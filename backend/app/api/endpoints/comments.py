from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from datetime import datetime

from app.core.auth import get_current_active_superuser, get_current_active_user
from app.db.mongodb import get_database
from app.models.comment import Comment, CommentCreate, CommentUpdate
from app.models.user import UserInDB

router = APIRouter()


@router.get("/", response_model=List[Comment])
async def read_comments(
    db: Database = Depends(get_database),
    post_id: Optional[str] = None,
    approved_only: bool = True,
    skip: int = 0,
    limit: int = 100,
    current_user: Optional[UserInDB] = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve comments with filtering options.
    """
    # Build query
    query = {}
    
    # Filter by post
    if post_id:
        query["post_id"] = post_id
    
    # Filter by approval status
    if approved_only and (not current_user or not current_user.is_superuser):
        query["is_approved"] = True
    
    # Fetch comments
    comments = await db.comments.find(query).sort("date", -1).skip(skip).limit(limit).to_list(length=limit)
    
    # Process comments
    for comment in comments:
        comment["id"] = str(comment.pop("_id"))
    
    return comments


@router.post("/", response_model=Comment)
async def create_comment(
    *,
    db: Database = Depends(get_database),
    comment_in: CommentCreate,
    current_user: Optional[UserInDB] = Depends(None),
) -> Any:
    """
    Create new comment.
    """
    # Verify post exists
    try:
        post = await db.posts.find_one({"_id": ObjectId(comment_in.post_id)})
        if not post:
            raise HTTPException(
                status_code=404,
                detail="The post does not exist in the system",
            )
        
        # Check if post is visible
        if not post["is_visible"]:
            raise HTTPException(
                status_code=404,
                detail="The post does not exist or is not published",
            )
    except:
        raise HTTPException(
            status_code=404,
            detail="Invalid post ID",
        )
    
    # Create comment
    comment_data = comment_in.dict()
    comment_data["date"] = datetime.utcnow()
    comment_data["created_at"] = datetime.utcnow()
    comment_data["updated_at"] = comment_data["created_at"]
    
    # Auto-approve comments from authenticated users
    if current_user:
        if current_user.is_superuser or current_user.id == post["author_id"]:
            comment_data["is_approved"] = True
            
        # Use user's information if authenticated
        comment_data["author_name"] = current_user.full_name or current_user.username
        comment_data["author_email"] = current_user.email
    
    result = await db.comments.insert_one(comment_data)
    comment_data["id"] = str(result.inserted_id)
    return comment_data


@router.get("/{comment_id}", response_model=Comment)
async def read_comment(
    *,
    db: Database = Depends(get_database),
    comment_id: str,
    current_user: Optional[UserInDB] = Depends(None),
) -> Any:
    """
    Get comment by ID.
    """
    try:
        comment = await db.comments.find_one({"_id": ObjectId(comment_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The comment with this id does not exist in the system",
        )
    if not comment:
        raise HTTPException(
            status_code=404,
            detail="The comment with this id does not exist in the system",
        )
    
    # Check if comment is approved or user has permission
    if not comment["is_approved"] and (not current_user or not current_user.is_superuser):
        try:
            post = await db.posts.find_one({"_id": ObjectId(comment["post_id"])})
            if not post or (not current_user or current_user.id != post["author_id"]):
                raise HTTPException(
                    status_code=404,
                    detail="The comment with this id does not exist in the system",
                )
        except:
            raise HTTPException(
                status_code=404,
                detail="The comment with this id does not exist in the system",
            )
    
    comment["id"] = str(comment.pop("_id"))
    return comment


@router.put("/{comment_id}", response_model=Comment)
async def update_comment(
    *,
    db: Database = Depends(get_database),
    comment_id: str,
    comment_in: CommentUpdate,
    current_user: UserInDB = Depends(get_current_active_user),
) -> Any:
    """
    Update a comment.
    """
    try:
        comment = await db.comments.find_one({"_id": ObjectId(comment_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The comment with this id does not exist in the system",
        )
    if not comment:
        raise HTTPException(
            status_code=404,
            detail="The comment with this id does not exist in the system",
        )
    
    # Check permissions
    if not current_user.is_superuser:
        try:
            post = await db.posts.find_one({"_id": ObjectId(comment["post_id"])})
            if not post or current_user.id != post["author_id"]:
                raise HTTPException(
                    status_code=403,
                    detail="Not authorized to update this comment",
                )
        except:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to update this comment",
            )
    
    comment_data = comment.copy()
    update_data = comment_in.dict(exclude_unset=True)
    for field in update_data:
        comment_data[field] = update_data[field]
    comment_data["updated_at"] = datetime.utcnow()
    
    await db.comments.update_one({"_id": ObjectId(comment_id)}, {"$set": comment_data})
    comment_data["id"] = str(comment_data.pop("_id"))
    return comment_data


@router.delete("/{comment_id}", response_model=Comment)
async def delete_comment(
    *,
    db: Database = Depends(get_database),
    comment_id: str,
    current_user: UserInDB = Depends(get_current_active_user),
) -> Any:
    """
    Delete a comment.
    """
    try:
        comment = await db.comments.find_one({"_id": ObjectId(comment_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The comment with this id does not exist in the system",
        )
    if not comment:
        raise HTTPException(
            status_code=404,
            detail="The comment with this id does not exist in the system",
        )
    
    # Check permissions
    if not current_user.is_superuser:
        try:
            post = await db.posts.find_one({"_id": ObjectId(comment["post_id"])})
            if not post or current_user.id != post["author_id"]:
                raise HTTPException(
                    status_code=403,
                    detail="Not authorized to delete this comment",
                )
        except:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to delete this comment",
            )
    
    # Delete the comment
    await db.comments.delete_one({"_id": ObjectId(comment_id)})
    comment["id"] = str(comment.pop("_id"))
    return comment


@router.put("/{comment_id}/approve", response_model=Comment)
async def approve_comment(
    *,
    db: Database = Depends(get_database),
    comment_id: str,
    current_user: UserInDB = Depends(get_current_active_user),
) -> Any:
    """
    Approve a comment.
    """
    try:
        comment = await db.comments.find_one({"_id": ObjectId(comment_id)})
    except:
        raise HTTPException(
            status_code=404,
            detail="The comment with this id does not exist in the system",
        )
    if not comment:
        raise HTTPException(
            status_code=404,
            detail="The comment with this id does not exist in the system",
        )
    
    # Check permissions
    if not current_user.is_superuser:
        try:
            post = await db.posts.find_one({"_id": ObjectId(comment["post_id"])})
            if not post or current_user.id != post["author_id"]:
                raise HTTPException(
                    status_code=403,
                    detail="Not authorized to approve this comment",
                )
        except:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to approve this comment",
            )
    
    # Update the comment
    comment_data = comment.copy()
    comment_data["is_approved"] = True
    comment_data["updated_at"] = datetime.utcnow()
    
    await db.comments.update_one({"_id": ObjectId(comment_id)}, {"$set": comment_data})
    comment_data["id"] = str(comment_data.pop("_id"))
    return comment_data