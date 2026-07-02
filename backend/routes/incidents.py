from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import SessionLocal
from ..models import Admin, Incident
from ..auth import get_current_admin
from ..schemas import IncidentCreate, IncidentOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/incidents/new")
def create_incident(body: IncidentCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    new_incident = Incident(
        admin_id=admin["id"],
        description=body.description,
        opened_at=body.opened_at,
        created_at=datetime.now()
    )
    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)
    return {"message": "Incidente registrado correctamente", "id": new_incident.id}

@router.get("/incidents/list", response_model=list[IncidentOut])
def list_incidents(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    incidents = (
        db.query(Incident, Admin)
        .join(Admin, Incident.admin_id == Admin.id)
        .order_by(Incident.created_at.desc())
        .all()
    )

    return [
        IncidentOut(
            id=incident.id,
            description=incident.description,
            opened_at=incident.opened_at,
            created_at=incident.created_at,
            registered_by=admin_record.full_name
        )
        for incident, admin_record in incidents
    ]