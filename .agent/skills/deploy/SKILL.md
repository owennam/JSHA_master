---
name: Deploy JSHA Master
description: JSHA_master 프로젝트 빌드 및 배포 절차 (Firebase Hosting / Vercel)
---

# 배포 Skill

JSHA_master 프로젝트의 빌드 및 배포 절차를 정의합니다.

## 프로젝트 구성

- **프론트엔드**: Vite + React + TypeScript
- **백엔드**: Express.js (server/ 폴더)
- **데이터베이스**: Firebase Firestore
- **호스팅**: Firebase Hosting / Vercel

## 배포 전 체크리스트

- [ ] 모든 변경사항 git commit 완료
- [ ] `npm audit` 보안 검사 통과
- [ ] 로컬에서 빌드 테스트 완료
- [ ] 환경 변수 설정 확인
- [ ] Firestore 규칙 업데이트 (필요 시)

---

## 방법 1: Firebase Hosting 배포

### 1. Firebase CLI 설치 (최초 1회)

```powershell
npm install -g firebase-tools
firebase login
```

### 2. 프로덕션 빌드

```powershell
cd c:\Users\admin\Desktop\AntiGravity\JSHA_master

# 의존성 설치 (필요 시)
npm install

# 프로덕션 빌드
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

### 3. Firebase에 배포

```powershell
# Firestore 규칙 + Hosting 동시 배포
firebase deploy

# Hosting만 배포
firebase deploy --only hosting

# Firestore 규칙만 배포
firebase deploy --only firestore:rules
```

### 4. 배포 확인

배포 후 다음을 확인합니다:
- Firebase Console에서 배포 상태 확인
- 프로덕션 URL에서 사이트 정상 작동 확인

---

## 방법 2: Vercel 배포

### 1. Vercel CLI 설치 (최초 1회)

```powershell
npm install -g vercel
vercel login
```

### 2. 배포 실행

```powershell
cd c:\Users\admin\Desktop\AntiGravity\JSHA_master

# 프로덕션 배포
vercel --prod

# 프리뷰 배포 (테스트용)
vercel
```

### 3. 환경 변수 설정

Vercel Dashboard에서 환경 변수 설정:
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ADMIN_EMAIL`
- Firebase 관련 변수들

---

## 방법 3: Lovable 배포 (가장 간편)

[Lovable 프로젝트](https://lovable.dev/projects/8cbe4c62-dcef-4293-b61a-ee287188bd6b)에서:

1. **Share** 버튼 클릭
2. **Publish** 선택
3. 자동으로 빌드 및 배포 진행

---

## 백엔드 서버 배포

백엔드 API 서버 (`server/` 폴더)는 별도 배포가 필요합니다.

### Vercel Serverless Functions

`api/` 폴더의 함수들은 Vercel에 자동 배포됩니다.

### 별도 서버 실행 (개발/테스트)

```powershell
# 백엔드 서버만 실행
npm run server

# 프론트엔드 + 백엔드 동시 실행
npm run dev:all
```

---

## 배포 후 검증

### 1. 기본 기능 테스트

- [ ] 메인 페이지 로딩
- [ ] 로그인/회원가입 기능
- [ ] 결제 흐름 (토스페이먼츠)
- [ ] Recap 영상 재생 (Vimeo)
- [ ] 관리자 패널 접근

### 2. 모바일 검증

- [ ] 모바일 Chrome에서 테스트
- [ ] Safari에서 테스트 (iOS)

### 3. 성능 확인

```powershell
# Lighthouse 성능 검사 (Chrome DevTools)
# Performance, Accessibility, Best Practices, SEO 점수 확인
```

---

## 롤백 절차

문제 발생 시 이전 버전으로 롤백:

### Firebase

```powershell
# 배포 기록 확인
firebase hosting:channel:list

# 이전 버전으로 롤백 (Firebase Console에서)
# Hosting > 릴리스 기록 > 이전 버전 선택 > 롤백
```

### Vercel

```powershell
# Vercel Dashboard에서
# Deployments > 이전 배포 선택 > Promote to Production
```

### Git 기반 롤백

```powershell
# 이전 커밋으로 되돌리기
git revert HEAD
git push origin main

# 또는 특정 커밋으로
git checkout <commit-hash> -- .
git commit -m "Rollback to <commit-hash>"
git push origin main
```

---

## 트러블슈팅

### 빌드 실패

```powershell
# 캐시 삭제 후 재시도
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run build
```

### Firebase 권한 오류

```powershell
firebase login --reauth
```

### 환경 변수 누락

`.env` 파일과 호스팅 플랫폼의 환경 변수 설정이 일치하는지 확인하세요.

---

## 관련 문서

- [VIMEO_SECURITY_GUIDE.md](file:///c:/Users/admin/Desktop/AntiGravity/JSHA_master/VIMEO_SECURITY_GUIDE.md)
- [PAYMENT_SETUP.md](file:///c:/Users/admin/Desktop/AntiGravity/JSHA_master/PAYMENT_SETUP.md)
- [FIREBASE_ANALYTICS_SETUP.md](file:///c:/Users/admin/Desktop/AntiGravity/JSHA_master/FIREBASE_ANALYTICS_SETUP.md)
