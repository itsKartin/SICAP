from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Admin, Owner
from ..auth import verify_password, create_token


router = APIRouter()

#Login in the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#This is a the url that comes after the one in main.py
@router.post("/login")
def login(email:str, password:str, db: Session = Depends(get_db)):

    admin = db.query(Admin).filter(Admin.email == email).first()
    if admin and verify_password(password, admin.password):
        token = create_token({"id": admin.id, "email": admin.email, "role": "admin"})
        return {"acces_token": token, "role": "admin"}

    user = db.query(Owner).filter(Owner.email == email).first()
    if user and verify_password(password, user.password):
        token = create_token({"id": user.id, "email": user.email, "role": "owner"})
        return {"acces_token": token, "role": "owner"}
    
    raise HTTPException(status_code=401, detail="Invalid credentials")