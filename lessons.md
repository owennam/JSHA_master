# 다시보기 접근 시스템 구현 회고

## 📅 작업 기간
2026-01-10 ~ 2026-01-11

---

## 🎯 구현된 기능

- 다시보기 회원가입/로그인 (Firebase Auth)
- 관리자 승인 시스템 (Firestore)
- 비디오 관리 페이지 (CRUD)
- 모달 비디오 플레이어 (자동 재생)
- YouTube/Vimeo 썸네일 자동 추출
- Vimeo 비밀 해시 링크 지원

---

## 📚 배운 점

### 1. Google Sheets → Firestore 마이그레이션
- **문제**: 서비스 계정 권한 설정 복잡 (403 PERMISSION_DENIED)
- **해결**: Firestore로 마이그레이션
- **교훈**: 프로토타입에는 Firestore가 더 적합

### 2. Firebase 익명 인증 제한
- **문제**: `auth/admin-restricted-operation` 에러
- **해결**: 개발 환경에서 Firestore 규칙 임시 개방
- **교훈**: 프로덕션 전 규칙 강화 필수

### 3. Vimeo 프라이버시 설정
- **"비공개"**: 로그인 필요 → 임베드 불가 ❌
- **"일부 공개"**: 비밀 해시 필요 (URL에 /hash 포함)
- **"숨기기"**: 도메인 제한 임베드 가능 ✅ (권장)

### 4. Vimeo 비밀 해시 처리
- 형식: `vimeo.com/VIDEO_ID/HASH`
- embed URL: `player.vimeo.com/video/VIDEO_ID?h=HASH`

### 5. 비공개 영상 썸네일
- 자동 추출 불가 (vumbnail.com 접근 제한)
- 수동으로 썸네일 URL 입력 필요

---

## ⚠️ 프로덕션 배포 전 필수 작업

1. Firestore 규칙: `if true` → `if isAdmin()`
2. Vimeo 프라이버시: "숨기기" 설정
3. Vimeo 도메인 제한: 프로덕션 도메인만 허용
4. 비공개 영상: 수동 썸네일 URL 입력

---

## 🔧 기술 스택
- Frontend: React + TypeScript + Vite + Shadcn UI
- Backend: Firebase (Auth + Firestore)
- Video: YouTube/Vimeo embed (모달 플레이어)
