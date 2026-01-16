# JSHA 프로젝트 개발 회고

> 📅 최종 업데이트: 2026-01-16

---

## 🚨 트러블슈팅 요약

### 1. 관리자 인증 오류 (2026-01-13)

| 오류 | 원인 | 해결 |
|------|------|------|
| `net::ERR_BLOCKED_BY_CLIENT` | 브라우저 확장 프로그램이 Firestore 연결 차단 | 서버 API로 마이그레이션 |
| `auth/admin-restricted-operation` | Firebase 익명 인증 비활성화 | `signInAnonymously` 제거 |
| `Missing or insufficient permissions` | Firestore 규칙 + 미로그인 | 규칙 완화 or 로그인 필수 |

**해결책**: 관리자 페이지는 **서버 API + JWT** 사용, Firestore 직접 접근 제거

---

### 2. 프로덕션 배포 누락 (2026-01-13)

| 오류 | 원인 | 해결 |
|------|------|------|
| 404 Not Found (`/api/admin/recap-videos`) | Render 서버에 새 API 미배포 | `git push` 후 Render Manual Deploy |

**핵심 교훈**: 프론트엔드(Vercel)와 백엔드(Render) **둘 다 배포** 필요!

---

### 3. 브라우저 캐시 문제 (2026-01-13)

| 증상 | 원인 | 해결 |
|------|------|------|
| 배포 후에도 오류 지속 | 브라우저가 이전 번들 캐시 | **시크릿 모드**로 테스트 또는 **하드 리프레시** (Ctrl+Shift+R) |

---

### 4. `ERR_BLOCKED_BY_CLIENT` 경고 (무시 가능)

| 차단 대상 | 원인 | 영향 |
|-----------|------|------|
| `arclight.vimeo.com` | 광고 차단기가 Vimeo 분석 차단 | 없음 ✅ |
| `youtube.com/log_event` | 광고 차단기가 YouTube 분석 차단 | 없음 ✅ |
| `firestore...Listen/channel` | Firestore 리스너 정리 요청 | 없음 ✅ |

**결론**: 광고 차단기 사용 시 콘솔에 뜨지만 **기능에 영향 없음**

---

### 5. Firestore 초기화 오류 (2026-01-12)

```typescript
// ❌ 문제
db = getFirestore();

// ✅ 해결
import { app } from './firebase';
db = getFirestore(app);  // app 인스턴스 명시적 전달
```


---

### 6. 교과서 인증 및 권한 로직 (2026-01-14)

| 이슈 | 해결/패턴 |
|------|-----------|
| **복잡한 권한 (Book vs Session1)** | 단순 계층(Hierarchy) 대신 **매트릭스(Matrix)** 로직 사용 (`if-else` 분기) |
| **민감 정보 입력 UX (Privacy)** | Placeholder 가이드 + 입력 시 자동 포맷팅 (`replace`로 하이픈 제거) |
| **다국어 카테고리 정렬** | 단순 문자열 정렬 대신 **정의된 순서 배열(Order Array)** 사용 |

---


## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│  프론트엔드 (Vercel)                                          │
│  - React + TypeScript + Vite                                 │
│  - 사용자 페이지: Firebase Auth + Firestore SDK              │
│  - 관리자 페이지: 비밀번호 로그인 + 서버 API                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  백엔드 서버 (Render)                                         │
│  - Express.js + Firebase Admin SDK                          │
│  - JWT 인증 (24시간 유효)                                     │
│  - Firestore 규칙 우회 (Admin SDK)                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Firebase                                                    │
│  - Auth: 사용자 이메일 인증                                   │
│  - Firestore: 데이터 저장                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 배포 체크리스트

### 코드 변경 후
- [ ] `npm run build` 로컬 빌드 확인
- [ ] `git add -A && git commit && git push origin master`
- [ ] Vercel 자동 배포 확인 (프론트엔드)
- [ ] Render Manual Deploy (백엔드 - 필요시)
- [ ] `firebase deploy --only firestore:rules` (규칙 변경시)

### 새 브라우저/기기에서 접속 시
- [ ] **관리자**: `/admin/login`에서 비밀번호 로그인
- [ ] **사용자**: Firebase Auth 로그인 필요

---

## 🔐 Firestore 보안 규칙 요약

```javascript
// recapVideos - 읽기 공개, 쓰기는 서버만
allow read: if true;
allow write: if false;  // Admin SDK로만 수정

// recapRegistrants - 로그인 필요
allow read: if isSignedIn();
allow create: if isOwner(userId);
allow update: if isSignedIn();
```

---

## 🎬 Vimeo 설정 가이드

| 설정 | 값 | 이유 |
|------|-----|------|
| 프라이버시 | **숨기기 (Hide from Vimeo)** | 검색 노출 방지 + 임베드 가능 |
| 도메인 제한 | `jshamaster.com` | 다른 사이트 임베드 차단 |
| 플랜 | Starter (₩12,600/월) | 도메인 제한 기능 필요 |

**영상 URL 형식**: 비밀 해시 포함 필요
```
https://vimeo.com/123456789/abc123hash
```

---

## 📁 주요 파일 위치

| 기능 | 파일 |
|------|------|
| 관리자 라우트 | `server/routes/adminRoutes.js` |
| Firestore 규칙 | `firestore.rules` |
| 환경 변수 | `.env` (VITE_API_URL, JWT_SECRET 등) |
| 관리자 대시보드 | `src/pages/admin/AdminDashboard.tsx` |
| 비디오 관리 | `src/pages/admin/AdminRecapVideosPage.tsx` |
| 등록자 관리 | `src/pages/admin/AdminRecapPage.tsx` |

---

## ⚠️ 자주 하는 실수

1. **프론트만 배포하고 백엔드 안 함** → API 404 오류
2. **Firestore 규칙 배포 안 함** → 권한 오류
3. **새 브라우저에서 로그인 안 함** → 데이터 로드 실패
4. **`getFirestore()` 호출 시 app 누락** → 초기화 오류

---

## �️ 개발 가이드: Website Builder 스킬

UI/UX 개선 작업 시 `website-builder-extracted` 폴더의 스킬을 활용하세요:

```
📁 website-builder-extracted/website-builder/
├── SKILL.md           # 멀티 에이전트 웹 개발 워크플로우
├── marketing.md       # 마케팅 전략 가이드
├── design.md          # 디자인 시스템 원칙
├── seo.md             # SEO 최적화 체크리스트
├── content.md         # 콘텐츠 작성 가이드
└── frontend.md        # 프론트엔드 구현 패턴
```

**활용 예시:**
- 랜딩 페이지 개선 → `SKILL.md` + `marketing.md`
- UI 컴포넌트 개선 → `design.md` + `frontend.md`
- 검색 최적화 → `seo.md`

---

## �📚 참고 문서

- [Firebase Auth 설정](https://firebase.google.com/docs/auth)
- [Firestore 보안 규칙](https://firebase.google.com/docs/firestore/security/get-started)
- [Vimeo 개발자 문서](https://developer.vimeo.com/)

---

## 📌 TODO: 다시보기 UI 개선 

### Phase 1: 스케일링 및 텍스트 크기 조정 ✅ (2026-01-14 완료)
- [x] 비디오 그리드 반응형 (1열 → 2열 → 3열)
- [x] 고정 배지 모바일 위치 및 텍스트 반응형
- [x] 접근성 개선 (aria-label, 키보드 네비게이션)
- [x] 에러 메시지 role="alert" 추가
- [x] 이미지 lazy loading
- [x] 회원가입 헤더 및 자동승인 팁 개선

### Phase 2: 사용자 경험 개선 ✅ (2026-01-16 완료)
- [x] 비디오 로딩 스켈레톤 UI 추가
- [x] 접근 등급별 뱃지 시각적 구분 (배경색, 테두리, 그림자 적용)
- [x] React Query 도입으로 데이터 fetching 리팩토링 (캐싱, 자동 재시도)
- [ ] 재생 진행률 표시 (Vimeo API 연동 필요 - 연기)
- [ ] 마지막 시청 위치 기억 (연기)

### Phase 3: 레이아웃 리디자인 ✅ (2026-01-16 완료)
- [x] **사이드바 + 인라인 플레이어** 레이아웃 (카드 그리드 → 2컬럼)
- [x] **아코디언 강의 목록** (모듈별 그룹화)
- [x] **시청 완료 체크** (체크박스 UI + Firestore 저장)
- [x] **필터 기능** (전체 / 시청 가능 / 시청 완료)
- [x] **Vimeo Player API** 연동 - 영상 끝까지 시청 시 자동 완료 체크
- [x] Admin 비디오 관리 페이지: 교과서(book) 접근 등급 추가
- [x] 모듈 Input → Select 드롭다운 변경

### Phase 4: 성능 최적화 (예정)
- [ ] 비디오 목록 페이지네이션 (50개 이상 시)
- [ ] 이미지 WebP 변환 (커스텀 이미지에만 필요)

---

## 🚨 트러블슈팅 추가 (2026-01-16)

### 7. Firestore 서브컬렉션 권한 오류

| 오류 | 원인 | 해결 |
|------|------|------|
| `PERMISSION_DENIED` (시청 체크) | `watchedVideos` 서브컬렉션 규칙 누락 | `firestore.rules`에 규칙 추가 |
| `PERMISSION_DENIED` (교과서 등록) | `bookRegistrations` 컬렉션 규칙 누락 | `firestore.rules`에 규칙 추가 |

**교훈**: 새 컬렉션/서브컬렉션 추가 시 **반드시 Firestore 규칙 추가 + 배포** 필요!

```javascript
// watchedVideos 서브컬렉션
match /recapRegistrants/{userId}/watchedVideos/{videoId} {
  allow read, write: if isOwner(userId);
}

// bookRegistrations 컬렉션
match /bookRegistrations/{registrationId} {
  allow create: if isSignedIn();
  allow read: if isSignedIn();
}
```

### 8. 백엔드 서버 미실행

| 증상 | 원인 | 해결 |
|------|------|------|
| Admin 로그인 `Failed to fetch` | 포트 3001 서버 미실행 | `cd server && npm run dev` |

### 9. Vimeo Player API 연동

| 패키지 | 용도 |
|--------|------|
| `@vimeo/player` | iframe 영상 이벤트 감지 (ended, progress 등) |

```typescript
const player = new Player(iframeRef.current);
player.on('ended', () => { /* 시청 완료 처리 */ });
```

---

## 🔑 교과서 인증 코드

```
JSHA-MASTER-2026-7K3M
```
- 등급: book (교과서 구매자)
- 최대 등록: 500명

