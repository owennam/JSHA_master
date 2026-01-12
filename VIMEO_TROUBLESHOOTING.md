# Vimeo 재생 안 되는 문제 해결

URL: `https://vimeo.com/1153279937/3daf1d4f44?share=copy&fl=sv&fe=ci`

## 🔍 즉시 확인 사항

### 1. 브라우저에서 직접 테스트

다음 URL을 새 브라우저 창에 붙여넣어 보세요:

```
https://player.vimeo.com/video/1153279937?h=3daf1d4f44
```

**결과별 해결 방법:**

#### ✅ 정상 재생됨
→ 웹사이트 설정 문제입니다. 관리자에게 문의하세요.

#### ❌ "Because of its privacy settings, this video cannot be played here"
→ **Vimeo 프라이버시 설정 문제입니다. 아래 단계를 따라주세요.**

#### ❌ "This video is password protected"
→ **비밀번호가 설정되어 있습니다. 비밀번호를 제거해야 합니다.**

---

## 🛠️ Vimeo 설정 수정 (단계별)

### 1단계: Vimeo 로그인
1. https://vimeo.com 접속
2. 로그인

### 2단계: 영상 찾기
1. 우측 상단 프로필 아이콘 클릭
2. "Videos" 또는 "영상" 선택
3. 해당 영상 클릭 (ID: 1153279937)

### 3단계: 설정 열기
1. 영상 페이지 우측 상단의 **⚙️ Settings** 버튼 클릭

### 4단계: Privacy 설정 (가장 중요!)
1. 좌측 메뉴에서 **Privacy** 탭 선택

2. **"Who can watch this video?"** 섹션에서:
   ```
   ⚠️ "Only me" → 이것이 선택되어 있으면 안 됩니다!
   ⚠️ "Hide from Vimeo.com" → 이것도 embed 차단할 수 있습니다!

   ✅ "Unlisted" 선택 (권장)
   또는
   ✅ "Anyone" 선택
   ```

3. **"Where can this be embedded?"** 섹션에서:
   ```
   ✅ "Anywhere" 선택

   또는 특정 도메인만 허용하려면:
   ✅ "Specific domains" 선택 후 아래 도메인 추가:
      - jsha-master-course.web.app
      - jsha-master-course.firebaseapp.com
      - localhost (테스트용)
   ```

### 5단계: 비밀번호 확인
1. 같은 **Privacy** 탭에서 아래로 스크롤
2. **"Password"** 섹션 확인
3. 비밀번호가 설정되어 있다면:
   ```
   ❌ Remove password 클릭
   ```

### 6단계: 저장
1. 페이지 상단 또는 하단의 **"Save"** 버튼 클릭
2. 변경사항이 저장될 때까지 기다리기

---

## ✅ 설정 확인 방법

### 방법 1: Share 버튼으로 확인
1. 영상 페이지에서 **Share** 버튼 클릭
2. **Embed** 탭 선택
3. **embed 코드가 표시되면** → 설정 성공! ✅
4. **"Embedding has been disabled"** 메시지 → 설정 실패, 4단계 다시 확인 ❌

### 방법 2: 브라우저에서 직접 테스트 (위 참조)
```
https://player.vimeo.com/video/1153279937?h=3daf1d4f44
```

---

## 📸 스크린샷 가이드

### 올바른 설정 예시:

**Privacy 탭에서 확인할 내용:**
```
Who can watch this video?
⚪ Only me
⚪ Only people with a password
⚪ Only people with the private link
🔘 Unlisted ✅ (이것 선택!)
⚪ Anyone
⚪ Hide from Vimeo.com

Where can this be embedded?
🔘 Anywhere ✅ (이것 선택!)
⚪ Nowhere
⚪ Specific domains

Password
[ ] None ✅ (비어있어야 함!)
```

---

## 🚨 여전히 안 되는 경우

### 체크리스트:
- [ ] "Who can watch" → **"Unlisted" 또는 "Anyone"** 선택했나요?
- [ ] "Where can embed" → **"Anywhere"** 선택했나요?
- [ ] **Password가 없나요?** (Remove password 했나요?)
- [ ] **Save 버튼을 눌렀나요?**
- [ ] 변경 후 **5분 정도 기다렸나요?** (Vimeo 서버 반영 시간)
- [ ] **브라우저 캐시를 지웠나요?** (Ctrl+F5)

### 추가 확인사항:
1. **Vimeo 계정 타입 확인**
   - 무료 계정은 일부 embed 기능이 제한될 수 있습니다
   - Vimeo Plus, PRO, Business 계정 권장

2. **도메인 제한 설정**
   - "Specific domains"를 선택했다면, 정확한 도메인이 추가되었는지 확인
   - 띄어쓰기, 오타 주의

3. **비디오 업로드 상태**
   - 비디오가 완전히 업로드/처리 완료되었는지 확인
   - "Processing" 상태면 기다려야 함

---

## 💡 권장 설정 (복사해서 사용)

```
✅ Privacy: Unlisted
✅ Embed: Anywhere
✅ Password: None
✅ Save 후 5분 대기
```

---

## 📞 추가 도움

여전히 문제가 해결되지 않으면:
- **스크린샷 찍기:** Privacy 설정 페이지 전체 스크린샷
- **이메일:** jshaworkshop@gmail.com
- **포함 정보:**
  - Vimeo 비디오 ID (1153279937)
  - Privacy 설정 스크린샷
  - 브라우저 콘솔 에러 메시지 (F12 → Console 탭)

---

## 🎯 빠른 해결 (99% 이것이 문제)

**가장 흔한 원인:**
1. ❌ "Who can watch" → "Only me" 선택되어 있음
2. ❌ "Where can embed" → "Nowhere" 선택되어 있음
3. ❌ Password가 설정되어 있음
4. ❌ Save 버튼을 누르지 않음

**→ 위 4가지를 다시 한번 확인하세요!**
