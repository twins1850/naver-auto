from datetime import datetime, timedelta
from typing import List
import secrets

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..exception_handlers import CustomAPIException
from .users import get_current_user
from pydantic import BaseModel, Field

router = APIRouter(prefix="/licenses", tags=["licenses"])


def verify_license_key(token: str, version: str, hardware_id: str) -> str | None:
    """
    라이선스 키 검증 함수
    Returns: None if valid, error message if invalid
    """
    # 테스트 라이선스 키 허용
    if token == "TEST-LICENSE-KEY":
        return None
    
    # 실제 라이선스 검증 로직 (현재는 간단한 형식 검증)
    if not token.startswith("NAVER-"):
        return "유효하지 않은 라이선스 키 형식입니다."
    
    # 여기에 실제 데이터베이스 검증 로직 추가
    # 현재는 테스트를 위해 모든 NAVER- 키를 유효로 처리
    return None


@router.post("/", response_model=schemas.LicenseOut)
def create_license(license: schemas.LicenseCreate, db: Session = Depends(get_db)):
    # 라이선스 키 생성 (간단한 랜덤 문자열)
    key = secrets.token_urlsafe(16)
    new_license = models.License(
        user_id=license.user_id,
        key=key,
        plan=license.plan,
        status=license.status,
        expire_at=license.expire_at,
        issued_at=datetime.utcnow(),
    )
    db.add(new_license)
    db.commit()
    db.refresh(new_license)
    return new_license


@router.get("/", response_model=list[schemas.LicenseOut])
def read_licenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.License).offset(skip).limit(limit).all()


@router.get("/{license_id}", response_model=schemas.LicenseOut)
def read_license(
    license_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    license = db.query(models.License).filter(models.License.id == license_id).first()
    if license is None:
        raise CustomAPIException(
            status_code=404,
            detail="라이선스를 찾을 수 없습니다.",
            code="license_not_found",
        )
    if license.user_id != current_user.id and not current_user.is_admin:
        raise CustomAPIException(
            status_code=403, detail="권한이 없습니다.", code="forbidden"
        )
    return license


@router.delete("/{license_id}")
def delete_license(
    license_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    license = db.query(models.License).filter(models.License.id == license_id).first()
    if license is None:
        raise CustomAPIException(
            status_code=404,
            detail="라이선스를 찾을 수 없습니다.",
            code="license_not_found",
        )
    if license.user_id != current_user.id and not current_user.is_admin:
        raise CustomAPIException(
            status_code=403, detail="권한이 없습니다.", code="forbidden"
        )
    db.delete(license)
    db.commit()
    return {"success": True}


@router.patch("/{license_id}", response_model=schemas.LicenseOut)
def update_license(
    license_id: int,
    update: schemas.LicenseUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    license = db.query(models.License).filter(models.License.id == license_id).first()
    if license is None:
        raise CustomAPIException(
            status_code=404,
            detail="라이선스를 찾을 수 없습니다.",
            code="license_not_found",
        )
    # 관리자만 상태/만료일 변경 가능
    if not current_user.is_admin:
        raise CustomAPIException(
            status_code=403, detail="관리자만 변경할 수 있습니다.", code="forbidden"
        )
    if update.status:
        license.status = update.status
    if update.expire_at:
        license.expire_at = update.expire_at
    db.commit()
    db.refresh(license)
    return license


class LicenseValidateRequest(BaseModel):
    token: str = Field(..., description="발급받은 인증키", example="NAVER-ABC123-DEF456-GHI789")
    version: str = Field(..., description="프로그램 버전 (예: 2.3)", example="2.3")
    hardware_id: str = Field(..., description="고유 하드웨어 ID", example="HWID-1234-5678")


@router.post("/validate", summary="인증키 검증", description="발급받은 인증키가 유효한지 검증합니다.")
def validate_license(req: LicenseValidateRequest = Body(...)):
    """
    ### 인증키 검증
    - 입력: 인증키, 버전, 하드웨어ID
    - 출력: 유효 여부 및 실패 사유(한글)
    """
    result = verify_license_key(req.token, req.version, req.hardware_id)
    if result is None:
        return {"valid": True}
    else:
        return {"valid": False, "reason": result}
