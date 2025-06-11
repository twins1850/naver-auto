import threading
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta
import json
import asyncio

from .exception_handlers import (CustomAPIException,
                                    custom_api_exception_handler,
                                    global_exception_handler,
                                    http_exception_handler,
                                    sqlalchemy_exception_handler,
                                    validation_exception_handler)
from .logger import logger
from .routers import auth, licenses, payments, usages, users, purchases
from fastapi import FastAPI, HTTPException, Request, status, WebSocket, WebSocketDisconnect
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI(
    title="Naver Blog Admin API", description="네이버 블로그 관리 API", version="1.0.0"
)

# WebSocket 연결 관리
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.admin_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket, is_admin: bool = False):
        await websocket.accept()
        if is_admin:
            self.admin_connections.append(websocket)
            logger.info(f"관리자 WebSocket 연결: {len(self.admin_connections)}개")
        else:
            self.active_connections.append(websocket)
            logger.info(f"사용자 WebSocket 연결: {len(self.active_connections)}개")

    def disconnect(self, websocket: WebSocket, is_admin: bool = False):
        if is_admin and websocket in self.admin_connections:
            self.admin_connections.remove(websocket)
            logger.info(f"관리자 WebSocket 연결 해제: {len(self.admin_connections)}개")
        elif websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"사용자 WebSocket 연결 해제: {len(self.active_connections)}개")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error(f"WebSocket 메시지 전송 실패: {e}")

    async def broadcast_to_admins(self, message: dict):
        """관리자들에게 실시간 상태 브로드캐스트"""
        if self.admin_connections:
            message_str = json.dumps(message, ensure_ascii=False)
            disconnected = []
            for connection in self.admin_connections:
                try:
                    await connection.send_text(message_str)
                except Exception as e:
                    logger.error(f"관리자 WebSocket 브로드캐스트 실패: {e}")
                    disconnected.append(connection)
            
            # 연결이 끊어진 클라이언트 제거
            for connection in disconnected:
                self.admin_connections.remove(connection)

    async def broadcast_to_users(self, message: dict):
        """사용자들에게 공지사항 브로드캐스트"""
        if self.active_connections:
            message_str = json.dumps(message, ensure_ascii=False)
            disconnected = []
            for connection in self.active_connections:
                try:
                    await connection.send_text(message_str)
                except Exception as e:
                    logger.error(f"사용자 WebSocket 브로드캐스트 실패: {e}")
                    disconnected.append(connection)
            
            # 연결이 끊어진 클라이언트 제거
            for connection in disconnected:
                self.active_connections.remove(connection)

manager = ConnectionManager()

# 예외 핸들러 등록
app.add_exception_handler(CustomAPIException, custom_api_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # 랜딩페이지
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://localhost:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limit 미들웨어 (메모리 기반, IP별 분당 60회)
RATE_LIMIT = 60
RATE_LIMIT_WINDOW = 60  # seconds
rate_limit_data = defaultdict(deque)
rate_limit_lock = threading.Lock()


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        now = datetime.utcnow()
        with rate_limit_lock:
            dq = rate_limit_data[client_ip]
            # 오래된 요청 제거
            while dq and (now - dq[0]).total_seconds() > RATE_LIMIT_WINDOW:
                dq.popleft()
            if len(dq) >= RATE_LIMIT:
                logger.warning(f"Rate limit exceeded: {client_ip}")
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "success": False,
                        "code": "rate_limit_exceeded",
                        "message": "요청이 너무 많습니다. 잠시 후 다시 시도하세요.",
                        "path": str(request.url),
                    },
                )
            dq.append(now)
        return await call_next(request)


app.add_middleware(RateLimitMiddleware)


# 미들웨어 설정
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    user_id = None
    try:
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.lower().startswith("bearer "):
            from .config import get_settings
            from jose import jwt

            settings = get_settings()
            token = auth_header.split()[1]
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
            user_id = payload.get("sub")
    except Exception:
        user_id = None
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(
        f"User: {user_id} | Method: {request.method} | Path: {request.url.path} | "
        f"Status: {response.status_code} | Process Time: {process_time:.3f}s"
    )
    return response


# WebSocket 엔드포인트
@app.websocket("/ws/admin")
async def websocket_admin_endpoint(websocket: WebSocket):
    """관리자용 실시간 모니터링 WebSocket"""
    await manager.connect(websocket, is_admin=True)
    
    try:
        # 연결 성공 메시지 전송
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "message": "관리자 WebSocket 연결이 성공했습니다.",
            "timestamp": datetime.now().isoformat(),
            "admin_count": len(manager.admin_connections)
        }))
    
        # 메시지 수신 대기
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # ping/pong 처리
            if message.get("type") == "ping":
                await websocket.send_text(json.dumps({
                    "type": "pong", 
                    "timestamp": datetime.now().isoformat()
                }))
                    
            # 통계 요청 처리
            elif message.get("type") == "stats_request":
                await websocket.send_text(json.dumps({
                    "type": "stats_response",
                    "admin_connections": len(manager.admin_connections),
                    "user_connections": len(manager.active_connections),
                    "timestamp": datetime.now().isoformat()
                }))
            
    except WebSocketDisconnect:
        logger.info("관리자 WebSocket 정상 종료")
    except Exception as e:
        logger.error(f"관리자 WebSocket 오류: {e}")
    finally:
        manager.disconnect(websocket, is_admin=True)


@app.websocket("/ws/user/{user_id}")
async def websocket_user_endpoint(websocket: WebSocket, user_id: str):
    """사용자용 실시간 알림 WebSocket"""
    await manager.connect(websocket, is_admin=False)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # 자동화 상태 업데이트를 관리자에게 브로드캐스트
            if message.get("type") == "automation_status":
                await manager.broadcast_to_admins({
                    "type": "user_activity",
                    "user_id": user_id,
                    "status": message.get("status"),
                    "progress": message.get("progress", 0),
                    "message": message.get("message", ""),
                    "timestamp": datetime.now().isoformat()
                })
            
            # ping/pong 처리
            elif message.get("type") == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
            
    except WebSocketDisconnect:
        logger.info(f"사용자 {user_id} WebSocket 정상 종료")
        # 사용자 연결 해제를 관리자에게 알림
        await manager.broadcast_to_admins({
            "type": "user_disconnected",
            "user_id": user_id,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"사용자 WebSocket 오류: {e}")
    finally:
        manager.disconnect(websocket, is_admin=False)


# 라우터 등록
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(licenses.router)
app.include_router(payments.router)
app.include_router(usages.router)
app.include_router(purchases.router)


@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "naver-blog-admin API 서버 정상 동작"}


@app.get("/health")
def health_check():
    """헬스체크 엔드포인트 (Railway 배포용)"""
    return {
        "status": "healthy",
        "service": "naver-blog-backend",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }


# 실시간 통계 API 추가
@app.get("/api/realtime/stats")
def get_realtime_stats():
    """실시간 연결 통계"""
    return {
        "active_users": len(manager.active_connections),
        "admin_connections": len(manager.admin_connections),
        "timestamp": datetime.now().isoformat()
    }


# 관리자 공지사항 브로드캐스트 API
@app.post("/api/admin/broadcast")
async def broadcast_notice(notice: dict):
    """관리자가 모든 사용자에게 공지사항 브로드캐스트"""
    await manager.broadcast_to_users({
        "type": "admin_notice",
        "title": notice.get("title", "공지사항"),
        "message": notice.get("message", ""),
        "level": notice.get("level", "info"),
        "timestamp": datetime.now().isoformat()
    })
    return {"status": "success", "message": "공지사항이 브로드캐스트되었습니다."}


# 전역 WebSocket 매니저를 다른 모듈에서 사용할 수 있도록 설정
app.state.websocket_manager = manager

# --- [ADMIN 계정 자동 생성] ---
from .database import SessionLocal
from .models import User
from .auth import get_password_hash
from .config import get_settings

def create_admin_if_not_exists():
    db = SessionLocal()
    settings = get_settings()
    admin_email = settings.ADMIN_EMAIL
    admin_password = settings.ADMIN_PASSWORD
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        admin = User(
            name="관리자",
            email=admin_email,
            phone="010-0000-0000",
            plan="basic",
            hashed_password=get_password_hash(admin_password),
            is_admin=True,
        )
        db.add(admin)
        db.commit()
        print("[ADMIN] 관리자 계정이 자동 생성되었습니다.")
    else:
        print("[ADMIN] 관리자 계정이 이미 존재합니다.")
    db.close()

create_admin_if_not_exists()
# --- [ADMIN 계정 자동 생성 END] ---
