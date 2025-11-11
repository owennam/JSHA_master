# 구글 시트 연동 가이드

## 완료된 구현 사항

✅ Google Sheets API 연동
✅ 결제 완료 시 자동으로 구글 시트에 데이터 저장
✅ 사용자 입력 정보 (이름, 이메일, 전화번호) 저장
✅ 토스페이먼츠 결제 응답 정보 저장

## 구글 시트 구조

**시트 ID:** `1AaushXBsJLcr4WMl5pjsfDgxe59SNuudNR1jgCjD09g`
**시트명:** `결제정보`

### 저장되는 데이터 (13개 컬럼)

| 컬럼 | 설명 | 데이터 소스 |
|------|------|------------|
| A. 기록 시각 | 데이터 저장 시각 (한국시간) | 서버 |
| B. 주문번호 | 주문 ID | 토스페이먼츠 |
| C. 상품명 | 구매 상품명 | 토스페이먼츠 |
| D. 결제 금액 | 결제한 금액 | 토스페이먼츠 |
| E. 결제 수단 | 카드/가상계좌/계좌이체 등 | 토스페이먼츠 |
| F. 결제 수단 상세 | 카드번호, 계좌번호 등 | 토스페이먼츠 |
| G. 구매자 이름 | 사용자가 입력한 이름 | 사용자 입력 |
| H. 구매자 이메일 | 사용자가 입력한 이메일 | 사용자 입력 |
| I. 구매자 전화번호 | 사용자가 입력한 전화번호 | 사용자 입력 |
| J. 결제 상태 | DONE, CANCELED 등 | 토스페이먼츠 |
| K. 승인 시각 | 결제 승인 시각 | 토스페이먼츠 |
| L. 결제 키 | 토스페이먼츠 결제 고유 키 | 토스페이먼츠 |
| M. 영수증 URL | 영수증 링크 | 토스페이먼츠 |

## 서비스 계정 설정 방법

### 1. 서비스 계정 파일 업데이트

**파일 위치:** `server/google-service-account.json`

제공받은 서비스 계정 JSON 파일의 내용을 복사하여 위 파일에 붙여넣으세요.

필수 필드:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### 2. 구글 시트 공유 설정

구글 시트를 서비스 계정 이메일과 공유해야 합니다:

1. 구글 시트 열기: https://docs.google.com/spreadsheets/d/1AaushXBsJLcr4WMl5pjsfDgxe59SNuudNR1jgCjD09g/edit
2. 우측 상단 "공유" 버튼 클릭
3. 서비스 계정 이메일 추가 (예: `your-service-account@your-project.iam.gserviceaccount.com`)
4. 권한: **편집자** 권한 부여
5. 완료

### 3. 환경 변수 확인

`.env` 파일에 다음 환경 변수가 설정되어 있는지 확인:

```env
GOOGLE_SHEETS_ID=1AaushXBsJLcr4WMl5pjsfDgxe59SNuudNR1jgCjD09g
GOOGLE_SHEET_NAME=결제정보
GOOGLE_SERVICE_ACCOUNT_FILE=./server/google-service-account.json
```

### 4. 서버 재시작

서비스 계정 파일을 업데이트한 후 서버를 재시작하세요:

```bash
# 기존 서버 종료 후
cd server
npm start
```

서버 시작 시 다음 메시지가 나타나야 합니다:
```
✅ Google Sheets API initialized successfully
✅ Headers added to Google Sheet (또는 이미 존재하는 경우 생략)
📊 Google Sheets ready
```

## 데이터 흐름

```
1. 사용자가 결제 페이지에서 정보 입력
   ↓
2. 토스페이먼츠 결제 진행
   ↓
3. 결제 성공 → /payment/success?paymentKey=...&orderId=...&amount=...&customerName=...&customerEmail=...&customerPhone=...
   ↓
4. PaymentSuccessPage에서 백엔드 API 호출
   ↓
5. 서버가 토스페이먼츠 API로 결제 승인
   ↓
6. 승인 성공 시 구글 시트에 데이터 저장
   ↓
7. 사용자에게 성공 화면 표시
```

## 파일 구조

```
jsha-learn-path/
├── server/
│   ├── server.js                       # 메인 서버 (구글 시트 저장 로직 포함)
│   ├── googleSheetsService.js          # 구글 시트 API 서비스
│   ├── google-service-account.json     # 서비스 계정 인증 파일 (비공개!)
│   └── package.json
├── src/
│   └── pages/
│       ├── PaymentPage.tsx             # 사용자 정보를 successUrl에 포함
│       └── PaymentSuccessPage.tsx       # 사용자 정보를 서버로 전달
└── .env                                # 환경 변수
```

## 중요 보안 사항

🔒 **절대 git에 커밋하지 말 것:**
- `server/google-service-account.json`
- `.env` 파일

`.gitignore`에 다음 내용 추가:
```
server/google-service-account.json
.env
```

## 문제 해결

### Google Sheets API 초기화 실패

**에러:** `Service account file not found`
**해결:** `server/google-service-account.json` 파일이 존재하고 올바른 JSON 형식인지 확인

**에러:** `Error: Unable to access spreadsheet`
**해결:**
1. 구글 시트가 서비스 계정 이메일과 공유되었는지 확인
2. 서비스 계정에 **편집자** 권한이 있는지 확인

**에러:** `Invalid grant`
**해결:** 서비스 계정의 `private_key`가 올바르게 복사되었는지 확인 (줄바꿈 포함)

### 데이터가 저장되지 않음

1. 서버 콘솔에서 에러 메시지 확인
2. 구글 시트 권한 재확인
3. 환경 변수 값 확인 (`GOOGLE_SHEETS_ID`, `GOOGLE_SHEET_NAME`)

### 헤더가 중복 생성됨

- `ensureHeaders()` 함수는 첫 번째 행이 비어있을 때만 헤더를 추가합니다
- 이미 헤더가 있으면 건너뜁니다

## 테스트

결제를 완료하면 구글 시트에 자동으로 다음과 같은 형식으로 데이터가 추가됩니다:

| 기록 시각 | 주문번호 | 상품명 | 결제 금액 | ... |
|-----------|----------|--------|-----------|-----|
| 2025. 10. 12. 오전 11:30:25 | ORDER_123 | JS insole | 33000 | ... |

## API 문서 참고

- [토스페이먼츠 결제 승인 응답](https://docs.tosspayments.com/reference#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8)
- [Google Sheets API](https://developers.google.com/sheets/api)
