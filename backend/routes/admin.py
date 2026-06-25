from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Admin, Owner, Payment, MonthlyDue, Incident
from ..auth import hash_password


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally: 
        db.close()

#This is a the url that comes after the one in main.py
@router.post("/newowner")
def createowner(firstname:str, lastname:str, email:str, phone:int, ci:int, apartment:str, floor:str, tower:str, passw:str, db: Session=Depends(get_db)):
    newowner= Owner(first_name= firstname, last_name= lastname, email = email, phone = phone, ci = ci, apartment = apartment, floor = floor, tower = tower, password = hash_password(passw), monthly_fee = 5)
    db.add(newowner)
    db.commit()
    db.refresh(newowner)
    return {"message":"owner created", "id": newowner.id}

@router.get("/ownerlist")
def ownerlist(db: Session= Depends(get_db)):
    owners= db.query(Owner).all()
    return {"list": owners}

@router.post("/payment-verification")
def paymentverify(db: Session= Depends(get_db)):
    verify= Payment(status='paid')