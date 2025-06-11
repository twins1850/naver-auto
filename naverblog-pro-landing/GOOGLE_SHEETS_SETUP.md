# Google Sheets API 설정 가이드

NaverBlog Pro 결제 시스템에서 고객 정보를 Google Sheets에 자동으로 저장하기 위한 설정 가이드입니다.

## 1. Google Cloud Console 설정

### 1-1. 프로젝트 생성 및 API 활성화

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" → "라이브러리"에서 **Google Sheets API** 검색 후 활성화

### 1-2. 서비스 계정 생성

1. "API 및 서비스" → "사용자 인증 정보" → "사용자 인증 정보 만들기" → "서비스 계정"
2. 서비스 계정 정보 입력:
   - 서비스 계정 이름: `naverblog-pro-sheets`
   - 서비스 계정 ID: `naverblog-pro-sheets`
   - 설명: `NaverBlog Pro 고객 데이터 Google Sheets 연동`
3. 권한 설정: 기본값으로 두고 "완료" 클릭

### 1-3. 서비스 계정 키 생성

1. 생성된 서비스 계정 클릭
2. "키" 탭 → "키 추가" → "새 키 만들기"
3. 키 유형: **JSON** 선택 후 "만들기"
4. JSON 파일이 자동으로 다운로드됩니다.

## 2. Google 스프레드시트 설정

### 2-1. 스프레드시트 생성

1. [Google 스프레드시트](https://sheets.google.com/)에서 새 스프레드시트 생성
2. 스프레드시트 이름: `NaverBlog Pro 고객 관리`

### 2-2. 서비스 계정에 권한 부여

1. 스프레드시트에서 "공유" 버튼 클릭
2. 서비스 계정 이메일 주소 입력 (JSON 파일의 `client_email` 값)
3. 권한: **편집자**로 설정
4. "완료" 클릭

### 2-3. 스프레드시트 ID 확인

스프레드시트 URL에서 ID 확인:

```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

## 3. 환경 변수 설정

`.env` 파일에 다음 값들을 설정하세요:

```env
# Google Sheets API 설정
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----
```

### 설정 값 설명:

- `GOOGLE_SHEETS_SPREADSHEET_ID`: 2-3에서 확인한 스프레드시트 ID
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: JSON 파일의 `client_email` 값
- `GOOGLE_PRIVATE_KEY`: JSON 파일의 `private_key` 값 (개행 문자를 `\n`으로 변환)

## 4. Google Sheets 컬럼 구조

자동으로 생성되는 컬럼 구조:

| 컬럼        | 설명           | 예시                        |
| ----------- | -------------- | --------------------------- |
| A: 이름     | 고객 이름      | 김철수                      |
| B: 이메일   | 고객 이메일    | customer@example.com        |
| C: 연락처   | 고객 전화번호  | 010-1234-5678               |
| D: 결제일시 | 결제 완료 시간 | 2024-01-15 14:30:25         |
| E: 결제금액 | 결제 금액      | 150,000원                   |
| F: 아이디수 | 네이버 계정 수 | 2                           |
| G: 글수     | 계정당 글 수   | 3                           |
| H: 개월수   | 이용 기간      | 1                           |
| I: 결제상태 | 결제 상태      | 결제완료                    |
| J: 주문번호 | 토스 주문번호  | NaverBlog-Pro-1705123456789 |

## 5. 테스트 방법

1. 모든 설정 완료 후 결제 테스트 진행
2. 결제 성공 페이지에서 "고객 정보가 시스템에 자동으로 저장되었습니다" 메시지 확인
3. Google 스프레드시트에서 데이터 자동 추가 확인

## 6. 문제 해결

### 일반적인 오류:

- **403 Forbidden**: 서비스 계정에 스프레드시트 편집 권한이 없음
- **404 Not Found**: 스프레드시트 ID가 잘못됨
- **401 Unauthorized**: 서비스 계정 인증 정보가 잘못됨

### 로그 확인:

개발자 도구 콘솔에서 다음 메시지 확인:

- "고객 정보가 Google Sheets에 성공적으로 저장되었습니다." (성공)
- "고객 정보 저장 실패:" (실패 시 상세 오류 메시지)

## 7. 보안 주의사항

1. **서비스 계정 JSON 파일 보안**:

   - JSON 파일을 버전 관리 시스템에 커밋하지 마세요
   - `.gitignore`에 JSON 파일 패턴 추가

2. **환경 변수 보안**:

   - `.env` 파일을 버전 관리 시스템에 커밋하지 마세요
   - 프로덕션 환경에서는 안전한 방법으로 환경 변수 설정

3. **최소 권한 원칙**:
   - 서비스 계정에는 필요한 최소한의 권한만 부여
   - 정기적으로 사용하지 않는 서비스 계정 정리
