#!/usr/bin/env python3
from app.database import SessionLocal
from app.models import User
from app.auth import verify_password, authenticate_user

def debug_auth():
    db = SessionLocal()
    
    print("🔍 인증 시스템 디버깅...")
    print("=" * 50)
    
    # 1. 사용자 조회
    user = db.query(User).filter(User.email == 'yegreen2010@gmail.com').first()
    print(f"✅ 사용자 조회: {user.email if user else '없음'}")
    
    if user:
        print(f"   - 이름: {user.name}")
        print(f"   - 관리자: {user.is_admin}")
        print(f"   - 활성: {user.is_active}")
        
        # 2. 비밀번호 검증
        test_password = "1qaz2wsx!!"
        verify_result = verify_password(test_password, user.hashed_password)
        print(f"✅ 비밀번호 검증: {verify_result}")
        
        # 3. authenticate_user 함수 테스트
        auth_result = authenticate_user(db, 'yegreen2010@gmail.com', test_password)
        print(f"✅ authenticate_user: {auth_result.email if auth_result else 'False'}")
        
    else:
        print("❌ 사용자를 찾을 수 없습니다!")
    
    db.close()
    print("=" * 50)

if __name__ == "__main__":
    debug_auth() 