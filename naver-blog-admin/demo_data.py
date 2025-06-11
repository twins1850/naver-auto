#!/usr/bin/env python3
"""Demo data generation for the unified purchase/license system"""

import os
import sys
import jwt
import hashlib
from datetime import datetime, timedelta

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Purchase
from app.config import get_settings

# Get settings to use the correct database
settings = get_settings()

# JWT Secret (should match the one in purchases.py)
SECRET_KEY = "your-secret-key-here"

def generate_temporary_license(purchase_data: dict) -> str:
    """임시 라이선스 생성 - 짧은 형태로 개선"""
    # 핵심 데이터만 포함하여 더 짧은 라이선스 생성
    core_data = f"{purchase_data['order_id']}-{purchase_data['version']}-{purchase_data['account_count']}-{purchase_data['post_count']}"
    
    # SHA256 해시 생성 후 앞 16자리만 사용
    hash_object = hashlib.sha256(core_data.encode())
    hash_hex = hash_object.hexdigest()[:16]
    
    # 버전-계정-포스트-해시코드 형태로 구성 (예: V34-A3P4-A1B2C3D4)
    version = purchase_data['version'].replace('.', '')  # 3.4 -> 34
    short_license = f"V{version}-A{purchase_data['account_count']}P{purchase_data['post_count']}-{hash_hex[:8].upper()}"
    
    return short_license

def create_demo_purchases():
    """데모 구매 데이터 생성"""
    db = SessionLocal()
    
    try:
        # 기존 데모 데이터 확인 및 삭제 (안전한 방법)
        existing_purchases = db.query(Purchase).filter(Purchase.customer_name.like("데모%")).all()
        for purchase in existing_purchases:
            db.delete(purchase)
        db.commit()
        
        demo_purchases = [
            {
                "order_id": "ORDER-2024-001",
                "customer_name": "데모 사용자 1",
                "customer_email": "demo1@example.com",
                "customer_phone": "010-1234-5678",
                "version": "2.3",
                "account_count": 2,
                "post_count": 3,
                "months": 6,
                "amount": 150000,
                "payment_status": "completed",
                "status": "pending",
                "expire_date": datetime.utcnow() + timedelta(days=180)
            },
            {
                "order_id": "ORDER-2024-002", 
                "customer_name": "데모 사용자 2",
                "customer_email": "demo2@example.com",
                "customer_phone": "010-2345-6789",
                "version": "5.10",
                "account_count": 5,
                "post_count": 10,
                "months": 12,
                "amount": 500000,
                "payment_status": "completed",
                "status": "activated",
                "hardware_id": "HW-ABC123DEF456",
                "activation_date": datetime.utcnow() - timedelta(days=10),
                "expire_date": datetime.utcnow() + timedelta(days=355)
            },
            {
                "order_id": "ORDER-2024-003",
                "customer_name": "데모 사용자 3", 
                "customer_email": "demo3@example.com",
                "customer_phone": None,
                "version": "1.1",
                "account_count": 1,
                "post_count": 1,
                "months": 3,
                "amount": 50000,
                "payment_status": "completed",
                "status": "expired",
                "hardware_id": "HW-XYZ789GHI012",
                "activation_date": datetime.utcnow() - timedelta(days=100),
                "expire_date": datetime.utcnow() - timedelta(days=10)
            }
        ]
        
        for purchase_data in demo_purchases:
            # 임시 라이선스 생성
            temp_license = generate_temporary_license(purchase_data)
            purchase_data["temporary_license"] = temp_license
            
            # 활성화된 구매의 경우 최종 라이선스도 생성
            if purchase_data["status"] == "activated":
                final_license_data = {
                    "order_id": purchase_data["order_id"],
                    "hardware_id": purchase_data["hardware_id"],
                    "version": purchase_data["version"],
                    "account_count": purchase_data["account_count"],
                    "post_count": purchase_data["post_count"],
                    "expire_date": purchase_data["expire_date"].isoformat(),
                    "status": "activated",
                    "activated_at": purchase_data["activation_date"].isoformat()
                }
                purchase_data["final_license"] = jwt.encode(final_license_data, SECRET_KEY, algorithm="HS256")
            
            # 데이터베이스에 저장
            purchase = Purchase(**purchase_data)
            db.add(purchase)
        
        db.commit()
        print("✅ 데모 구매 데이터가 성공적으로 생성되었습니다!")
        print(f"📊 총 {len(demo_purchases)}개의 구매 내역이 추가되었습니다.")
        
        # 생성된 데이터 확인
        purchases = db.query(Purchase).filter(Purchase.customer_name.like("데모%")).all()
        print("\n📋 생성된 구매 내역:")
        for p in purchases:
            print(f"- {p.order_id}: {p.customer_name} (v{p.version}, {p.status})")
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_purchases() 