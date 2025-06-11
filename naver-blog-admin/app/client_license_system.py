"""
소비자 프로그램용 라이선스 검증 시스템
이 코드는 실제 소비자 프로그램(naver_blog_hybrid)에 통합될 예정
"""

import jwt
import requests
import hashlib
import platform
import uuid
from datetime import datetime
from typing import Dict, Optional, List

class LicenseManager:
    def __init__(self, server_url: str = "http://localhost:8000"):
        self.server_url = server_url
        self.hardware_id = self._generate_hardware_id()
        self.stored_license = None
        self.allowed_features = []
        
    def _generate_hardware_id(self) -> str:
        """하드웨어 고유 ID 생성"""
        try:
            # MAC 주소 + CPU 정보 + 시스템 정보 조합
            mac = hex(uuid.getnode())[2:].upper()
            cpu_info = platform.processor()
            system_info = f"{platform.system()}-{platform.release()}"
            
            # SHA-256 해시로 고유 ID 생성
            combined = f"{mac}-{cpu_info}-{system_info}"
            return hashlib.sha256(combined.encode()).hexdigest()[:32]
        except:
            # 오류 시 UUID 기반 대체 ID
            return str(uuid.uuid4()).replace("-", "")[:32]

    async def activate_license(self, temporary_license: str) -> Dict:
        """임시 라이선스를 최종 인증키로 활성화"""
        try:
            response = requests.post(
                f"{self.server_url}/purchases/activate",
                json={
                    "temporary_license": temporary_license,
                    "hardware_id": self.hardware_id,
                    "system_info": {
                        "os": platform.system(),
                        "os_version": platform.release(),
                        "processor": platform.processor(),
                        "machine": platform.machine()
                    }
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                if result["success"]:
                    # 최종 라이선스 저장
                    self.stored_license = result["license_key"]
                    self._save_license_to_file(result["license_key"])
                    
                    # 허용된 기능 리스트 업데이트
                    self._update_allowed_features()
                    
                    return {
                        "success": True,
                        "message": "라이선스가 성공적으로 활성화되었습니다!",
                        "expire_date": result["expire_date"]
                    }
                else:
                    return {"success": False, "message": result["message"]}
            else:
                return {"success": False, "message": "서버 오류가 발생했습니다"}
                
        except Exception as e:
            return {"success": False, "message": f"네트워크 오류: {str(e)}"}

    async def validate_license_realtime(self) -> Dict:
        """실시간 라이선스 검증"""
        if not self.stored_license:
            self.stored_license = self._load_license_from_file()
            
        if not self.stored_license:
            return {"valid": False, "reason": "라이선스가 없습니다"}
        
        try:
            response = requests.post(
                f"{self.server_url}/purchases/validate",
                json={
                    "license_key": self.stored_license,
                    "hardware_id": self.hardware_id
                },
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if result["valid"]:
                    self._update_allowed_features_from_server(result)
                    return {
                        "valid": True,
                        "version": result["version"],
                        "account_count": result["account_count"],
                        "post_count": result["post_count"],
                        "expire_date": result["expire_date"]
                    }
                else:
                    return {"valid": False, "reason": result["reason"]}
            else:
                return {"valid": False, "reason": "서버 연결 실패"}
                
        except Exception as e:
            # 오프라인 모드로 전환
            return self._offline_validation()

    def _offline_validation(self) -> Dict:
        """오프라인 라이선스 검증 (제한적)"""
        if not self.stored_license:
            return {"valid": False, "reason": "오프라인 상태에서 라이선스를 찾을 수 없습니다"}
        
        try:
            # JWT 디코드 (서명 검증 없이 내용만 확인)
            license_data = jwt.decode(
                self.stored_license, 
                options={"verify_signature": False}
            )
            
            # 만료일 확인
            expire_date = datetime.fromisoformat(license_data["expire_date"])
            if datetime.utcnow() > expire_date:
                return {"valid": False, "reason": "라이선스가 만료되었습니다"}
            
            # 오프라인 모드는 기본 기능만 허용
            return {
                "valid": True,
                "offline_mode": True,
                "version": license_data.get("version", "1.1"),
                "limited_features": True,
                "message": "오프라인 모드 (기본 기능만 사용 가능)"
            }
            
        except Exception as e:
            return {"valid": False, "reason": "라이선스 파일이 손상되었습니다"}

    def can_use_feature(self, feature_name: str) -> bool:
        """특정 기능 사용 가능 여부 확인"""
        return feature_name in self.allowed_features

    def get_account_limit(self) -> int:
        """계정 수 제한 반환"""
        license_data = self._decode_license()
        return license_data.get("account_count", 1) if license_data else 1

    def get_post_limit(self) -> int:
        """포스트 수 제한 반환"""
        license_data = self._decode_license()
        return license_data.get("post_count", 1) if license_data else 1

    def _decode_license(self) -> Optional[Dict]:
        """라이선스 디코드"""
        if not self.stored_license:
            return None
        try:
            return jwt.decode(self.stored_license, options={"verify_signature": False})
        except:
            return None

    def _update_allowed_features(self):
        """허용된 기능 리스트 업데이트"""
        license_data = self._decode_license()
        if not license_data:
            self.allowed_features = ["basic_posting"]
            return
        
        version = license_data.get("version", "1.1")
        version_float = float(version)
        
        # 버전별 기능 매핑
        self.allowed_features = ["basic_posting", "simple_schedule"]
        
        if version_float >= 2.3:
            self.allowed_features.extend([
                "advanced_schedule", "auto_hashtag", "advanced_features"
            ])
            
        if version_float >= 4.4:
            self.allowed_features.extend([
                "ai_content", "bulk_upload", "premium_analytics"
            ])

    def _update_allowed_features_from_server(self, server_response: Dict):
        """서버 응답으로부터 허용된 기능 업데이트"""
        version = server_response.get("version", "1.1")
        version_float = float(version)
        
        self.allowed_features = ["basic_posting", "simple_schedule"]
        
        if version_float >= 2.3:
            self.allowed_features.extend([
                "advanced_schedule", "auto_hashtag", "advanced_features"
            ])
            
        if version_float >= 4.4:
            self.allowed_features.extend([
                "ai_content", "bulk_upload", "premium_analytics"
            ])

    def _save_license_to_file(self, license_key: str):
        """라이선스를 암호화하여 파일에 저장"""
        try:
            import os
            license_dir = os.path.expanduser("~/.naver_blog_auto")
            os.makedirs(license_dir, exist_ok=True)
            
            license_file = os.path.join(license_dir, "license.dat")
            
            # 간단한 암호화 (실제로는 더 강력한 암호화 사용 권장)
            encrypted_license = self._simple_encrypt(license_key)
            
            with open(license_file, "w", encoding="utf-8") as f:
                f.write(encrypted_license)
                
        except Exception as e:
            print(f"라이선스 저장 실패: {e}")

    def _load_license_from_file(self) -> Optional[str]:
        """파일에서 라이선스 로드"""
        try:
            import os
            license_file = os.path.expanduser("~/.naver_blog_auto/license.dat")
            
            if os.path.exists(license_file):
                with open(license_file, "r", encoding="utf-8") as f:
                    encrypted_license = f.read().strip()
                    return self._simple_decrypt(encrypted_license)
            return None
            
        except Exception as e:
            print(f"라이선스 로드 실패: {e}")
            return None

    def _simple_encrypt(self, text: str) -> str:
        """간단한 암호화 (데모용)"""
        # 실제로는 AES나 더 강력한 암호화 사용
        import base64
        encoded = base64.b64encode(text.encode()).decode()
        return encoded[::-1]  # 단순 역순

    def _simple_decrypt(self, encrypted_text: str) -> str:
        """간단한 복호화 (데모용)"""
        import base64
        reversed_text = encrypted_text[::-1]
        return base64.b64decode(reversed_text).decode()

# 사용 예시
class FeatureGuard:
    """기능별 접근 제어 데코레이터"""
    
    def __init__(self, license_manager: LicenseManager):
        self.license_manager = license_manager

    def require_feature(self, feature_name: str):
        """기능 접근 제어 데코레이터"""
        def decorator(func):
            def wrapper(*args, **kwargs):
                if not self.license_manager.can_use_feature(feature_name):
                    raise PermissionError(
                        f"이 기능은 상위 버전에서만 사용 가능합니다: {feature_name}"
                    )
                return func(*args, **kwargs)
            return wrapper
        return decorator

# 사용 예시
"""
# 소비자 프로그램에서 사용 방법:

license_manager = LicenseManager()
feature_guard = FeatureGuard(license_manager)

@feature_guard.require_feature("ai_content")
def generate_ai_content():
    # AI 컨텐츠 생성 (4.4 버전 이상에서만 사용 가능)
    pass

@feature_guard.require_feature("advanced_schedule")
def advanced_scheduling():
    # 고급 예약 기능 (2.3 버전 이상에서만 사용 가능)
    pass

# 계정/포스트 수 제한 확인
if len(accounts) > license_manager.get_account_limit():
    raise Exception("계정 수 제한을 초과했습니다")

if post_count > license_manager.get_post_limit():
    raise Exception("포스트 수 제한을 초과했습니다")
""" 