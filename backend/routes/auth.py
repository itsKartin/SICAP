from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Admin, Owner
from ..auth import verify_password, create_token


router = APIRouter()

#Inicio de sesion en base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#This is a the url that comes after the one in main.py
@router.post("/login")
def login(email:str, password:str, db: Session = Depends(get_db)):
    user = db.query(Owner).filter(Owner.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"access_token": create_token({"id":user.id, "email": user.email})}