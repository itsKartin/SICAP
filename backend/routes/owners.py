from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Owner
from ..services.sms import block

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/block")
def block_owner(owner_id:str,db:Session = Depends(get_db)):
    owner = db.query(Owner).filter(Owner.id == owner_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail='Not data found')
    owner.status = "inactive"
    db.commit()
    block(owner.phone)
    return {"message": "Propietario bloqueado correctamente"}