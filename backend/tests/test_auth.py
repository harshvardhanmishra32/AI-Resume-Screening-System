import pytest
from httpx import AsyncClient
from fastapi import status

pytestmark = pytest.mark.asyncio

async def test_register_user(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@hirelens.ai",
            "password": "strongpassword123",
            "first_name": "John",
            "last_name": "Doe",
            "role_names": ["CANDIDATE"]
        }
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == "test@hirelens.ai"
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert "id" in data
    assert len(data["roles"]) > 0
    assert data["roles"][0]["name"] == "CANDIDATE"

async def test_register_duplicate_user(client: AsyncClient):
    user_data = {
        "email": "duplicate@hirelens.ai",
        "password": "strongpassword123",
        "first_name": "John",
        "last_name": "Doe"
    }
    # Register once
    response1 = await client.post("/api/v1/auth/register", json=user_data)
    assert response1.status_code == status.HTTP_201_CREATED

    # Register twice
    response2 = await client.post("/api/v1/auth/register", json=user_data)
    assert response2.status_code == status.HTTP_400_BAD_REQUEST
    assert response2.json()["detail"] == "A user with this email address already exists."

async def test_login_user(client: AsyncClient):
    user_data = {
        "email": "login@hirelens.ai",
        "password": "strongpassword123",
        "first_name": "Login",
        "last_name": "User"
    }
    # Register
    await client.post("/api/v1/auth/register", json=user_data)

    # Login JSON
    response = await client.post(
        "/api/v1/auth/login-json",
        json={
            "email": "login@hirelens.ai",
            "password": "strongpassword123"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"

async def test_get_current_user_profile(client: AsyncClient):
    user_data = {
        "email": "profile@hirelens.ai",
        "password": "strongpassword123",
        "first_name": "Profile",
        "last_name": "User"
    }
    # Register
    await client.post("/api/v1/auth/register", json=user_data)

    # Login
    login_response = await client.post(
        "/api/v1/auth/login-json",
        json={
            "email": "profile@hirelens.ai",
            "password": "strongpassword123"
        }
    )
    token = login_response.json()["access_token"]

    # Profile check
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "profile@hirelens.ai"
    assert data["first_name"] == "Profile"

async def test_refresh_token_rotation(client: AsyncClient):
    user_data = {
        "email": "rotate@hirelens.ai",
        "password": "strongpassword123",
        "first_name": "Rotate",
        "last_name": "User"
    }
    # Register
    await client.post("/api/v1/auth/register", json=user_data)

    # Login
    login_response = await client.post(
        "/api/v1/auth/login-json",
        json={
            "email": "rotate@hirelens.ai",
            "password": "strongpassword123"
        }
    )
    refresh_token = login_response.json()["refresh_token"]

    # Rotate
    rotate_response = await client.post(
        f"/api/v1/auth/refresh?refresh_token={refresh_token}"
    )
    assert rotate_response.status_code == status.HTTP_200_OK
    data = rotate_response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["refresh_token"] != refresh_token  # rotated

    # Try using old refresh token again (mitigation check)
    fail_response = await client.post(
        f"/api/v1/auth/refresh?refresh_token={refresh_token}"
    )
    assert fail_response.status_code == status.HTTP_401_UNAUTHORIZED
