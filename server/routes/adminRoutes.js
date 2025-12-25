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

        // 날짜 파싱 헬퍼 함수
        const parseDate = (dateStr) => {
            if (!dateStr) return 0;

            // 1. ISO String 등 표준 포맷 시도
            const time = new Date(dateStr).getTime();
            if (!isNaN(time)) return time;

            // 2. 구글 시트 한국어 포맷 등 처리 시도
            try {
                // 예: "2024. 12. 25. 오전 10:10:00" -> 숫자만 추출해서 문자열 비교용으로라도 변환?
                // 혹은 정규식으로 년월일시분초 추출
                const digits = dateStr.replace(/[^0-9]/g, '');
                if (digits.length >= 8) {
                    // YYYYMMDD... 형태일 때 앞 8자리라도 비교값으로 사용
                    return parseInt(digits.padEnd(14, '0').substring(0, 14));
                }
            } catch (e) {
                // ignore
            }
            return 0;
        };

        // 최신순 정렬 (createdAt 기준 내림차순)
        finalOrders.sort((a, b) => {
            // ISO 포맷인 경우 Date 객체로 바로 비교가 가장 정확
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            // 둘 다 유효한 타임스탬프라면 바로 비교
            if (!isNaN(dateA) && !isNaN(dateB)) {
                return dateB - dateA;
            }

            // 하나라도 파싱 안되면 문자열 자체로 역순 정렬 (최근 날짜가 문자열로도 더 큼 "2025..." > "2024...")
            if (a.createdAt < b.createdAt) return 1;
            if (a.createdAt > b.createdAt) return -1;
            return 0;
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
