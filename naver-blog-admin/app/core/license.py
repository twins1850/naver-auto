import os
import jwt
from datetime import datetime, timedelta
from typing import Dict, Optional

class LicenseManager:
    def __init__(self):
        self.secret_key = os.getenv("LICENSE_SECRET_KEY")
        if not self.secret_key:
            raise ValueError("LICENSE_SECRET_KEY 환경변수가 설정되지 않았습니다.")
            
    def issue_license(
        self, 
        hardware_id: str, 
        version: str,
        offline_period: int = 3
    ) -> str:
        """인증키 발급"""
        now = datetime.utcnow()
        expires_at = now + timedelta(days=30)  # 30일 기본 만료
        
        payload = {
            "hardware_id": hardware_id,
            "version": version,
            "offline_period": offline_period,
            "issued_at": now.isoformat(),
            "expires_at": expires_at.isoformat()
        }
        
        return jwt.encode(
            payload,
            self.secret_key,
            algorithm="HS256"
        )
        
    def validate_license(
        self,
        license_key: str,
        hardware_id: str
    ) -> bool:
        """인증키 검증"""
        try:
            payload = jwt.decode(
                license_key,
                self.secret_key,
                algorithms=["HS256"]
            )
            
            # 하드웨어 ID 일치 확인
            if payload["hardware_id"] != hardware_id:
                return False
                
            # 만료일 확인
            expires_at = datetime.fromisoformat(payload["expires_at"])
            if datetime.utcnow() > expires_at:
                return False
                
            return True
            
        except jwt.InvalidTokenError:
            return False 