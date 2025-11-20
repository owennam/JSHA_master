import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import googleSheetsService from '../googleSheetsService.js';

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

    // 쿠키에 토큰 설정 (HTTP Only)
    res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
        success: true,
        message: 'Login successful'
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
        // 배열을 객체로 변환 (헤더 순서에 맞게)
        const orders = rows.map(row => ({
            timestamp: row[0],
            orderId: row[1],
            productName: row[2],
            amount: row[3],
            customerName: row[6],
            status: row[10],
        })).reverse(); // 최신순

        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
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

export default router;
