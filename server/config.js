import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 프로젝트 루트의 .env 파일 로드
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

export const config = {
  serverPort: process.env.SERVER_PORT || 3001,
  clientPort: process.env.VITE_CLIENT_PORT || 5173,
  tossSecretKey: process.env.TOSS_SECRET_KEY,
  googleSheetsId: process.env.GOOGLE_SHEETS_ID,
  googleSheetName: process.env.GOOGLE_SHEET_NAME,
  emailService: process.env.EMAIL_SERVICE || 'gmail',
  emailUser: process.env.EMAIL_USER,
  // Resend API (권장 - Render 호환)
  resendApiKey: process.env.RESEND_API_KEY,
  // OAuth2 설정 (Gmail용 - Render에서 포트 제한으로 작동 안 함)
  oauthClientId: process.env.OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  oauthRefreshToken: process.env.OAUTH_REFRESH_TOKEN,
  // 레거시 앱 비밀번호 방식 (OAuth2가 없을 경우 대체)
  emailPassword: process.env.EMAIL_PASSWORD,
  adminEmail: process.env.ADMIN_EMAIL,
  // SOLAPI SMS 설정
  solapiApiKey: process.env.SOLAPI_API_KEY,
  solapiApiSecret: process.env.SOLAPI_API_SECRET,
  solapiFromNumber: process.env.SOLAPI_FROM_NUMBER,
  adminPhone: process.env.ADMIN_PHONE,
};

console.log('Config loaded:', {
  googleSheetsId: config.googleSheetsId,
  googleSheetName: config.googleSheetName,
  tossSecretKey: config.tossSecretKey ? '✓' : '✗',
  resendApiKey: config.resendApiKey ? '✓ (Resend configured)' : '✗ (Resend NOT configured)',
  oauthClientId: config.oauthClientId ? '✓ (OAuth2 configured)' : '✗',
  emailUser: config.emailUser || 'Not set',
  adminEmail: config.adminEmail || 'Not set'
});
