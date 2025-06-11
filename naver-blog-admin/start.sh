#!/bin/bash

# Railway 배포용 시작 스크립트

echo "🚀 Railway 배포 시작..."
echo "현재 디렉토리: $(pwd)"
echo "Python 경로: $(which python)"
echo "파일 목록:"
ls -la

# 환경변수 확인
echo "PORT: ${PORT:-8000}"
echo "DATABASE_URL: $DATABASE_URL"

# 데이터베이스 초기화
echo "📊 데이터베이스 초기화..."
python -c "
import sqlite3
import os

# 데이터베이스 파일이 없으면 생성
db_path = './license_server.db'
if not os.path.exists(db_path):
    print('SQLite 데이터베이스 파일 생성 중...')
    conn = sqlite3.connect(db_path)
    conn.close()
    print('✅ 데이터베이스 파일 생성 완료')
else:
    print('✅ 데이터베이스 파일 이미 존재')
"

# FastAPI 앱 실행
echo "🌟 FastAPI 서버 시작..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1 