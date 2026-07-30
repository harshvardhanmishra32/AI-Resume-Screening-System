from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.user import UserCreate, UserOut, TokenOut, UserLogin
from app.services.user import user_service
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user candidate or recruiter profile.
    """
    return await user_service.register_user(db, user_in)

@router.post("/login", response_model=TokenOut)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    OAuth2 compatible token login, retrieve access and refresh tokens.
    """
    _, access_token, refresh_token = await user_service.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/login-json", response_model=TokenOut)
async def login_json(
    login_in: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    JSON raw payload login endpoint.
    """
    _, access_token, refresh_token = await user_service.authenticate_user(
        db, email=login_in.email, password=login_in.password
    )
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=TokenOut)
async def refresh(
    refresh_token: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Rotate expired access tokens using a valid refresh token.
    """
    access_token, new_refresh_token = await user_service.refresh_tokens(
        db, refresh_token_str=refresh_token
    )
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserOut)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    """
    Get profile details of current authorized user session.
    """
    return current_user
