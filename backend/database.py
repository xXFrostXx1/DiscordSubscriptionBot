from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import os
from dotenv import load_dotenv
import redis  # Importing Redis
import json  # For efficient data serialization

# Loading environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URI", "sqlite:///example.db")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost")

engine = create_engine(DATABASE_URL, echo=True, future=True)

SessionLocal = scopedSerializable_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

# Initialize Redis client
redis_client = redis.Redis.from_url(REDIS_URL)

def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def cache_get(key):
    """Retrieve value from cache by key."""
    value = redis_client.get(key)
    if value:
        return json.loads(value.decode("utf-8"))  # Assuming JSON storage for efficiency
    return None

def cache_set(key, value, expiry_seconds=3600):
    """Set key-value pair in cache with an optional expiry."""
    # Serialize using JSON for efficient storage
    serialized_value = json.dumps(value)
    redis_client.setex(key, expiry_seconds, serialized_value)

# Example usage of caching in your application
def get_cached_user_info(user_id):
    cache_key = f"user_info:{user_inid}"
    user_info = cache_get(cache_key)
    
    if user_info is None:
        # Placeholder for actual database retrieval logic
        # Assuming the replacement text is a dictionary-like object
        user_info = {"info": "Fetch from DB and replace this text with actual user information"}
        cache_set(cache_key, user_info)
    
    return user_info