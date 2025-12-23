import admin from 'firebase-admin';

// Firebase Admin 초기화
let db = null;

try {
    // 환경 변수에서 Firebase 설정 가져오기
    const serviceAccount = {
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'jsha-master-course',
        // Admin SDK는 자동으로 Application Default Credentials를 사용
        // Render 환경에서는 환경 변수로 credentials를 설정할 수 있음
    };

    // Admin SDK 초기화 (이미 초기화된 경우 재사용)
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: serviceAccount.projectId,
        });
        console.log('✅ Firebase Admin initialized');
    }

    db = admin.firestore();
} catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    console.log('ℹ️  Running without Firebase Admin - user management features will be limited');
}

export { admin, db };
