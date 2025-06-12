from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from datetime import datetime

from app.core.auth import get_current_active_superuser, get_current_active_user
from app.db.mongodb import get_database
from app.models.post import Post, PostCreate, PostUpdate, PostWithDetails
from app.models.user import UserInDB

router = APIRouter()


@router.get("/", response_model=List[PostWithDetails])
async def read_posts(
    db: Database = Depends(get_database),
    skip: int = 0,
    limit: int = 10,
    category_id: Optional[str] = None,
    tag_id: Optional[str] = None,
    author_id: Optional[str] = None,
    search: Optional[str] = None,
    include_invisible: bool = False,
    current_user: Optional[UserInDB] = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve posts with filtering options.
    """
    # Build query
    query = {}
    
    # Filter by visibility
    if not include_invisible or not current_user or (not current_user.is_superuser and not author_id == current_user.id):
        query["is_visible"] = True
    
    # Filter by category
    if category_id:
        query["category_id"] = category_id
    
    # Filter by tag
    if tag_id:
        query["tags"] = tag_id
    
    # Filter by author
    if author_id:
        query["author_id"] = author_id
    
    # Search in title and text
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"text": {"$regex": search, "$options": "i"}}
        ]
    
    # Fetch posts
    cursor = db.posts.find(query).sort("date", -1).skip(skip).limit(limit)
    posts = await cursor.to_list(length=limit)
    
    # Enhance posts with details
    result = []
    for post in posts:
        post["id"] = str(post.pop("_id"))
        
        # Get author info
        author = await db.users.find_one({"_id": ObjectId(post["author_id"])})
        author_name = author["full_name"] if author and author.get("full_name") else author["username"] if author else "Unknown"
        
        # Get category info
        category = await db.categories.find_one({"_id": ObjectId(post["category_id"])})
        category_name = category["name"] if category else "Uncategorized"
        
        # Count comments
        comment_count = await db.comments.count_documents({"post_id": post["id"]})
        
        # Get tag info
        tags_info = []
        if "tags" in post and post["tags"]:
            for tag_id in post["tags"]:
                tag = await db.tags.find_one({"_id": ObjectId(tag_id)})
                if tag:
                    tags_info.append({"id": str(tag["_id"]), "name": tag["name"]})
        
        # Create enhanced post
        post_with_details = PostWithDetails(
            **post,
            author_name=author_name,
            category_name=category_name,
            comment_count=comment_count,
            tags_info=tags_info
        )
        result.append(post_with_details)
    
    return result


@router.post("/", response_model=Post, status_code=status.HTTP_201_CREATED)
async def create_post(
    *,
    db: Database = Depends(get_database),
    post_in: PostCreate,
    current_user: UserInDB = Depends(get_current_active_user),
) -> Any:
    """
    Create new post.
    """
    # Verify category exists
    try:
        category = await db.categories.find_one({"_id": ObjectId(post_in.category_id)})
        if not category:
            raise HTTPException(
                status_code=404,
                detail="The category does not exist in the system",
            )
    except:
        raise HTTPException(
            status_code=404,
            detail="Invalid category ID",
        )
    
    # Verify tags exist
    if post_in.tags:
        for tag_id in post_in.tags:
            try:
                tag = await db.tags.find_one({"_id": ObjectId(tag_id)})
                if not tag:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Tag with ID {tag_id} does not exist in the system",
                    )
            except:
                raise HTTPException(
                    status_code=404,
                    detail=f"Invalid tag ID: {tag_id}",
                )
    
    # Create post
    post_data = post_in.dict()
    post_data["author_id"] = current_user.id
    post_data["date"] = datetime.utcnow()
    post_data["created_at"] = datetime.utcnow()
    post_data["updated_at"] = post_data["created_at"]
    
    # Only admins can directly publish posts
    if not current_user.is_superuser:
        post_data["is_visible"] = False
    
    result = await db.posts.insert_one(post_data)
    post_data["id"] = str(result.inserted_id)
    return post_data


@router.get("/{post_id}", response_model=PostWithDetails)
async def read_post(
    *,
    db: Database = Depends(get_database),
    post_id: str,
    current_user: Optional[UserInDB] = Depends(get_current_active_user),
) -> Any:
    """
    Get post by ID.
    """
    try:
        post = await db.posts.find_one({"_id": ObjectId(post_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The post with this id does not exist in the system",
        )
    if not post:
        raise HTTPException(
            status_code=404,
            detail="The post with this id does not exist in the system",
        )
    
    # Check visibility permissions
    if not post["is_visible"]:
        if not current_user:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to access this post",
            )
        if not current_user.is_superuser and current_user.id != post["author_id"]:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to access this post",
            )
    
    post["id"] = str(post.pop("_id"))
    
    # Get author info
    author = await db.users.find_one({"_id": ObjectId(post["author_id"])})
    author_name = author["full_name"] if author and author.get("full_name") else author["username"] if author else "Unknown"
    
    # Get category info
    category = await db.categories.find_one({"_id": ObjectId(post["category_id"])})
    category_name = category["name"] if category else "Uncategorized"
    
    # Count comments
    comment_count = await db.comments.count_documents({"post_id": post["id"]})
    
    # Get tag info
    tags_info = []
    if "tags" in post and post["tags"]:
        for tag_id in post["tags"]:
            tag = await db.tags.find_one({"_id": ObjectId(tag_id)})
            if tag:
                tags_info.append({"id": str(tag["_id"]), "name": tag["name"]})
    
    # Create enhanced post
    post_with_details = PostWithDetails(
        **post,
        author_name=author_name,
        category_name=category_name,
        comment_count=comment_count,
        tags_info=tags_info
    )
    
    return post_with_details


@router.put("/{post_id}", response_model=Post)
async def update_post(
    *,
    db: Database = Depends(get_database),
    post_id: str,
    post_in: PostUpdate,
    current_user: UserInDB = Depends(get_current_active_user),
) -> Any:
    """
    Update a post.
    """
    try:
        post = await db.posts.find_one({"_id": ObjectId(post_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The post with this id does not exist in the system",
        )
    if not post:
        raise HTTPException(
            status_code=404,
            detail="The post with this id does not exist in the system",
        )
    
    # Check permissions
    if not current_user.is_superuser and current_user.id != post["author_id"]:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update this post",
        )
    
    # Verify category exists if being updated
    if post_in.category_id:
        try:
            category = await db.categories.find_one({"_id": ObjectId(post_in.category_id)})
            if not category:
                raise HTTPException(
                    status_code=404,
                    detail="The category does not exist in the system",
                )
        except:
            raise HTTPException(
                status_code=404,
                detail="Invalid category ID",
            )
    
    # Verify tags exist if being updated
    if post_in.tags:
        for tag_id in post_in.tags:
            try:
                tag = await db.tags.find_one({"_id": ObjectId(tag_id)})
                if not tag:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Tag with ID {tag_id} does not exist in the system",
                    )
            except:
                raise HTTPException(
                    status_code=404,
                    detail=f"Invalid tag ID: {tag_id}",
                )
    
    # Only admins can change visibility
    if post_in.is_visible is not None and not current_user.is_superuser and post_in.is_visible != post["is_visible"]:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can change post visibility",
        )
    
    post_data = post.copy()
    update_data = post_in.dict(exclude_unset=True)
    for field in update_data:
        post_data[field] = update_data[field]
    post_data["updated_at"] = datetime.utcnow()
    
    await db.posts.update_one({"_id": ObjectId(post_id)}, {"$set": post_data})
    post_data["id"] = str(post_data.pop("_id"))
    return post_data


@router.delete("/{post_id}", response_model=Post)
async def delete_post(
    *,
    db: Database = Depends(get_database),
    post_id: str,
    current_user: UserInDB = Depends(get_current_active_user),
) -> Any:
    """
    Delete a post.
    """
    try:
        post = await db.posts.find_one({"_id": ObjectId(post_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The post with this id does not exist in the system",
        )
    if not post:
        raise HTTPException(
            status_code=404,
            detail="The post with this id does not exist in the system",
        )
    
    # Check permissions
    if not current_user.is_superuser and current_user.id != post["author_id"]:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this post",
        )
    
    # Delete related comments
    await db.comments.delete_many({"post_id": post_id})
    
    # Delete the post
    await db.posts.delete_one({"_id": ObjectId(post_id)})
    post["id"] = str(post.pop("_id"))
    return post