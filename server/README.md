# JSHA Payment Server

토스페이먼츠 결제 승인을 처리하는 백엔드 서버입니다.

## 설치

```bash
cd server
npm install
```

## 실행

```bash
npm start
```

또는 개발 모드 (자동 재시작):

```bash
npm run dev
```

## 환경 변수

프로젝트 루트의 `.env` 파일에서 다음 환경 변수를 설정합니다:

- `SERVER_PORT`: 서버 포트 (기본값: 3001)
- `VITE_CLIENT_PORT`: 클라이언트 포트 (CORS 설정용, 기본값: 5173)
- `TOSS_SECRET_KEY`: 토스페이먼츠 시크릿 키

## API 엔드포인트

### GET /health
서버 상태 확인

### POST /confirm-payment
결제 승인 처리

**요청 본문:**
```json
{
  "paymentKey": "string",
  "orderId": "string",
  "amount": number
}
```

**응답 (성공):**
```json
{
  "success": true,
  "data": {
    // 토스페이먼츠 결제 정보
  }
}
```

**응답 (실패):**
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "에러 메시지"
}
```
