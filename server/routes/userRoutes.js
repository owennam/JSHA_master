import express from 'express';
import googleSheetsService from '../googleSheetsService.js';
import emailService from '../emailService.js';
import admin from 'firebase-admin';

const router = express.Router();

/**
 * 사용자 주문 목록 조회 (이메일 기반)
 * GET /api/user/orders?email=user@example.com
 */
router.get('/orders', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Google Sheets에서 모든 결제 정보 가져오기
        const rows = await googleSheetsService.getPaymentInfo();

        // 이메일로 필터링하여 사용자 주문만 추출
        const userOrders = rows
            .filter(row => {
                const orderEmail = row[7] || ''; // H: 구매자 이메일
                return orderEmail.toLowerCase() === email.toLowerCase();
            })
            .map(row => {
                // 주소 파싱 (우편번호, 기본주소, 상세주소 분리)
                const fullAddress = row[9] || ''; // J: 배송 주소
                const addressParts = fullAddress.split(' ');
                const postalCode = addressParts[0] || '';
                const address = addressParts.slice(1, -1).join(' ') || '';
                const addressDetail = addressParts[addressParts.length - 1] || '';

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
                    orderId: row[1] || '',
                    userId: '',  // Google Sheets에는 userId가 없음
                    paymentKey: row[12] || '',
                    productName: row[2] || '',
                    amount: parseInt((row[3] || '0').toString().replace(/[^0-9]/g, '')) || 0,
                    customerName: row[6] || '',
                    customerEmail: row[7] || '',
                    customerPhone: row[8] || '',
                    address: fullAddress,
                    addressDetail: '',
                    postalCode: '',
                    status: status,
                    createdAt: row[0] || '',
                    cancelRequestedAt: undefined,
                    canceledAt: undefined,
                    cancelReason: '',
                };
            })
            .reverse(); // 최신순 정렬

        res.json({
            success: true,
            data: userOrders,
            source: 'google_sheets' // 데이터 출처 표시
        });
    } catch (error) {
        console.error('Failed to fetch user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user orders',
            error: error.message
        });
    }
});

/**
 * 주문 취소 요청
 * POST /api/user/cancel-request
 */
router.post('/cancel-request', async (req, res) => {
    try {
        const { userId, orderId, cancelReason, orderData } = req.body;

        if (!userId || !orderId || !cancelReason) {
            return res.status(400).json({
                success: false,
                message: 'userId, orderId, cancelReason are required'
            });
        }

        // Firestore에서 주문 상태 업데이트
        const db = admin.firestore();
        const orderRef = db.collection('users').doc(userId).collection('orders').doc(orderId);

        await orderRef.update({
            status: 'cancel_requested',
            cancelReason: cancelReason,
            cancelRequestedAt: new Date().toISOString()
        });

        console.log(`✅ Cancel request submitted for order: ${orderId}`);

        // 관리자에게 이메일 알림 발송
        try {
            await emailService.sendCancelRequestNotificationToAdmin({
                orderId: orderId,
                productName: orderData?.productName || '주문 상품',
                amount: orderData?.amount || 0,
                customerName: orderData?.customerName || '',
                customerEmail: orderData?.customerEmail || '',
                customerPhone: orderData?.customerPhone || '',
                cancelReason: cancelReason,
                requestedAt: new Date().toISOString()
            });
            console.log('✅ Cancel request email sent to admin');
        } catch (emailError) {
            console.error('⚠️ Failed to send email notification:', emailError);
            // 이메일 실패해도 취소 요청은 성공으로 처리
        }

        res.json({
            success: true,
            message: 'Cancel request submitted successfully'
        });
    } catch (error) {
        console.error('Failed to submit cancel request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit cancel request',
            error: error.message
        });
    }
});

export default router;
