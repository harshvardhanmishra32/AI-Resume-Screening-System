from typing import Optional, List
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.user import User, Role, RefreshToken

class UserRepository(BaseRepository[User]):
    def __init__(self) -> None:
        super().__init__(User)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(
            select(User)
            .filter(User.email == email, User.is_deleted == False)
            .options(selectinload(User.roles).selectinload(Role.permissions))
        )
        return result.scalars().first()

    async def get_with_roles(self, db: AsyncSession, id: UUID) -> Optional[User]:
        result = await db.execute(
            select(User)
            .filter(User.id == id, User.is_deleted == False)
            .options(selectinload(User.roles).selectinload(Role.permissions))
        )
        return result.scalars().first()

class RoleRepository(BaseRepository[Role]):
    def __init__(self) -> None:
        super().__init__(Role)

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Role]:
        result = await db.execute(select(Role).filter(Role.name == name))
        return result.scalars().first()

class RefreshTokenRepository(BaseRepository[RefreshToken]):
    def __init__(self) -> None:
        super().__init__(RefreshToken)

    async def get_by_token(self, db: AsyncSession, token: str) -> Optional[RefreshToken]:
        result = await db.execute(
            select(RefreshToken)
            .filter(RefreshToken.token == token, RefreshToken.revoked == False)
            .options(selectinload(RefreshToken.user))
        )
        return result.scalars().first()

user_repo = UserRepository()
role_repo = RoleRepository()
token_repo = RefreshTokenRepository()
