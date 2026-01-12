import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import googleSheetsService from '../googleSheetsService.js';
import { db } from '../firebaseAdmin.js';

const router = express.Router();

// 관리자 로그인
router.post('/login', (req, res) => {
    const { password } = req.body;

    if (password !== config.adminPassword) {
        return res.status(401).json({
            success: false,
            message: 'Invalid password'
        });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
        { role: 'admin' },
        config.jwtSecret,
        { expiresIn: '24h' }
    );

    // 토큰을 JSON 응답으로 반환 (클라이언트가 localStorage에 저장)
    res.json({
        success: true,
        message: 'Login successful',
        token: token
    });
});

// 로그아웃
router.post('/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true });
});

// 인증 확인
router.get('/check-auth', authMiddleware, (req, res) => {
    res.json({ success: true, user: req.admin });
});

// --- 데이터 조회 API (인증 필요) ---

// 대시보드 요약 정보
router.get('/dashboard-summary', authMiddleware, async (req, res) => {
    try {
        const [payments, applications, mastercare] = await Promise.all([
            googleSheetsService.getPaymentInfo(),
            googleSheetsService.getApplicationInfo(),
            googleSheetsService.getMasterCareInfo()
        ]);

        // 간단한 통계 계산
        let totalRevenue = 0;
        let completedOrdersCount = 0;
        let pendingOrderCancels = 0;

        payments.forEach(row => {
            const rawStatus = (row[10] || '').toUpperCase().trim();
            const amount = parseInt(row[3]?.replace(/[^0-9]/g, '') || '0');

            // 상태 분류
            if (rawStatus === 'DONE' || rawStatus === 'COMPLETED') {
                // 완료된 주문만 매출에 포함
                totalRevenue += amount;
                completedOrdersCount++;
            } else if (rawStatus.includes('CANCEL') && !rawStatus.includes('CANCELED') && !rawStatus.includes('CANCELLED')) {
                // 취소 요청 대기 중
                pendingOrderCancels++;
            }
            // CANCELED/CANCELLED 상태 또는 빈 값은 매출에서 제외
        });

        // Firestore에서 승인 대기 중인 회원 수 조회
        let pendingUsers = 0;
        if (db) {
            try {
                const usersSnapshot = await db.collection('users').where('status', '==', 'pending').get();
                pendingUsers = usersSnapshot.size;
            } catch (dbError) {
                console.error('Failed to fetch pending users from Firestore:', dbError);
            }
        }

        res.json({
            success: true,
            data: {
                totalRevenue,
                totalOrders: payments.length,
                masterCourseRegistrations: applications.length,
                pendingUsers,
                pendingOrderCancels
            }
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
    }
});

// 주문 목록 조회 (Hybrid: Google Sheets + Firestore)
router.get('/orders', authMiddleware, async (req, res) => {
    try {
        // 1. Google Sheets 데이터 조회 (과거 데이터 포함)
        const sheetRows = await googleSheetsService.getPaymentInfo();
        const sheetOrders = sheetRows.map(row => {
            const rawStatus = (row[10] || 'DONE').toUpperCase();
            let status = 'completed';
            if (rawStatus === 'DONE' || rawStatus === 'COMPLETED') {
                status = 'completed';
            } else if (rawStatus === 'CANCELED' || rawStatus === 'CANCELLED') {
                status = 'canceled';
            } else if (rawStatus.includes('CANCEL')) {
                status = 'cancel_requested';
            }

            return {
                createdAt: row[0] || '',
                orderId: row[1] || '',
                productName: row[2] || '',
                amount: parseInt((row[3] || '0').replace(/[^0-9]/g, '')) || 0,
                paymentMethod: row[4] || '',
                customerName: row[6] || '',
                customerEmail: row[7] || '',
                customerPhone: row[8] || '',
                address: row[9] || '',
                addressDetail: '',
                status: status,
                approvedAt: row[11] || '',
                paymentKey: row[12] || '',
                userId: '',
                postalCode: '',
                cancelReason: '',
                cancelRequestedAt: undefined,
                canceledAt: undefined,
                source: 'sheets' // 디버깅용 출처 표시
            };
        });

        // 2. Firestore 데이터 조회 (실시간 상태 반영)
        let dbOrders = [];
        if (db) {
            try {
                const ordersSnapshot = await db.collectionGroup('orders').get();
                ordersSnapshot.forEach(doc => {
                    dbOrders.push({
                        ...doc.data(),
                        source: 'firestore'
                    });
                });
            } catch (dbError) {
                console.error('Failed to fetch from Firestore:', dbError);
                // Firestore 실패 시 구글 시트 데이터만이라도 반환하려고 시도할 수 있음
            }
        }

        // 3. 데이터 병합 (Firestore 데이터 우선)
        // Map을 사용하여 orderId 기준으로 중복 제거 및 병합
        const ordersMap = new Map();

        // 먼저 구글 시트 데이터 넣기
        sheetOrders.forEach(order => {
            if (order.orderId) {
                ordersMap.set(order.orderId, order);
            }
        });

        // Firestore 데이터로 덮어쓰기 (상태 업데이트 반영됨)
        dbOrders.forEach(order => {
            if (order.orderId) {
                // 기존 데이터가 있으면 병합 (없던 필드 추가 등), 없으면 추가
                const existing = ordersMap.get(order.orderId) || {};
                ordersMap.set(order.orderId, { ...existing, ...order });
            }
        });

        // [긴급 수정] 특정 사용자(남승균) 일괄 환불 처리 로직
        // 조회 시점에 DB와 상태를 강제로 동기화
        for (let [orderId, order] of ordersMap) {
            if ((order.customerName === '남승균' || order.customerName === '소무철') && order.status !== 'canceled') {
                // 1. 메모리 상 상태 변경
                order.status = 'canceled';
                order.canceledAt = new Date().toISOString();
                order.cancelReason = '관리자 일괄 처리';

                // 2. Firestore에도 비동기 업데이트 (Fire-and-forget)
                if (db && order.userId) {
                    db.collection('users').doc(order.userId).collection('orders').doc(orderId).set({
                        status: 'canceled',
                        canceledAt: new Date().toISOString(),
                        cancelReason: '관리자 일괄 처리 (시스템 보정)'
                    }, { merge: true }).catch(e => console.error(`Auto-cancel update failed for ${orderId}:`, e));
                }
            }
        }

        // 4. 배열로 변환 및 정렬, 필터링
        let finalOrders = Array.from(ordersMap.values());

        // 상태 필터링
        const status = req.query.status;
        if (status && status !== 'all') {
            finalOrders = finalOrders.filter(order => order.status === status);
        }

        // 날짜 파싱 헬퍼 함수 (숫자 추출 방식)
        const parseDate = (dateStr) => {
            if (!dateStr) return 0;

            // 1. ISO String 등 표준 포맷 시도
            const time = new Date(dateStr).getTime();
            if (!isNaN(time)) return time;

            // 2. 비표준 포맷 처리 (숫자만 추출하여 파싱)
            try {
                // 모든 숫자 그룹 추출
                const digits = dateStr.match(/\d+/g);
                if (!digits || digits.length < 3) return 0; // 최소 연,월,일은 있어야 함

                let y = parseInt(digits[0]);
                let m = parseInt(digits[1]) - 1; // 월 (0-11)
                let d = parseInt(digits[2]);
                let h = digits[3] ? parseInt(digits[3]) : 0;
                let min = digits[4] ? parseInt(digits[4]) : 0;
                let s = digits[5] ? parseInt(digits[5]) : 0;

                // 연도가 2자리인 경우 (예: 25.12.25) 2000년대 간주
                if (y < 100) y += 2000;

                // 오전/오후 처리
                if (dateStr.includes('오후') && h < 12) h += 12;
                if (dateStr.includes('오전') && h === 12) h = 0;

                const parsedTime = new Date(y, m, d, h, min, s).getTime();
                if (!isNaN(parsedTime)) return parsedTime;

            } catch (e) {
                // ignore
            }
            return 0;
        };

        // 최신순 정렬 (createdAt 기준 내림차순)
        finalOrders.sort((a, b) => {
            const dateA = parseDate(a.createdAt);
            const dateB = parseDate(b.createdAt);
            return dateB - dateA;
        });

        res.json({ success: true, data: finalOrders });
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
    }
});

// 결제 취소 (환불)
router.post('/cancel-payment', authMiddleware, async (req, res) => {
    const { paymentKey, cancelReason, cancelAmount } = req.body;

    if (!paymentKey || !cancelReason) {
        return res.status(400).json({
            success: false,
            message: 'paymentKey and cancelReason are required'
        });
    }

    try {
        console.log('결제 취소 요청:', { paymentKey, cancelReason, cancelAmount });

        // Toss Payments API에 취소 요청
        const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(config.tossSecretKey + ':').toString('base64')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cancelReason,
                ...(cancelAmount && { cancelAmount: parseInt(cancelAmount) })
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('결제 취소 실패:', data);
            return res.status(response.status).json({
                success: false,
                error: data.code || 'CANCEL_FAILED',
                message: data.message || '결제 취소에 실패했습니다.'
            });
        }

        console.log('결제 취소 성공:', data.orderId);

        // TODO: Google Sheets에 취소 상태 업데이트
        // TODO: Firestore에 취소 정보 저장

        res.json({
            success: true,
            data: data,
            message: '결제가 취소되었습니다.'
        });

    } catch (error) {
        console.error('결제 취소 중 오류:', error);
        res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: '결제 취소 중 서버 오류가 발생했습니다.'
        });
    }
});

// 마스터 코스 신청자 조회
router.get('/applications', authMiddleware, async (req, res) => {
    try {
        const rows = await googleSheetsService.getApplicationInfo();
        const applications = rows.map(row => ({
            timestamp: row[0],
            name: row[1],
            email: row[2],
            phone: row[3],
            hospital: row[4],
            status: row[6],
        })).reverse();

        res.json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch applications' });
    }
});

// 수료자 목록 조회
router.get('/graduates', authMiddleware, async (req, res) => {
    try {
        const rows = await googleSheetsService.getGraduates();
        // 헤더 제외하고 데이터만 (이미 getAllRows에서 헤더 제외됨)
        const graduates = rows.map(row => ({
            name: row[0],
            email: row[1],
            batch: row[2],
            date: row[3]
        }));

        res.json({ success: true, data: graduates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch graduates' });
    }
});

// 수료자 추가
router.post('/graduates', authMiddleware, async (req, res) => {
    const { name, email, batch, date } = req.body;

    if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    try {
        await googleSheetsService.addGraduate(name, email, batch, date || new Date().toLocaleDateString());
        res.json({ success: true, message: 'Graduate added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add graduate' });
    }
});

// ============================================
// 사용자 관리 (Firestore)
// ============================================

// 사용자 목록 조회
router.get('/users', authMiddleware, async (req, res) => {
    if (!db) {
        return res.status(503).json({
            success: false,
            message: 'Firebase Admin is not initialized'
        });
    }

    try {
        const { status } = req.query;
        let usersRef = db.collection('users');

        // status 쿼리 파라미터가 있으면 필터링
        if (status) {
            usersRef = usersRef.where('status', '==', status);
        }

        const snapshot = await usersRef.get();
        const users = [];

        snapshot.forEach(doc => {
            users.push({
                uid: doc.id,
                ...doc.data()
            });
        });

        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});

// 사용자 상태 업데이트
router.patch('/users/:uid/status', authMiddleware, async (req, res) => {
    if (!db) {
        return res.status(503).json({
            success: false,
            message: 'Firebase Admin is not initialized'
        });
    }

    const { uid } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be: pending, approved, or rejected'
        });
    }

    try {
        await db.collection('users').doc(uid).update({
            status,
            updatedAt: new Date().toISOString()
        });

        // 승인 시 이메일 발송
        if (status === 'approved') {
            try {
                const userDoc = await db.collection('users').doc(uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    // 이메일 발송 (비동기, 에러가 전체 응답을 방해하지 않도록 함)
                    emailService.sendAccountApprovalToUser({
                        email: userData.email,
                        directorName: userData.directorName || '원장님',
                        clinicName: userData.clinicName || '병원'
                    }).catch(err => console.error('Failed to send approval email (async):', err));
                }
            } catch (emailError) {
                console.error('Error fetching user data for email:', emailError);
            }
        }

        res.json({
            success: true,
            message: `User status updated to ${status}`
        });
    } catch (error) {
        console.error('Failed to update user status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status'
        });
    }
});

// ============================================
// 다시보기 등록자 관리 (더 이상 사용하지 않음 - Firestore로 마이그레이션됨)
// ============================================
/*
// 다시보기 등록자 목록 조회
router.get('/recap-registrants', authMiddleware, async (req, res) => {
    try {
        const rows = await googleSheetsService.getRecapRegistrants();
        const registrants = rows.map(row => ({
            timestamp: row[0],
            name: row[1],
            email: row[2],
            batch: row[3],
            status: row[4] || 'pending'
        }));

        // 상태별 필터링
        const { status } = req.query;
        let filtered = registrants;
        if (status && status !== 'all') {
            filtered = registrants.filter(r => r.status === status);
        }

        // 최신순 정렬
        filtered.reverse();

        res.json({ success: true, data: filtered });
    } catch (error) {
        console.error('Failed to fetch recap registrants:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch recap registrants' });
    }
});

// 다시보기 등록자 상태 업데이트
router.patch('/recap-registrants/:email/status', authMiddleware, async (req, res) => {
    const { email } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be: pending, approved, or rejected'
        });
    }

    try {
        await googleSheetsService.updateRecapRegistrantStatus(decodeURIComponent(email), status);
        res.json({
            success: true,
            message: `Registrant status updated to ${status}`
        });
    } catch (error) {
        console.error('Failed to update recap registrant status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update registrant status'
        });
    }
});
*/
// ============================================
// Firebase Auth 사용자 동기화 (Auth에는 있지만 Firestore에 없는 사용자)
// ============================================

// Auth 사용자 목록 조회 (Firestore 미등록 사용자 포함)
router.get('/sync-auth-users', authMiddleware, async (req, res) => {
    if (!db) {
        return res.status(503).json({
            success: false,
            message: 'Firebase Admin is not initialized'
        });
    }

    try {
        const { admin } = await import('../firebaseAdmin.js');

        // 1. Firebase Auth에서 모든 사용자 가져오기
        const listUsersResult = await admin.auth().listUsers(1000);
        const authUsers = listUsersResult.users;

        // 2. Firestore에서 기존 등록자 가져오기 (users + recapRegistrants)
        const [usersSnapshot, recapSnapshot] = await Promise.all([
            db.collection('users').get(),
            db.collection('recapRegistrants').get()
        ]);

        const existingUserUids = new Set();
        usersSnapshot.forEach(doc => existingUserUids.add(doc.id));
        recapSnapshot.forEach(doc => existingUserUids.add(doc.id));

        // 3. Firestore에 없는 Auth 사용자 필터링
        const unregisteredUsers = authUsers
            .filter(user => !existingUserUids.has(user.uid))
            .map(user => ({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                createdAt: user.metadata.creationTime
            }));

        res.json({
            success: true,
            data: {
                totalAuthUsers: authUsers.length,
                registeredUsers: existingUserUids.size,
                unregisteredUsers: unregisteredUsers
            }
        });
    } catch (error) {
        console.error('Failed to sync auth users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sync auth users',
            error: error.message
        });
    }
});

// Auth 사용자를 Firestore recapRegistrants에 등록
router.post('/sync-auth-users', authMiddleware, async (req, res) => {
    if (!db) {
        return res.status(503).json({
            success: false,
            message: 'Firebase Admin is not initialized'
        });
    }

    const { uids, collection = 'recapRegistrants' } = req.body;

    if (!uids || !Array.isArray(uids) || uids.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'uids array is required'
        });
    }

    try {
        const { admin } = await import('../firebaseAdmin.js');
        const results = [];

        for (const uid of uids) {
            try {
                // Auth에서 사용자 정보 가져오기
                const userRecord = await admin.auth().getUser(uid);

                // Firestore에 등록
                const docData = {
                    uid: uid,
                    email: userRecord.email || '',
                    name: userRecord.displayName || userRecord.email?.split('@')[0] || '이름미입력',
                    status: 'pending',
                    accessLevel: 'preview',
                    createdAt: new Date().toISOString(),
                    syncedFromAuth: true
                };

                if (collection === 'users') {
                    docData.clinicName = '미입력';
                    docData.directorName = docData.name;
                    docData.location = '기타';
                }

                await db.collection(collection).doc(uid).set(docData);
                results.push({ uid, email: userRecord.email, success: true });
            } catch (userError) {
                results.push({ uid, success: false, error: userError.message });
            }
        }

        res.json({
            success: true,
            message: `Synced ${results.filter(r => r.success).length} of ${uids.length} users`,
            data: results
        });
    } catch (error) {
        console.error('Failed to sync auth users to Firestore:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sync auth users',
            error: error.message
        });
    }
});

// 수동 사용자 등록 (Auth API 의존성 제거)
router.post('/manual-register', authMiddleware, async (req, res) => {
    if (!db) {
        return res.status(503).json({
            success: false,
            message: 'Firebase Admin is not initialized'
        });
    }

    const { uid, email, name, collection = 'recapRegistrants' } = req.body;

    if (!uid || !email || !name) {
        return res.status(400).json({
            success: false,
            message: 'uid, email, and name are required'
        });
    }

    try {
        const docData = {
            uid,
            email,
            name,
            status: 'pending',
            accessLevel: 'preview',
            createdAt: new Date().toISOString(),
            manualRegistered: true
        };

        if (collection === 'users') {
            docData.clinicName = '미입력';
            docData.directorName = name;
            docData.location = '기타';
            delete docData.accessLevel;
        }

        await db.collection(collection).doc(uid).set(docData);

        res.json({
            success: true,
            message: `User ${email} manually registered`,
            data: docData
        });
    } catch (error) {
        console.error('Failed to manually register user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to manually register user',
            error: error.message
        });
    }
});

export default router;
