from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Enum, Date
from sqlalchemy.orm import relationship
from .database import Base

class Owner(Base):
    __tablename__ = 'owners'

    id = Column(Integer, primary_key = True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    phone = Column(String, nullable=False)
    status = Column(Enum("active", "inactive"), nullable=False, default="active")

class Payment(Base):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True)
    owner_id = Column(ForeignKey("Owner.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_date = Column(Date, nullable=False)
    receipt = Column(String, nullable=False)
    status = Column(Enum("paid", "pending", "late"), nullable=False)

class Admin(Base):
    __tablename__ = 'administrators'

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)