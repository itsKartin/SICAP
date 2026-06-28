from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routes import auth, owners, admin

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://192.168.1.109:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app is the instace of the server, include_router is a method
#name_route.router is the instance for the class APIRouter of his respective route
#prefix is the base url of the entire route
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(owners.router, prefix="/owners", tags=["owners"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])

@app.get("/")
def root():
    return{"message":"server is runing"}