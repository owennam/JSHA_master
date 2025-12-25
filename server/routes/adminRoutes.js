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
        const totalRevenue = payments.reduce((sum, row) => {
            // 결제 금액 컬럼 (D열, 인덱스 3) 파싱
            const amount = parseInt(row[3]?.replace(/[^0-9]/g, '') || '0');
            return sum + amount;
        }, 0);

        res.json({
            success: true,
            data: {
                totalRevenue,
                totalOrders: payments.length,
                newApplications: applications.length,
                pendingConsultations: mastercare.length
            }
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
    }
});

// 주문 목록 조회 (Firestore 사용)
router.get('/orders', authMiddleware, async (req, res) => {
    try {
        if (!db) {
            // Firestore가 초기화되지 않은 경우 Google Sheets 폴백
            console.log('⚠️ Firestore not initialized, falling back to Google Sheets');
            const rows = await googleSheetsService.getPaymentInfo();
            // ... (기존 Google Sheets 매핑 로직 유지 가능하지만 복잡하므로 생략하거나 필요한 경우 추가)
            return res.json({ success: false, message: 'Firestore DB not available' });
        }

        // users 컬렉션의 모든 문서를 조회한 후, 각 user의 orders 서브컬렉션을 조회해야 함
        // 하지만 collectionGroup을 사용하면 더 효율적
        const status = req.query.status;
        let ordersQuery = db.collectionGroup('orders');

        // 상태 필터링이 있다면 적용
        if (status && status !== 'all') {
            ordersQuery = ordersQuery.where('status', '==', status);
        }

        // Firestore 정렬은 인덱스가 필요할 수 있으므로 메모리에서 정렬하거나 인덱스 생성 필요
        // 여기서는 가져온 후 메모리 정렬 (데이터 양이 적을 때 유효)
        const snapshot = await ordersQuery.get();

        const orders = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            orders.push({
                ...data,
                // 날짜 포맷팅 등 필요한 전처리
            });
        });

        // 최신순 정렬 (createdAt 기준)
        orders.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Failed to fetch orders from Firestore:', error);
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

export default router;
