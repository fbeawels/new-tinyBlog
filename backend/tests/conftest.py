import asyncio
import os
import pytest
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.testclient import TestClient

from app.main import app
from app.core.config import settings
from app.db.mongodb import close_mongo_connection, connect_to_mongo

import pytest_asyncio

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    yield loop
    
    # Clean up
    if not loop.is_closed():
        pending = asyncio.all_tasks(loop=loop)
        if pending:
            loop.run_until_complete(asyncio.gather(*pending, return_exceptions=True))
        loop.run_until_complete(loop.shutdown_asyncgens())
        loop.close()

@pytest_asyncio.fixture(scope="function")
async def db_client():
    """Create a MongoDB client for testing."""
    # Use a test database with a unique name for each test session
    settings.DATABASE_NAME = f"test_tinyblog_{uuid.uuid4().hex[:8]}"
    
    # Create a new client and connect to the database
    client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
    
    # Test the connection
    try:
        await client.server_info()
    except Exception as e:
        pytest.fail(f"Failed to connect to MongoDB: {e}")
    
    db = client[settings.DATABASE_NAME]
    
    # Connect to the test database
    await connect_to_mongo()
    
    try:
        yield db
    finally:
        # Clean up the test database after tests
        try:
            await db.client.drop_database(settings.DATABASE_NAME)
            await close_mongo_connection()
            if client:
                client.close()
            # Give time for all connections to close
            await asyncio.sleep(0.1)
        except Exception as e:
            print(f"Error during cleanup: {e}")
        finally:
            # Ensure the client is closed
            if hasattr(client, 'close') and callable(getattr(client, 'close')):
                client.close()


@pytest_asyncio.fixture(scope="function")
async def test_client(db_client):
    # Create a test client
    with TestClient(app) as client:
        yield client


@pytest_asyncio.fixture(scope="function")
async def test_superuser(test_client, db_client):
    """Create a test superuser and return auth headers"""
    # Create a test superuser
    user_data = {
        "email": "superuser@example.com",
        "username": "superuser",
        "password": "superpassword",
        "full_name": "Super User",
        "is_superuser": True,
        "is_active": True
    }
    
    # Register the superuser (bypassing normal registration which doesn't allow setting is_superuser)
    from app.core.security import get_password_hash
    from app.models.user import UserInDB
    
    # Use the db_client fixture that's already using the correct event loop
    db = db_client
    
    # Delete if exists
    await db.users.delete_one({"username": user_data["username"]})
    
    # Create user document
    hashed_password = get_password_hash(user_data["password"])
    user_dict = {
        "email": user_data["email"],
        "username": user_data["username"],
        "full_name": user_data["full_name"],
        "is_superuser": user_data["is_superuser"],
        "is_active": user_data["is_active"],
        "hashed_password": hashed_password,
        "created_at": None,
        "updated_at": None
    }
    
    # Insert the superuser
    result = await db.users.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    # Get token for the superuser
    login_data = {
        "username": user_data["username"],
        "password": user_data["password"]
    }
    response = test_client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200, f"Failed to login superuser: {response.text}"
    token = response.json()["access_token"]
    
    # Return headers with the auth token
    headers = {"Authorization": f"Bearer {token}"}
    return headers
