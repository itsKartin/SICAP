from pydantic import BaseModel

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

class VerifyPaymentResponse(BaseModel):
    message: str
    payment_id: int
    owner_id: int
    amount_bs: float
    amount_usd: float
    exchange_rate: float
    dues_covered: list[int]
    owner_unblocked: bool
    pending_debt_usd: float
    