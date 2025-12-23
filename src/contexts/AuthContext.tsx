import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, createUserProfile, UserProfile, UserStatus } from '@/lib/firestore';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, clinicName: string, directorName: string, location: string, status?: UserStatus) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn('⚠️ Firebase Auth is not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // 사용자가 로그인된 경우 Firestore에서 프로필 가져오기
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * 회원가입
   */
  const signUp = async (
    email: string,
    password: string,
    clinicName: string,
    directorName: string,
    location: string,
    status: UserStatus = 'pending'
  ) => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    try {
      // Firebase Authentication에 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Firestore에 사용자 프로필 저장 (status 포함)
      await createUserProfile(newUser.uid, email, clinicName, directorName, location, status);

      // 프로필 다시 가져오기
      const profile = await getUserProfile(newUser.uid);
      setUserProfile(profile);

      console.log('✅ User signed up successfully with status:', status);
    } catch (error: any) {
      console.error('❌ Sign up failed:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  /**
   * 로그인
   */
  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      // Firestore에서 프로필 가져오기
      const profile = await getUserProfile(loggedInUser.uid);
      setUserProfile(profile);

      console.log('✅ User signed in successfully');
    } catch (error: any) {
      console.error('❌ Sign in failed:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  /**
   * 로그아웃
   */
  const signOut = async () => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      console.log('✅ User signed out successfully');
    } catch (error: any) {
      console.error('❌ Sign out failed:', error);
      throw new Error('로그아웃에 실패했습니다.');
    }
  };

  /**
   * 비밀번호 재설정 이메일 전송
   */
  const resetPassword = async (email: string) => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    try {
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent');
    } catch (error: any) {
      console.error('❌ Password reset failed:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Firebase Auth 에러 메시지를 한글로 변환
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return '이미 사용 중인 이메일입니다.';
    case 'auth/invalid-email':
      return '유효하지 않은 이메일 형식입니다.';
    case 'auth/operation-not-allowed':
      return '이메일/비밀번호 로그인이 비활성화되어 있습니다.';
    case 'auth/weak-password':
      return '비밀번호는 최소 6자 이상이어야 합니다.';
    case 'auth/user-disabled':
      return '비활성화된 계정입니다.';
    case 'auth/user-not-found':
      return '존재하지 않는 계정입니다.';
    case 'auth/wrong-password':
      return '잘못된 비밀번호입니다.';
    case 'auth/invalid-credential':
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    case 'auth/too-many-requests':
      return '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '인증 오류가 발생했습니다. 다시 시도해주세요.';
  }
};
