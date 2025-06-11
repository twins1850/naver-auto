# 🚀 Railway 배포 가이드 - autotoolshub.com

## 📋 배포 순서

### 1️⃣ Railway 회원가입 (완료 후 진행)

- https://railway.app 접속
- GitHub 계정으로 로그인
- $5 무료 크레딧 확인

### 2️⃣ 백엔드 API 배포

1. **New Project → Deploy from GitHub repo**
2. **Repository**: `twins1850/naver-auto` 선택
3. **Service 설정**:

   - Name: `naver-blog-backend`
   - Root Directory: `naver-blog-admin`
   - Build Command: Docker (자동 감지)
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables 설정**:
   ```
   DATABASE_URL=sqlite:///./license_server.db
   SECRET_KEY=your-super-secret-key-here
   ADMIN_EMAIL=admin@autotoolshub.com
   ADMIN_PASSWORD=admin123
   CORS_ORIGINS=["https://autotoolshub.com","https://admin.autotoolshub.com"]
   ```

### 3️⃣ 관리자 GUI 배포

1. **Add New Service**
2. **Repository**: 동일한 저장소 선택
3. **Service 설정**:

   - Name: `naver-blog-admin-gui`
   - Root Directory: `naver-blog-admin-gui`
   - Build Command: `npm run build`
   - Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`

4. **Environment Variables 설정**:
   ```
   VITE_API_URL=https://api.autotoolshub.com
   NODE_ENV=production
   ```

### 4️⃣ 랜딩 페이지 배포 (Next.js)

1. **Add New Service**
2. **Repository**: 동일한 저장소 선택
3. **Service 설정**:

   - Name: `naverblog-pro-landing`
   - Root Directory: `naverblog-pro-landing`
   - Framework: Next.js (자동 감지)

4. **Environment Variables 설정**:
   ```
   NEXT_PUBLIC_API_URL=https://api.autotoolshub.com
   NEXT_PUBLIC_ADMIN_URL=https://admin.autotoolshub.com
   ```

## 🌐 도메인 연결 (가비아)

### Railway에서 도메인 설정

1. 각 서비스의 **Settings → Domains** 메뉴
2. **Custom Domain** 추가:
   - 백엔드: `api.autotoolshub.com`
   - 관리자: `admin.autotoolshub.com`
   - 랜딩: `autotoolshub.com`

### 가비아 DNS 설정

1. 가비아 관리 페이지 접속
2. **DNS 관리** → **DNS 설정**
3. **A 레코드/CNAME 추가**:
   ```
   A    @              Railway IP (자동 제공됨)
   CNAME api           api-서비스명.railway.app
   CNAME admin         admin-서비스명.railway.app
   CNAME www           autotoolshub.com
   ```

## ⚙️ SSL 인증서

- Railway에서 자동으로 Let's Encrypt SSL 인증서 발급
- 도메인 연결 후 자동 HTTPS 활성화

## 📊 예상 비용

- Railway: 월 $5~10 (트래픽에 따라)
- 가비아 도메인: 연 15,000원
- 총 월 비용: 약 6,000~12,000원

## 🔧 배포 후 확인사항

- [ ] 백엔드 API 헬스체크: https://api.autotoolshub.com/health
- [ ] 관리자 GUI 접속: https://admin.autotoolshub.com
- [ ] 랜딩 페이지 접속: https://autotoolshub.com
- [ ] SSL 인증서 정상 작동
- [ ] Google Sheets 연동 테스트
- [ ] 이메일 발송 테스트
