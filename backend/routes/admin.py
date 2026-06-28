from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import SessionLocal
from ..models import Admin, Owner, Payment, MonthlyDue
from ..auth import hash_password, get_current_admin
from ..schemas import OwnerCreate, OwnerOut, VerifyPaymentResponse
from ..services.exchange import usd_value
from ..services.sms import block, add

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

BLOCK_THRESHOLD = 3

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

@router.get("/ownerlist", response_model=list[OwnerOut])
def ownerlist(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(Owner).all()

@router.post("/payment-verification/{payment_id}", response_model=VerifyPaymentResponse)
def paymentverify(payment_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.status == "paid":
        raise HTTPException(status_code=400, detail="Payment already verified")

    owner = db.query(Owner).filter(Owner.id == payment.owner_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    try:
        rate = usd_value()
    except Exception:
        raise HTTPException(status_code=503, detail="Could not fetch BCV exchange rate")

    amount_usd = round(payment.amount_bs / rate, 2)

    payment.status = "paid"
    payment.exchange_rate = rate
    payment.admin_id = admin["id"]

    pending_dues = (
        db.query(MonthlyDue)
        .filter(MonthlyDue.owner_id == owner.id, MonthlyDue.status == "pending")
        .order_by(MonthlyDue.due_date.asc())
        .all()
    )

    remaining_credit = amount_usd
    dues_covered = []

    for due in pending_dues:
        if remaining_credit <= 0:
            break
        if remaining_credit >= due.amount_usd:
            remaining_credit -= due.amount_usd
            due.status = "paid"
            dues_covered.append(due.id)
        else:
            due.amount_usd = round(due.amount_usd - remaining_credit, 2)
            remaining_credit = 0

    overpayment = round(remaining_credit, 2)

    pending_dues_count = db.query(func.count(MonthlyDue.id)).filter(
        MonthlyDue.owner_id == owner.id,
        MonthlyDue.status == "pending"
    ).scalar() or 0

    remaining_debt = db.query(func.sum(MonthlyDue.amount_usd)).filter(
        MonthlyDue.owner_id == owner.id,
        MonthlyDue.status == "pending"
    ).scalar() or 0.0

    owner_unblocked = False

    if pending_dues_count < BLOCK_THRESHOLD and owner.status == "inactive":
        try:
            add(owner.phone)
        except Exception:
            pass
        owner.status = "active"
        owner_unblocked = True

    db.commit()

    return VerifyPaymentResponse(
        message="Payment verified successfully",
        payment_id=payment.id,
        owner_id=owner.id,
        amount_bs=payment.amount_bs,
        amount_usd=amount_usd,
        exchange_rate=rate,
        dues_covered=dues_covered,
        owner_unblocked=owner_unblocked,
        pending_dues_count=pending_dues_count,
        pending_debt_usd=float(remaining_debt),
        overpayment_usd=overpayment
    )