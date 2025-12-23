import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, Timestamp, collectionGroup } from 'firebase/firestore';
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

// 주문 상태
export type OrderStatus = 'completed' | 'cancel_requested' | 'canceled';

// 주문 정보 타입
export interface OrderInfo {
  orderId: string;
  userId: string;
  paymentKey: string;
  productName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  addressDetail: string;
  postalCode: string;
  status: OrderStatus;
  createdAt: string;
  cancelRequestedAt?: string;
  canceledAt?: string;
  cancelReason?: string;
}

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

// ============================================
// 주문 관련 함수들
// ============================================

/**
 * Firestore에 주문 정보 저장
 */
export const createOrder = async (orderData: OrderInfo): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const orderRef = doc(db, 'users', orderData.userId, 'orders', orderData.orderId);
  await setDoc(orderRef, orderData);
  console.log('✅ Order created:', orderData.orderId);
};

/**
 * 사용자의 주문 목록 조회
 */
export const getUserOrders = async (userId: string): Promise<OrderInfo[]> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const ordersRef = collection(db, 'users', userId, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => doc.data() as OrderInfo);
};

/**
 * 주문 상세 정보 조회
 */
export const getOrderById = async (userId: string, orderId: string): Promise<OrderInfo | null> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const orderDoc = await getDoc(doc(db, 'users', userId, 'orders', orderId));

  if (orderDoc.exists()) {
    return orderDoc.data() as OrderInfo;
  }

  return null;
};

/**
 * 주문 상태 업데이트
 */
export const updateOrderStatus = async (
  userId: string,
  orderId: string,
  status: OrderStatus,
  additionalData?: Partial<OrderInfo>
): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const orderRef = doc(db, 'users', userId, 'orders', orderId);
  await setDoc(
    orderRef,
    {
      status,
      ...additionalData,
    },
    { merge: true }
  );
  console.log('✅ Order status updated:', orderId, 'new status:', status);
};

/**
 * 주문 취소 요청
 */
export const requestCancelOrder = async (
  userId: string,
  orderId: string,
  cancelReason: string
): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  await updateOrderStatus(userId, orderId, 'cancel_requested', {
    cancelReason,
    cancelRequestedAt: new Date().toISOString(),
  });
  console.log('✅ Cancel request submitted:', orderId);
};

/**
 * 모든 주문 조회 (Admin용)
 */
export const getAllOrders = async (): Promise<OrderInfo[]> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  // users/{userId}/orders 하위 컬렉션 전체 조회
  const ordersQuery = query(collectionGroup(db, 'orders'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(ordersQuery);

  return querySnapshot.docs.map(doc => doc.data() as OrderInfo);
};
