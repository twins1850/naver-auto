# naver-blog-admin API 서버

## 개요

이 프로젝트는 사용자, 라이선스, 결제, 사용량 관리를 위한 FastAPI 기반의 백엔드 서버입니다.

## 실행 방법

```bash
# 가상환경 활성화 및 의존성 설치
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# DB 테이블 생성
python3 -m app.init_db

# 서버 실행 (naver-blog-admin 폴더에서)
uvicorn app.main:app --reload --port 8001
```

## 주요 엔드포인트

### 인증

- **POST /auth/token** : 로그인 및 토큰 발급 (OAuth2)

### 사용자

- **POST /users/** : 회원가입
- **GET /users/{user_id}** : 사용자 정보 조회

### 라이선스

- **POST /licenses/** : 라이선스 발급
- **GET /licenses/** : 전체 라이선스 조회
- **GET /licenses/{license_id}** : 라이선스 상세 조회
- **DELETE /licenses/{license_id}** : 라이선스 삭제

### 결제

- **POST /payments/** : 결제 등록
- **GET /payments/** : 전체 결제 내역 조회
- **GET /payments/{payment_id}** : 결제 상세 조회
- **DELETE /payments/{payment_id}** : 결제 내역 삭제

### 사용량

- **POST /usages/** : 사용량 등록
- **GET /usages/** : 전체 사용량 조회
- **GET /usages/{usage_id}** : 사용량 상세 조회
- **DELETE /usages/{usage_id}** : 사용량 삭제

## 인증 방식

- OAuth2 Password Flow (Bearer Token)
- 회원가입 후 `/auth/token`에서 토큰 발급 → 이후 Authorization 헤더에 `Bearer {token}` 추가하여 사용

## 예시: 회원가입 및 로그인

1. **회원가입**

```json
POST /users/
{
  "name": "홍길동",
  "email": "test@example.com",
  "phone": "010-1234-5678",
  "plan": "basic",
  "password": "test1234"
}
```

2. **로그인 및 토큰 발급**

```bash
POST /auth/token
Content-Type: application/x-www-form-urlencoded

grant_type=&username=test@example.com&password=test1234&scope=&client_id=&client_secret=
```

3. **API 호출 시 인증 헤더 추가**

```
Authorization: Bearer {access_token}
```

## Swagger 문서

- http://localhost:8001/docs

---

## 추천사항 및 다음 단계

- 자동화 테스트 코드 작성 (pytest, httpx 등)
- 예외처리 및 응답 메시지 고도화
- 관리자/사용자 권한 분리 및 인가 강화
- 배포 환경 설정 및 보안 강화

## 인증 방식

- OAuth2 Password Flow (Bearer Token)
- 회원가입 후 `/auth/token`에서 토큰 발급 → 이후 Authorization 헤더에 `Bearer {token}` 추가하여 사용

## 실전 운영/보안/모니터링 가이드

### 1. 환경변수(.env) 안전 관리

- `.env` 파일은 반드시 서버에만 배포, git에는 절대 커밋 금지
- 운영 환경에서는 환경변수 관리 솔루션(예: AWS SSM, HashiCorp Vault 등) 사용 권장

### 2. Docker 볼륨 분리 예시

```bash
sudo docker run -d -p 8001:8001 \
  --env-file .env \
  -v /srv/naver-blog-admin/logs:/app/logs \
  -v /srv/naver-blog-admin/db:/app \
  --name naver-blog-admin naver-blog-admin
```

- `/srv/naver-blog-admin/logs` : 로그 파일 호스트 저장
- `/srv/naver-blog-admin/db` : SQLite DB 등 데이터 파일 호스트 저장

### 3. HTTPS 적용 예시 (Nginx 리버스 프록시)

- 인증서 발급: [Let's Encrypt](https://letsencrypt.org/)
- Nginx 예시 설정:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. 에러 알림 연동 예시

- **Sentry**: [Sentry FastAPI 연동 가이드](https://docs.sentry.io/platforms/python/guides/fastapi/)
- **Slack Webhook**: `global_exception_handler`에서 에러 발생 시 슬랙으로 POST 요청
- **SMTP 메일**: Python `smtplib`로 에러 발생 시 메일 발송

### 5. 외부 모니터링/대시보드 연동

- **ELK(ElasticSearch, Logstash, Kibana)**: 로그 파일을 Logstash로 수집, Kibana로 시각화
- **Grafana + Loki**: 로그/사용량 실시간 대시보드 구축
- **Prometheus**: FastAPI 메트릭 수집 및 모니터링

---

> 실서비스 운영 시 위 가이드와 예시를 참고하여 보안, 데이터, 장애 대응, 모니터링 체계를 반드시 구축하세요.

## 소비자용 설치/실행 가이드

### 1. Docker로 가장 쉽게 실행하기

#### (1) Docker 설치

- [Docker 공식 다운로드](https://www.docker.com/products/docker-desktop/)
- 윈도우/맥/리눅스 모두 지원

#### (2) Docker Hub에서 이미지 받아 실행 (예시)

```bash
# (이미지를 직접 빌드하지 않고, 배포자가 올린 이미지를 사용)
sudo docker pull twinslab/naver-blog-admin:latest
sudo docker run -d -p 8001:8001 --env-file .env --name naver-blog-admin twinslab/naver-blog-admin:latest
```

- `.env` 파일은 배포자가 예시와 함께 제공(환경에 맞게 수정)

#### (3) 직접 빌드해서 실행도 가능

```bash
cd naver-blog-admin
cp .env.example .env  # 환경에 맞게 수정
sudo docker build -t naver-blog-admin .
sudo docker run -d -p 8001:8001 --env-file .env --name naver-blog-admin naver-blog-admin
```

### 2. 소스코드 직접 설치(가상환경)

```bash
git clone <repo-url>
cd naver-blog-admin
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # 환경에 맞게 수정
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### 3. .env 환경변수 설명

- `.env.example` 파일의 각 항목을 참고, 환경에 맞게 수정
- 예시 및 설명은 아래 참고

### 4. 윈도우/맥/리눅스 설치 팁

- **윈도우**: powershell에서 `python -m venv venv`, `venv\Scripts\activate` 사용
- **맥/리눅스**: `source venv/bin/activate`
- 포트 충돌 시 기존 프로세스 종료 후 재실행
- DB/로그 경로는 Docker 볼륨 또는 호스트 경로로 분리 권장

### 5. Docker Hub 배포 가이드(운영자용)

```bash
# 빌드 및 푸시
sudo docker build -t twinslab/naver-blog-admin:latest .
sudo docker push twinslab/naver-blog-admin:latest
```

- 소비자는 `docker pull twinslab/naver-blog-admin:latest`로 바로 설치 가능

---

## 2025-05-23 2단계: 서버 인증 API 및 환경변수 기반 보안 고도화

- FastAPI 기반 인증 API 설계 및 구현
  - `/api/license/issue` : 인증키 발급
  - `/api/license/validate` : 인증키 검증
- cross-project import 및 환경변수 기반 SECRET_KEY 적용
- 인증키 발급/검증 end-to-end 테스트 성공
- 모든 작업 내역/테스트 결과 README에 자동 기록

---
