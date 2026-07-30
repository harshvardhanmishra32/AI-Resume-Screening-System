from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime

# Permissions Schemas
class PermissionBase(BaseModel):
    name: str
    description: Optional[str] = None

class PermissionOut(PermissionBase):
    id: UUID

    class Config:
        from_attributes = True

# Roles Schemas
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleOut(RoleBase):
    id: UUID
    permissions: List[PermissionOut] = []

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=128)
    role_names: Optional[List[str]] = ["CANDIDATE"]

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id: UUID
    is_active: bool
    company_id: Optional[UUID] = None
    roles: List[RoleOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Auth Schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str
    roles: List[str] = []
    exp: Optional[int] = None
