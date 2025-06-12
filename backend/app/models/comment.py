from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class CommentBase(BaseModel):
    post_id: str
    text: str
    author_name: str
    author_email: Optional[str] = None
    is_approved: bool = False


class CommentCreate(CommentBase):
    pass


class CommentUpdate(CommentBase):
    post_id: Optional[str] = None
    text: Optional[str] = None
    author_name: Optional[str] = None
    author_email: Optional[str] = None
    is_approved: Optional[bool] = None


class CommentInDBBase(CommentBase):
    id: Optional[str] = None
    date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class Comment(CommentInDBBase):
    pass