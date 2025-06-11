from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field


# User
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    plan: Optional[str] = "basic"
    is_admin: Optional[bool] = False


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserOut(UserBase):
    id: int
    join_date: datetime
    expire_date: Optional[datetime]
    is_active: bool

    class Config:
        from_attributes = True


# License
class LicenseBase(BaseModel):
    plan: Optional[str] = "basic"
    status: Optional[str] = "active"
    expire_at: Optional[datetime]


class LicenseCreate(LicenseBase):
    user_id: int


class LicenseOut(LicenseBase):
    id: int
    user_id: int
    key: str
    issued_at: datetime

    class Config:
        from_attributes = True


class LicenseUpdate(BaseModel):
    status: Optional[str] = None
    expire_at: Optional[datetime] = None


# Payment
class PaymentBase(BaseModel):
    amount: float
    status: Optional[str] = "paid"
    method: Optional[str] = "card"
    next_due: Optional[datetime]


class PaymentCreate(PaymentBase):
    user_id: int


class PaymentOut(PaymentBase):
    id: int
    user_id: int
    paid_at: datetime

    class Config:
        from_attributes = True


# Usage
class UsageBase(BaseModel):
    date: Optional[datetime]
    post_count: int = 0
    success_count: int = 0
    fail_count: int = 0


class UsageCreate(UsageBase):
    user_id: int


class UsageOut(UsageBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class PaginatedUsers(BaseModel):
    total: int
    page: int
    size: int
    items: List[UserOut]


# Purchase (새로운 통합 시스템)
class PurchaseBase(BaseModel):
    order_id: str
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    
    # 버전 기반 정보
    version: str
    account_count: int
    post_count: int
    months: int
    
    # 결제 정보
    amount: int
    payment_status: Optional[str] = "completed"
    
    expire_date: datetime

class PurchaseCreate(PurchaseBase):
    pass

class PurchaseUpdate(BaseModel):
    hardware_id: Optional[str] = None
    final_license: Optional[str] = None
    activation_date: Optional[datetime] = None
    status: Optional[str] = None

class PurchaseOut(PurchaseBase):
    id: int
    temporary_license: Optional[str] = None
    final_license: Optional[str] = None
    hardware_id: Optional[str] = None
    activation_date: Optional[datetime] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 임시 라이선스 활성화 요청
class ActivationRequest(BaseModel):
    temporary_license: str
    hardware_id: str
    system_info: Optional[dict] = None

class ActivationResponse(BaseModel):
    success: bool
    license_key: Optional[str] = None
    message: str
    expire_date: Optional[datetime] = None
