from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Enum, Date, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class Owner(Base):
    __tablename__ = 'owners'

    id = Column(Integer, primary_key = True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    phone = Column(String(20), nullable=False)
    apartment = Column(String(10), nullable=False)
    status = Column(Enum("active", "inactive"), nullable=False, default="active")
    password = Column(String(100), nullable=False)
    monthly_fee = Column(Float, nullable=False)
    month_unpaid = Column(Integer)

class MonthlyDue(Base):
    __tablename__ = 'dues'

    id = Column(Integer, primary_key=True)
    owner_id = Column(ForeignKey("owners.id"), nullable=False)
    amount_usd = Column(Float, nullable=False)
    month = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(Enum("paid", "pending"), nullable=False, default="pending")


class Payment(Base):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True)
    owner_id = Column(ForeignKey("owners.id"), nullable=False)
    admin_id = Column(ForeignKey("administrators.id"), nullable=True)
    amount_bs = Column(Float, nullable=False)
    payment_date = Column(Date, nullable=False)
    receipt = Column(String(100), nullable=False)
    status = Column(Enum("paid", "pending", "late"), nullable=False)

class Admin(Base):
    __tablename__ = 'administrators'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False)
    password = Column(String (250), nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String (100), nullable=False)

class Incident(Base):
    __tablename__ = 'incidents'
    id = Column(Integer, primary_key=True)
    admin_id = Column(ForeignKey("administrators.id"), nullable=False)
    description = Column(String(500), nullable=False)
    opened_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False)