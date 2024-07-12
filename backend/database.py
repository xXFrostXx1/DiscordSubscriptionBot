from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URI", "sqlite:///example.db") 

engine = create_engine(DATABASE_URL, echo=True, future=True)

SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()