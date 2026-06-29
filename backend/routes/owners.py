from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from ..database import SessionLocal
from ..models import Owner, Payment, MonthlyDue
from ..auth import get_current_owner
from ..schemas import PaymentUpload, PaymentHistoryItem, DebtSummary, DueOut
from ..services.sms import block
from ..services.exchange import get_rate, to_bs


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload-payment")
def upload_payment(body: PaymentUpload, db: Session = Depends(get_db), owner=Depends(get_current_owner)):
    if body.amount_bs <= 0:
        raise HTTPException(status_code=400, detail="El monto debe ser mayor a cero")

    rate = get_rate()
    amount_usd = round(body.amount_bs / rate, 2)

    new_payment = Payment(
        owner_id=owner["id"],
        amount_bs=body.amount_bs,
        receipt=body.receipt,
        payment_date=date.today(),
        exchange_rate=rate,
        amount_usd=amount_usd,
        status="pending"
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return {"message": "Pago enviado, pendiente de verificación", "payment_id": new_payment.id, "amount_usd": amount_usd}

@router.get("/my-payments", response_model=list[PaymentHistoryItem])
def my_payments(db: Session = Depends(get_db), owner=Depends(get_current_owner)):
    payments = (
        db.query(Payment)
        .filter(Payment.owner_id == owner["id"])
        .order_by(Payment.payment_date.desc())
        .all()
    )
    return payments


@router.get("/my-debt", response_model=DebtSummary)
def my_debt(db: Session = Depends(get_db), owner=Depends(get_current_owner)):
    pending_dues = (
        db.query(MonthlyDue)
        .filter(MonthlyDue.owner_id == owner["id"], MonthlyDue.status == "pending")
        .order_by(MonthlyDue.due_date.asc())
        .all()
    )

    total_usd = db.query(func.sum(MonthlyDue.amount_usd)).filter(
        MonthlyDue.owner_id == owner["id"],
        MonthlyDue.status == "pending"
    ).scalar() or 0.0

    rate = get_rate()

    return DebtSummary(
        pending_dues=[DueOut(
            id=d.id,
            amount_usd=d.amount_usd,
            month=d.month,
            due_date=d.due_date,
            status=d.status
        ) for d in pending_dues],
        total_debt_usd=float(total_usd),
        total_debt_bs=to_bs(float(total_usd)),
        pending_count=len(pending_dues),
        exchange_rate=rate
    )

@router.post("/block-number")
def block_my_number(db: Session = Depends(get_db), owner=Depends(get_current_owner)):
    owner_record = db.query(Owner).filter(Owner.id == owner["id"]).first()
    if not owner_record:
        raise HTTPException(status_code=404, detail="Not data found")

    try:
        block(owner_record.phone)
    except Exception:
        raise HTTPException(status_code=503, detail="Server error, not sms sent")

    return {"message": "Tu número ha sido bloqueado correctamente"}



    
#bro esta es para ver cantidad de usuarios (home screen admin)
@router.get("/stats")
def get_owner_stats(db: Session = Depends(get_db)):
    # Cuenta el total de usuarios en la tabla
    total_users = db.query(Owner).count()

    blocked_users = db.query(Owner).filter(Owner.status == "inactive").count()
    
    active_users = db.query(Owner).filter(Owner.status == "active").count()
    
    return {
        "total": total_users,
        "blocked": blocked_users,
        "active": active_users
    }
