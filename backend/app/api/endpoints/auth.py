from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.database import Database

from app.core.auth import authenticate_user
from app.core.config import settings
from app.core.security import create_access_token, get_password_hash
from app.db.mongodb import get_database
from app.models.user import Token, UserCreate, UserInDB

router = APIRouter()


@router.post("/login", response_model=Token)
async def login_access_token(
    db: Database = Depends(get_database), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/register", response_model=UserInDB, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate, db: Database = Depends(get_database)
) -> Any:
    """
    Create new user without the need to be logged in.
    """
    # Check if user with this email already exists
    existing_user = await db.users.find_one({"$or": [
        {"email": user_in.email},
        {"username": user_in.username}
    ]})
    
    if existing_user:
        if existing_user["email"] == user_in.email:
            raise HTTPException(
                status_code=400,
                detail="A user with this email already exists in the system.",
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="A user with this username already exists in the system.",
            )
    
    # Create new user
    hashed_password = get_password_hash(user_in.password)
    user_data = user_in.dict()
    user_data["hashed_password"] = hashed_password
    user_data["is_active"] = True
    user_data["is_superuser"] = False
    
    # Remove plain password from the data
    del user_data["password"]
    
    # Insert the new user
    result = await db.users.insert_one(user_data)
    
    # Retrieve the created user
    created_user = await db.users.find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user.pop("_id"))
    
    return created_user