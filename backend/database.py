from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "mysql+pymysql://root:peanut@localhost/sicap_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine,autocommit=False, autoflush=False)

class Base(DeclarativeBase):
    pass