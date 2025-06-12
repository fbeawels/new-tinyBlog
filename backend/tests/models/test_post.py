import pytest
from pydantic import ValidationError
from datetime import datetime, timezone

from app.models.post import PostCreate, PostInDBBase as PostInDB, PostUpdate


def test_post_create():
    # Test valid post creation
    post_data = {
        "title": "Test Post",
        "text": "This is a test post content",
        "category_id": "category123",
        "tags": ["tag1", "tag2"]
    }
    post = PostCreate(**post_data)
    assert post.title == post_data["title"]
    assert post.text == post_data["text"]
    assert post.category_id == post_data["category_id"]
    assert post.tags == post_data["tags"]
    assert post.is_visible is False  # Default value
    
    # Test missing required fields
    with pytest.raises(ValidationError):
        PostCreate(title="Missing fields")
    
    # Test with minimum required fields
    min_post = PostCreate(
        title="Minimal Post",
        text="Minimal content",
        category_id="cat123"
    )
    assert min_post.title == "Minimal Post"
    assert min_post.text == "Minimal content"
    assert min_post.category_id == "cat123"
    assert min_post.is_visible is False  # Default value
    assert min_post.tags == []  # Default value


def test_post_in_db():
    # Test post in DB model
    now = datetime.now(timezone.utc)
    post_data = {
        "title": "Test Post",
        "text": "This is a test post content",
        "author_id": "user123",
        "category_id": "category123",
        "tags": ["tag1", "tag2"],
        "created_at": now,
        "updated_at": now,
        "is_visible": True
    }
    post = PostInDB(**post_data)
    assert post.title == post_data["title"]
    assert post.text == post_data["text"]
    assert post.author_id == post_data["author_id"]
    assert post.category_id == post_data["category_id"]
    assert post.tags == post_data["tags"]
    assert post.created_at == post_data["created_at"]
    assert post.updated_at == post_data["updated_at"]
    assert post.is_visible == post_data["is_visible"]
    # Check that date fields are set automatically if not provided
    post_without_dates = PostInDB(
        title="Another Post",
        text="Content",
        author_id="user123",
        category_id="cat123"
    )
    assert post_without_dates.created_at is not None
    assert post_without_dates.updated_at is not None
    assert post_without_dates.date is not None


def test_post_update():
    # Test post update model
    update_data = {
        "title": "Updated Title",
        "text": "Updated content",
        "is_visible": False
    }
    post_update = PostUpdate(**update_data)
    assert post_update.title == update_data["title"]
    assert post_update.text == update_data["text"]
    assert post_update.is_visible == update_data["is_visible"]
    
    # Test with tags update
    update_with_tags = PostUpdate(tags=["newtag1", "newtag2"], **update_data)
    assert update_with_tags.tags == ["newtag1", "newtag2"]
