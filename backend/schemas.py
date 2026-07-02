from pydantic import BaseModel
from typing import Optional
from datetime import date
from datetime import datetime

#Auth route
class LoginRequest(BaseModel): #Login /login
    email:str
    password:str

#Owners routes

class PaymentUpload(BaseModel):
    amount_bs: float
    receipt: str

class PaymentHistoryItem(BaseModel):
    id: int
    amount_bs: float
    payment_date: date
    status: str
    amount_usd: Optional[float] = None
    exchange_rate: Optional[float] = None
    receipt: Optional[str] = None

    class Config:
        from_attributes = True

class DueOut(BaseModel):
    id: int
    amount_usd: float
    month: date
    due_date: date
    status: str

    class Config:
        from_attributes = True

        
class DebtSummary(BaseModel):
    pending_dues: list[DueOut]
    total_debt_usd: float
    total_debt_bs: float
    pending_count: int
    exchange_rate: float

#Admin routes

class AdminCreate(BaseModel):
    username: str
    full_name: str
    email: str
    password: str

class OwnerUpdate(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    status: Optional[str] = None

class OwnerCreate(BaseModel): #Registro de propietario /newowner 
    firstname: str
    lastname: str
    email: str
    phone: str
    ci: str
    apartment: str
    floor: str
    tower: str
    passw: str

class OwnerOut(BaseModel): #Lista de usuario /ownerlist 
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

class PaymentOut(BaseModel): #Lista de pagos /pending-payments 
    id: int
    owner_id: int
    amount_bs: float
    payment_date: date
    receipt: Optional[str]
    status: str
    owner_name: str
    owner_apartment: str
    owner_tower: str 
    owner_floor: str

class VerifyPaymentResponse(BaseModel):  #Verificacion de pagos /payment-verification/{payment_id}
    message: str
    payment_id: int
    owner_id: int
    amount_bs: float
    amount_usd: float
    exchange_rate: float
    dues_covered: list[int]
    owner_unblocked: bool
    pending_dues_count: int
    pending_debt_usd: float
    overpayment_usd: float

class GenerateDuesRequest(BaseModel):
    amount_usd: float
    due_date: date

class IncidentCreate(BaseModel):
    description: str
    opened_at: datetime

class IncidentOut(BaseModel):
    id: int
    description: str
    opened_at: datetime
    created_at: datetime
    registered_by: str