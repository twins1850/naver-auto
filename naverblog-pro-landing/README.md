# 네이버 블로그 자동화 프로그램 랜딩페이지

## 🚀 새로운 기능: 라이선스 자동 발급 + 이메일 발송 시스템

### ✨ 주요 기능

- 💳 **토스페이먼츠 결제 시스템**
- 📊 **Google Sheets 고객 데이터 관리**
- 🔑 **라이선스 자동 생성 및 발급**
- 📧 **이메일 자동 발송 시스템**
- 🎯 **실시간 라이선스 상태 관리**

### 🔄 자동화 플로우

1. **결제 완료** → 2. **라이선스 키 생성** → 3. **Google Sheets 저장** → 4. **이메일 발송**

## 📁 프로젝트 구조

### 라이선스 시스템 핵심 파일

```
lib/
├── license.js              # 라이선스 키 생성
├── email.js                # 이메일 발송 시스템
├── license-service.js      # 통합 라이선스 서비스
└── google-sheets.ts        # Google Sheets 연동

app/api/
├── issue-license/          # 라이선스 발급 API
└── admin/licenses/         # 관리자 라이선스 조회 API

app/
├── payment-info/success/   # 결제 성공 + 라이선스 발급
└── admin/licenses/         # 라이선스 관리 페이지
```

## 🛠 설치 및 설정

### 1. 패키지 설치

```bash
npm install nodemailer uuid
```

### 2. 환경 변수 설정

`.env` 파일에 다음 설정을 추가하세요:

```env
# 이메일 발송 설정 (Gmail SMTP)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# 프로그램 다운로드 링크
DOWNLOAD_LINK=https://your-download-server.com/naver-blog-automation.exe

# 고객 지원 정보
SUPPORT_EMAIL=support@your-domain.com
KAKAO_ID=@naverblog
```

### 3. Gmail 앱 비밀번호 설정

1. Gmail 계정의 2단계 인증 활성화
2. 앱 비밀번호 생성 ([Google 계정 설정](https://myaccount.google.com/security))
3. 생성된 앱 비밀번호를 `EMAIL_PASS`에 설정

## 🚀 실행

```bash
npm run dev
```

## 📊 라이선스 관리

### 관리자 페이지

- URL: `/admin/licenses`
- 라이선스 현황 조회
- 라이선스 재발송 기능

### 주요 API 엔드포인트

#### 1. 라이선스 발급

```javascript
POST /api/issue-license
{
  "name": "홍길동",
  "email": "user@example.com",
  "phone": "010-1234-5678",
  "orderId": "order_123",
  "paymentKey": "payment_key_123",
  "productType": "standard"
}
```

#### 2. 라이선스 재발송

```javascript
PUT /api/issue-license
{
  "email": "user@example.com"
}
```

## 🎯 라이선스 키 형식

```
NAVER-XXXX-XXXX-XXXX-XXXX
```

- 25자리 고유 라이선스 키
- 1년 유효 기간
- 자동 만료일 계산

## 📧 이메일 템플릿 기능

- 🎨 **HTML 이메일 템플릿**
- 📱 **반응형 디자인**
- 🔗 **다운로드 링크 포함**
- 📞 **고객 지원 정보**
- 🔒 **라이선스 키 하이라이트**

## 📊 Google Sheets 연동

### 자동 생성되는 시트

1. **고객 정보 시트**: 결제 정보 저장
2. **라이선스 시트**: 라이선스 정보 관리

### 라이선스 시트 컬럼

- 라이선스키, 고객명, 이메일, 연락처
- 상품유형, 발급일시, 만료일시, 상태
- 결제ID, 주문번호

## 🔧 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Google Sheets API
- **Email**: Nodemailer (Gmail SMTP)
- **Payment**: 토스페이먼츠
- **License**: UUID + Crypto

## 🎨 UI/UX 특징

- ✅ **실시간 라이선스 발급 상태 표시**
- 🔄 **자동 새로고침 및 재시도**
- 📱 **모바일 최적화**
- 🎯 **직관적인 관리자 인터페이스**

## 🛡 보안 기능

- 🔐 **라이선스 키 암호화**
- 📧 **이메일 인증**
- 🛡 **API 요청 검증**
- 📊 **에러 핸들링**

## 📈 모니터링

- 💬 **콘솔 로깅**
- 📊 **Google Sheets 자동 추적**
- 📧 **이메일 발송 상태 확인**

## 🚀 배포

Vercel에 배포할 때 환경 변수 설정을 잊지 마세요!

---

## 🎉 완성된 기능

✅ 랜딩페이지 + 결제 시스템  
✅ Google Sheets 연동  
✅ **라이선스 자동 발급 + 이메일 발송 시스템**

다음 단계: 고객 지원 시스템 구축 🎯
