import pytest
from pydantic import ValidationError

from app.models.user import UserCreate, UserInDB, UserUpdate


def test_user_create():
    # Test valid user creation
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "securepassword",
        "full_name": "Test User"
    }
    user = UserCreate(**user_data)
    assert user.email == user_data["email"]
    assert user.username == user_data["username"]
    assert user.password == user_data["password"]
    assert user.full_name == user_data["full_name"]
    
    # Test invalid email
    with pytest.raises(ValidationError):
        UserCreate(email="invalid-email", username="testuser", password="securepassword")
    
    # Test missing required fields
    with pytest.raises(ValidationError):
        UserCreate(email="test@example.com")


def test_user_in_db():
    # Test user in DB model
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "hashed_password": "hashedpassword",
        "full_name": "Test User",
        "is_active": True,
        "is_superuser": False,
        "role": "reader"
    }
    user = UserInDB(**user_data)
    assert user.email == user_data["email"]
    assert user.hashed_password == user_data["hashed_password"]
    assert user.role == user_data["role"]
    
    # Test with ID
    user_with_id = UserInDB(id="123", **user_data)
    assert user_with_id.id == "123"


def test_user_update():
    # Test user update model
    update_data = {
        "full_name": "Updated Name",
        "is_active": False
    }
    user_update = UserUpdate(**update_data)
    assert user_update.full_name == update_data["full_name"]
    assert user_update.is_active == update_data["is_active"]
    
    # Test with password update
    update_with_password = UserUpdate(password="newpassword", **update_data)
    assert update_with_password.password == "newpassword"
