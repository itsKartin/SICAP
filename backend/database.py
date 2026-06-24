from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

load_dotenv()
dbuser= os.getenv("DATABASEUSER")
dbpass= os.getenv("DATABASEPASS")

DATABASE_URL = f"mysql+pymysql://{dbuser}:{dbpass}@localhost/sicap_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine,autocommit=False, autoflush=False)

class Base(DeclarativeBase):
    pass