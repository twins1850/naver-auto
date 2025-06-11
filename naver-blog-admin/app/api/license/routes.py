from fastapi import APIRouter, Depends, HTTPException
from typing import Dict

from ..core.auth import get_current_user
from ..core.license import LicenseManager
from ..schemas.license import LicenseRequest, LicenseResponse

router = APIRouter()
license_manager = LicenseManager()

@router.post("/issue", response_model=LicenseResponse)
async def issue_license(
    request: LicenseRequest,
    current_user = Depends(get_current_user)
) -> Dict:
    """인증키 발급 API"""
    try:
        license_key = license_manager.issue_license(
            hardware_id=request.hardware_id,
            version=request.version,
            offline_period=request.offline_period
        )
        return {"license_key": license_key}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/validate")
async def validate_license(
    request: LicenseRequest,
    current_user = Depends(get_current_user)
) -> Dict:
    """인증키 검증 API"""
    try:
        is_valid = license_manager.validate_license(
            license_key=request.license_key,
            hardware_id=request.hardware_id
        )
        return {"is_valid": is_valid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 연장/회수는 실제로는 DB/상태 관리 필요. 샘플에서는 단순 구조만 제공 