#!/bin/bash

echo "🚀 개발 서버들 시작 중..."

# 기본 디렉토리
BASE_DIR="/Users/twins/Documents/AI/naver-auto"

# 로그 디렉토리 사전 생성 (재시작 후 누락 방지)
echo "📁 로그 디렉토리 생성 중..."
mkdir -p "${BASE_DIR}/naver-blog-admin/logs"
mkdir -p "${BASE_DIR}/naver-blog-admin-gui/logs" 
mkdir -p "${BASE_DIR}/naverblog-pro-landing/logs"
echo "✅ 로그 디렉토리 생성 완료"

# 유틸리티 함수들
wait_for_port() {
    local port=$1
    local max_attempts=30
    local attempt=1
    
    echo "⏳ 포트 $port 리스닝 대기 중..."
    while [ $attempt -le $max_attempts ]; do
        if lsof -i :$port | grep -q LISTEN; then
            echo "✅ 포트 $port 리스닝 확인"
            return 0
        fi
        sleep 1
        ((attempt++))
        echo -n "."
    done
    
    echo ""
    echo "❌ 포트 $port 리스닝 실패 ($max_attempts초 시도)"
    return 1
}

test_api_response() {
    local url=$1
    local max_attempts=10
    local attempt=1
    
    echo "⏳ API 응답 테스트 중: $url"
    while [ $attempt -le $max_attempts ]; do
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
        
        if [ "$response" = "200" ]; then
            echo "✅ API 응답 정상: $url (HTTP 200)"
            return 0
        fi
        sleep 2
        ((attempt++))
        echo -n "."
    done
    
    echo ""
    echo "❌ API 응답 실패: $url (최종 HTTP $response)"
    return 1
}

check_backend_errors() {
    local log_file="${BASE_DIR}/naver-blog-admin/logs/backend.log"
    
    if [ ! -f "$log_file" ]; then
        echo "⚠️ 로그 파일 없음: $log_file"
        return 1
    fi
    
    if grep -q "IndentationError\|SyntaxError\|ImportError\|ModuleNotFoundError" "$log_file" 2>/dev/null; then
        echo "❌ 백엔드 코드 오류 감지됨:"
        echo "--- 오류 로그 ---"
        tail -10 "$log_file" | grep -E "(Error|Traceback)" || tail -5 "$log_file"
        echo "--- 오류 로그 끝 ---"
        return 1
    fi
    
    return 0
}

restart_backend_server() {
    echo "🔄 백엔드 서버 재시작 시도..."
    
    # 기존 프로세스 정리
    pkill -f "uvicorn.*app.main:app" 2>/dev/null || true
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    sleep 3
    
    # 다시 시작
    cd "${BASE_DIR}/naver-blog-admin"
    source venv/bin/activate
    
    # 로그 파일 초기화
    > logs/backend.log
    
    echo "백엔드 서버를 재시작합니다..."
    nohup python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > logs/backend.log 2>&1 &
    local new_pid=$!
    
    sleep 8
    
    # 재검증
    if wait_for_port 8000 && test_api_response "http://localhost:8000/docs"; then
        echo "✅ 백엔드 서버 재시작 성공 (PID: $new_pid)"
        return 0
    else
        echo "❌ 백엔드 서버 재시작 실패"
        echo "💡 수동 확인 필요: tail -20 ${BASE_DIR}/naver-blog-admin/logs/backend.log"
        return 1
    fi
}

# 1. 백엔드 서버 시작 (개선된 버전)
echo ""
echo "⚙️ 1단계: 백엔드 서버 시작 중..."
cd "${BASE_DIR}/naver-blog-admin"

# 포트 정리
echo "🧹 포트 8000 정리 중..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
sleep 2

# 가상환경 활성화 및 서버 시작
source venv/bin/activate
echo "백엔드 서버를 백그라운드에서 시작합니다..."

# 로그 파일 초기화
> logs/backend.log

nohup python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > logs/backend.log 2>&1 &
BACKEND_PID=$!

echo "프로세스 시작됨 (PID: $BACKEND_PID)"

# 개선된 백엔드 확인 프로세스
sleep 8

if wait_for_port 8000; then
    if test_api_response "http://localhost:8000/docs"; then
        echo "✅ 백엔드 서버 시작 성공 (PID: $BACKEND_PID)"
    else
        echo "⚠️ 포트는 열렸지만 API 응답 없음. 로그 확인 중..."
        if ! check_backend_errors; then
            # 자동 재시작 시도
            if restart_backend_server; then
                BACKEND_PID=$(pgrep -f "uvicorn.*app.main:app" | head -1)
            else
                echo "❌ 백엔드 서버 복구 실패"
                exit 1
            fi
        else
            echo "❌ 백엔드 코드 오류 - 수동 수정 필요"
            exit 1
        fi
    fi
else
    echo "❌ 백엔드 서버 포트 열기 실패. 로그 확인 중..."
    if ! check_backend_errors; then
        # 자동 재시작 시도
        if restart_backend_server; then
            BACKEND_PID=$(pgrep -f "uvicorn.*app.main:app" | head -1)
        else
            echo "❌ 백엔드 서버 복구 실패"
            exit 1
        fi
    else
        echo "❌ 백엔드 코드 오류 - 수동 수정 필요"
        exit 1
    fi
fi

# 2. 관리자 GUI 시작
echo ""
echo "🎨 2단계: 관리자 GUI 시작 중..."
cd "${BASE_DIR}/naver-blog-admin-gui"

# 포트 정리
lsof -ti:5173,5174 | xargs kill -9 2>/dev/null || true

echo "관리자 GUI를 백그라운드에서 시작합니다..."
nohup npm run dev -- --port 5173 --force > logs/admin-gui.log 2>&1 &
ADMIN_PID=$!

if wait_for_port 5173; then
    echo "✅ 관리자 GUI 시작 성공 (PID: $ADMIN_PID)"
else
    echo "❌ 관리자 GUI 시작 실패"
    echo "로그 확인: tail ${BASE_DIR}/naver-blog-admin-gui/logs/admin-gui.log"
fi

# 3. 랜딩페이지 시작
echo ""
echo "🌐 3단계: 랜딩페이지 시작 중..."
cd "${BASE_DIR}/naverblog-pro-landing"

# 포트 정리
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || true

# TailwindCSS 의존성 확인
if ! npm list tailwindcss >/dev/null 2>&1; then
    echo "TailwindCSS 의존성 설치 중..."
    npm install tailwindcss @tailwindcss/typography autoprefixer postcss lucide-react framer-motion --save-dev
fi

echo "랜딩페이지를 백그라운드에서 시작합니다..."
nohup npx next@15.2.4 dev --port 3000 > logs/landing.log 2>&1 &
LANDING_PID=$!

if wait_for_port 3000; then
    echo "✅ 랜딩페이지 시작 성공 (PID: $LANDING_PID)"
else
    echo "❌ 랜딩페이지 시작 실패"
    echo "로그 확인: tail ${BASE_DIR}/naverblog-pro-landing/logs/landing.log"
fi

# 최종 결과 출력
echo ""
echo "🎉 개발 서버 시작 완료!"
echo ""
echo "📊 서비스 상태:"
echo "├── 백엔드 API: http://localhost:8000/docs"
echo "├── 관리자 GUI: http://localhost:5173"
echo "└── 랜딩페이지: http://localhost:3000"
echo ""
echo "🔍 포트 상태 확인:"
lsof -i :3000,5173,8000

echo ""
echo "📝 PID 정보:"
echo "├── 백엔드: $BACKEND_PID"
echo "├── 관리자: $ADMIN_PID"  
echo "└── 랜딩: $LANDING_PID"

echo ""
echo "📄 로그 파일 위치:"
echo "├── 백엔드: ${BASE_DIR}/naver-blog-admin/logs/backend.log"
echo "├── 관리자: ${BASE_DIR}/naver-blog-admin-gui/logs/admin-gui.log"
echo "└── 랜딩: ${BASE_DIR}/naverblog-pro-landing/logs/landing.log"

echo ""
echo "⚠️ 서버 종료 방법:"
echo "kill $BACKEND_PID $ADMIN_PID $LANDING_PID"
echo "또는 scripts/stop_dev_servers.sh 실행"

echo ""
echo "🎯 최종 상태 요약:"
if lsof -i :8000 | grep -q LISTEN; then
    echo "✅ 백엔드: 정상 실행 중"
else
    echo "❌ 백엔드: 실행 실패"
fi

if lsof -i :5173 | grep -q LISTEN; then
    echo "✅ 관리자 GUI: 정상 실행 중"
else
    echo "❌ 관리자 GUI: 실행 실패"
fi

if lsof -i :3000 | grep -q LISTEN; then
    echo "✅ 랜딩페이지: 정상 실행 중"
else
    echo "❌ 랜딩페이지: 실행 실패"
fi 