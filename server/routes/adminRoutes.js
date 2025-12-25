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

// 주문 목록 조회
router.get('/orders', authMiddleware, async (req, res) => {
    try {
        const rows = await googleSheetsService.getPaymentInfo();
        // 배열을 객체로 변환 (OrderInfo 형식에 맞게)
        const orders = rows.map(row => {
            // Google Sheets 상태를 Firestore 형식으로 매핑
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
                createdAt: row[0] || '',           // A: 기록 시각
                orderId: row[1] || '',             // B: 주문번호
                productName: row[2] || '',         // C: 상품명
                amount: parseInt((row[3] || '0').replace(/[^0-9]/g, '')) || 0,  // D: 결제 금액
                paymentMethod: row[4] || '',       // E: 결제 수단 (카드, 가상계좌 등)
                customerName: row[6] || '',        // G: 구매자 이름
                customerEmail: row[7] || '',       // H: 구매자 이메일
                customerPhone: row[8] || '',       // I: 구매자 전화번호
                address: row[9] || '',             // J: 배송 주소
                addressDetail: '',                 // (주소에 포함됨)
                status: status,                    // K: 결제 상태 (매핑됨)
                approvedAt: row[11] || '',         // L: 승인 시각
                paymentKey: row[12] || '',         // M: 결제 키 (Toss paymentKey)
                userId: '',                        // Google Sheets에는 userId가 없음
                postalCode: '',                    // (주소에 포함됨)
                cancelReason: '',
                cancelRequestedAt: undefined,
                canceledAt: undefined,
            };
        }).reverse(); // 최신순

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        res.json({ success: false, message: 'Failed to fetch orders' });
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
