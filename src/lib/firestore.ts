import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from './firebase';

// Firestore 인스턴스 (firebase.ts에서 app이 초기화된 경우에만 사용 가능)
let db: ReturnType<typeof getFirestore> | null = null;

try {
  if (auth) {
    // auth가 초기화되었다면 같은 app 인스턴스를 사용
    db = getFirestore();
    console.log('✅ Firestore initialized');
  }
} catch (error) {
  console.error('❌ Firestore initialization failed:', error);
}

export { db };

// 사용자 승인 상태
export type UserStatus = 'pending' | 'approved' | 'rejected';

// 사용자 정보 타입
export interface UserProfile {
  uid: string;
  email: string;
  clinicName: string;
  directorName: string;
  location: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Firestore에 사용자 프로필 저장
 */
export const createUserProfile = async (
  uid: string,
  email: string,
  clinicName: string,
  directorName: string,
  location: string,
  status: UserStatus = 'pending'
): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const userProfile: UserProfile = {
    uid,
    email,
    clinicName,
    directorName,
    location,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', uid), userProfile);
  console.log('✅ User profile created:', uid, 'status:', status);
};

/**
 * Firestore에서 사용자 프로필 조회
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const userDoc = await getDoc(doc(db, 'users', uid));

  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }

  return null;
};

/**
 * 이메일로 사용자 프로필 조회
 */
export const getUserProfileByEmail = async (email: string): Promise<UserProfile | null> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return userDoc.data() as UserProfile;
  }

  return null;
};

/**
 * 의료기관 이름과 원장 이름으로 사용자 검증
 */
export const validateClinicAndDirector = async (
  clinicName: string,
  directorName: string
): Promise<boolean> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('clinicName', '==', clinicName),
    where('directorName', '==', directorName)
  );
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

/**
 * 사용자 승인 상태 업데이트
 */
export const updateUserStatus = async (
  uid: string,
  status: UserStatus
): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  await setDoc(
    doc(db, 'users', uid),
    {
      status,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  console.log('✅ User status updated:', uid, 'new status:', status);
};

/**
 * 모든 사용자 프로필 조회 (Admin용)
 */
export const getAllUsers = async (): Promise<UserProfile[]> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);

  return querySnapshot.docs.map(doc => doc.data() as UserProfile);
};

/**
 * 특정 상태의 사용자 조회 (Admin용)
 */
export const getUsersByStatus = async (status: UserStatus): Promise<UserProfile[]> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('status', '==', status));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => doc.data() as UserProfile);
};
