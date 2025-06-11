#!/usr/bin/env python3
from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash, verify_password

def fix_password():
    db = SessionLocal()
    
    print("🔧 관리자 비밀번호 재설정...")
    print("=" * 50)
    
    # 1. 관리자 사용자 조회
    admin = db.query(User).filter(User.is_admin == True).first()
    if not admin:
        print("❌ 관리자 사용자를 찾을 수 없습니다!")
        return
    
    print(f"✅ 관리자 찾음: {admin.email}")
    
    # 2. 새 비밀번호 해시 생성
    new_password = "1qaz2wsx!!"
    hashed_password = get_password_hash(new_password)
    
    print(f"🔐 새 비밀번호: {new_password}")
    print(f"🔒 해시 생성: {hashed_password[:50]}...")
    
    # 3. 데이터베이스 업데이트
    admin.hashed_password = hashed_password
    db.commit()
    
    print("✅ 데이터베이스 업데이트 완료")
    
    # 4. 검증 테스트
    verify_result = verify_password(new_password, admin.hashed_password)
    print(f"🧪 검증 테스트: {verify_result}")
    
    db.close()
    print("=" * 50)
    
    if verify_result:
        print("🎉 비밀번호 재설정 성공!")
    else:
        print("❌ 비밀번호 재설정 실패!")

if __name__ == "__main__":
    fix_password() 