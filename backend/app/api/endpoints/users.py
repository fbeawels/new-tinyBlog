from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException, status
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from datetime import datetime

from app.core.auth import get_current_active_user, get_current_active_superuser
from app.core.security import get_password_hash
from app.db.mongodb import get_database
from app.models.user import User, UserCreate, UserInDB, UserUpdate

router = APIRouter()


@router.get("/", response_model=List[User])
async def read_users(
    db: Database = Depends(get_database),
    skip: int = 0,
    limit: int = 100,
    current_user: UserInDB = Depends(get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = await db.users.find().skip(skip).limit(limit).to_list(length=limit)
    for user in users:
        user["id"] = str(user.pop("_id"))
    return users


@router.post("/", response_model=User)
async def create_user(
    *,
    db: Database = Depends(get_database),
    user_in: UserCreate,
    current_user: UserInDB = Depends(get_current_active_superuser),
) -> Any:
    """
    Create new user.
    """
    try:
        user = await db.users.find_one({"email": user_in.email})
        if user:
            raise HTTPException(
                status_code=400,
                detail="A user with this email already exists in the system.",
            )
        user = await db.users.find_one({"username": user_in.username})
        if user:
            raise HTTPException(
                status_code=400,
                detail="A user with this username already exists in the system.",
            )
        user_data = user_in.dict()
        hashed_password = get_password_hash(user_in.password)
        user_data.pop("password")
        user_data["hashed_password"] = hashed_password
        user_data["created_at"] = datetime.utcnow()
        user_data["updated_at"] = user_data["created_at"]
        result = await db.users.insert_one(user_data)
        user_data["id"] = str(result.inserted_id)
        return user_data
    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail="A user with this email or username already exists in the system.",
        )


@router.get("/me", response_model=User)
async def read_user_me(
    current_user: UserInDB = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.put("/me", response_model=User)
async def update_user_me(
    *,
    db: Database = Depends(get_database),
    user_in: UserUpdate,
    current_user: UserInDB = Depends(get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    user_data = current_user.dict()
    if user_in.password:
        hashed_password = get_password_hash(user_in.password)
        user_data["hashed_password"] = hashed_password
    update_data = user_in.dict(exclude_unset=True)
    update_data.pop("password", None)
    for field in update_data:
        user_data[field] = update_data[field]
    user_data["updated_at"] = datetime.utcnow()
    user_id = ObjectId(current_user.id)
    user_data.pop("id")
    await db.users.update_one({"_id": user_id}, {"$set": user_data})
    user_data["id"] = str(user_id)
    return user_data


@router.get("/{user_id}", response_model=User)
async def read_user_by_id(
    user_id: str,
    db: Database = Depends(get_database),
    current_user: UserInDB = Depends(get_current_active_superuser),
) -> Any:
    """
    Get a specific user by id.
    """
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    if user:
        user["id"] = str(user.pop("_id"))
        return user
    raise HTTPException(
        status_code=404,
        detail="The user with this id does not exist in the system",
    )


@router.put("/{user_id}", response_model=User)
async def update_user(
    *,
    db: Database = Depends(get_database),
    user_id: str,
    user_in: UserUpdate,
    current_user: UserInDB = Depends(get_current_active_superuser),
) -> Any:
    """
    Update a user.
    """
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    user_data = user.copy()
    if user_in.password:
        hashed_password = get_password_hash(user_in.password)
        user_data["hashed_password"] = hashed_password
    update_data = user_in.dict(exclude_unset=True)
    update_data.pop("password", None)
    for field in update_data:
        user_data[field] = update_data[field]
    user_data["updated_at"] = datetime.utcnow()
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": user_data})
    user_data["id"] = str(user_data.pop("_id"))
    return user_data


@router.delete("/{user_id}", response_model=User)
async def delete_user(
    *,
    db: Database = Depends(get_database),
    user_id: str,
    current_user: UserInDB = Depends(get_current_active_superuser),
) -> Any:
    """
    Delete a user.
    """
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    await db.users.delete_one({"_id": ObjectId(user_id)})
    user["id"] = str(user.pop("_id"))
    return user