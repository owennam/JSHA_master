import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase Admin 초기화
let db = null;

try {
    // 환경 변수에서 Firebase 설정 가져오기
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'jsha-master-course';

    // Admin SDK 초기화 (이미 초기화된 경우 재사용)
    if (!admin.apps.length) {
        // 1. 환경 변수에 서비스 계정 JSON이 있으면 사용
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            try {
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    projectId: projectId,
                });
                console.log('✅ Firebase Admin initialized with service account (Env)');
            } catch (parseError) {
                console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', parseError);
                throw parseError;
            }
        } else {
            // 2. 로컬 키 파일 확인 (google-service-account.json)
            const keyFilePath = path.join(__dirname, 'google-service-account.json');

            if (fs.existsSync(keyFilePath)) {
                try {
                    const serviceAccount = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                        projectId: projectId,
                    });
                    console.log('✅ Firebase Admin initialized with local key file');
                } catch (e) {
                    console.error('❌ Failed to read/parse local key file:', e);
                    // Fallback to default
                    admin.initializeApp({
                        credential: admin.credential.applicationDefault(),
                        projectId: projectId,
                    });
                    console.log('⚠️ Failed to load local key, falling back to default credentials');
                }
            } else {
                // 3. Application Default Credentials 시도
                admin.initializeApp({
                    credential: admin.credential.applicationDefault(),
                    projectId: projectId,
                });
                console.log('✅ Firebase Admin initialized with default credentials');
            }
        }
    }

    db = admin.firestore();
    console.log('✅ Firestore initialized');
} catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    console.log('ℹ️  Running without Firebase Admin - user management features will be limited');
    console.log('ℹ️  Set FIREBASE_SERVICE_ACCOUNT environment variable with service account JSON');
}

export { admin, db };
