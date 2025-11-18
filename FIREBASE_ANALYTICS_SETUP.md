# Firebase Analytics & Google Analytics 4 설정 가이드

실시간 방문자 대시보드를 위한 Firebase Analytics와 Google Analytics 4 설정 방법입니다.

---

## 📋 목차

1. [Firebase 프로젝트 생성](#1-firebase-프로젝트-생성)
2. [Google Analytics 연동](#2-google-analytics-연동)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [대시보드 접근](#4-대시보드-접근)
5. [추적 가능한 데이터](#5-추적-가능한-데이터)

---

## 1. Firebase 프로젝트 생성

### 1.1 Firebase Console 접속
1. https://console.firebase.google.com 접속
2. Google 계정으로 로그인

### 1.2 새 프로젝트 생성
1. **"프로젝트 추가"** 클릭
2. **프로젝트 이름** 입력: `JSHA-Master` (원하는 이름)
3. **Google Analytics 사용 설정**: ✅ **체크** (중요!)
4. **계정 선택**: 기본 계정 또는 새 계정 생성
5. **프로젝트 만들기** 클릭

### 1.3 웹 앱 추가
1. 프로젝트 생성 후 **웹 아이콘 (</>)** 클릭
2. **앱 닉네임** 입력: `JSHA Master Website`
3. ✅ **"Firebase Hosting도 설정합니다"** 체크 안 함 (Vercel 사용 중)
4. **앱 등록** 클릭

### 1.4 Firebase 설정 정보 복사
등록 후 나타나는 `firebaseConfig` 정보를 복사하세요:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "jsha-master.firebaseapp.com",
  projectId: "jsha-master",
  storageBucket: "jsha-master.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## 2. Google Analytics 연동

### 2.1 Analytics 자동 연동 확인
Firebase 프로젝트 생성 시 Google Analytics를 활성화했다면 자동으로 연동됩니다.

### 2.2 Google Analytics 4 속성 확인
1. https://analytics.google.com 접속
2. 왼쪽 하단 **⚙️ 관리** 클릭
3. **속성** 열에서 `JSHA Master` 프로젝트 확인
4. **측정 ID** (G-XXXXXXXXXX) 확인 - Firebase의 `measurementId`와 동일해야 함

---

## 3. 환경 변수 설정

### 3.1 .env 파일 생성
프로젝트 루트 디렉토리에 `.env` 파일을 생성하세요:

```bash
# 기존 설정들...

# Firebase Configuration (새로 추가)
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=jsha-master.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=jsha-master
VITE_FIREBASE_STORAGE_BUCKET=jsha-master.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**⚠️ 주의사항:**
- Firebase Console에서 복사한 값으로 정확히 교체하세요
- `.env` 파일은 절대 Git에 커밋하지 마세요 (이미 `.gitignore`에 포함됨)
- 프로덕션 환경(Vercel)에서는 환경 변수를 별도로 설정해야 합니다

### 3.2 Vercel 환경 변수 설정 (프로덕션)
1. Vercel 대시보드 접속: https://vercel.com
2. 프로젝트 선택: `jsha-master`
3. **Settings** > **Environment Variables** 클릭
4. 다음 변수들을 추가:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
5. **Save** 클릭
6. 프로젝트 재배포

---

## 4. 대시보드 접근

### 4.1 Google Analytics 실시간 대시보드

**URL:** https://analytics.google.com

**접근 방법:**
1. Google Analytics 접속
2. 왼쪽 메뉴에서 **보고서** > **실시간** 클릭

**볼 수 있는 정보:**
- 🟢 **현재 활성 사용자 수** (실시간)
- 📊 **지난 30분간 사용자 활동**
- 🌍 **사용자 위치** (국가/도시)
- 📱 **디바이스 종류** (모바일/데스크톱)
- 📄 **실시간 페이지뷰**
- 🔗 **유입 경로** (검색, 직접, 소셜 등)

### 4.2 상세 보고서

**위치:** Google Analytics > 보고서

**주요 보고서:**
1. **획득 보고서**
   - 사용자가 어디서 왔는지 (검색엔진, SNS, 직접 방문 등)
   - 유입 채널별 성과

2. **참여도 보고서**
   - 페이지별 조회수
   - 평균 세션 시간
   - 이탈률

3. **수익 창출 보고서**
   - 전환 이벤트 (구매, 신청서 제출 등)
   - 거래 내역
   - 매출 분석

### 4.3 Google Analytics 모바일 앱

**다운로드:**
- iOS: App Store에서 "Google Analytics" 검색
- Android: Play Store에서 "Google Analytics" 검색

**장점:**
- 📱 언제 어디서나 실시간 데이터 확인
- 🔔 중요 이벤트 알림 설정 가능

---

## 5. 추적 가능한 데이터

### 5.1 자동 추적 (이미 구현됨)

#### ✅ 페이지뷰
- 모든 페이지 방문 자동 추적
- 페이지 경로, 제목, URL 기록
- **구현 파일:** `src/App.tsx`

#### ✅ 결제 완료
- 주문 번호
- 결제 금액
- 구매한 상품 목록
- **구현 파일:** `src/pages/PaymentSuccessPage.tsx`

### 5.2 추가 가능한 이벤트

다음 이벤트들도 쉽게 추가할 수 있습니다:

#### 신청서 제출
```typescript
import { logCustomEvent } from "@/lib/firebase";

// 신청서 제출 시
logCustomEvent.applicationSubmit("마스터코스");
```

#### 버튼 클릭
```typescript
// 특정 버튼 클릭 추적
logCustomEvent.buttonClick("신청하기", "마스터코스페이지");
```

#### 상품 조회
```typescript
// 상품 상세 페이지 진입 시
logCustomEvent.viewProduct("product-001", "JSHA 교육 영상");
```

#### 장바구니 추가
```typescript
// 장바구니 추가 시
logCustomEvent.addToCart("product-001", "JSHA 교육 영상", 50000);
```

### 5.3 커스텀 이벤트 추가하기

`src/lib/firebase.ts` 파일의 `logCustomEvent` 객체에 새 메서드를 추가하세요:

```typescript
export const logCustomEvent = {
  // ... 기존 이벤트들

  // 새 커스텀 이벤트 추가
  videoPlay: (videoId: string, videoTitle: string) => {
    logAnalyticsEvent('video_play', {
      video_id: videoId,
      video_title: videoTitle,
    });
  },
};
```

---

## 6. 자주 묻는 질문 (FAQ)

### Q1: 데이터가 실시간으로 안 보여요
**A:** 최초 설정 후 데이터가 표시되기까지 24-48시간이 걸릴 수 있습니다. 하지만 **실시간 보고서**는 즉시 작동합니다.

### Q2: "Analytics 지원 안 됨" 경고가 나와요
**A:** 브라우저에서 광고 차단기나 추적 차단 기능이 활성화되어 있을 수 있습니다. 개발 중에는 시크릿 모드에서 테스트하세요.

### Q3: 로컬에서 테스트할 때 주의사항은?
**A:**
- `localhost`에서도 Analytics가 작동합니다
- 개발자 본인의 방문은 필터링하는 것을 권장합니다
- Google Analytics에서 **관리 > 데이터 스트림 > 웹 > 향상된 측정**에서 설정 가능

### Q4: 비용이 얼마나 드나요?
**A:**
- Firebase Analytics: **완전 무료**
- Google Analytics 4: **무료** (월 1천만 이벤트까지)
- 대부분의 중소 웹사이트는 무료 범위 내에서 사용 가능

### Q5: GDPR/개인정보보호는 어떻게 하나요?
**A:**
- Google Analytics는 IP 익명화를 기본적으로 적용합니다
- 필요시 쿠키 동의 배너 추가를 고려하세요
- Firebase Analytics는 개인 식별 정보를 자동으로 수집하지 않습니다

---

## 7. 다음 단계

### 🎯 추천 작업

1. **알림 설정**
   - Google Analytics에서 중요 이벤트 알림 설정
   - 일일/주간 보고서 이메일 구독

2. **전환 목표 설정**
   - 신청서 제출을 전환 이벤트로 등록
   - 구매 완료를 전환 이벤트로 등록

3. **맞춤 보고서 생성**
   - 자주 확인하는 지표로 커스텀 대시보드 구성

4. **UTM 파라미터 활용**
   - 마케팅 캠페인에 UTM 파라미터 추가하여 유입 경로 추적

---

## 8. 도움말 링크

- **Firebase Console:** https://console.firebase.google.com
- **Google Analytics:** https://analytics.google.com
- **Firebase 문서:** https://firebase.google.com/docs/analytics
- **GA4 문서:** https://support.google.com/analytics

---

## ✅ 체크리스트

설정을 완료하려면 다음 단계를 확인하세요:

- [ ] Firebase 프로젝트 생성
- [ ] Google Analytics 연동 확인
- [ ] Firebase 설정 정보 복사
- [ ] `.env` 파일 생성 및 설정
- [ ] Vercel 환경 변수 설정 (프로덕션)
- [ ] 로컬에서 테스트 (`npm run dev`)
- [ ] Google Analytics 실시간 보고서 확인
- [ ] 배포 후 실제 데이터 수집 확인

---

**설정 완료 후 Google Analytics에서 실시간 데이터를 확인하실 수 있습니다!** 🎉

문제가 발생하면 콘솔(F12)에서 에러 메시지를 확인하세요.
