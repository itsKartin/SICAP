import io
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from fpdf import FPDF
from datetime import date as date_type
from ..database import SessionLocal
from ..models import Admin, Owner, Payment, MonthlyDue
from ..auth import hash_password, get_current_admin
from ..schemas import OwnerCreate, OwnerOut, PaymentOut, VerifyPaymentResponse, GenerateDuesRequest, AdminCreate, OwnerUpdate
from ..services.exchange import get_rate
from ..services.sms import block, add

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

BLOCK_THRESHOLD = 3

@router.post("/new-admin")
def create_admin(body: AdminCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    existing = db.query(Admin).filter(Admin.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un administrador con ese correo")

    new_admin = Admin(
        username=body.username,
        full_name=body.full_name,
        email=body.email,
        password=hash_password(body.password)
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {"message": "Administrador creado correctamente", "id": new_admin.id}

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

@router.put("/update-owner/{owner_id}")
def update_owner(owner_id: int, body: OwnerUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    owner = db.query(Owner).filter(Owner.id == owner_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Propietario no encontrado")

    if body.phone is not None:
        owner.phone = body.phone
    if body.email is not None:
        owner.email = body.email
    if body.password is not None:
        owner.password = hash_password(body.password)
    if body.status is not None:
        if body.status not in ("active", "inactive"):
            raise HTTPException(status_code=400, detail="Estado inválido, use 'active' o 'inactive'")
        owner.status = body.status

    db.commit()
    return {"message": "Propietario actualizado correctamente"}

@router.get("/ownerlist", response_model=list[OwnerOut])
def ownerlist(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(Owner).all()

@router.get("/pending-payments", response_model=list[PaymentOut])
def pending_payments(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    payments = (
        db.query(Payment, Owner)
        .join(Owner, Payment.owner_id == Owner.id)
        .filter(Payment.status == "pending")
        .order_by(Payment.payment_date.asc())
        .all()
    )

    result = []
    for payment, owner in payments:
        result.append(PaymentOut(
            id=payment.id,
            owner_id=payment.owner_id,
            amount_bs=payment.amount_bs,
            payment_date=payment.payment_date,
            receipt=payment.receipt,
            status=payment.status,
            owner_name=f"{owner.first_name} {owner.last_name}",
            owner_apartment=owner.apartment,
            owner_tower=owner.tower, 
            owner_floor=owner.floor 
        ))
    return result

@router.post("/payment-verification/{payment_id}", response_model=VerifyPaymentResponse)
def paymentverify(payment_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    if payment.status == "paid":
        raise HTTPException(status_code=400, detail="Este pago ya fue verificado")

    owner = db.query(Owner).filter(Owner.id == payment.owner_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Propietario no encontrado")

    amount_usd = payment.amount_usd
    rate = payment.exchange_rate

    payment.status = "paid"
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

    db.flush()

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
        message="Pago verificado correctamente",
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

@router.post("/generate-dues")
def generate_dues(body: GenerateDuesRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    today = date_type.today()
    current_month = date_type(today.year, today.month, 1)

    owners = db.query(Owner).all()

    if not owners:
        raise HTTPException(status_code=404, detail="No hay propietarios activos")

    dues_created = []
    owners_blocked = []

    for owner in owners:
        new_due = MonthlyDue(
            owner_id=owner.id,
            amount_usd=body.amount_usd,
            month=current_month,
            due_date=body.due_date,
            status="pending"
        )
        db.add(new_due)
        dues_created.append(owner.id)

        pending_count = db.query(func.count(MonthlyDue.id)).filter(
            MonthlyDue.owner_id == owner.id,
            MonthlyDue.status == "pending"
        ).scalar() or 0

        if pending_count >= BLOCK_THRESHOLD and owner.status == "active":
            try:
                block(owner.phone)
            except Exception:
                pass
            owner.status = "inactive"
            owners_blocked.append(owner.id)

    db.commit()

    return {
        "message": "Mensualidades generadas y deudas verificadas",
        "dues_created": len(dues_created),
        "owners_blocked": owners_blocked
    }


MESES = {
    1: "enero", 2: "febrero", 3: "marzo", 4: "abril",
    5: "mayo", 6: "junio", 7: "julio", 8: "agosto",
    9: "septiembre", 10: "octubre", 11: "noviembre", 12: "diciembre"
}

def fecha_hoy():
    hoy = date_type.today()
    return f"{hoy.day} de {MESES[hoy.month]} de {hoy.year}"

@router.get("/owners-report/pdf")
def owners_pdf(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    owners = db.query(Owner).order_by(Owner.tower, Owner.floor, Owner.apartment).all()

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "Reporte de Propietarios", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, f"Generado el: {fecha_hoy()}", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(6)

    headers = ["Nombre", "CI", "Apto", "Piso", "Torre", "Estatus"]
    widths =  [55,       25,   20,     20,     20,      30]

    pdf.set_font("Helvetica", "B", 9)
    pdf.set_fill_color(30, 30, 30)
    pdf.set_text_color(255, 255, 255)
    for header, width in zip(headers, widths):
        pdf.cell(width, 8, header, border=1, fill=True)
    pdf.ln()

    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(0, 0, 0)

    for i, owner in enumerate(owners):
        fill = i % 2 == 0
        pdf.set_fill_color(245, 245, 245) if fill else pdf.set_fill_color(255, 255, 255)
        status_label = "Activo" if owner.status == "active" else "Bloqueado"
        row = [
            f"{owner.first_name} {owner.last_name}",
            owner.ci,
            owner.apartment,
            owner.floor,
            owner.tower,
            status_label
        ]
        for value, width in zip(row, widths):
            pdf.cell(width, 7, str(value), border=1, fill=fill)
        pdf.ln()

    pdf.ln(8)
    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 6, f"Total de propietarios: {len(owners)}", new_x="LMARGIN", new_y="NEXT")

    buffer = io.BytesIO(bytes(pdf.output()))
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=reporte_propietarios.pdf"}
    )