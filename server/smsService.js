import { SolapiMessageService } from 'solapi';
import { config } from './config.js';

class SMSService {
  constructor() {
    this.messageService = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      if (!config.solapiApiKey || !config.solapiApiSecret) {
        console.warn('⚠️ SOLAPI credentials not configured, SMS service will be disabled');
        return;
      }

      this.messageService = new SolapiMessageService(
        config.solapiApiKey,
        config.solapiApiSecret
      );

      this.initialized = true;
      console.log('✅ SMS service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize SMS service:', error.message);
      throw error;
    }
  }

  /**
   * 전화번호를 국제 형식으로 변환 (010-1234-5678 -> +821012345678)
   */
  formatPhoneNumber(phone) {
    if (!phone) return null;

    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, '');

    // 010으로 시작하는 경우 +82로 변환
    if (numbers.startsWith('010')) {
      return '+82' + numbers.substring(1);
    }

    // 이미 +82로 시작하는 경우
    if (numbers.startsWith('82')) {
      return '+' + numbers;
    }

    return '+82' + numbers;
  }

  /**
   * 주문 완료 SMS 발송 (구매자에게)
   */
  async sendOrderConfirmationSMS(orderData) {
    if (!this.initialized || !this.messageService) {
      console.warn('⚠️ SMS service not initialized, skipping SMS');
      return { success: false, message: 'SMS service not initialized' };
    }

    try {
      const { customerName, customerPhone, orderId, totalAmount } = orderData;

      if (!customerPhone) {
        console.warn('⚠️ Customer phone number not provided');
        return { success: false, message: 'Phone number not provided' };
      }

      const to = this.formatPhoneNumber(customerPhone);
      const from = config.solapiFromNumber;

      const message = `[JSHA] ${customerName}님, 주문이 완료되었습니다.\n\n주문번호: ${orderId}\n결제금액: ${totalAmount.toLocaleString()}원\n\n배송은 영업일 기준 2-3일 소요됩니다.\n감사합니다.`;

      const response = await this.messageService.send({
        to,
        from,
        text: message,
      });

      console.log('✅ Order confirmation SMS sent to customer:', customerPhone);
      return { success: true, messageId: response.messageId };
    } catch (error) {
      console.error('❌ Failed to send order confirmation SMS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 주문 알림 SMS 발송 (관리자에게)
   */
  async sendOrderNotificationSMS(orderData) {
    if (!this.initialized || !this.messageService) {
      console.warn('⚠️ SMS service not initialized, skipping SMS');
      return { success: false, message: 'SMS service not initialized' };
    }

    try {
      if (!config.adminPhone) {
        console.warn('⚠️ Admin phone number not configured');
        return { success: false, message: 'Admin phone not configured' };
      }

      const { customerName, orderId, totalAmount } = orderData;

      const to = this.formatPhoneNumber(config.adminPhone);
      const from = config.solapiFromNumber;

      const message = `[JSHA 관리자] 새 주문이 접수되었습니다.\n\n주문번호: ${orderId}\n구매자: ${customerName}\n결제금액: ${totalAmount.toLocaleString()}원`;

      const response = await this.messageService.send({
        to,
        from,
        text: message,
      });

      console.log('✅ Order notification SMS sent to admin');
      return { success: true, messageId: response.messageId };
    } catch (error) {
      console.error('❌ Failed to send order notification SMS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 주문 관련 SMS 일괄 발송 (구매자 + 관리자)
   */
  async sendOrderSMS(orderData) {
    const results = {
      customer: { success: false },
      admin: { success: false },
    };

    try {
      results.customer = await this.sendOrderConfirmationSMS(orderData);
    } catch (error) {
      console.error('Failed to send customer SMS:', error);
      results.customer = { success: false, error: error.message };
    }

    try {
      results.admin = await this.sendOrderNotificationSMS(orderData);
    } catch (error) {
      console.error('Failed to send admin SMS:', error);
      results.admin = { success: false, error: error.message };
    }

    return results;
  }

  /**
   * 마스터 코스 신청 확인 SMS 발송 (신청자에게)
   */
  async sendApplicationConfirmationSMS(applicationData) {
    if (!this.initialized || !this.messageService) {
      console.warn('⚠️ SMS service not initialized, skipping SMS');
      return { success: false, message: 'SMS service not initialized' };
    }

    try {
      const { name, phone } = applicationData;

      if (!phone) {
        console.warn('⚠️ Applicant phone number not provided');
        return { success: false, message: 'Phone number not provided' };
      }

      const to = this.formatPhoneNumber(phone);
      const from = config.solapiFromNumber;

      const message = `[JSHA 마스터 코스] ${name}님, 신청이 접수되었습니다.\n\n담당자가 3-5일 이내에 연락드리겠습니다.\n\n문의: 010-4002-1094`;

      const response = await this.messageService.send({
        to,
        from,
        text: message,
      });

      console.log('✅ Application confirmation SMS sent to applicant:', phone);
      return { success: true, messageId: response.messageId };
    } catch (error) {
      console.error('❌ Failed to send application confirmation SMS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 마스터 코스 신청 알림 SMS 발송 (관리자에게)
   */
  async sendApplicationNotificationSMS(applicationData) {
    if (!this.initialized || !this.messageService) {
      console.warn('⚠️ SMS service not initialized, skipping SMS');
      return { success: false, message: 'SMS service not initialized' };
    }

    try {
      if (!config.adminPhone) {
        console.warn('⚠️ Admin phone number not configured');
        return { success: false, message: 'Admin phone not configured' };
      }

      const { name, phone, email } = applicationData;

      const to = this.formatPhoneNumber(config.adminPhone);
      const from = config.solapiFromNumber;

      const message = `[JSHA 관리자] 새 마스터 코스 신청\n\n이름: ${name}\n전화: ${phone}\n이메일: ${email}`;

      const response = await this.messageService.send({
        to,
        from,
        text: message,
      });

      console.log('✅ Application notification SMS sent to admin');
      return { success: true, messageId: response.messageId };
    } catch (error) {
      console.error('❌ Failed to send application notification SMS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 마스터 코스 신청 관련 SMS 일괄 발송 (신청자 + 관리자)
   */
  async sendApplicationSMS(applicationData) {
    const results = {
      applicant: { success: false },
      admin: { success: false },
    };

    try {
      results.applicant = await this.sendApplicationConfirmationSMS(applicationData);
    } catch (error) {
      console.error('Failed to send applicant SMS:', error);
      results.applicant = { success: false, error: error.message };
    }

    try {
      results.admin = await this.sendApplicationNotificationSMS(applicationData);
    } catch (error) {
      console.error('Failed to send admin SMS:', error);
      results.admin = { success: false, error: error.message };
    }

    return results;
  }

  /**
   * Master Care 신청 확인 SMS 발송 (신청자에게)
   */
  async sendMasterCareConfirmationSMS(mastercareData) {
    if (!this.initialized || !this.messageService) {
      console.warn('⚠️ SMS service not initialized, skipping SMS');
      return { success: false, message: 'SMS service not initialized' };
    }

    try {
      const { name, phone, packageType } = mastercareData;

      if (!phone) {
        console.warn('⚠️ Applicant phone number not provided');
        return { success: false, message: 'Phone number not provided' };
      }

      const packageNames = {
        basic: 'Basic',
        standard: 'Standard',
        premium: 'Premium'
      };

      const to = this.formatPhoneNumber(phone);
      const from = config.solapiFromNumber;

      const message = `[JSHA Master Care] ${name}님, ${packageNames[packageType]} 패키지 신청이 접수되었습니다.\n\n담당자가 1-2일 이내에 초기 상담을 위해 연락드리겠습니다.\n\n문의: 010-4002-1094`;

      const response = await this.messageService.send({
        to,
        from,
        text: message,
      });

      console.log('✅ Master Care confirmation SMS sent to applicant:', phone);
      return { success: true, messageId: response.messageId };
    } catch (error) {
      console.error('❌ Failed to send Master Care confirmation SMS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Master Care 신청 알림 SMS 발송 (관리자에게)
   */
  async sendMasterCareNotificationSMS(mastercareData) {
    if (!this.initialized || !this.messageService) {
      console.warn('⚠️ SMS service not initialized, skipping SMS');
      return { success: false, message: 'SMS service not initialized' };
    }

    try {
      if (!config.adminPhone) {
        console.warn('⚠️ Admin phone number not configured');
        return { success: false, message: 'Admin phone not configured' };
      }

      const { name, phone, email, hospital, packageType } = mastercareData;

      const packageNames = {
        basic: 'Basic (150만원)',
        standard: 'Standard (400만원)',
        premium: 'Premium (700만원)'
      };

      const to = this.formatPhoneNumber(config.adminPhone);
      const from = config.solapiFromNumber;

      const message = `[JSHA Master Care] 새 신청\n\n이름: ${name}\n병원: ${hospital}\n패키지: ${packageNames[packageType]}\n전화: ${phone}\n이메일: ${email}`;

      const response = await this.messageService.send({
        to,
        from,
        text: message,
      });

      console.log('✅ Master Care notification SMS sent to admin');
      return { success: true, messageId: response.messageId };
    } catch (error) {
      console.error('❌ Failed to send Master Care notification SMS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Master Care 신청 관련 SMS 일괄 발송 (신청자 + 관리자)
   */
  async sendMasterCareSMS(mastercareData) {
    const results = {
      applicant: { success: false },
      admin: { success: false },
    };

    try {
      results.applicant = await this.sendMasterCareConfirmationSMS(mastercareData);
    } catch (error) {
      console.error('Failed to send Master Care applicant SMS:', error);
      results.applicant = { success: false, error: error.message };
    }

    try {
      results.admin = await this.sendMasterCareNotificationSMS(mastercareData);
    } catch (error) {
      console.error('Failed to send Master Care admin SMS:', error);
      results.admin = { success: false, error: error.message };
    }

    return results;
  }
}

// 싱글톤 인스턴스
const smsService = new SMSService();

export default smsService;
