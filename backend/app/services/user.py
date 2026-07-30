from datetime import datetime, timezone, timedelta
from typing import Optional, List, Tuple
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.user import User, Role, RefreshToken
from app.repositories.user import user_repo, role_repo, token_repo
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.config import settings

class UserService:
    async def register_user(self, db: AsyncSession, user_in: UserCreate) -> User:
        # Check if email is already taken
        existing_user = await user_repo.get_by_email(db, user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )

        # Hash the password
        hashed_password = get_password_hash(user_in.password)

        # Resolve roles
        roles: List[Role] = []
        if user_in.role_names:
            for name in user_in.role_names:
                role = await role_repo.get_by_name(db, name)
                if not role:
                    # Auto-create role if it does not exist for development ease
                    role = await role_repo.create(db, obj_in={"name": name, "description": f"{name} role"})
                roles.append(role)

        # Prepare database fields (including roles)
        user_data = {
            "email": user_in.email,
            "hashed_password": hashed_password,
            "first_name": user_in.first_name,
            "last_name": user_in.last_name,
            "is_active": True,
            "is_deleted": False,
            "roles": roles
        }

        # Create user record with pre-populated roles
        db_user = await user_repo.create(db, obj_in=user_data)
        await db.flush()
        
        # Fetch the fully populated user (including roles and permissions) to prevent serialization lazy-load errors
        return await user_repo.get_with_roles(db, db_user.id)

    async def authenticate_user(
        self, db: AsyncSession, email: str, password: str
    ) -> Tuple[User, str, str]:
        db_user = await user_repo.get_by_email(db, email)
        if not db_user or not verify_password(password, db_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not db_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated."
            )

        # Generate tokens
        role_names = [r.name for r in db_user.roles]
        access_token = create_access_token(db_user.id, roles=role_names)
        refresh_token_str = create_refresh_token(db_user.id)

        # Store refresh token with rotation
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        await token_repo.create(
            db,
            obj_in={
                "user_id": db_user.id,
                "token": refresh_token_str,
                "expires_at": expires_at,
                "revoked": False
            }
        )

        return db_user, access_token, refresh_token_str

    async def refresh_tokens(self, db: AsyncSession, refresh_token_str: str) -> Tuple[str, str]:
        # Validate refresh token payload
        payload = decode_token(refresh_token_str)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token."
            )

        user_id_str = payload.get("sub")
        if not user_id_str:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token payload."
            )

        # Check in DB
        db_token = await token_repo.get_by_token(db, refresh_token_str)
        if not db_token or db_token.revoked or db_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            # If token was reused or revoked, trigger strict token reuse mitigation (revoke all user's tokens)
            if db_token:
                await self.revoke_all_user_tokens(db, db_token.user_id)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or reused refresh token. Access revoked."
            )

        # Mark old token as revoked (rotation)
        db_token.revoked = True
        db.add(db_token)

        # Generate new pair
        user = await user_repo.get_with_roles(db, UUID(user_id_str))
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is deactivated or deleted."
            )

        role_names = [r.name for r in user.roles]
        new_access_token = create_access_token(user.id, roles=role_names)
        new_refresh_token_str = create_refresh_token(user.id)

        # Save new refresh token
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        await token_repo.create(
            db,
            obj_in={
                "user_id": user.id,
                "token": new_refresh_token_str,
                "expires_at": expires_at,
                "revoked": False
            }
        )

        return new_access_token, new_refresh_token_str

    async def revoke_all_user_tokens(self, db: AsyncSession, user_id: UUID) -> None:
        # Fetch active tokens and revoke them
        from sqlalchemy import update
        await db.execute(
            update(RefreshToken)
            .filter(RefreshToken.user_id == user_id, RefreshToken.revoked == False)
            .values(revoked=True)
        )

    async def get_profile(self, db: AsyncSession, user_id: UUID) -> Optional[User]:
        return await user_repo.get_with_roles(db, user_id)

user_service = UserService()
