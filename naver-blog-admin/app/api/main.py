from fastapi import FastAPI
from .license import router as license_router
from ..routers.auth import router as auth_router

app = FastAPI()

app.include_router(license_router, prefix="/api/license")
app.include_router(auth_router, prefix="/api")

@app.get("/")
def root():
    return {"msg": "Naver Blog Admin API"} 