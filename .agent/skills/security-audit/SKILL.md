---
name: Security Audit
description: JSHA_master 프로젝트의 의존성 취약점 검사 및 보안 감사 자동화
---

# 보안 감사 Skill

JSHA_master 프로젝트의 보안 상태를 점검하고 취약점을 식별합니다.

## 사용 시점

- 정기적인 보안 점검 시 (주 1회 권장)
- 새 패키지 추가 후
- 배포 전 사전 점검
- 보안 경고(CVE) 발생 시

## 실행 단계

### 1. NPM 의존성 보안 감사

```powershell
# 프로젝트 디렉토리에서 실행
cd c:\Users\admin\Desktop\AntiGravity\JSHA_master
npm audit
```

결과 분석:
- **Critical/High**: 즉시 수정 필요
- **Moderate**: 가능한 빨리 수정
- **Low**: 다음 업데이트 시 처리

### 2. 자동 수정 시도

```powershell
# 호환성 문제 없는 취약점 자동 수정
npm audit fix

# 주요 버전 업그레이드 포함 (주의: 호환성 확인 필요)
npm audit fix --force
```

> [!WARNING]
> `--force` 옵션 사용 전 반드시 git commit을 해두세요.

### 3. React/프레임워크 버전 확인

검사 대상 및 권장 버전:

| 패키지 | 취약 버전 | 권장 버전 |
|--------|-----------|-----------|
| react | < 19.0.1 | 19.0.1+ |
| react-dom | < 19.0.1 | 19.0.1+ |
| next (사용 시) | < 15.0.5 | 15.0.5+ |

```powershell
# 현재 버전 확인
npm list react react-dom next
```

> [!NOTE]
> JSHA_master는 Vite + React 18 SPA 구조로 Next.js를 사용하지 않습니다.
> React2Shell (CVE-2025-55182)은 Next.js Flight 프로토콜 취약점이므로 직접적 영향 없음.

### 4. Firestore 보안 규칙 검토

파일 위치: `firestore.rules`

확인 사항:
- [ ] 인증 없는 읽기/쓰기 차단
- [ ] 관리자 권한 분리
- [ ] 민감 데이터 접근 제한

```javascript
// 예: 인증된 사용자만 접근 허용
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### 5. 환경 변수 보안 점검

`.env` 파일 확인 사항:
- [ ] `.gitignore`에 `.env` 포함 여부
- [ ] API 키가 노출되지 않았는지 확인
- [ ] 프로덕션/개발 환경 분리

```powershell
# .gitignore 확인
Get-Content .gitignore | Select-String ".env"
```

### 6. HTTPS 및 도메인 보안

- [ ] Vimeo 도메인 제한 설정 (`VIMEO_SECURITY_GUIDE.md` 참조)
- [ ] Firebase Hosting HTTPS 적용 확인
- [ ] CORS 설정 검토

## 보고서 생성

검사 결과를 다음 형식으로 정리:

```markdown
# 보안 감사 보고서 - YYYY-MM-DD

## 요약
- 총 취약점: X개
- Critical: X개 / High: X개 / Moderate: X개 / Low: X개

## 조치 현황
| 취약점 | 심각도 | 상태 | 조치 내용 |
|--------|--------|------|-----------|
| CVE-XXXX | High | ✅ 완료 | npm update xxx |

## 권장 사항
1. ...
2. ...
```

## 주기적 점검 일정

| 점검 항목 | 주기 | 담당 |
|-----------|------|------|
| npm audit | 주 1회 | 개발자 |
| 프레임워크 버전 | 월 1회 | 개발자 |
| Firestore 규칙 | 분기 1회 | 관리자 |
| 환경 변수 검토 | 변경 시 | 개발자 |
