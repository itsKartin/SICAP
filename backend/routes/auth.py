from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Admin, Owner
from ..auth import verify_password, create_token
from ..schemas import LoginRequest
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter()

#Login in the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#This is a the url that comes after the one in main.py

from ..schemas import LoginRequest

@router.post("/token")
def login_json(body: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == body.email).first()
    if admin and verify_password(body.password, admin.password):
        token = create_token({"id": admin.id, "email": admin.email, "role": "admin"})
        return {"access_token": token, "token_type": "bearer", "role": "admin"}

    owner = db.query(Owner).filter(Owner.email == body.email).first()
    if owner and verify_password(body.password, owner.password):
        token = create_token({"id": owner.id, "email": owner.email, "role": "owner"})
        return {"access_token": token, "token_type": "bearer", "role": "owner"}

    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == form.username).first()
    if admin and verify_password(form.password, admin.password):
        token = create_token({"id": admin.id, "email": admin.email, "role": "admin"})
        return {"access_token": token, "token_type": "bearer", "role": "admin"}

    owner = db.query(Owner).filter(Owner.email == form.username).first()
    if owner and verify_password(form.password, owner.password):
        token = create_token({"id": owner.id, "email": owner.email, "role": "owner"})
        return {"access_token": token, "token_type": "bearer", "role": "owner"}

    raise HTTPException(status_code=401, detail="Invalid credentials")