from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from datetime import datetime

from app.core.auth import get_current_active_superuser, get_current_active_user
from app.db.mongodb import get_database
from app.models.category import Category, CategoryCreate, CategoryUpdate, CategoryWithCount
from app.models.user import UserInDB

router = APIRouter()


@router.get("/", response_model=List[CategoryWithCount])
async def read_categories(
    db: Database = Depends(get_database),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve categories with post count.
    """
    categories = await db.categories.find().skip(skip).limit(limit).to_list(length=limit)
    result = []
    for category in categories:
        category["id"] = str(category.pop("_id"))
        # Count posts in this category
        post_count = await db.posts.count_documents({"category_id": category["id"]})
        result.append(CategoryWithCount(**category, post_count=post_count))
    return result


@router.post("/", response_model=Category)
async def create_category(
    *,
    db: Database = Depends(get_database),
    category_in: CategoryCreate,
    current_user: UserInDB = Depends(get_current_active_superuser),
) -> Any:
    """
    Create new category.
    """
    try:
        category = await db.categories.find_one({"name": category_in.name})
        if category:
            raise HTTPException(
                status_code=400,
                detail="A category with this name already exists in the system.",
            )
        category_data = category_in.dict()
        category_data["created_at"] = datetime.utcnow()
        category_data["updated_at"] = category_data["created_at"]
        result = await db.categories.insert_one(category_data)
        category_data["id"] = str(result.inserted_id)
        return category_data
    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail="A category with this name already exists in the system.",
        )


@router.get("/{category_id}", response_model=CategoryWithCount)
async def read_category(
    *,
    db: Database = Depends(get_database),
    category_id: str,
) -> Any:
    """
    Get category by ID.
    """
    try:
        category = await db.categories.find_one({"_id": ObjectId(category_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The category with this id does not exist in the system",
        )
    if not category:
        raise HTTPException(
            status_code=404,
            detail="The category with this id does not exist in the system",
        )
    category["id"] = str(category.pop("_id"))
    # Count posts in this category
    post_count = await db.posts.count_documents({"category_id": category["id"]})
    return CategoryWithCount(**category, post_count=post_count)


@router.put("/{category_id}", response_model=Category)
async def update_category(
    *,
    db: Database = Depends(get_database),
    category_id: str,
    category_in: CategoryUpdate,
    current_user: UserInDB = Depends(get_current_active_superuser),
) -> Any:
    """
    Update a category.
    """
    try:
        category = await db.categories.find_one({"_id": ObjectId(category_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The category with this id does not exist in the system",
        )
    if not category:
        raise HTTPException(
            status_code=404,
            detail="The category with this id does not exist in the system",
        )
    
    # Check if name is being updated and it already exists
    if category_in.name and category_in.name != category["name"]:
        existing = await db.categories.find_one({"name": category_in.name})
        if existing and str(existing["_id"]) != category_id:
            raise HTTPException(
                status_code=400,
                detail="A category with this name already exists in the system.",
            )
    
    category_data = category.copy()
    update_data = category_in.dict(exclude_unset=True)
    for field in update_data:
        category_data[field] = update_data[field]
    category_data["updated_at"] = datetime.utcnow()
    await db.categories.update_one({"_id": ObjectId(category_id)}, {"$set": category_data})
    category_data["id"] = str(category_data.pop("_id"))
    return category_data


@router.delete("/{category_id}", response_model=Category)
async def delete_category(
    *,
    db: Database = Depends(get_database),
    category_id: str,
    current_user: UserInDB = Depends(get_current_active_superuser),
) -> Any:
    """
    Delete a category.
    """
    try:
        category = await db.categories.find_one({"_id": ObjectId(category_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The category with this id does not exist in the system",
        )
    if not category:
        raise HTTPException(
            status_code=404,
            detail="The category with this id does not exist in the system",
        )
    
    # Check if there are posts using this category
    post_count = await db.posts.count_documents({"category_id": category_id})
    if post_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete category: {post_count} posts are using this category",
        )
    
    await db.categories.delete_one({"_id": ObjectId(category_id)})
    category["id"] = str(category.pop("_id"))
    return category