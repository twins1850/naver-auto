from pydantic import BaseModel, Field
from typing import Optional

class LicenseRequest(BaseModel):
    hardware_id: str = Field(..., description="고유 하드웨어 ID", example="HWID-1234-5678")
    version: str = Field(..., description="프로그램 버전", example="2.3.0")
    license_key: Optional[str] = Field(None, description="인증키 (검증 시에만 필요)", example="NAVER-ABC123-DEF456")
    offline_period: int = Field(3, description="오프라인 허용 기간(일)", example=3)

class LicenseResponse(BaseModel):
    license_key: str = Field(..., description="발급된 인증키", example="NAVER-ABC123-DEF456")
    expires_at: str = Field(..., description="만료일시", example="2025-12-31T23:59:59")
    is_valid: bool = Field(..., description="유효 여부") 