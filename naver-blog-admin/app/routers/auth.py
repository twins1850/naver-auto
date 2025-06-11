import secrets
from datetime import datetime, timedelta

from .. import auth, models, schemas
from ..database import get_db
from ..exception_handlers import CustomAPIException
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise CustomAPIException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
            code="login_failed",
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    # 리프레시 토큰 생성 및 저장
    refresh_token = secrets.token_urlsafe(32)
    refresh_token_expire = datetime.utcnow() + timedelta(days=7)
    user.refresh_token = refresh_token
    user.refresh_token_expire = refresh_token_expire
    db.commit()
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "refresh_token_expire": refresh_token_expire.isoformat(),
        "token_type": "bearer",
    }


@router.post("/refresh")
def refresh_access_token(refresh_token: str, db: Session = Depends(get_db)):
    user = (
        db.query(models.User).filter(models.User.refresh_token == refresh_token).first()
    )
    if (
        not user
        or not user.refresh_token_expire
        or user.refresh_token_expire < datetime.utcnow()
    ):
        raise HTTPException(
            status_code=401, detail="리프레시 토큰이 유효하지 않거나 만료되었습니다."
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    # 리프레시 토큰 재발급(보안상 기존 토큰 폐기)
    new_refresh_token = secrets.token_urlsafe(32)
    new_refresh_token_expire = datetime.utcnow() + timedelta(days=7)
    user.refresh_token = new_refresh_token
    user.refresh_token_expire = new_refresh_token_expire
    db.commit()
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "refresh_token_expire": new_refresh_token_expire.isoformat(),
        "token_type": "bearer",
    }
