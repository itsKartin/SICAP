from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import SessionLocal
from ..models import Admin, Owner, Payment, MonthlyDue, Incident
from ..auth import hash_password, get_current_admin
from ..schemas import OwnerCreate, VerifyPaymentResponse
from ..services.exchange import usd_value
from services.sms import block, add



router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally: 
        db.close()

#This is a the url that comes after the one in main.py

@router.post("/newowner")
def createowner(owner: OwnerCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    newowner = Owner(
        first_name=owner.firstname,
        last_name=owner.lastname,
        email=owner.email,
        phone=owner.phone,
        ci=owner.ci,
        apartment=owner.apartment,
        floor=owner.floor,
        tower=owner.tower,
        password=hash_password(owner.passw),
        monthly_fee=5
    )
    db.add(newowner)
    db.commit()
    db.refresh(newowner)
    return {"message": "owner created", "id": newowner.id}


@router.get("/ownerlist")
def ownerlist(db: Session= Depends(get_db), admin=Depends(get_current_admin)):
    owners= db.query(Owner).all()
    return {"list": owners}

@router.post("/payment-verification/{payment_id}", response_model=VerifyPaymentResponse)
def paymentverify(db: Session= Depends(get_db)):
    pass