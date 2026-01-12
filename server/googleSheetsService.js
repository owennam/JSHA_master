import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.spreadsheetId = config.googleSheetsId;
    this.sheetName = config.googleSheetName;
    this.initialized = false;
  }

  /**
   * 전화번호를 하이픈 포함 형식으로 변환 (010-1234-5678)
   * @param {string} phone - 전화번호 (숫자만 또는 하이픈 포함)
   * @returns {string} 하이픈 포함 전화번호
   */
  formatPhoneWithHyphens(phone) {
    if (!phone) return '';

    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, '');

    // 010-1234-5678 형식으로 변환
    if (numbers.length === 11) {
      return `${numbers.substring(0, 3)}-${numbers.substring(3, 7)}-${numbers.substring(7, 11)}`;
    } else if (numbers.length === 10) {
      return `${numbers.substring(0, 3)}-${numbers.substring(3, 6)}-${numbers.substring(6, 10)}`;
    }

    return phone; // 형식이 맞지 않으면 원본 반환
  }

  /**
   * 현재 한국 시간을 표준 포맷(YYYY-MM-DD HH:mm:ss)으로 반환
   */
  getCurrentKSTString() {
    const now = new Date();
    const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    return kstDate.toISOString().replace('T', ' ').substring(0, 19);
  }

  async initialize() {
    if (this.initialized) return;

    try {
      const serviceAccountPath = path.join(__dirname, 'google-service-account.json');

      if (!fs.existsSync(serviceAccountPath)) {
        throw new Error(`Service account file not found at: ${serviceAccountPath}`);
      }

      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.initialized = true;
      console.log('✅ Google Sheets API initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets API:', error.message);
      throw error;
    }
  }

  /**
   * 결제 정보를 구글 시트에 저장
   * @param {Object} paymentData - 토스페이먼츠 결제 승인 응답 데이터
   * @param {Object} customerInfo - 사용자 입력 정보 (이름, 이메일, 전화번호)
   * @param {Array} cartItems - 장바구니 상품 목록
   */
  async savePaymentInfo(paymentData, customerInfo, cartItems = []) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // 결제 정보 추출
      const {
        orderId,
        orderName,
        totalAmount,
        method,
        status,
        approvedAt,
        paymentKey,
        card,
        virtualAccount,
        transfer,
        receipt,
      } = paymentData;

      // 결제 수단 상세 정보
      let paymentMethodDetail = '';
      if (method === '카드' && card) {
        paymentMethodDetail = `${card.issuerCode || ''} ${card.number || ''}`;
      } else if (method === '가상계좌' && virtualAccount) {
        paymentMethodDetail = `${virtualAccount.bankCode || ''} ${virtualAccount.accountNumber || ''}`;
      } else if (method === '계좌이체' && transfer) {
        paymentMethodDetail = `${transfer.bankCode || ''}`;
      }

      // 현재 시각 (한국 시간)
      // 현재 시각 (한국 시간 표준 포맷)
      const now = this.getCurrentKSTString();

      // 장바구니 상품 정보를 텍스트로 변환
      let cartItemsText = '';
      if (cartItems && cartItems.length > 0) {
        cartItemsText = cartItems.map((item, index) =>
          `${index + 1}. ${item.productName} (${item.size} / ${item.type}) x ${item.quantity}개 = ${(item.price * item.quantity).toLocaleString()}원`
        ).join('\n');
      }

      // 배송 주소 조합
      const fullAddress = [
        customerInfo.postalCode || '',
        customerInfo.address || '',
        customerInfo.addressDetail || ''
      ].filter(Boolean).join(' ');

      // 저장할 행 데이터
      const rowData = [
        now,                              // 기록 시각
        orderId,                          // 주문번호
        orderName,                        // 상품명 요약
        totalAmount,                      // 결제 금액
        method,                           // 결제 수단
        paymentMethodDetail,              // 결제 수단 상세
        customerInfo.customerName || '',  // 구매자 이름
        customerInfo.customerEmail || '', // 구매자 이메일
        this.formatPhoneWithHyphens(customerInfo.customerPhone || ''), // 구매자 전화번호 (하이픈 포함)
        fullAddress,                      // 배송 주소
        status,                           // 결제 상태
        approvedAt,                       // 승인 시각
        paymentKey,                       // 결제 키
        receipt?.url || '',               // 영수증 URL
        cartItemsText,                    // 주문 상품 상세
      ];

      // 시트에 데이터 추가 (인솔결제정보 시트)
      const paymentSheetName = '인솔결제정보';
      const appendRange = `${paymentSheetName}!A:O`; // A열부터 O열까지
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: appendRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowData],
        },
      });

      console.log('✅ Payment info saved to Google Sheets:', {
        orderId,
        updatedCells: response.data.updates.updatedCells,
      });

      return {
        success: true,
        updatedRange: response.data.updates.updatedRange,
        updatedCells: response.data.updates.updatedCells,
      };
    } catch (error) {
      console.error('❌ Failed to save payment info to Google Sheets:', error);
      throw error;
    }
  }

  /**
   * 마스터 코스 신청 정보를 구글 시트에 저장
   * @param {Object} applicationData - 신청자 정보 (이름, 이메일, 전화번호, 근무병원, 근무형태)
   */
  async saveApplicationInfo(applicationData) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const { name, email, phone, hospital, workType } = applicationData;

      // 현재 시각 (한국 시간)
      // 현재 시각 (한국 시간 표준 포맷)
      const now = this.getCurrentKSTString();

      // 저장할 행 데이터
      const rowData = [
        now,    // 신청 시각
        name,   // 이름
        email,  // 이메일
        this.formatPhoneWithHyphens(phone),  // 전화번호 (하이픈 포함)
        hospital || '',   // 근무병원
        workType || '',   // 근무형태
        '대기', // 상태 (초기값)
        '',     // 메모 (빈 칸)
      ];

      // 신청자 시트에 데이터 추가
      const applicationSheetName = '마스터코스신청자';
      const appendRange = `${applicationSheetName}!A:H`; // A열부터 H열까지
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: appendRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowData],
        },
      });

      console.log('✅ Application info saved to Google Sheets:', {
        name,
        email,
        updatedCells: response.data.updates.updatedCells,
      });

      return {
        success: true,
        updatedRange: response.data.updates.updatedRange,
        updatedCells: response.data.updates.updatedCells,
      };
    } catch (error) {
      console.error('❌ Failed to save application info to Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Master Care 신청 정보를 구글 시트에 저장
   * @param {Object} mastercareData - Master Care 신청자 정보
   */
  async saveMasterCareInfo(mastercareData) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
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
        additionalNotes,
        timestamp
      } = mastercareData;

      // 패키지명 변환
      const packageNames = {
        basic: 'Basic Package (100만원)',
        standard: 'Standard Package (400만원)',
        premium: 'Premium Package (700만원)'
      };

      // 시작 시기 변환
      const startDateNames = {
        immediately: '즉시 시작',
        '1-month': '1개월 이내',
        '2-3-months': '2-3개월 이내',
        flexible: '유연하게 조율 가능'
      };

      // 컨설팅 분야 라벨 변환
      const consultingAreaLabels = {
        'dtr-str-ptr': 'DTR-STR-PTR 기법 심화',
        'xray': 'X-ray 판독 및 진단',
        'emg-nerve': '근전도/신경전도 검사',
        'kinesiology': '운동학/기능해부학',
        'exercise-rehab': '운동 처방 및 재활',
        'marketing': '마케팅 및 환자 관리',
        'insurance': '보험 청구 및 행정'
      };

      // Transform consultingAreas from IDs to labels
      const consultingAreasDisplay = consultingAreas
        ? consultingAreas.split(',').map(id => consultingAreaLabels[id.trim()] || id.trim()).join(', ')
        : '';

      // 현재 시각 (한국 시간)
      // 현재 시각 (한국 시간 표준 포맷)
      const now = this.getCurrentKSTString();

      // 저장할 행 데이터
      const rowData = [
        now,                                          // 신청 시각
        name,                                         // 이름
        email,                                        // 이메일
        this.formatPhoneWithHyphens(phone),           // 전화번호 (하이픈 포함)
        hospital,                                     // 병원명
        hospitalAddress || '',                        // 병원 주소
        masterCourseCompleted || '',                  // 수료 기수
        packageNames[packageType] || packageType,     // 패키지
        consultingAreasDisplay || '',                 // 컨설팅 희망 분야
        startDateNames[preferredStartDate] || preferredStartDate, // 희망 시작 시기
        additionalNotes || '',                        // 추가 문의사항
        '대기',                                       // 상태 (초기값)
        '',                                           // 메모 (빈 칸)
      ];

      // Master Care 시트에 데이터 추가
      const mastercareSheetName = 'Master_care';
      const appendRange = `${mastercareSheetName}!A:M`; // A열부터 M열까지
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: appendRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowData],
        },
      });

      console.log('✅ Master Care info saved to Google Sheets:', {
        name,
        email,
        hospital,
        packageType,
        updatedCells: response.data.updates.updatedCells,
      });

      return {
        success: true,
        updatedRange: response.data.updates.updatedRange,
        updatedCells: response.data.updates.updatedCells,
      };
    } catch (error) {
      console.error('❌ Failed to save Master Care info to Google Sheets:', error);
      throw error;
    }
  }

  /**
   * 구글 시트에 헤더 행이 있는지 확인하고, 없으면 추가 (인솔결제정보 시트)
   */
  async ensureHeaders() {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID is not set in environment variables');
    }

    try {
      const paymentSheetName = '인솔결제정보';

      // 첫 번째 행 읽기 (한글 시트명은 작은따옴표로 감싸기)
      const range = `'${paymentSheetName}'!A1:O1`;
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      const headers = [
        '기록 시각',
        '주문번호',
        '상품명',
        '결제 금액',
        '결제 수단',
        '결제 수단 상세',
        '구매자 이름',
        '구매자 이메일',
        '구매자 전화번호',
        '배송 주소',
        '결제 상태',
        '승인 시각',
        '결제 키',
        '영수증 URL',
        '주문 상품 상세',
      ];

      // 헤더가 없거나 비어있으면 추가
      if (!response.data.values || response.data.values.length === 0) {
        const updateRange = `'${paymentSheetName}'!A1:O1`;
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: updateRange,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [headers],
          },
        });
        console.log('✅ Headers added to Google Sheet (인솔결제정보)');
      }
    } catch (error) {
      console.error('❌ Failed to ensure headers:', error);
      throw error;
    }
  }

  /**
   * 수료자 이메일 확인
   * @param {string} email - 확인할 이메일 주소
   * @returns {Promise<boolean>} - 승인된 수료자면 true, 아니면 false
   */
  async checkGraduateEmail(email) {
    if (!this.initialized) {
      throw new Error('Google Sheets service not initialized');
    }

    try {
      // '수료자명단' 시트에서 이메일 목록 가져오기
      const graduateSheetName = '수료자명단';
      const range = `'${graduateSheetName}'!A:D`; // 이름, 이메일, 기수, 등록일

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      const rows = response.data.values;

      if (!rows || rows.length <= 1) {
        // 헤더만 있거나 데이터가 없으면 승인되지 않은 것으로 처리
        console.log('수료자 명단이 비어있습니다.');
        return false;
      }

      // 첫 번째 행은 헤더이므로 제외
      const dataRows = rows.slice(1);

      // 이메일 컬럼(B열, 인덱스 1)에서 일치하는 항목 찾기
      const isAuthorized = dataRows.some(row => {
        const rowEmail = row[1]; // B열 (0:이름, 1:이메일, 2:기수, 3:등록일)
        return rowEmail && rowEmail.toLowerCase().trim() === email.toLowerCase().trim();
      });

      return isAuthorized;

    } catch (error) {
      // 시트가 없거나 접근 권한이 없는 경우
      if (error.message && error.message.includes('Unable to parse range')) {
        console.warn('⚠️ "수료자명단" 시트를 찾을 수 없습니다. 스프레드시트에 시트를 추가해주세요.');
        return false;
      }

      console.error('❌ Failed to check graduate email:', error);
      throw error;
    }
  }
  /**
   * 시트의 모든 데이터 가져오기 (헤더 제외)
   * @param {string} sheetName - 시트 이름
   * @returns {Promise<Array>} - 데이터 행 배열
   */
  async getAllRows(sheetName) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const range = `'${sheetName}'!A2:Z`; // 2행부터 가져옴 (헤더 제외)
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      return response.data.values || [];
    } catch (error) {
      console.error(`❌ Failed to fetch rows from ${sheetName}:`, error.message);
      throw error;
    }
  }

  /**
   * 인솔 결제 정보 전체 조회
   */
  async getPaymentInfo() {
    return this.getAllRows('인솔결제정보');
  }

  /**
   * 마스터 코스 신청자 전체 조회
   */
  async getApplicationInfo() {
    return this.getAllRows('마스터코스신청자');
  }

  /**
   * Master Care 신청자 전체 조회
   */
  async getMasterCareInfo() {
    return this.getAllRows('Master_care');
  }

  /**
   * 수료자 명단 전체 조회
   */
  async getGraduates() {
    return this.getAllRows('수료자명단');
  }

  /**
   * 수료자 추가
   */
  async addGraduate(name, email, batch, date) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const rowData = [name, email, batch, date];
      const sheetName = '수료자명단';

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `'${sheetName}'!A:D`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [rowData] },
      });

      return true;
    } catch (error) {
      console.error('❌ Failed to add graduate:', error);
      throw error;
    }
  }

  // ============================================
  // 다시보기 등록자 관리
  // ============================================

  /**
   * 다시보기 등록자 추가
   * @param {Object} data - { name, email, batch }
   */
  async addRecapRegistrant(data) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const { name, email, batch } = data;
      const now = this.getCurrentKSTString();
      const rowData = [now, name, email, batch || '', 'pending'];
      const sheetName = '다시보기등록자';

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `'${sheetName}'!A:E`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [rowData] },
      });

      console.log('✅ Recap registrant added:', email);
      return true;
    } catch (error) {
      console.error('❌ Failed to add recap registrant:', error);
      throw error;
    }
  }

  /**
   * 다시보기 등록자 이메일 확인 (상태 포함 반환)
   * @param {string} email - 확인할 이메일
   * @returns {Promise<{exists: boolean, status: string|null}>}
   */
  async checkRecapRegistrant(email) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const sheetName = '다시보기등록자';
      const range = `'${sheetName}'!A:E`;

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      const rows = response.data.values;
      if (!rows || rows.length <= 1) {
        return { exists: false, status: null };
      }

      // 첫 번째 행은 헤더
      const dataRows = rows.slice(1);
      const found = dataRows.find(row =>
        row[2] && row[2].toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (found) {
        return { exists: true, status: found[4] || 'pending' };
      }
      return { exists: false, status: null };

    } catch (error) {
      if (error.message && error.message.includes('Unable to parse range')) {
        console.warn('⚠️ "다시보기등록자" 시트를 찾을 수 없습니다.');
        return { exists: false, status: null };
      }
      console.error('❌ Failed to check recap registrant:', error);
      throw error;
    }
  }

  /**
   * 다시보기 등록자 전체 조회
   */
  async getRecapRegistrants() {
    return this.getAllRows('다시보기등록자');
  }

  /**
   * 다시보기 등록자 상태 업데이트
   * @param {string} email - 이메일
   * @param {string} newStatus - approved | rejected | pending
   */
  async updateRecapRegistrantStatus(email, newStatus) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const sheetName = '다시보기등록자';
      const range = `'${sheetName}'!A:E`;

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      const rows = response.data.values;
      if (!rows || rows.length <= 1) {
        throw new Error('No data found');
      }

      // 이메일이 있는 행 찾기 (2행부터 시작, 인덱스 1부터)
      let rowIndex = -1;
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][2] && rows[i][2].toLowerCase().trim() === email.toLowerCase().trim()) {
          rowIndex = i + 1; // 스프레드시트는 1-indexed
          break;
        }
      }

      if (rowIndex === -1) {
        throw new Error('Registrant not found');
      }

      // 상태 컬럼(E열) 업데이트
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `'${sheetName}'!E${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[newStatus]] },
      });

      console.log('✅ Recap registrant status updated:', email, '->', newStatus);
      return true;
    } catch (error) {
      console.error('❌ Failed to update recap registrant status:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스
const googleSheetsService = new GoogleSheetsService();

export default googleSheetsService;
