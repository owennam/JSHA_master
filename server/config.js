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
  // Resend 이메일 설정 (클라우드 친화적, 권장)
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
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
  tossSecretKey: config.tossSecretKey ? '✓' : '✗'
});
