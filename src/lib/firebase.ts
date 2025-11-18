import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';

// Firebase 설정
// Firebase Console에서 받은 설정 값으로 업데이트해야 합니다
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Authentication 초기화
export const auth = getAuth(app);

// Google 로그인 Provider
export const googleProvider = new GoogleAuthProvider();

// 로그인 시 항상 계정 선택 팝업 표시
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Analytics 초기화 (브라우저 환경에서만)
let analytics: ReturnType<typeof getAnalytics> | null = null;

// Analytics 지원 여부 확인 후 초기화
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log('✅ Firebase Analytics initialized');
  }
}).catch(err => {
  console.warn('⚠️ Firebase Analytics not supported:', err);
});

// Analytics 이벤트 로깅 헬퍼 함수
export const logAnalyticsEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

// 페이지뷰 추적
export const logPageView = (pageName: string, pageTitle?: string) => {
  logAnalyticsEvent('page_view', {
    page_title: pageTitle || pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
};

// 커스텀 이벤트 추적
export const logCustomEvent = {
  // 결제 관련
  purchaseComplete: (orderId: string, amount: number, items: any[]) => {
    logAnalyticsEvent('purchase', {
      transaction_id: orderId,
      value: amount,
      currency: 'KRW',
      items: items,
    });
  },

  // 신청서 제출
  applicationSubmit: (formType: string) => {
    logAnalyticsEvent('form_submit', {
      form_type: formType,
    });
  },

  // 버튼 클릭
  buttonClick: (buttonName: string, location: string) => {
    logAnalyticsEvent('button_click', {
      button_name: buttonName,
      click_location: location,
    });
  },

  // 상품 조회
  viewProduct: (productId: string, productName: string) => {
    logAnalyticsEvent('view_item', {
      item_id: productId,
      item_name: productName,
    });
  },

  // 장바구니 추가
  addToCart: (productId: string, productName: string, price: number) => {
    logAnalyticsEvent('add_to_cart', {
      item_id: productId,
      item_name: productName,
      price: price,
      currency: 'KRW',
    });
  },
};

export { analytics };
