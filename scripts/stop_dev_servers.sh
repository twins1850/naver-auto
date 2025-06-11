#!/bin/bash

echo "🛑 개발 서버들 종료 중..."

# 포트별로 프로세스 종료
echo "포트 기반 프로세스 종료 중..."

# 8000포트 (백엔드)
if lsof -i :8000 >/dev/null 2>&1; then
    echo "백엔드 서버 종료 중 (포트 8000)..."
    lsof -ti:8000 | xargs kill -TERM 2>/dev/null || true
    sleep 2
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
fi

# 5173포트 (관리자 GUI)
if lsof -i :5173 >/dev/null 2>&1; then
    echo "관리자 GUI 종료 중 (포트 5173)..."
    lsof -ti:5173 | xargs kill -TERM 2>/dev/null || true
    sleep 2
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
fi

# 3000포트 (랜딩페이지)
if lsof -i :3000 >/dev/null 2>&1; then
    echo "랜딩페이지 종료 중 (포트 3000)..."
    lsof -ti:3000 | xargs kill -TERM 2>/dev/null || true
    sleep 2
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

# 추가 정리
echo "추가 프로세스 정리 중..."
sudo pkill -f "uvicorn.*app.main" 2>/dev/null || true
sudo pkill -f "npm.*run.*dev" 2>/dev/null || true
sudo pkill -f "next.*dev" 2>/dev/null || true
sudo pkill -f "vite" 2>/dev/null || true

# 결과 확인
echo ""
echo "🔍 종료 결과 확인:"
REMAINING=$(lsof -i :3000,5173,8000 2>/dev/null)
if [ -z "$REMAINING" ]; then
    echo "✅ 모든 개발 서버가 정상적으로 종료되었습니다."
else
    echo "⚠️ 일부 프로세스가 남아있습니다:"
    echo "$REMAINING"
    echo ""
    echo "강제 종료가 필요하면 다음 명령을 실행하세요:"
    echo "sudo lsof -ti:3000,5173,8000 | xargs sudo kill -9"
fi

echo ""
echo "✅ 개발 서버 종료 완료!" 