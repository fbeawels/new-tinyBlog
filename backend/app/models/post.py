from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class PostBase(BaseModel):
    title: str
    text: str
    is_visible: bool = False
    category_id: str
    tags: Optional[List[str]] = []


class PostCreate(PostBase):
    pass


class PostUpdate(PostBase):
    title: Optional[str] = None
    text: Optional[str] = None
    is_visible: Optional[bool] = None
    category_id: Optional[str] = None
    tags: Optional[List[str]] = None


class PostInDBBase(PostBase):
    id: Optional[str] = None
    author_id: str
    date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class Post(PostInDBBase):
    pass


class PostWithDetails(Post):
    author_name: str
    category_name: str
    comment_count: int = 0
    tags_info: List[dict] = []