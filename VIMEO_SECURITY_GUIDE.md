# Vimeo 플랜별 보안 가이드

## 📊 플랜별 가격 및 보안 기능

| 플랜 | 월간 결제 | 연간 결제 (월평균) | 도메인 제한 | 비밀번호 보호 | Vimeo 로고 숨김 | DRM |
|------|----------|------------------|------------|--------------|----------------|-----|
| **Starter** | ₩21,000 | ₩12,600 | ✅ | ✅ | ❌ | ❌ |
| **Standard** | ₩76,563 | ₩45,938 | ✅ | ✅ | ✅ | ❌ |
| **Advanced** | ₩110,339 | ₩66,000 | ✅ | ✅ | ✅ | ❌ |
| **Enterprise** | 별도 문의 | 별도 문의 | ✅ | ✅ | ✅ | ✅ |

---

## 🏆 권장 플랜: **Starter** (₩12,600/월)

JSHA 마스터코스 다시보기에 가장 적합한 플랜입니다.

### Starter 플랜에서 가능한 보안 기능

1. **도메인 제한 (Domain-level Privacy)**
   - 특정 도메인에서만 재생 가능
   - 예: `jsha-master-course.onrender.com`, `jshamaster.com`

2. **일부 공개 (Unlisted)**
   - Vimeo 검색에 노출 안 됨
   - 링크를 아는 사람만 접근 가능

3. **비밀번호 보호**
   - 영상별 비밀번호 설정 가능

---

## 🔐 Starter 플랜 최적 보안 설정 방법

### 1단계: Starter 플랜 업그레이드
1. https://vimeo.com/upgrade-plan 접속
2. **Starter** 플랜 선택
3. 연간 결제 선택 (40% 할인)

### 2단계: 영상별 프라이버시 설정
1. Vimeo 영상 → ⚙️ Settings
2. **Privacy** 탭:
   - "Who can watch" → **Unlisted** 선택
   - "Where can embed" → **Specific domains** 선택
   - 도메인 추가:
     - `jsha-master-course.onrender.com`
     - `jshamaster.com`
     - `localhost` (개발용)
3. **Save** 클릭

### 3단계: 관리자 페이지에서 URL 등록
- 형식: `https://vimeo.com/VIDEO_ID/HASH`
- 예시: `https://vimeo.com/1153279937/3daf1d4f44`

---

## ⚠️ 주의사항

### Starter 플랜 한계
- Vimeo 로고 숨기기 **불가** (Standard 이상 필요)
- DRM 보호 **불가** (Enterprise 필요)

### 그래도 충분한 이유
- 도메인 제한만으로도 **99%의 일반 사용자 무단 접근 차단**
- 다시보기 서비스에는 Starter 플랜의 보안이 충분함
- 영상 다운로드 방지도 기본 제공

---

## 🎯 보안 체크리스트

- [ ] Starter 플랜 업그레이드 완료
- [ ] 모든 영상 "Unlisted" 설정
- [ ] 모든 영상 도메인 제한 설정
- [ ] 관리자 페이지에 해시 포함 URL 등록
- [ ] 테스트: 다른 도메인에서 재생 안 됨 확인

---

## 💡 대안 비교

| 옵션 | 장점 | 단점 |
|------|------|------|
| **Vimeo Starter** | 도메인 제한 가능, 깔끔한 UI | 월 ₩12,600 비용 |
| **YouTube Unlisted** | 무료 | 다운로드 쉬움, 도메인 제한 불가 |
| **자체 호스팅** | 완전한 제어 | 서버 비용, 대역폭, 개발 시간 |

**결론**: Vimeo Starter가 가성비 최고!
