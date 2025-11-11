# 토스페이먼츠 결제 위젯 연동 가이드

## 개요

이 프로젝트는 토스페이먼츠 결제위젯 v2를 사용하여 안전한 결제 시스템을 구현합니다.

## 시스템 구조

```
┌─────────────┐         ┌─────────────┐         ┌──────────────────┐
│   Client    │────────>│   Server    │────────>│ Toss Payments   │
│ (React App) │<────────│ (Express)   │<────────│      API        │
│  Port:5173  │         │  Port:3001  │         │                  │
└─────────────┘         └─────────────┘         └──────────────────┘
```

- **클라이언트**: 결제 위젯 UI를 렌더링하고 사용자 입력을 받음
- **서버**: 시크릿 키를 사용하여 결제 승인을 안전하게 처리
- **토스페이먼츠 API**: 실제 결제 처리

## 주요 특징

✅ 결제위젯 방식 사용 (결제창 아님)
✅ 백엔드 서버를 통한 안전한 결제 승인
✅ CORS 설정으로 클라이언트-서버 통신
✅ 환경변수를 통한 포트 및 키 관리
✅ 테스트 키 사용으로 실제 결제 없이 테스트 가능
✅ 프로젝트 디자인에 맞는 성공/실패 페이지

## 설치 및 실행

### 1. 환경 변수 확인

`.env` 파일이 다음과 같이 설정되어 있는지 확인:

```env
# Client Port
VITE_CLIENT_PORT=5173

# Server Port
SERVER_PORT=3001

# Server URL (for client to connect)
VITE_SERVER_URL=http://localhost:3001

# Toss Payments API Keys (테스트용)
VITE_TOSS_CLIENT_KEY=test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm
TOSS_SECRET_KEY=test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6
VITE_TOSS_CUSTOMER_KEY=ANONYMOUS
```

### 2. 의존성 설치

#### 클라이언트
```bash
npm install
```

#### 서버
```bash
cd server
npm install
```

### 3. 실행

#### 방법 1: 자동 실행 (Windows)
```bash
run-payment.bat
```

#### 방법 2: 수동 실행

터미널 1 - 서버:
```bash
cd server
npm start
```

터미널 2 - 클라이언트:
```bash
npm run dev
```

## 결제 흐름

1. **상품 선택**: 사용자가 제품 페이지에서 상품 선택
2. **결제 페이지 이동**: `/payment?productName=...&amount=...&orderId=...` 로 이동
3. **결제 위젯 렌더링**:
   - 결제 수단 선택 UI 표시
   - 약관 동의 UI 표시
4. **결제 요청**: 사용자가 "결제하기" 버튼 클릭
5. **토스페이먼츠 처리**: 토스 결제창에서 결제 진행
6. **결제 승인**:
   - 성공 시: `/payment/success?paymentKey=...&orderId=...&amount=...`로 리디렉션
   - 실패 시: `/payment/fail?code=...&message=...`로 리디렉션
7. **서버 승인 요청**: 성공 페이지에서 백엔드 서버의 `/confirm-payment` API 호출
8. **최종 승인**: 서버가 시크릿 키로 토스페이먼츠 API에 결제 승인 요청
9. **결과 표시**: 성공/실패 정보를 사용자에게 표시

## 파일 구조

```
jsha-learn-path/
├── server/
│   ├── package.json          # 서버 의존성
│   ├── server.js             # Express 서버 (결제 승인 API)
│   └── README.md             # 서버 문서
├── src/
│   ├── pages/
│   │   ├── PaymentPage.tsx           # 결제 위젯 페이지
│   │   ├── PaymentSuccessPage.tsx    # 결제 성공 페이지
│   │   └── PaymentFailPage.tsx       # 결제 실패 페이지
├── .env                      # 환경 변수
├── run-payment.bat           # 자동 실행 스크립트
└── PAYMENT_SETUP.md          # 이 문서
```

## 주요 구현 내용

### 클라이언트 (PaymentPage.tsx)

```typescript
// 1. SDK 로드
const tossPayments = await loadTossPayments(clientKey);

// 2. 위젯 초기화
const paymentWidget = tossPayments.widgets({ customerKey });

// 3. 금액 설정 (렌더링 전 필수!)
await paymentWidget.setAmount({ currency: "KRW", value: amount });

// 4. UI 렌더링
await paymentWidget.renderPaymentMethods({ selector: "#payment-method" });
await paymentWidget.renderAgreement({ selector: "#agreement" });

// 5. 결제 요청
await paymentWidget.requestPayment({
  orderId,
  orderName,
  successUrl,
  failUrl,
  customerEmail,
  customerName,
  customerMobilePhone
});
```

### 서버 (server.js)

```javascript
// CORS 설정
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

// 결제 승인 엔드포인트
app.post('/confirm-payment', async (req, res) => {
  const { paymentKey, orderId, amount } = req.body;

  // 토스페이먼츠 API 호출
  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount })
  });

  // 결과 반환
  const data = await response.json();
  res.json({ success: true, data });
});
```

## 보안 고려사항

🔒 **시크릿 키는 절대 클라이언트에 노출하지 않음**
- 클라이언트: `VITE_TOSS_CLIENT_KEY`만 사용
- 서버: `TOSS_SECRET_KEY` 사용

🔒 **CORS 설정으로 허용된 클라이언트만 접근 가능**

🔒 **환경변수로 민감한 정보 관리**

## 테스트 카드 정보

토스페이먼츠 테스트 환경에서 사용 가능한 카드:

- **카드번호**: 아무 16자리 숫자
- **유효기간**: 미래의 날짜
- **생년월일**: 아무 6자리
- **비밀번호**: 아무 2자리

예시:
- 카드번호: 1234-5678-9012-3456
- 유효기간: 12/25
- 생년월일: 990101
- 비밀번호 앞 2자리: 00

## 문제 해결

### 1. 결제 위젯이 렌더링되지 않음
- 브라우저 콘솔에서 에러 확인
- `VITE_TOSS_CLIENT_KEY`가 올바르게 설정되었는지 확인
- DOM 요소(`#payment-method`, `#agreement`)가 존재하는지 확인

### 2. CORS 에러
- 서버가 실행 중인지 확인
- `.env`의 포트 설정이 올바른지 확인
- 서버 재시작 시도

### 3. 결제 승인 실패
- 서버 콘솔에서 에러 로그 확인
- `TOSS_SECRET_KEY`가 올바른지 확인
- 금액이 일치하는지 확인 (클라이언트와 서버)

### 4. "NOT_REGISTERED_PAYMENT_WIDGET" 에러
- 결제 금액을 설정하지 않았을 때 발생
- `setAmount()` 호출 확인

## 참고 문서

- [토스페이먼츠 결제위젯 연동 가이드](https://docs.tosspayments.com/guides/v2/payment-widget/integration)
- [토스페이먼츠 API 문서](https://docs.tosspayments.com/reference)

## 실제 운영 환경 배포 시

1. 테스트 키를 실제 키로 변경
2. `VITE_SERVER_URL`을 실제 서버 URL로 변경
3. HTTPS 사용 필수
4. 환경변수를 안전하게 관리 (AWS Secrets Manager, etc.)
5. 결제 내역 데이터베이스 저장 구현
6. 웹훅(Webhook) 설정으로 결제 상태 동기화
