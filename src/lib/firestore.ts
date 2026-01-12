import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, Timestamp, collectionGroup, deleteDoc } from 'firebase/firestore';
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

// 접근 등급 (영상 접근 레벨)
export type AccessLevel = 'preview' | 'session1' | 'graduate';

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
// 다시보기 등록자 관련 타입 및 함수들
// ============================================

// 다시보기 등록자 정보 타입
export interface RecapRegistrant {
  uid: string;
  email: string;
  name: string;
  batch?: string; // 수료 기수
  status: UserStatus; // 승인 상태 (pending, approved, rejected)
  accessLevel: AccessLevel; // 영상 접근 등급
  createdAt: string;
  updatedAt: string;
}

/**
 * Firestore에 다시보기 등록자 저장
 */
export const createRecapRegistrant = async (
  uid: string,
  email: string,
  name: string,
  batch?: string,
  status: UserStatus = 'pending',
  accessLevel: AccessLevel = 'preview'
): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const registrant: RecapRegistrant = {
    uid,
    email,
    name,
    batch,
    status,
    accessLevel,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'recapRegistrants', uid), registrant);
  console.log('✅ Recap registrant created:', uid, 'status:', status, 'accessLevel:', accessLevel);
};

/**
 * Firestore에서 다시보기 등록자 조회
 */
export const getRecapRegistrant = async (uid: string): Promise<RecapRegistrant | null> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const registrantDoc = await getDoc(doc(db, 'recapRegistrants', uid));

  if (registrantDoc.exists()) {
    return registrantDoc.data() as RecapRegistrant;
  }

  return null;
};

/**
 * 이메일로 다시보기 등록자 조회
 */
export const getRecapRegistrantByEmail = async (email: string): Promise<RecapRegistrant | null> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const registrantsRef = collection(db, 'recapRegistrants');
  const q = query(registrantsRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const registrantDoc = querySnapshot.docs[0];
    return registrantDoc.data() as RecapRegistrant;
  }

  return null;
};

/**
 * 특정 상태의 다시보기 등록자 조회
 */
export const getRecapRegistrantsByStatus = async (status: UserStatus): Promise<RecapRegistrant[]> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const registrantsRef = collection(db, 'recapRegistrants');
  const q = query(registrantsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => doc.data() as RecapRegistrant);
};

/**
 * 다시보기 등록자 상태 업데이트
 */
export const updateRecapRegistrantStatus = async (
  uid: string,
  status: UserStatus
): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  await setDoc(
    doc(db, 'recapRegistrants', uid),
    {
      status,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  console.log('✅ Recap registrant status updated:', uid, 'new status:', status);
};

/**
 * 모든 다시보기 등록자 조회 (Admin용)
 */
export const getAllRecapRegistrants = async (): Promise<RecapRegistrant[]> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const registrantsRef = collection(db, 'recapRegistrants');
  const q = query(registrantsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => doc.data() as RecapRegistrant);
};

// ============================================
// 다시보기 비디오 관련 타입 및 함수들
// ============================================

// 다시보기 비디오 정보 타입
export interface RecapVideo {
  id: string;
  title: string;
  description: string;
  vimeoUrl: string;
  duration: string;
  module: string;
  thumbnail: string;
  order: number;
  isPublished: boolean;
  accessLevel: AccessLevel; // 영상 접근 등급
  createdAt: string;
  updatedAt: string;
}

/**
 * Firestore에 다시보기 비디오 생성
 */
export const createRecapVideo = async (videoData: Omit<RecapVideo, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const videosRef = collection(db, 'recapVideos');
  const newVideoRef = doc(videosRef);

  const video: RecapVideo = {
    id: newVideoRef.id,
    ...videoData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(newVideoRef, video);
  console.log('✅ Recap video created:', video.id);
  return video.id;
};

/**
 * 모든 다시보기 비디오 조회 (order 순서대로)
 */
export const getAllRecapVideos = async (publishedOnly: boolean = true): Promise<RecapVideo[]> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const videosRef = collection(db, 'recapVideos');
  let q = query(videosRef, orderBy('order', 'asc'));

  if (publishedOnly) {
    q = query(videosRef, where('isPublished', '==', true), orderBy('order', 'asc'));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as RecapVideo);
};

/**
 * 특정 비디오 조회
 */
export const getRecapVideo = async (videoId: string): Promise<RecapVideo | null> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const videoDoc = await getDoc(doc(db, 'recapVideos', videoId));

  if (videoDoc.exists()) {
    return videoDoc.data() as RecapVideo;
  }

  return null;
};

/**
 * 다시보기 비디오 업데이트
 */
export const updateRecapVideo = async (videoId: string, updates: Partial<Omit<RecapVideo, 'id' | 'createdAt'>>): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  await setDoc(
    doc(db, 'recapVideos', videoId),
    {
      ...updates,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  console.log('✅ Recap video updated:', videoId);
};

/**
 * 다시보기 비디오 삭제
 */
export const deleteRecapVideo = async (videoId: string): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  await deleteDoc(doc(db, 'recapVideos', videoId));
  console.log('✅ Recap video deleted:', videoId);
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

// ============================================
// 접근 등급 관련 함수들
// ============================================

/**
 * 접근 등급 계층 정의 (낮은 순서 -> 높은 순서)
 */
const ACCESS_LEVEL_HIERARCHY: AccessLevel[] = ['preview', 'session1', 'graduate'];

/**
 * 접근 등급 비교 함수
 * @returns userLevel이 requiredLevel 이상이면 true
 */
export const canAccessLevel = (userLevel: AccessLevel, requiredLevel: AccessLevel): boolean => {
  const userIndex = ACCESS_LEVEL_HIERARCHY.indexOf(userLevel);
  const requiredIndex = ACCESS_LEVEL_HIERARCHY.indexOf(requiredLevel);
  return userIndex >= requiredIndex;
};

/**
 * 다시보기 등록자의 접근 등급 업데이트
 */
export const updateRecapRegistrantAccessLevel = async (
  uid: string,
  accessLevel: AccessLevel
): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  await setDoc(
    doc(db, 'recapRegistrants', uid),
    {
      accessLevel,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  console.log('✅ Recap registrant access level updated:', uid, 'new level:', accessLevel);
};

/**
 * 사용자의 접근 등급에 따라 접근 가능한 비디오만 조회
 */
export const getAccessibleVideos = async (userAccessLevel: AccessLevel): Promise<RecapVideo[]> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  // 모든 공개된 비디오 가져오기
  const allVideos = await getAllRecapVideos(true);

  // 사용자의 접근 등급에 따라 필터링
  return allVideos.filter(video => canAccessLevel(userAccessLevel, video.accessLevel));
};

// ============================================
// 통합 계정 시스템 관련 함수들
// ============================================

/**
 * 이메일로 어떤 서비스에 이미 등록되어 있는지 확인
 * @returns { hasInsole: boolean, hasRecap: boolean, insoleUser?: UserProfile, recapUser?: RecapRegistrant }
 */
export const checkExistingServices = async (email: string): Promise<{
  hasInsole: boolean;
  hasRecap: boolean;
  insoleUser?: UserProfile;
  recapUser?: RecapRegistrant;
}> => {
  const [insoleUser, recapUser] = await Promise.all([
    getUserProfileByEmail(email),
    getRecapRegistrantByEmail(email),
  ]);

  return {
    hasInsole: !!insoleUser,
    hasRecap: !!recapUser,
    insoleUser: insoleUser || undefined,
    recapUser: recapUser || undefined,
  };
};

/**
 * 기존 인솔 사용자에게 다시보기 서비스 추가
 * (이미 Firebase Auth 계정이 있는 경우)
 */
export const addRecapServiceToExistingUser = async (
  uid: string,
  email: string,
  name: string,
  batch?: string,
  status: UserStatus = 'pending',
  accessLevel: AccessLevel = 'preview'
): Promise<void> => {
  // recapRegistrants 컬렉션에 새로운 문서 생성
  await createRecapRegistrant(uid, email, name, batch, status, accessLevel);
  console.log('✅ Recap service added to existing user:', uid);
};

/**
 * 기존 다시보기 사용자에게 인솔 서비스 추가
 * (이미 Firebase Auth 계정이 있는 경우)
 */
export const addInsoleServiceToExistingUser = async (
  uid: string,
  email: string,
  clinicName: string,
  directorName: string,
  location: string,
  status: UserStatus = 'pending'
): Promise<void> => {
  // users 컬렉션에 새로운 문서 생성
  await createUserProfile(uid, email, clinicName, directorName, location, status);
  console.log('✅ Insole service added to existing user:', uid);
};
