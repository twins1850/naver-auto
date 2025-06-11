#!/bin/bash

echo "🧹 개발환경 완전 정리 중..."

# 포트 정리
echo "포트 정리 중..."
sudo lsof -ti:3000,3001,5173,5174,8000 | xargs sudo kill -9 2>/dev/null || true

# 프로세스 정리
echo "프로세스 정리 중..."
sudo pkill -f "npm\|next\|vite\|uvicorn" 2>/dev/null || true

# Node.js 좀비 프로세스 정리
echo "Node.js 프로세스 정리 중..."
ps aux | grep -E "(node|next|npm)" | grep -v grep | awk '{print $2}' | xargs sudo kill -9 2>/dev/null || true

# Python 프로세스 정리
echo "Python 프로세스 정리 중..."
ps aux | grep python | grep -v grep | awk '{print $2}' | xargs sudo kill -9 2>/dev/null || true

# npm 캐시 정리
echo "npm 캐시 정리 중..."
npm cache clean --force

# 결과 확인
echo ""
echo "🔍 정리 결과 확인:"
lsof -i :3000,3001,5173,5174,8000 2>/dev/null || echo "모든 포트가 깨끗하게 정리되었습니다."

echo ""
echo "✅ 개발환경 정리 완료!"
echo "이제 start_dev_servers.sh 를 실행하여 서버들을 시작하세요." 