# 다시보기 접근 시스템 구현 회고

## 📅 작업 기간
2026-01-10 ~ 2026-01-11

## 🎯 목표
마스터 코스 수료자 및 등록자를 위한 다시보기 영상 접근 시스템 구현

---

## 📚 배운 점

### 1. Google Sheets API vs Firestore
처음에는 Google Sheets를 백엔드 DB로 사용하려 했으나.
- **문제**: 서비스 계정 권한 설정 복잡 (403 PERMISSION_DENIED)
- **해결**: Firestore로 마이그레이션하여 프론트엔드에서 직접 접근
- **교훈**: 프로토타입에는 Firestore가 더 적합. Google Sheets는 기존 데이터가 있을 때만 사용

### 2. Firebase Auth 연동
- 이메일/비밀번호 인증으로 간단하게 구현
- `onAuthStateChanged`로 인증 상태 감지하여 자동 리다이렉트

### 3. Firestore 보안 규칙
- 본인 데이터만 읽기 가능하도록 `isOwner()` 함수 활용
- status 필드 변경은 관리자만 가능하도록 제한
- 개발 중에는 임시로 `isSignedIn()`으로 열어두고 프로덕션에서 `isAdmin()`으로 변경 필요

---

## ⚠️ 남은 과제

1. **Firestore 인덱스 배포**: `firebase deploy --only firestore:indexes`
2. **Firestore 규칙 배포**: `firebase deploy --only firestore:rules`
3. **관리자 인증 강화**: 현재 익명 로그인으로 임시 처리됨
4. **비디오 데이터 입력**: AdminRecapVideosPage에서 실제 비디오 추가 필요

---

## 🔧 기술 스택
- Frontend: React + TypeScript + Vite + Shadcn UI
- Backend: Firebase (Auth + Firestore)
- 이전: Express + Google Sheets API (폐기)
