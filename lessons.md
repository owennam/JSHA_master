# 다시보기 접근 시스템 구현 회고

## 📅 작업 기간
2026-01-10 ~ 2026-01-11

---

## 🎯 구현 내용

### 핵심 기능
- 다시보기 등록/인증 시스템 (Firebase Auth)
- 관리자 승인 시스템 (Firestore)
- 비디오 관리 페이지 (CRUD)
- 모달 비디오 플레이어 (자동 재생)
- YouTube/Vimeo 썸네일 자동 추출

---

## 📚 배운 점

### 1. Google Sheets → Firestore 마이그레이션
- **문제**: 서비스 계정 권한 설정 복잡 (403 PERMISSION_DENIED)
- **해결**: Firestore로 마이그레이션하여 프론트엔드에서 직접 접근
- **교훈**: Firestore가 프로토타입에 더 적합

### 2. Firebase 익명 인증 제한
- **문제**: `auth/admin-restricted-operation` 에러
- **해결**: 개발 환경에서 Firestore 규칙 임시 개방 (`allow read, write: if true`)
- **교훈**: 프로덕션 전 반드시 규칙 강화 필요

### 3. 비디오 보안
- **YouTube**: 링크만 있으면 누구나 시청 가능 (보안 약함)
- **Vimeo Pro**: 도메인 제한, 다운로드 차단, 비밀번호 보호 가능 (권장)

---

## ⚠️ 프로덕션 배포 전 필수 작업

1. Firestore 규칙에서 `if true` → `if isAdmin()` 변경
2. Vimeo Pro에서 도메인 제한 설정
3. Firebase Auth 관리자 인증 구현

---

## 🔧 기술 스택
- Frontend: React + TypeScript + Vite + Shadcn UI
- Backend: Firebase (Auth + Firestore)
- Video: YouTube/Vimeo embed + 자동 썸네일 추출
