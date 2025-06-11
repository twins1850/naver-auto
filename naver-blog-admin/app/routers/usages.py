from datetime import datetime

from .. import models, schemas
from ..database import get_db
from ..exception_handlers import CustomAPIException
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .users import get_current_user

router = APIRouter(prefix="/usages", tags=["usages"])


@router.post("/", response_model=schemas.UsageOut)
def create_usage(usage: schemas.UsageCreate, db: Session = Depends(get_db)):
    new_usage = models.Usage(
        user_id=usage.user_id,
        date=usage.date or datetime.utcnow(),
        post_count=usage.post_count,
        success_count=usage.success_count,
        fail_count=usage.fail_count,
    )
    db.add(new_usage)
    db.commit()
    db.refresh(new_usage)
    return new_usage


@router.get("/", response_model=list[schemas.UsageOut])
def read_usages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Usage).offset(skip).limit(limit).all()


@router.get("/{usage_id}", response_model=schemas.UsageOut)
def read_usage(
    usage_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    usage = db.query(models.Usage).filter(models.Usage.id == usage_id).first()
    if usage is None:
        raise CustomAPIException(
            status_code=404,
            detail="사용량 정보를 찾을 수 없습니다.",
            code="usage_not_found",
        )
    if usage.user_id != current_user.id and not current_user.is_admin:
        raise CustomAPIException(
            status_code=403, detail="권한이 없습니다.", code="forbidden"
        )
    return usage


@router.delete("/{usage_id}")
def delete_usage(
    usage_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    usage = db.query(models.Usage).filter(models.Usage.id == usage_id).first()
    if usage is None:
        raise CustomAPIException(
            status_code=404,
            detail="사용량 정보를 찾을 수 없습니다.",
            code="usage_not_found",
        )
    if usage.user_id != current_user.id and not current_user.is_admin:
        raise CustomAPIException(
            status_code=403, detail="권한이 없습니다.", code="forbidden"
        )
    db.delete(usage)
    db.commit()
    return {"success": True}
