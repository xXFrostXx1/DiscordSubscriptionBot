from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    create_engine
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URI = os.getenv("DATABASE_URL")

engine = create engine(DATABASE_URI, echo=True)
SessionManager = sessionmaker(bind=engine)
session = SessionManager()

BaseModel = declarative_base()

class User(BaseModel):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    payments = relationship("PaymentRecord", backref="user")
    subscriptions = relationship("SubscriptionDetail", backref="user")

class PaymentRecord(BaseModel):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    amount_paid = Column(Integer)
    payment_status = Column(String)
    payment_method_type = Column(String)

class SubscriptionDetail(BaseModel):
    __tablename__ = 'subscriptions'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    type_of_subscription = Column(String)
    subscription_start_date = Column(DateTime)
    subscription_end_date = Column(DateTime)

BaseModel.metadata.create_all(engine)