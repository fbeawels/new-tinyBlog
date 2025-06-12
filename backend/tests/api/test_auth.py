import pytest
import sys
from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.models.user import UserCreate

print("Python executable:", sys.executable)
print("Python path:", sys.path)


@pytest.mark.asyncio
async def test_login_access_token(test_client, db_client):
    print("\n=== Starting test_login_access_token ===")
    print("Test client:", test_client)
    print("DB client:", db_client)
    
    # First create a test user
    user_data = {
        "email": "auth_test@example.com",
        "username": "auth_test",
        "password": "testpassword",
        "full_name": "Auth Test"
    }
    
    print("\nAttempting to register user:", user_data)
    # Register the user
    response = test_client.post("/api/v1/auth/register", json=user_data)
    print("Register response status:", response.status_code)
    print("Register response body:", response.text)
    assert response.status_code == 201
    
    # Try to login with correct credentials
    login_data = {
        "username": user_data["username"],
        "password": user_data["password"]
    }
    response = test_client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    
    # Try to login with incorrect password
    login_data["password"] = "wrongpassword"
    response = test_client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 401
    
    # Try to login with non-existent username
    login_data["username"] = "nonexistent"
    response = test_client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_register_user(test_client, db_client):
    # Create a new user
    user_data = {
        "email": "register_test@example.com",
        "username": "register_test",
        "password": "testpassword",
        "full_name": "Register Test"
    }
    
    # Register the user
    response = test_client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 201
    created_user = response.json()
    assert created_user["email"] == user_data["email"]
    assert created_user["username"] == user_data["username"]
    assert "password" not in created_user  # Password should not be returned
    
    # Try to register with the same email
    response = test_client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 400
    
    # Try to register with the same username but different email
    user_data["email"] = "different@example.com"
    response = test_client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_get_current_user(test_client, db_client):
    # Create a test user
    user_data = {
        "email": "current_user_test@example.com",
        "username": "current_user_test",
        "password": "testpassword",
        "full_name": "Current User Test"
    }
    
    # Register the user
    response = test_client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 201
    user_id = response.json()["id"]
    
    # Login to get token
    login_data = {
        "username": user_data["username"],
        "password": user_data["password"]
    }
    response = test_client.post("/api/v1/auth/login", data=login_data)
    token = response.json()["access_token"]
    
    # Get current user with token
    headers = {"Authorization": f"Bearer {token}"}
    response = test_client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    current_user = response.json()
    assert current_user["id"] == user_id
    assert current_user["email"] == user_data["email"]
    
    # Try with invalid token
    headers = {"Authorization": "Bearer invalidtoken"}
    response = test_client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 401
