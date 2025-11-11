import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase 설정
// 나중에 Firebase Console에서 받은 설정 값으로 업데이트해야 합니다
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
