from datetime import datetime

from sqlalchemy import (Boolean, Column, DateTime, Float, ForeignKey, Integer,
                        String)
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, nullable=True)
    hashed_password = Column(String)
    plan = Column(String, default="basic")
    join_date = Column(DateTime, default=datetime.utcnow)
    expire_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)  # 관리자 여부

    # Relationships
    licenses = relationship("License", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    usages = relationship("Usage", back_populates="user")


class License(Base):
    __tablename__ = "licenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    key = Column(String, unique=True, index=True)
    plan = Column(String, default="basic")
    status = Column(String, default="active")
    issued_at = Column(DateTime, default=datetime.utcnow)
    expire_at = Column(DateTime, nullable=True)

    # Relationship
    user = relationship("User", back_populates="licenses")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    status = Column(String, default="paid")
    method = Column(String, default="card")
    paid_at = Column(DateTime, default=datetime.utcnow)
    next_due = Column(DateTime, nullable=True)

    # Relationship
    user = relationship("User", back_populates="payments")


class Usage(Base):
    __tablename__ = "usages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    post_count = Column(Integer, default=0)
    success_count = Column(Integer, default=0)
    fail_count = Column(Integer, default=0)

    # Relationship
    user = relationship("User", back_populates="usages")


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, unique=True, index=True)  # 토스 주문번호
    customer_name = Column(String, index=True)
    customer_email = Column(String, index=True)
    customer_phone = Column(String, nullable=True)
    
    # 버전 기반 정보 (플랜 대신 사용)
    version = Column(String, index=True)  # "1.1", "2.3", "5.10"
    account_count = Column(Integer)       # 아이디 수
    post_count = Column(Integer)          # 글 수  
    months = Column(Integer)              # 사용 기간
    
    # 결제 정보
    amount = Column(Integer)              # 결제 금액
    payment_status = Column(String, default="completed")
    payment_date = Column(DateTime, default=datetime.utcnow)
    
    # 라이선스 정보
    temporary_license = Column(String, nullable=True)     # 임시 라이선스
    final_license = Column(String, nullable=True)         # 최종 인증키
    hardware_id = Column(String, nullable=True)           # 하드웨어 ID
    activation_date = Column(DateTime, nullable=True)     # 활성화 날짜
    expire_date = Column(DateTime)                        # 만료일
    
    # 다운로드 통계
    download_count = Column(Integer, default=0)          # 다운로드 횟수
    last_download_date = Column(DateTime, nullable=True) # 마지막 다운로드 날짜
    
    # 상태 관리
    status = Column(String, default="pending")           # pending, activated, expired
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
