from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt 
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("TOKENKEY")
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 30

pass_context= CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str):
    return pass_context.hash(password)

def verify_password(password: str, hashed: str):
    return pass_context.verify(password, hashed)

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
