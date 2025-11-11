# Gmail OAuth2 설정 가이드

이 문서는 Gmail OAuth2를 사용하여 이메일을 발송하기 위한 설정 방법을 안내합니다.

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성 또는 선택
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 기존 프로젝트를 선택하거나 새 프로젝트 생성

### 1.2 Gmail API 활성화
1. 좌측 메뉴에서 **APIs & Services > Library** 선택
2. "Gmail API" 검색
3. **Enable** 클릭

### 1.3 OAuth 동의 화면 구성
1. **APIs & Services > OAuth consent screen** 선택
2. User Type: **External** 선택 후 **Create**
3. 필수 정보 입력:
   - App name: `JSHA Email Service`
   - User support email: 본인 이메일
   - Developer contact information: 본인 이메일
4. **Save and Continue**
5. Scopes 단계에서 **Add or Remove Scopes** 클릭
6. 다음 scope 추가:
   - `https://mail.google.com/` 또는
   - `https://www.googleapis.com/auth/gmail.send`
7. **Save and Continue**
8. Test users 추가: 이메일 발송에 사용할 Gmail 주소 추가
9. **Save and Continue**

### 1.4 OAuth 2.0 클라이언트 ID 생성
1. **APIs & Services > Credentials** 선택
2. **Create Credentials > OAuth client ID** 클릭
3. Application type: **Web application** 선택
4. Name: `JSHA Email OAuth Client`
5. Authorized redirect URIs에 추가:
   ```
   https://developers.google.com/oauthplayground
   ```
6. **Create** 클릭
7. **Client ID**와 **Client Secret** 복사 (나중에 사용)

## 2. Refresh Token 발급

### 2.1 OAuth Playground 사용
1. [OAuth 2.0 Playground](https://developers.google.com/oauthplayground) 접속
2. 우측 상단 톱니바퀴 아이콘(⚙️) 클릭
3. **Use your own OAuth credentials** 체크
4. 앞서 생성한 **OAuth Client ID**와 **OAuth Client Secret** 입력
5. 좌측 **Step 1** 섹션에서 Gmail API 선택:
   - `https://mail.google.com/` 체크
6. **Authorize APIs** 클릭
7. Google 계정 로그인 및 권한 승인
8. **Step 2** 섹션에서 **Exchange authorization code for tokens** 클릭
9. **Refresh token** 복사 (나중에 사용)

## 3. 환경 변수 설정

`.env` 파일을 열고 다음 내용을 추가/수정합니다:

```env
# 기존 앱 비밀번호 방식 (제거하거나 주석 처리)
# EMAIL_PASSWORD=your_app_password

# OAuth2 설정
OAUTH_CLIENT_ID=your_client_id_here
OAUTH_CLIENT_SECRET=your_client_secret_here
OAUTH_REFRESH_TOKEN=your_refresh_token_here
EMAIL_USER=your_email@gmail.com
ADMIN_EMAIL=admin_email@example.com
EMAIL_SERVICE=gmail
```

**값 설명:**
- `OAUTH_CLIENT_ID`: Google Cloud Console에서 생성한 클라이언트 ID
- `OAUTH_CLIENT_SECRET`: Google Cloud Console에서 생성한 클라이언트 시크릿
- `OAUTH_REFRESH_TOKEN`: OAuth Playground에서 발급받은 리프레시 토큰
- `EMAIL_USER`: 이메일 발송에 사용할 Gmail 주소
- `ADMIN_EMAIL`: 관리자 알림을 받을 이메일 주소

## 4. 테스트

1. 서버 재시작:
   ```bash
   cd server
   node server.js
   ```

2. 콘솔에서 다음 메시지 확인:
   ```
   ✅ Email service initialized successfully
   ```

3. 테스트 주문 또는 신청을 통해 이메일 발송 확인

## 문제 해결

### "Error: invalid_grant" 오류
- Refresh Token이 만료되었을 수 있습니다
- OAuth Playground에서 새로운 Refresh Token 재발급

### "Error: invalid_client" 오류
- Client ID 또는 Client Secret이 잘못되었습니다
- .env 파일의 값을 다시 확인하세요

### 이메일이 발송되지 않음
- Gmail API가 활성화되어 있는지 확인
- Test users에 이메일 주소가 추가되어 있는지 확인
- OAuth consent screen이 "Testing" 상태인 경우 Test users만 사용 가능

## 보안 권장사항

1. `.env` 파일을 절대 Git에 커밋하지 마세요
2. `.gitignore`에 `.env`가 포함되어 있는지 확인
3. Refresh Token을 안전하게 보관하세요
4. 프로덕션 환경에서는 환경변수를 서버 설정으로 관리하세요

## 참고 자료

- [Google OAuth2 문서](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API 문서](https://developers.google.com/gmail/api)
- [Nodemailer OAuth2 가이드](https://nodemailer.com/smtp/oauth2/)
