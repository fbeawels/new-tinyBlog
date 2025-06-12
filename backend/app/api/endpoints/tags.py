from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from datetime import datetime

from app.core.auth import get_current_active_superuser, get_current_active_user
from app.db.mongodb import get_database
from app.models.tag import Tag, TagCreate, TagUpdate, TagWithCount
from app.models.user import UserInDB

router = APIRouter()


@router.get("/", response_model=List[TagWithCount])
async def read_tags(
    db: Database = Depends(get_database),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve tags with post count.
    """
    tags = await db.tags.find().skip(skip).limit(limit).to_list(length=limit)
    result = []
    for tag in tags:
        tag["id"] = str(tag.pop("_id"))
        # Count posts with this tag
        post_count = await db.posts.count_documents({"tags": tag["id"]})
        result.append(TagWithCount(**tag, post_count=post_count))
    return result


@router.post("/", response_model=Tag)
async def create_tag(
    *,
    db: Database = Depends(get_database),
    tag_in: TagCreate,
    current_user: UserInDB = Depends(get_current_active_user),
) -> Any:
    """
    Create new tag.
    """
    try:
        tag = await db.tags.find_one({"name": tag_in.name})
        if tag:
            raise HTTPException(
                status_code=400,
                detail="A tag with this name already exists in the system.",
            )
        tag_data = tag_in.dict()
        tag_data["created_at"] = datetime.utcnow()
        tag_data["updated_at"] = tag_data["created_at"]
        result = await db.tags.insert_one(tag_data)
        tag_data["id"] = str(result.inserted_id)
        return tag_data
    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail="A tag with this name already exists in the system.",
        )


@router.get("/{tag_id}", response_model=TagWithCount)
async def read_tag(
    *,
    db: Database = Depends(get_database),
    tag_id: str,
) -> Any:
    """
    Get tag by ID.
    """
    try:
        tag = await db.tags.find_one({"_id": ObjectId(tag_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The tag with this id does not exist in the system",
        )
    if not tag:
        raise HTTPException(
            status_code=404,
            detail="The tag with this id does not exist in the system",
        )
    tag["id"] = str(tag.pop("_id"))
    # Count posts with this tag
    post_count = await db.posts.count_documents({"tags": tag["id"]})
    return TagWithCount(**tag, post_count=post_count)


@router.put("/{tag_id}", response_model=Tag)
async def update_tag(
    *,
    db: Database = Depends(get_database),
    tag_id: str,
    tag_in: TagUpdate,
    current_user: UserInDB = Depends(get_current_active_superuser),
) -> Any:
    """
    Update a tag.
    """
    try:
        tag = await db.tags.find_one({"_id": ObjectId(tag_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The tag with this id does not exist in the system",
        )
    if not tag:
        raise HTTPException(
            status_code=404,
            detail="The tag with this id does not exist in the system",
        )
    
    # Check if name is being updated and it already exists
    if tag_in.name and tag_in.name != tag["name"]:
        existing = await db.tags.find_one({"name": tag_in.name})
        if existing and str(existing["_id"]) != tag_id:
            raise HTTPException(
                status_code=400,
                detail="A tag with this name already exists in the system.",
            )
    
    tag_data = tag.copy()
    update_data = tag_in.dict(exclude_unset=True)
    for field in update_data:
        tag_data[field] = update_data[field]
    tag_data["updated_at"] = datetime.utcnow()
    await db.tags.update_one({"_id": ObjectId(tag_id)}, {"$set": tag_data})
    tag_data["id"] = str(tag_data.pop("_id"))
    return tag_data


@router.delete("/{tag_id}", response_model=Tag)
async def delete_tag(
    *,
    db: Database = Depends(get_database),
    tag_id: str,
    current_user: UserInDB = Depends(get_current_active_superuser),
) -> Any:
    """
    Delete a tag.
    """
    try:
        tag = await db.tags.find_one({"_id": ObjectId(tag_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The tag with this id does not exist in the system",
        )
    if not tag:
        raise HTTPException(
            status_code=404,
            detail="The tag with this id does not exist in the system",
        )
    
    # Remove tag from all posts that use it
    await db.posts.update_many({"tags": tag_id}, {"$pull": {"tags": tag_id}})
    
    # Delete the tag
    await db.tags.delete_one({"_id": ObjectId(tag_id)})
    tag["id"] = str(tag.pop("_id"))
    return tag