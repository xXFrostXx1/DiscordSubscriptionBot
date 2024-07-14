pip install redis
```

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import os
from dotenv import load_dotenv
import redis  # Importing Redis

# Loading environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URI", "sqlite:///example.db")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost")  # Add this line

engine = create_engine(DATABASE_URL, echo=True, future=True)

SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

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
        return value.decode("utf-8")
    return None

def cache_set(key, value, expiry_seconds=3600):
    """Set key-value pair in cache with an optional expiry."""
    redis_client.setex(key, expiry_seconds, value)

# Example usage of caching in your application
def get_cached_user_info(user_id):
    cache_key = f"user_info:{user_id}"
    user_info = cache_get(cache_key)
    
    if user_info is None:
        # Placeholder for actual database retrieval logic
        user_info = "Fetch from DB and replace this text with actual user information"
        cache_set(cache_key, user_info)
    
    return user_info