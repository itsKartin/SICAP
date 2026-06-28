from pydantic import BaseModel
from typing import Optional

class OwnerCreate(BaseModel):
    firstname: str
    lastname: str
    email: str
    phone: str
    ci: str
    apartment: str
    floor: str
    tower: str
    passw: str

class OwnerOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    ci: str
    apartment: str
    floor: str
    tower: str
    status: str
    monthly_fee: float

    class Config:
        from_attributes = True

class VerifyPaymentResponse(BaseModel):
    message: str
    payment_id: int
    owner_id: int
    amount_bs: float
    amount_usd: float
    exchange_rate: float
    dues_covered: list[int]
    owner_unblocked: bool
    owner_blocked: bool
    pending_dues_count: int
    pending_debt_usd: float
    overpayment_usd: float