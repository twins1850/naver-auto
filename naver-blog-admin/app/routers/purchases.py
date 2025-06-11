import jwt
import secrets
from datetime import datetime, timedelta
from typing import List, Optional
import hashlib
import base64

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse, RedirectResponse
import os

from .. import models, schemas
from ..database import get_db
from .users import get_current_user
from ..email_service import send_purchase_confirmation_email
from ..config import get_settings

router = APIRouter(prefix="/purchases", tags=["purchases"])

# JWT Secret (실제 환경에서는 환경변수로 관리)
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

def generate_final_license(purchase_data: dict) -> str:
    """최종 인증키 생성"""
    final_license_data = {
        "order_id": purchase_data["order_id"],
        "hardware_id": purchase_data["hardware_id"],
        "version": purchase_data["version"],
        "account_count": purchase_data["account_count"],
        "post_count": purchase_data["post_count"],
        "expire_date": purchase_data["expire_date"].isoformat(),
        "status": "activated",
        "activated_at": datetime.utcnow().isoformat()
    }
    
    return jwt.encode(final_license_data, SECRET_KEY, algorithm="HS256")

@router.post("/", response_model=schemas.PurchaseOut)
def create_purchase(
    purchase: schemas.PurchaseCreate, 
    db: Session = Depends(get_db)
):
    """새로운 구매 정보 생성 (결제 완료 시 호출)"""
    
    # 임시 라이선스 생성
    temp_license = generate_temporary_license({
        "order_id": purchase.order_id,
        "version": purchase.version,
        "account_count": purchase.account_count,
        "post_count": purchase.post_count,
        "months": purchase.months,
        "expire_date": purchase.expire_date
    })
    
    # 데이터베이스에 저장
    db_purchase = models.Purchase(
        order_id=purchase.order_id,
        customer_name=purchase.customer_name,
        customer_email=purchase.customer_email,
        customer_phone=purchase.customer_phone,
        version=purchase.version,
        account_count=purchase.account_count,
        post_count=purchase.post_count,
        months=purchase.months,
        amount=purchase.amount,
        payment_status=purchase.payment_status,
        expire_date=purchase.expire_date,
        temporary_license=temp_license,
        status="pending"
    )
    
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    
    # 이메일 발송 (비동기로 처리하여 API 응답 지연 방지)
    email_data = {
        "order_id": purchase.order_id,
        "customer_name": purchase.customer_name,
        "customer_email": purchase.customer_email,
        "version": purchase.version,
        "account_count": purchase.account_count,
        "post_count": purchase.post_count,
        "months": purchase.months,
        "temporary_license": temp_license,
        "expire_date": purchase.expire_date.isoformat()
    }
    
    try:
        send_purchase_confirmation_email(email_data)
    except Exception as e:
        # 이메일 발송 실패해도 구매는 정상 처리
        print(f"이메일 발송 실패: {e}")
    
    return db_purchase

@router.post("/activate", response_model=schemas.ActivationResponse)
def activate_license(
    request: schemas.ActivationRequest,
    db: Session = Depends(get_db)
):
    """임시 라이선스를 최종 인증키로 활성화"""
    
    try:
        # 새로운 짧은 형태의 임시 라이선스 파싱 (예: V34-A3P4-A1B2C3D4)
        temp_license = request.temporary_license
        
        # 임시 라이선스가 데이터베이스에 있는지 직접 확인
        purchase = db.query(models.Purchase).filter(
            models.Purchase.temporary_license == temp_license
        ).first()
        
        if not purchase:
            raise HTTPException(404, "유효하지 않은 임시 라이선스입니다")
            
        if purchase.status == "activated":
            raise HTTPException(400, "이미 활성화된 라이선스입니다")
        
        # 하드웨어 ID 저장 및 최종 인증키 생성
        purchase.hardware_id = request.hardware_id
        purchase.activation_date = datetime.utcnow()
        purchase.status = "activated"
        
        final_license = generate_final_license({
            "order_id": purchase.order_id,
            "hardware_id": request.hardware_id,
            "version": purchase.version,
            "account_count": purchase.account_count,
            "post_count": purchase.post_count,
            "expire_date": purchase.expire_date
        })
        
        purchase.final_license = final_license
        db.commit()
        
        return schemas.ActivationResponse(
            success=True,
            license_key=final_license,
            message="라이선스가 성공적으로 활성화되었습니다",
            expire_date=purchase.expire_date
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"활성화 중 오류가 발생했습니다: {str(e)}")

@router.get("/", response_model=List[schemas.PurchaseOut])
def get_purchases(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """구매 목록 조회 (관리자 전용)"""
    if not current_user.is_admin:
        raise HTTPException(403, "관리자 권한이 필요합니다")
    
    purchases = db.query(models.Purchase).offset(skip).limit(limit).all()
    return purchases

@router.get("/{purchase_id}", response_model=schemas.PurchaseOut)
def get_purchase(
    purchase_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """특정 구매 정보 조회"""
    if not current_user.is_admin:
        raise HTTPException(403, "관리자 권한이 필요합니다")
    
    purchase = db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(404, "구매 정보를 찾을 수 없습니다")
    
    return purchase

@router.get("/order/{order_id}", response_model=schemas.PurchaseOut)  
def get_purchase_by_order_id(
    order_id: str,
    db: Session = Depends(get_db)
):
    """주문번호로 구매 정보 조회"""
    purchase = db.query(models.Purchase).filter(models.Purchase.order_id == order_id).first()
    if not purchase:
        raise HTTPException(404, "구매 정보를 찾을 수 없습니다")
    
    return purchase

@router.post("/validate", response_model=dict)
def validate_license(
    license_key: str,
    hardware_id: str,
    db: Session = Depends(get_db)
):
    """라이선스 검증 (소비자 프로그램에서 호출)"""
    try:
        # 라이선스 디코드
        license_data = jwt.decode(license_key, SECRET_KEY, algorithms=["HS256"])
        
        # 하드웨어 ID 검증
        if license_data.get("hardware_id") != hardware_id:
            return {"valid": False, "reason": "하드웨어 ID가 일치하지 않습니다"}
        
        # 만료일 검증
        expire_date = datetime.fromisoformat(license_data["expire_date"])
        if datetime.utcnow() > expire_date:
            return {"valid": False, "reason": "라이선스가 만료되었습니다"}
        
        return {
            "valid": True,
            "version": license_data["version"],
            "account_count": license_data["account_count"],
            "post_count": license_data["post_count"],
            "expire_date": license_data["expire_date"]
        }
        
    except jwt.InvalidTokenError:
        return {"valid": False, "reason": "유효하지 않은 라이선스입니다"}
    except Exception as e:
        return {"valid": False, "reason": f"검증 중 오류: {str(e)}"}

@router.get("/download/{temporary_license}")
def download_program(temporary_license: str, db: Session = Depends(get_db)):
    """임시 라이선스로 프로그램 다운로드"""
    try:
        # 새로운 짧은 형태의 임시 라이선스로 구매 정보 확인
        purchase = db.query(models.Purchase).filter(
            models.Purchase.temporary_license == temporary_license
        ).first()
        
        if not purchase or purchase.status == "expired":
            raise HTTPException(404, "유효하지 않은 다운로드 링크입니다")
        
        # 다운로드 파일 선택 (최신 패키지 우선)
        download_files = [
            "static/downloads/naver-blog-automation-latest.zip",  # 최신 패키지
            "static/downloads/naver-blog-automation-unified.exe"  # 호환성용
        ]
        
        program_file = None
        for file_path in download_files:
            if os.path.exists(file_path):
                program_file = file_path
                break
        
        if not program_file:
            raise HTTPException(404, "프로그램 파일을 찾을 수 없습니다")
        
        # 다운로드 통계 업데이트
        purchase.download_count = (purchase.download_count or 0) + 1
        purchase.last_download_date = datetime.utcnow()
        db.commit()
        
        # 파일 확장자에 따른 적절한 파일명 생성
        file_ext = os.path.splitext(program_file)[1]
        filename = f"네이버블로그자동화_v{purchase.version}_{purchase.order_id}{file_ext}"
        
        return FileResponse(
            path=program_file,
            filename=filename,
            media_type="application/zip" if file_ext == ".zip" else "application/octet-stream"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"다운로드 중 오류가 발생했습니다: {str(e)}")

@router.get("/download-info/{order_id}")
def get_download_info(order_id: str, db: Session = Depends(get_db)):
    """구매자의 다운로드 정보 조회"""
    purchase = db.query(models.Purchase).filter(
        models.Purchase.order_id == order_id
    ).first()
    
    if not purchase:
        raise HTTPException(404, "구매 정보를 찾을 수 없습니다")
    
    settings = get_settings()
    download_url = f"{settings.BASE_URL}/purchases/download/{purchase.temporary_license}"
    
    # 버전 정보 파일 읽기
    version_info = {}
    version_file_path = "static/downloads/version_info.json"
    if os.path.exists(version_file_path):
        import json
        with open(version_file_path, 'r', encoding='utf-8') as f:
            version_info = json.load(f)
    
    return {
        "order_id": order_id,
        "customer_name": purchase.customer_name,
        "version": purchase.version,
        "download_url": download_url,
        "download_count": purchase.download_count or 0,
        "last_download_date": purchase.last_download_date,
        "program_info": {
            "latest_version": version_info.get("version", "1.0.0"),
            "build_date": version_info.get("build_date"),
            "description": version_info.get("description", "네이버 블로그 자동화 프로그램"),
            "requirements": version_info.get("requirements", [])
        },
        "features": get_version_features(purchase.version),
        "usage_limits": {
            "accounts": purchase.account_count,
            "posts": purchase.post_count,
            "months": purchase.months
        }
    }

def get_version_features(version: str) -> dict:
    """버전별 기능 정보 반환"""
    features_map = {
        "1.1": {
            "basic_posting": True,
            "simple_schedule": True,
            "advanced_features": False,
            "ai_content": False,
            "bulk_upload": False
        },
        "2.3": {
            "basic_posting": True,
            "simple_schedule": True,
            "advanced_schedule": True,
            "auto_hashtag": True,
            "advanced_features": True,
            "ai_content": False,
            "bulk_upload": False
        },
        "4.4": {
            "basic_posting": True,
            "simple_schedule": True,
            "advanced_schedule": True,
            "auto_hashtag": True,
            "advanced_features": True,
            "ai_content": True,
            "bulk_upload": True,
            "premium_analytics": True
        }
    }
    return features_map.get(version, features_map["1.1"]) 