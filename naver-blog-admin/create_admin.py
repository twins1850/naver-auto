#!/usr/bin/env python3
from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash

def create_admin():
    db = SessionLocal()
    admin_email = 'yegreen2010@gmail.com'
    admin_password = '1qaz2wsx!!'

    # 기존 관리자 확인
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if existing_admin:
        print(f'[ADMIN] 관리자 계정이 이미 존재합니다.')
    else:
        # 새 관리자 생성
        admin = User(
            name='관리자',
            email=admin_email,
            phone='010-0000-0000',
            plan='basic',
            hashed_password=get_password_hash(admin_password),
            is_admin=True,
        )
        db.add(admin)
        db.commit()
        print(f'[ADMIN] 관리자 계정이 생성되었습니다: {admin_email}')

    db.close()

if __name__ == "__main__":
    create_admin() 