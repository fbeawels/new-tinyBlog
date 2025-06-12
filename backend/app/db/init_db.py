import asyncio
import logging

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.mongodb import db

logger = logging.getLogger(__name__)

async def init_db():
    try:
        # Create collections if they don't exist
        collections = await db.db.list_collection_names()
        
        # Create indexes for Users collection
        if "users" not in collections:
            await db.db.create_collection("users")
        await db.db.users.create_index("email", unique=True)
        await db.db.users.create_index("username", unique=True)
        
        # Create indexes for Posts collection
        if "posts" not in collections:
            await db.db.create_collection("posts")
        await db.db.posts.create_index("title")
        await db.db.posts.create_index("date")
        await db.db.posts.create_index("category_id")
        await db.db.posts.create_index("author_id")
        
        # Create indexes for Categories collection
        if "categories" not in collections:
            await db.db.create_collection("categories")
        await db.db.categories.create_index("name", unique=True)
        
        # Create indexes for Comments collection
        if "comments" not in collections:
            await db.db.create_collection("comments")
        await db.db.comments.create_index("post_id")
        await db.db.comments.create_index("date")
        
        # Create indexes for Tags collection
        if "tags" not in collections:
            await db.db.create_collection("tags")
        await db.db.tags.create_index("name", unique=True)
        
        # Create first superuser if it doesn't exist
        try:
            user = await db.db.users.find_one({"email": settings.FIRST_SUPERUSER})
            if not user:
                user_data = {
                    "email": settings.FIRST_SUPERUSER,
                    "username": "admin",
                    "hashed_password": get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                    "is_active": True,
                    "is_superuser": True,
                    "full_name": "Initial Admin User",
                }
                await db.db.users.insert_one(user_data)
                logger.info("Created first superuser")
        except DuplicateKeyError:
            logger.warning("Superuser already exists")
        
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise

if __name__ == "__main__":
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db.client = client
    db.db = client[settings.DATABASE_NAME]
    
    loop = asyncio.get_event_loop()
    loop.run_until_complete(init_db())