import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import googleSheetsService from './googleSheetsService.js';
import emailService from './emailService.js';
import smsService from './smsService.js';

import cookieParser from 'cookie-parser';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = config.serverPort;
const CLIENT_PORT = config.clientPort;
const TOSS_SECRET_KEY = config.tossSecretKey;

// CORS 설정 - 여러 클라이언트 URL 허용
const allowedOrigins = [
  `http://localhost:${CLIENT_PORT}`,
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:8083',
  'http://localhost:5173',
  'https://jsha-master.vercel.app', // Vercel 프로덕션 도메인
  'https://www.jshamaster.com',     // 프로덕션 커스텀 도메인
  'https://jshamaster.com'          // 프로덕션 커스텀 도메인 (www 없이)
];

app.use(cors({
  origin: function (origin, callback) {
    // origin이 없는 경우(예: 모바일 앱, Postman) 또는 허용된 origin인 경우
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Admin Routes
app.use('/api/admin', adminRoutes);

// User Routes
app.use('/api/user', userRoutes);

// 서버 상태 확인 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Payment server is running',
    timestamp: new Date().toISOString()
  });
});

// 결제 승인 엔드포인트
app.post('/confirm-payment', async (req, res) => {
  const { paymentKey, orderId, amount, customerName, customerEmail, customerPhone, postalCode, address, addressDetail, cartItems } = req.body;

  // 요청 파라미터 검증
  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters',
      message: 'paymentKey, orderId, amount are required'
    });
  }

  // Secret Key 확인
  if (!TOSS_SECRET_KEY) {
    console.error('TOSS_SECRET_KEY is not set in environment variables');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error',
      message: 'Payment service is not properly configured'
    });
  }

  try {
    console.log('결제 승인 요청:', { orderId, amount });

    // Toss Payments API에 결제 승인 요청
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: parseInt(amount)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('결제 승인 실패:', data);
      return res.status(response.status).json({
        success: false,
        error: data.code || 'PAYMENT_CONFIRMATION_FAILED',
        message: data.message || '결제 승인에 실패했습니다.'
      });
    }

    console.log('결제 승인 성공:', data.orderId);

    // cartItems 파싱
    let parsedCartItems = [];
    if (cartItems) {
      try {
        parsedCartItems = typeof cartItems === 'string' ? JSON.parse(cartItems) : cartItems;
      } catch (parseError) {
        console.warn('⚠️ cartItems 파싱 실패:', parseError.message);
      }
    }

    const customerInfo = {
      customerName,
      customerEmail,
      customerPhone,
      postalCode,
      address,
      addressDetail
    };

    // 구글 시트에 결제 정보 저장
    try {
      await googleSheetsService.savePaymentInfo(data, customerInfo, parsedCartItems);
      console.log('✅ 결제 정보가 구글 시트에 저장되었습니다.');
    } catch (sheetError) {
      // 구글 시트 저장 실패는 로그만 남기고 결제 성공 응답은 반환
      console.error('⚠️ 구글 시트 저장 실패 (결제는 성공):', sheetError.message);
    }

    // 이메일 발송
    try {
      const emailData = {
        customerName,
        customerEmail,
        customerPhone,
        postalCode,
        address,
        addressDetail,
        orderId: data.orderId,
        orderName: data.orderName,
        totalAmount: data.totalAmount,
        cartItems: parsedCartItems,
        approvedAt: data.approvedAt,
      };

      const emailResults = await emailService.sendOrderEmails(emailData);

      if (emailResults.customer.success) {
        console.log('✅ 구매자 이메일 발송 성공');
      } else {
        console.warn('⚠️ 구매자 이메일 발송 실패');
      }

      if (emailResults.admin.success) {
        console.log('✅ 관리자 이메일 발송 성공');
      } else {
        console.warn('⚠️ 관리자 이메일 발송 실패');
      }
    } catch (emailError) {
      // 이메일 발송 실패는 로그만 남기고 결제 성공 응답은 반환
      console.error('⚠️ 이메일 발송 실패 (결제는 성공):', emailError.message);
    }

    // SMS 발송
    try {
      const smsData = {
        customerName,
        customerPhone,
        orderId: data.orderId,
        totalAmount: data.totalAmount,
      };

      const smsResults = await smsService.sendOrderSMS(smsData);

      if (smsResults.customer.success) {
        console.log('✅ 구매자 SMS 발송 성공');
      } else {
        console.warn('⚠️ 구매자 SMS 발송 실패');
      }

      if (smsResults.admin.success) {
        console.log('✅ 관리자 SMS 발송 성공');
      } else {
        console.warn('⚠️ 관리자 SMS 발송 실패');
      }
    } catch (smsError) {
      // SMS 발송 실패는 로그만 남기고 결제 성공 응답은 반환
      console.error('⚠️ SMS 발송 실패 (결제는 성공):', smsError.message);
    }

    // 성공 응답
    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('결제 승인 중 오류:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: '결제 승인 중 서버 오류가 발생했습니다.'
    });
  }
});

// 마스터 코스 신청서 제출 엔드포인트
app.post('/submit-application', async (req, res) => {
  const { name, email, phone, hospital, workType } = req.body;

  // 요청 파라미터 검증
  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters',
      message: 'name, email, phone are required'
    });
  }

  try {
    console.log('신청서 접수:', { name, email, phone, hospital, workType });

    const applicationData = {
      name,
      email,
      phone,
      hospital,
      workType,
    };

    // 구글 시트에 신청 정보 저장
    try {
      await googleSheetsService.saveApplicationInfo(applicationData);
      console.log('✅ 신청 정보가 구글 시트에 저장되었습니다.');
    } catch (sheetError) {
      // 구글 시트 저장 실패는 로그만 남기고 계속 진행
      console.error('⚠️ 구글 시트 저장 실패 (신청은 접수됨):', sheetError.message);
    }

    // 이메일 발송
    try {
      const emailResults = await emailService.sendApplicationEmails(applicationData);

      if (emailResults.applicant.success) {
        console.log('✅ 신청자 이메일 발송 성공');
      } else {
        console.warn('⚠️ 신청자 이메일 발송 실패');
      }

      if (emailResults.admin.success) {
        console.log('✅ 관리자 이메일 발송 성공');
      } else {
        console.warn('⚠️ 관리자 이메일 발송 실패');
      }
    } catch (emailError) {
      console.error('⚠️ 이메일 발송 실패:', emailError.message);
    }

    // SMS 발송
    try {
      const smsResults = await smsService.sendApplicationSMS(applicationData);

      if (smsResults.applicant.success) {
        console.log('✅ 신청자 SMS 발송 성공');
      } else {
        console.warn('⚠️ 신청자 SMS 발송 실패');
      }

      if (smsResults.admin.success) {
        console.log('✅ 관리자 SMS 발송 성공');
      } else {
        console.warn('⚠️ 관리자 SMS 발송 실패');
      }
    } catch (smsError) {
      console.error('⚠️ SMS 발송 실패:', smsError.message);
    }

    // 성공 응답
    res.json({
      success: true,
      message: '신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.'
    });

  } catch (error) {
    console.error('신청서 처리 중 오류:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: '신청 처리 중 서버 오류가 발생했습니다.'
    });
  }
});

// 수료자 이메일 확인 엔드포인트
app.post('/check-graduate', async (req, res) => {
  const { email } = req.body;

  // 요청 파라미터 검증
  if (!email) {
    return res.status(400).json({
      success: false,
      authorized: false,
      error: 'Missing required parameter',
      message: 'email is required'
    });
  }

  try {
    console.log('수료자 확인 요청:', email);

    // 구글 시트에서 수료자 이메일 목록 확인
    const isAuthorized = await googleSheetsService.checkGraduateEmail(email);

    if (isAuthorized) {
      console.log('✅ 승인된 수료자:', email);
      res.json({
        success: true,
        authorized: true,
        message: '승인된 수료자입니다.'
      });
    } else {
      console.log('❌ 승인되지 않은 이메일:', email);
      res.json({
        success: true,
        authorized: false,
        message: '수료자 명단에 없는 이메일입니다.'
      });
    }

  } catch (error) {
    console.error('수료자 확인 중 오류:', error);
    res.status(500).json({
      success: false,
      authorized: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: '수료자 확인 중 서버 오류가 발생했습니다.'
    });
  }
});

// ============================================
// 다시보기 관련 엔드포인트 (더 이상 사용하지 않음 - Firestore로 마이그레이션됨)
// ============================================
/*
// 다시보기 접근 권한 확인 엔드포인트
// 수료자 OR 승인된 등록자만 접근 가능
app.post('/check-recap-access', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      accessGranted: false,
      message: 'email is required'
    });
  }

  try {
    console.log('다시보기 접근 권한 확인:', email);

    // 1. 먼저 수료자 명단 확인 (수료자는 자동 승인)
    const isGraduate = await googleSheetsService.checkGraduateEmail(email);
    if (isGraduate) {
      console.log('✅ 수료자 확인됨:', email);
      return res.json({
        success: true,
        accessGranted: true,
        isGraduate: true,
        status: 'approved',
        message: '수료자로 확인되었습니다.'
      });
    }

    // 2. 등록자 명단 확인
    const registrant = await googleSheetsService.checkRecapRegistrant(email);
    if (registrant.exists) {
      const accessGranted = registrant.status === 'approved';
      console.log(`📋 등록자 확인됨: ${email}, 상태: ${registrant.status}`);
      return res.json({
        success: true,
        accessGranted,
        isGraduate: false,
        status: registrant.status,
        message: accessGranted
          ? '접근이 승인되었습니다.'
          : '관리자 승인 대기 중입니다.'
      });
    }

    // 3. 어디에도 없음
    console.log('❌ 미등록 사용자:', email);
    return res.json({
      success: true,
      accessGranted: false,
      isGraduate: false,
      status: 'not_registered',
      message: '등록되지 않은 사용자입니다.'
    });

  } catch (error) {
    console.error('다시보기 접근 확인 중 오류:', error);
    res.status(500).json({
      success: false,
      accessGranted: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: '접근 권한 확인 중 서버 오류가 발생했습니다.'
    });
  }
});

// 다시보기 등록 신청 엔드포인트
app.post('/register-recap', async (req, res) => {
  const { name, email, batch } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'name and email are required'
    });
  }

  try {
    console.log('다시보기 등록 신청:', { name, email, batch });

    // 이미 등록되어 있는지 확인
    const existing = await googleSheetsService.checkRecapRegistrant(email);
    if (existing.exists) {
      return res.json({
        success: true,
        alreadyRegistered: true,
        status: existing.status,
        message: '이미 등록된 이메일입니다.'
      });
    }

    // 수료자인지 확인 (수료자면 자동 승인)
    const isGraduate = await googleSheetsService.checkGraduateEmail(email);
    const status = isGraduate ? 'approved' : 'pending';

    // 등록자 추가
    await googleSheetsService.addRecapRegistrant({ name, email, batch });

    // 수료자면 상태를 approved로 업데이트
    if (isGraduate) {
      await googleSheetsService.updateRecapRegistrantStatus(email, 'approved');
    }

    console.log(`✅ 다시보기 등록 완료: ${email}, 상태: ${status}`);
    res.json({
      success: true,
      alreadyRegistered: false,
      status,
      isGraduate,
      message: isGraduate
        ? '수료자로 확인되어 바로 이용 가능합니다.'
        : '등록이 완료되었습니다. 관리자 승인 후 이용 가능합니다.'
    });

  } catch (error) {
    console.error('다시보기 등록 중 오류:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: '등록 처리 중 서버 오류가 발생했습니다.'
    });
  }
});
*/
// ============================================

// Master Care 신청 엔드포인트
app.post('/submit-mastercare', async (req, res) => {
  const {
    name,
    email,
    phone,
    hospital,
    hospitalAddress,
    masterCourseCompleted,
    packageType,
    consultingAreas,
    preferredStartDate,
    additionalNotes
  } = req.body;

  // 요청 파라미터 검증
  if (!name || !email || !phone || !hospital || !packageType) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters',
      message: 'name, email, phone, hospital, packageType are required'
    });
  }

  try {
    console.log('Master Care 신청 접수:', { name, email, phone, hospital, packageType });

    const mastercareData = {
      name,
      email,
      phone,
      hospital,
      hospitalAddress,
      masterCourseCompleted,
      packageType,
      consultingAreas: Array.isArray(consultingAreas) ? consultingAreas.join(', ') : consultingAreas,
      preferredStartDate,
      additionalNotes,
      timestamp: new Date().toISOString()
    };

    // 구글 시트에 Master Care 신청 정보 저장
    try {
      await googleSheetsService.saveMasterCareInfo(mastercareData);
      console.log('✅ Master Care 신청 정보가 구글 시트에 저장되었습니다.');
    } catch (sheetError) {
      // 구글 시트 저장 실패는 로그만 남기고 계속 진행
      console.error('⚠️ 구글 시트 저장 실패 (신청은 접수됨):', sheetError.message);
    }

    // 이메일 발송
    try {
      const emailResults = await emailService.sendMasterCareEmails(mastercareData);

      if (emailResults.applicant.success) {
        console.log('✅ Master Care 신청자 이메일 발송 성공');
      } else {
        console.warn('⚠️ Master Care 신청자 이메일 발송 실패');
      }

      if (emailResults.admin.success) {
        console.log('✅ Master Care 관리자 이메일 발송 성공');
      } else {
        console.warn('⚠️ Master Care 관리자 이메일 발송 실패');
      }
    } catch (emailError) {
      console.error('⚠️ Master Care 이메일 발송 실패:', emailError.message);
    }

    // SMS 발송
    try {
      const smsResults = await smsService.sendMasterCareSMS(mastercareData);

      if (smsResults.applicant.success) {
        console.log('✅ Master Care 신청자 SMS 발송 성공');
      } else {
        console.warn('⚠️ Master Care 신청자 SMS 발송 실패');
      }

      if (smsResults.admin.success) {
        console.log('✅ Master Care 관리자 SMS 발송 성공');
      } else {
        console.warn('⚠️ Master Care 관리자 SMS 발송 실패');
      }
    } catch (smsError) {
      console.error('⚠️ Master Care SMS 발송 실패:', smsError.message);
    }

    // 성공 응답
    res.json({
      success: true,
      message: 'Master Care 신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.'
    });

  } catch (error) {
    console.error('Master Care 신청 처리 중 오류:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Master Care 신청 처리 중 서버 오류가 발생했습니다.'
    });
  }
});

// 회원가입 알림 엔드포인트
app.post('/notify-signup', async (req, res) => {
  const { email, clinicName, directorName, location, status } = req.body;

  // 요청 파라미터 검증
  if (!email || !clinicName || !directorName) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters',
      message: 'email, clinicName, directorName are required'
    });
  }

  try {
    console.log('회원가입 알림 요청:', { email, clinicName, directorName, status });

    const userData = {
      email,
      clinicName,
      directorName,
      location: location || '기타',
      status: status || 'pending'
    };

    // 이메일 발송
    const emailResult = await emailService.sendSignupNotificationToAdmin(userData);
    if (emailResult.success) {
      console.log('✅ 관리자에게 가입 알림 이메일 발송 성공');
    } else {
      console.warn('⚠️ 관리자에게 가입 알림 이메일 발송 실패:', emailResult.error);
    }

    // SMS 발송
    const smsResult = await smsService.sendSignupNotificationSMS(userData);
    if (smsResult.success) {
      console.log('✅ 관리자에게 가입 알림 SMS 발송 성공');
    } else {
      console.warn('⚠️ 관리자에게 가입 알림 SMS 발송 실패:', smsResult.error);
    }

    res.json({
      success: true,
      message: 'Notification sent successfully'
    });

  } catch (error) {
    console.error('회원가입 알림 처리 중 오류:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to process signup notification'
    });
  }
});

// 다시보기 회원가입 알림 엔드포인트
app.post('/notify-recap-signup', async (req, res) => {
  const { email, name, batch, status } = req.body;

  // 요청 파라미터 검증
  if (!email || !name) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters',
      message: 'email, name are required'
    });
  }

  try {
    console.log('다시보기 회원가입 알림 요청:', { email, name, batch, status });

    const userData = {
      email,
      name,
      batch: batch || '',
      status: status || 'pending'
    };

    // 이메일 발송 (가입자 환영 + 관리자 알림)
    const emailResults = await emailService.sendRecapSignupEmails(userData);

    if (emailResults.user.success) {
      console.log('✅ 가입자에게 환영 이메일 발송 성공');
    } else {
      console.warn('⚠️ 가입자에게 환영 이메일 발송 실패:', emailResults.user.error);
    }

    if (emailResults.admin.success) {
      console.log('✅ 관리자에게 가입 알림 이메일 발송 성공');
    } else {
      console.warn('⚠️ 관리자에게 가입 알림 이메일 발송 실패:', emailResults.admin.error);
    }

    res.json({
      success: true,
      message: 'Recap signup notification sent successfully',
      results: emailResults
    });

  } catch (error) {
    console.error('다시보기 회원가입 알림 처리 중 오류:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to process recap signup notification'
    });
  }
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'The requested endpoint does not exist'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
});

app.listen(PORT, async () => {
  console.log('='.repeat(50));
  console.log(`🚀 Payment Server is running`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Allowed Origins:`);
  allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
  console.log(`🔑 Secret Key: ${TOSS_SECRET_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log('='.repeat(50));

  // 구글 시트 초기화 (헤더는 수동으로 추가)
  try {
    await googleSheetsService.initialize();
    console.log('📊 Google Sheets ready');
    console.log('   Payment sheet: "인솔결제정보"');
    console.log('   Application sheet: "마스터코스신청자"');
    console.log('   Master Care sheet: "Master_care"');
    console.log('   Graduate sheet: "수료자명단"');
  } catch (error) {
    console.error('⚠️  Google Sheets initialization failed:', error.message);
    console.error('   Payment will work but data won\'t be saved to sheets');
  }

  // 이메일 서비스 초기화
  try {
    await emailService.initialize();
    console.log('📧 Email service ready');
    console.log(`   Customer emails: ${config.emailUser ? '✓' : '✗'}`);
    console.log(`   Admin email: ${config.adminEmail || 'Not configured'}`);
  } catch (error) {
    console.error('⚠️  Email service initialization failed:', error.message);
    console.error('   Payment will work but emails won\'t be sent');
  }

  // SMS 서비스 초기화
  try {
    await smsService.initialize();
    if (config.solapiApiKey && config.solapiApiSecret) {
      console.log('📱 SMS service ready');
      console.log(`   From number: ${config.solapiFromNumber || 'Not configured'}`);
      console.log(`   Admin phone: ${config.adminPhone || 'Not configured'}`);
    } else {
      console.log('⚠️  SMS service not configured (will be skipped)');
    }
  } catch (error) {
    console.error('⚠️  SMS service initialization failed:', error.message);
    console.error('   Payment will work but SMS won\'t be sent');
  }
});
