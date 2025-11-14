import { Resend } from 'resend';
import { config } from './config.js';

class EmailService {
  constructor() {
    this.resend = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      if (!config.resendApiKey) {
        throw new Error('RESEND_API_KEY not configured. Please set it in .env file or Render environment variables.');
      }

      console.log('📧 Initializing email service with Resend...');
      this.resend = new Resend(config.resendApiKey);
      this.initialized = true;
      console.log('✅ Email service initialized successfully (Resend)');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error.message);
      console.error('💡 Tip: Get your API key from https://resend.com/api-keys');
      throw error;
    }
  }

  /**
   * 주문 상품 목록을 HTML 테이블로 변환
   */
  createCartItemsTable(cartItems) {
    if (!cartItems || cartItems.length === 0) {
      return '<p>주문 상품 정보가 없습니다.</p>';
    }

    let tableRows = '';
    let totalAmount = 0;

    cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;

      tableRows += `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${index + 1}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.size}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.type}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toLocaleString()}원</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">${itemTotal.toLocaleString()}원</td>
        </tr>
      `;
    });

    return `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; border-bottom: 2px solid #d1d5db; text-align: left;">번호</th>
            <th style="padding: 12px; border-bottom: 2px solid #d1d5db; text-align: left;">상품명</th>
            <th style="padding: 12px; border-bottom: 2px solid #d1d5db; text-align: left;">사이즈</th>
            <th style="padding: 12px; border-bottom: 2px solid #d1d5db; text-align: left;">타입</th>
            <th style="padding: 12px; border-bottom: 2px solid #d1d5db; text-align: center;">수량</th>
            <th style="padding: 12px; border-bottom: 2px solid #d1d5db; text-align: right;">단가</th>
            <th style="padding: 12px; border-bottom: 2px solid #d1d5db; text-align: right;">금액</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          <tr style="background-color: #f9fafb;">
            <td colspan="6" style="padding: 12px; text-align: right; font-weight: bold;">총 결제 금액</td>
            <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 1.2em; color: #2563eb;">${totalAmount.toLocaleString()}원</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  /**
   * 구매자에게 주문 확인 이메일 발송
   */
  async sendOrderConfirmationToCustomer(orderData) {
    if (!this.initialized) {
      await this.initialize();
    }

    const { customerEmail, customerName, orderId, orderName, totalAmount, cartItems, approvedAt, postalCode, address, addressDetail } = orderData;

    const cartItemsTable = this.createCartItemsTable(cartItems);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">주문이 완료되었습니다</h1>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            안녕하세요, <strong>${customerName}</strong>님!<br>
            JSHA에서 주문해 주셔서 감사합니다.
          </p>

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1f2937; font-size: 20px;">주문 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">주문번호</td>
                <td style="padding: 8px 0; text-align: right; font-family: monospace; font-weight: bold;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">주문일시</td>
                <td style="padding: 8px 0; text-align: right;">${new Date(approvedAt).toLocaleString('ko-KR')}</td>
              </tr>
            </table>
          </div>

          <h2 style="color: #1f2937; font-size: 20px; margin-top: 30px;">배송 주소</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; line-height: 1.8;">
              <strong>우편번호:</strong> ${postalCode || ''}<br>
              <strong>주소:</strong> ${address || ''}<br>
              <strong>상세주소:</strong> ${addressDetail || ''}
            </p>
          </div>

          <h2 style="color: #1f2937; font-size: 20px; margin-top: 30px;">주문 상품</h2>
          ${cartItemsTable}

          <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
            <p style="margin: 0; color: #1e40af;">
              <strong>안내사항</strong><br>
              • 주문하신 상품은 영업일 기준 2-3일 이내에 배송됩니다.<br>
              • 배송 관련 문의사항이 있으시면 언제든지 연락 주시기 바랍니다.
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>이 이메일은 발신 전용입니다. 문의사항은 고객센터로 연락 주시기 바랍니다.</p>
            <p style="margin: 10px 0;">© 2024 JSHA Academy. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await this.resend.emails.send({
        from: `JSHA Academy <${config.resendFromEmail}>`,
        to: [customerEmail],
        subject: `[JSHA] 주문이 완료되었습니다 (주문번호: ${orderId})`,
        html: htmlContent,
      });

      if (error) {
        throw error;
      }

      console.log('✅ Order confirmation email sent to customer:', customerEmail);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('❌ Failed to send email to customer:', error);
      throw error;
    }
  }

  /**
   * 관리자에게 새 주문 알림 이메일 발송
   */
  async sendOrderNotificationToAdmin(orderData) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!config.adminEmail) {
      console.warn('⚠️ Admin email not configured, skipping admin notification');
      return { success: false, message: 'Admin email not configured' };
    }

    const { customerEmail, customerName, customerPhone, orderId, orderName, totalAmount, cartItems, approvedAt, postalCode, address, addressDetail } = orderData;

    const cartItemsTable = this.createCartItemsTable(cartItems);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔔 새로운 주문이 접수되었습니다</h1>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h2 style="margin-top: 0; color: #92400e; font-size: 20px;">주문 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">주문번호</td>
                <td style="padding: 8px 0; text-align: right; font-family: monospace;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">주문일시</td>
                <td style="padding: 8px 0; text-align: right;">${new Date(approvedAt).toLocaleString('ko-KR')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">총 결제 금액</td>
                <td style="padding: 8px 0; text-align: right; font-size: 1.2em; font-weight: bold; color: #dc2626;">${totalAmount.toLocaleString()}원</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1f2937; font-size: 20px;">구매자 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #0c4a6e; font-weight: bold;">이름</td>
                <td style="padding: 8px 0; text-align: right;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #0c4a6e; font-weight: bold;">이메일</td>
                <td style="padding: 8px 0; text-align: right;">${customerEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #0c4a6e; font-weight: bold;">전화번호</td>
                <td style="padding: 8px 0; text-align: right;">${customerPhone}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #92400e; font-size: 20px;">배송 주소</h2>
            <p style="margin: 0; line-height: 1.8; color: #78350f;">
              <strong>우편번호:</strong> ${postalCode || ''}<br>
              <strong>주소:</strong> ${address || ''}<br>
              <strong>상세주소:</strong> ${addressDetail || ''}
            </p>
          </div>

          <h2 style="color: #1f2937; font-size: 20px; margin-top: 30px;">주문 상품</h2>
          ${cartItemsTable}

          <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>이 이메일은 자동으로 발송되었습니다.</p>
            <p style="margin: 10px 0;">© 2024 JSHA Academy. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await this.resend.emails.send({
        from: `JSHA 주문 시스템 <${config.resendFromEmail}>`,
        to: [config.adminEmail],
        subject: `[JSHA 관리자] 새 주문 접수 - ${customerName} (${orderId})`,
        html: htmlContent,
      });

      if (error) {
        throw error;
      }

      console.log('✅ Order notification email sent to admin:', config.adminEmail);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('❌ Failed to send email to admin:', error);
      throw error;
    }
  }

  /**
   * 주문 확인 이메일 일괄 발송 (구매자 + 관리자)
   */
  async sendOrderEmails(orderData) {
    const results = {
      customer: { success: false },
      admin: { success: false },
    };

    try {
      // 구매자에게 이메일 발송
      results.customer = await this.sendOrderConfirmationToCustomer(orderData);
    } catch (error) {
      console.error('Failed to send customer email:', error);
      results.customer = { success: false, error: error.message };
    }

    try {
      // 관리자에게 이메일 발송
      results.admin = await this.sendOrderNotificationToAdmin(orderData);
    } catch (error) {
      console.error('Failed to send admin email:', error);
      results.admin = { success: false, error: error.message };
    }

    return results;
  }

  /**
   * 신청자에게 마스터 코스 신청 확인 이메일 발송
   */
  async sendApplicationConfirmationToApplicant(applicationData) {
    if (!this.initialized) {
      await this.initialize();
    }

    const { name, email, phone } = applicationData;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">신청이 접수되었습니다</h1>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            안녕하세요, <strong>${name}</strong>님!<br>
            JSHA 마스터 코스에 관심을 가져주셔서 감사합니다.
          </p>

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1f2937; font-size: 20px;">신청 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">이름</td>
                <td style="padding: 8px 0; text-align: right;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">이메일</td>
                <td style="padding: 8px 0; text-align: right;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">전화번호</td>
                <td style="padding: 8px 0; text-align: right;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">신청일시</td>
                <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleString('ko-KR')}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">다음 단계</h3>
            <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
              <li style="margin-bottom: 8px;">담당자가 3-5일 이내에 연락드립니다.</li>
              <li style="margin-bottom: 8px;">상세한 커리큘럼 및 일정을 안내해드립니다.</li>
              <li style="margin-bottom: 8px;">궁금한 점이 있으시면 언제든 문의해주세요.</li>
            </ol>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e; font-size: 18px;">📚 JSHA 마스터 코스</h3>
            <p style="margin: 0; color: #78350f;">
              <strong>교육 기간:</strong> 2026년 2월 개강<br>
              <strong>교육 시간:</strong> 1박 2일 × 4회 (총 40시간)<br>
              <strong>수강료:</strong><br>
              • 모듈 1: 197만원 (워크숍 참석자 50% 할인)<br>
              • 전회차 등록: 1,100만원 (워크숍 참석자 50% 할인)
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>이 이메일은 발신 전용입니다. 문의사항은 아래 연락처로 연락 주시기 바랍니다.</p>
            <p style="margin: 10px 0;">
              📧 contact@jsha.kr | 📞 010-4002-1094
            </p>
            <p style="margin: 10px 0;">© 2024 JSHA Academy. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await this.resend.emails.send({
        from: `JSHA Academy <${config.resendFromEmail}>`,
        to: [email],
        subject: `[JSHA 마스터 코스] 신청이 접수되었습니다 - ${name}님`,
        html: htmlContent,
      });

      if (error) {
        throw error;
      }

      console.log('✅ Application confirmation email sent to applicant:', email);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('❌ Failed to send email to applicant:', error);
      throw error;
    }
  }

  /**
   * 관리자에게 새 마스터 코스 신청 알림 이메일 발송
   */
  async sendApplicationNotificationToAdmin(applicationData) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!config.adminEmail) {
      console.warn('⚠️ Admin email not configured, skipping admin notification');
      return { success: false, message: 'Admin email not configured' };
    }

    const { name, email, phone } = applicationData;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔔 새로운 마스터 코스 신청</h1>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h2 style="margin-top: 0; color: #92400e; font-size: 20px;">신청자 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">이름</td>
                <td style="padding: 8px 0; text-align: right;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">이메일</td>
                <td style="padding: 8px 0; text-align: right;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">전화번호</td>
                <td style="padding: 8px 0; text-align: right;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">신청일시</td>
                <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleString('ko-KR')}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534; font-size: 18px;">다음 액션</h3>
            <ul style="margin: 0; padding-left: 20px; color: #166534;">
              <li style="margin-bottom: 8px;">신청자에게 3-5일 이내 연락 필요</li>
              <li style="margin-bottom: 8px;">상세 커리큘럼 및 일정 안내</li>
              <li style="margin-bottom: 8px;">추가 문의사항 확인 및 응대</li>
            </ul>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>이 이메일은 자동으로 발송되었습니다.</p>
            <p style="margin: 10px 0;">© 2024 JSHA Academy. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await this.resend.emails.send({
        from: `JSHA 신청 시스템 <${config.resendFromEmail}>`,
        to: [config.adminEmail],
        subject: `[JSHA 관리자] 새 마스터 코스 신청 - ${name}`,
        html: htmlContent,
      });

      if (error) {
        throw error;
      }

      console.log('✅ Application notification email sent to admin:', config.adminEmail);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('❌ Failed to send email to admin:', error);
      throw error;
    }
  }

  /**
   * 마스터 코스 신청 이메일 일괄 발송 (신청자 + 관리자)
   */
  async sendApplicationEmails(applicationData) {
    const results = {
      applicant: { success: false },
      admin: { success: false },
    };

    try {
      // 신청자에게 이메일 발송
      results.applicant = await this.sendApplicationConfirmationToApplicant(applicationData);
    } catch (error) {
      console.error('Failed to send applicant email:', error);
      results.applicant = { success: false, error: error.message };
    }

    try {
      // 관리자에게 이메일 발송
      results.admin = await this.sendApplicationNotificationToAdmin(applicationData);
    } catch (error) {
      console.error('Failed to send admin email:', error);
      results.admin = { success: false, error: error.message };
    }

    return results;
  }

  /**
   * Master Care 신청자에게 확인 이메일 발송
   */
  async sendMasterCareConfirmationToApplicant(mastercareData) {
    if (!this.initialized) {
      await this.initialize();
    }

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
    } = mastercareData;

    const packageNames = {
      basic: 'Basic Package (150만원)',
      standard: 'Standard Package (400만원)',
      premium: 'Premium Package (700만원)'
    };

    const startDateNames = {
      immediately: '즉시 시작',
      '1-month': '1개월 이내',
      '2-3-months': '2-3개월 이내',
      flexible: '유연하게 조율 가능'
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Master Care 신청이 접수되었습니다</h1>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            안녕하세요, <strong>${name}</strong>님!<br>
            JSHA Master Care에 신청해 주셔서 감사합니다.
          </p>

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1f2937; font-size: 20px;">신청 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">신청자</td>
                <td style="padding: 8px 0; text-align: right;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">병원명</td>
                <td style="padding: 8px 0; text-align: right;">${hospital}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">수료 기수</td>
                <td style="padding: 8px 0; text-align: right;">${masterCourseCompleted || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">선택 패키지</td>
                <td style="padding: 8px 0; text-align: right; color: #2563eb; font-weight: bold;">${packageNames[packageType]}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">희망 시작 시기</td>
                <td style="padding: 8px 0; text-align: right;">${startDateNames[preferredStartDate] || preferredStartDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">신청일시</td>
                <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleString('ko-KR')}</td>
              </tr>
            </table>
          </div>

          ${consultingAreas ? `
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">컨설팅 희망 분야</h3>
            <p style="margin: 0; color: #1e40af;">${consultingAreas}</p>
          </div>
          ` : ''}

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">다음 단계</h3>
            <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
              <li style="margin-bottom: 8px;">담당자가 1-2일 이내에 초기 상담을 위해 연락드립니다.</li>
              <li style="margin-bottom: 8px;">30분 전화/화상 미팅을 통해 귀하의 병원 상황을 파악합니다.</li>
              <li style="margin-bottom: 8px;">맞춤형 컨설팅 플랜을 제안해드립니다.</li>
              <li style="margin-bottom: 8px;">일정 조율 후 서비스를 시작합니다.</li>
            </ol>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e; font-size: 18px;">💼 Master Care 패키지 안내</h3>
            <p style="margin: 0; color: #78350f;">
              <strong>Basic:</strong> 1회 방문 (150만원)<br>
              <strong>Standard:</strong> 3회 방문 (400만원)<br>
              <strong>Premium:</strong> 6회 방문 (700만원) + VIP 혜택<br><br>
              <strong>서비스 내용:</strong><br>
              • 현장 진료 참관 및 피드백<br>
              • 어려운 케이스 직접 시연<br>
              • 병원 시스템 점검 및 개선<br>
              • 직원 교육 및 표준화<br>
              • 온라인 Q&A 지원
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>궁금한 점이 있으시면 언제든 연락 주시기 바랍니다.</p>
            <p style="margin: 10px 0;">
              📧 jshaworkshop@gmail.com | 📞 010-4002-1094
            </p>
            <p style="margin: 10px 0;">© 2024 JSHA Academy. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await this.resend.emails.send({
        from: `JSHA Master Care <${config.resendFromEmail}>`,
        to: [email],
        subject: `[JSHA Master Care] 신청이 접수되었습니다 - ${name}님`,
        html: htmlContent,
      });

      if (error) {
        throw error;
      }

      console.log('✅ Master Care confirmation email sent to applicant:', email);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('❌ Failed to send Master Care email to applicant:', error);
      throw error;
    }
  }

  /**
   * 관리자에게 새 Master Care 신청 알림 이메일 발송
   */
  async sendMasterCareNotificationToAdmin(mastercareData) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!config.adminEmail) {
      console.warn('⚠️ Admin email not configured. Skipping admin notification.');
      return { success: false, error: 'Admin email not configured' };
    }

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
    } = mastercareData;

    const packageNames = {
      basic: 'Basic Package (150만원)',
      standard: 'Standard Package (400만원)',
      premium: 'Premium Package (700만원)'
    };

    const startDateNames = {
      immediately: '즉시 시작',
      '1-month': '1개월 이내',
      '2-3-months': '2-3개월 이내',
      flexible: '유연하게 조율 가능'
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔔 새로운 Master Care 신청</h1>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            새로운 Master Care 신청이 접수되었습니다.
          </p>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h2 style="margin-top: 0; color: #92400e; font-size: 20px;">📋 신청자 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">이름</td>
                <td style="padding: 8px 0; text-align: right;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">이메일</td>
                <td style="padding: 8px 0; text-align: right;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">전화번호</td>
                <td style="padding: 8px 0; text-align: right;"><a href="tel:${phone}">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">병원명</td>
                <td style="padding: 8px 0; text-align: right;">${hospital}</td>
              </tr>
              ${hospitalAddress ? `
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">병원 주소</td>
                <td style="padding: 8px 0; text-align: right;">${hospitalAddress}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">수료 기수</td>
                <td style="padding: 8px 0; text-align: right;">${masterCourseCompleted || '-'}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h2 style="margin-top: 0; color: #1e40af; font-size: 20px;">💼 패키지 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #1e40af; font-weight: bold;">선택 패키지</td>
                <td style="padding: 8px 0; text-align: right; font-size: 18px; font-weight: bold; color: #2563eb;">${packageNames[packageType]}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #1e40af; font-weight: bold;">희망 시작 시기</td>
                <td style="padding: 8px 0; text-align: right;">${startDateNames[preferredStartDate] || preferredStartDate}</td>
              </tr>
            </table>
          </div>

          ${consultingAreas ? `
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937; font-size: 18px;">컨설팅 희망 분야</h3>
            <p style="margin: 0; color: #4b5563;">${consultingAreas}</p>
          </div>
          ` : ''}

          ${additionalNotes ? `
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937; font-size: 18px;">추가 문의사항</h3>
            <p style="margin: 0; color: #4b5563; white-space: pre-wrap;">${additionalNotes}</p>
          </div>
          ` : ''}

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937; font-size: 18px;">⏰ 신청 시각</h3>
            <p style="margin: 0; font-size: 16px; color: #4b5563;">${new Date().toLocaleString('ko-KR')}</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #92400e; font-weight: bold; font-size: 16px;">
              ⚡ 1-2일 이내에 신청자에게 연락 주세요!
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await this.resend.emails.send({
        from: `JSHA Master Care <${config.resendFromEmail}>`,
        to: [config.adminEmail],
        subject: `[JSHA Master Care] 새로운 신청 - ${name} (${packageNames[packageType]})`,
        html: htmlContent,
      });

      if (error) {
        throw error;
      }

      console.log('✅ Master Care notification email sent to admin:', config.adminEmail);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('❌ Failed to send Master Care email to admin:', error);
      throw error;
    }
  }

  /**
   * Master Care 신청 이메일 발송 (신청자 + 관리자)
   */
  async sendMasterCareEmails(mastercareData) {
    const results = {
      applicant: { success: false },
      admin: { success: false },
    };

    try {
      // 신청자에게 이메일 발송
      results.applicant = await this.sendMasterCareConfirmationToApplicant(mastercareData);
    } catch (error) {
      console.error('Failed to send Master Care applicant email:', error);
      results.applicant = { success: false, error: error.message };
    }

    try {
      // 관리자에게 이메일 발송
      results.admin = await this.sendMasterCareNotificationToAdmin(mastercareData);
    } catch (error) {
      console.error('Failed to send Master Care admin email:', error);
      results.admin = { success: false, error: error.message };
    }

    return results;
  }
}

// 싱글톤 인스턴스
const emailService = new EmailService();

export default emailService;
