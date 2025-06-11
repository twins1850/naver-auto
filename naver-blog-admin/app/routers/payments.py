from datetime import datetime

from .. import models, schemas
from ..database import get_db
from ..exception_handlers import CustomAPIException
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .users import get_current_user

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/", response_model=schemas.PaymentOut)
def create_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    new_payment = models.Payment(
        user_id=payment.user_id,
        amount=payment.amount,
        status=payment.status,
        method=payment.method,
        paid_at=datetime.utcnow(),
        next_due=payment.next_due,
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment


@router.get("/", response_model=list[schemas.PaymentOut])
def read_payments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Payment).offset(skip).limit(limit).all()


@router.get("/{payment_id}", response_model=schemas.PaymentOut)
def read_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if payment is None:
        raise CustomAPIException(
            status_code=404,
            detail="결제 정보를 찾을 수 없습니다.",
            code="payment_not_found",
        )
    if payment.user_id != current_user.id and not current_user.is_admin:
        raise CustomAPIException(
            status_code=403, detail="권한이 없습니다.", code="forbidden"
        )
    return payment


@router.delete("/{payment_id}")
def delete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if payment is None:
        raise CustomAPIException(
            status_code=404,
            detail="결제 정보를 찾을 수 없습니다.",
            code="payment_not_found",
        )
    if payment.user_id != current_user.id and not current_user.is_admin:
        raise CustomAPIException(
            status_code=403, detail="권한이 없습니다.", code="forbidden"
        )
    db.delete(payment)
    db.commit()
    return {"success": True}
