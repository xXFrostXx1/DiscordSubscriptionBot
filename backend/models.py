from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)
Session = sessionmaker(bind=engine)
session = Session()
Base = declarative_base()

class Payment(Base):
    __tablename__ = 'payment'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    amount = Column(Integer)
    status = Column(String)
    payment_method = Column(String)
    

class Subscription(Base):
    __tablename__ = 'subscription'
    
    id = Column(Integer, primary_key=True, index=True)
    user_url = Column(Integer, ForeignKey('user.id'))
    subscription_type = Column(String)
    start_date = Column(DateTime)
    end (Date)Time)
    
Base.metadata.create_all(engine)