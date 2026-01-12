// 빠른 동기화 스크립트 - Firebase Auth 사용자를 Firestore에 등록
// 사용법: node syncUsers.js

import { config } from './config.js'; // 환경 변수 로드
import { admin, db } from './firebaseAdmin.js';

const syncUnregisteredUsers = async () => {
    if (!db) {
        console.error('❌ Firebase Admin is not initialized');
        process.exit(1);
    }

    try {
        console.log('🔍 Firebase Auth 사용자 조회 중...');

        // 1. Firebase Auth에서 모든 사용자 가져오기
        const listUsersResult = await admin.auth().listUsers(1000);
        const authUsers = listUsersResult.users;
        console.log(`   총 ${authUsers.length}명의 Auth 사용자 발견`);

        // 2. Firestore에서 기존 등록자 가져오기
        const [usersSnapshot, recapSnapshot] = await Promise.all([
            db.collection('users').get(),
            db.collection('recapRegistrants').get()
        ]);

        const existingUserUids = new Set();
        usersSnapshot.forEach(doc => existingUserUids.add(doc.id));
        recapSnapshot.forEach(doc => existingUserUids.add(doc.id));
        console.log(`   Firestore에 ${existingUserUids.size}명 등록됨`);

        // 3. Firestore에 없는 Auth 사용자 필터링
        const unregisteredUsers = authUsers.filter(user => !existingUserUids.has(user.uid));
        console.log(`   미등록 사용자: ${unregisteredUsers.length}명`);

        if (unregisteredUsers.length === 0) {
            console.log('✅ 모든 사용자가 이미 Firestore에 등록되어 있습니다.');
            process.exit(0);
        }

        // 4. 미등록 사용자 Firestore에 등록
        console.log('\n📝 미등록 사용자 등록 중...');
        for (const user of unregisteredUsers) {
            const docData = {
                uid: user.uid,
                email: user.email || '',
                name: user.displayName || user.email?.split('@')[0] || '이름미입력',
                status: 'pending',
                accessLevel: 'preview',
                createdAt: new Date().toISOString(),
                syncedFromAuth: true
            };

            await db.collection('recapRegistrants').doc(user.uid).set(docData);
            console.log(`   ✅ ${user.email} 등록 완료`);
        }

        console.log(`\n🎉 ${unregisteredUsers.length}명의 사용자가 recapRegistrants에 등록되었습니다.`);
        console.log('   이제 관리자 페이지에서 승인하실 수 있습니다.');

    } catch (error) {
        console.error('❌ 동기화 실패:', error);
        process.exit(1);
    }
};

syncUnregisteredUsers();
