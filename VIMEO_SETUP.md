# Vimeo 비디오 공유 설정 가이드

다시보기 페이지에서 Vimeo 영상을 정상적으로 재생하기 위한 설정 방법입니다.

## 문제 증상

- "개인정보보호로 실행할 수 없습니다" 에러 메시지
- 비디오가 재생되지 않고 검은 화면만 표시
- "This video is private" 메시지

## 원인

Vimeo 비디오의 프라이버시 설정이 embed(삽입)를 허용하지 않는 상태입니다.

---

## 해결 방법

### 1. Vimeo 웹사이트 접속

1. [Vimeo.com](https://vimeo.com) 로그인
2. 우측 상단 프로필 아이콘 클릭 → "영상" 선택
3. 설정할 영상 선택

### 2. 프라이버시 설정 변경

영상 페이지에서 **⚙️ 설정** 버튼을 클릭합니다.

#### 옵션 1: 비공개 (Unlisted) - 권장 ⭐

**추천하는 방법입니다!**

1. **Privacy** (프라이버시) 탭 선택
2. **Who can watch this video?** (누가 이 영상을 볼 수 있나요?)에서:
   - **`Unlisted (Link only)`** 선택 ✅

3. **Where can this video be embedded?** (어디에 삽입 가능한가요?)에서:
   - **`Anywhere`** (어디든지) 선택 ✅
   - 또는 **`Specific domains`** (특정 도메인)을 선택하고 귀하의 웹사이트 도메인 추가
     - 예: `jsha-master-course.web.app`, `localhost`

4. **Save changes** (변경사항 저장) 클릭

**장점:**
- ✅ 링크를 아는 사람만 접근 가능
- ✅ Vimeo 검색에 노출되지 않음
- ✅ embed 재생 가능
- ✅ 보안과 접근성의 균형

#### 옵션 2: 공개 (Public)

1. **Privacy** (프라이버시) 탭 선택
2. **Who can watch this video?**에서:
   - **`Public`** (공개) 선택

3. **Where can this video be embedded?**에서:
   - **`Anywhere`** (어디든지) 선택

**주의:**
- ⚠️ Vimeo 검색에 노출됩니다
- ⚠️ 누구나 영상 URL을 통해 접근 가능

#### 옵션 3: 도메인 제한 (고급)

**특정 도메인에서만 재생을 허용하고 싶을 때:**

1. **Privacy** 탭 → **Where can this video be embedded?**
2. **`Specific domains`** 선택
3. 허용할 도메인 추가:
   ```
   jsha-master-course.web.app
   jsha-master-course.firebaseapp.com
   localhost
   ```
4. **Save changes** 클릭

### 3. 비밀번호 제거 (중요!)

비디오에 비밀번호가 설정되어 있다면 제거해야 합니다:

1. **Privacy** 탭에서
2. **Password** 섹션 확인
3. 비밀번호가 설정되어 있다면 **Remove password** 클릭

---

## Vimeo URL 형식

### 일반 URL
```
https://vimeo.com/123456789
```

### 비공개 영상 URL (해시 포함)
```
https://vimeo.com/123456789/abc123def456
```

비공개 영상의 경우 **반드시 해시 코드(`/abc123def456`)를 포함한 전체 URL**을 사용해야 합니다!

---

## 설정 확인 방법

### 1. Vimeo 영상 페이지에서 확인

1. 영상 우측 상단의 **Share** (공유) 버튼 클릭
2. **Embed** 탭 선택
3. embed 코드가 표시되면 설정 성공! ✅
4. "Embedding has been disabled for this video" 메시지가 뜨면 설정 실패 ❌

### 2. 웹사이트에서 확인

1. 관리자 페이지에서 영상 등록
2. 다시보기 페이지에서 영상 재생 테스트
3. 정상 재생되면 설정 완료! 🎉

---

## 문제 해결 체크리스트

영상이 재생되지 않는다면 다음을 확인하세요:

- [ ] Privacy 설정이 `Unlisted` 또는 `Public`인가요?
- [ ] Embed 설정이 `Anywhere` 또는 도메인이 추가되어 있나요?
- [ ] 비밀번호가 제거되었나요?
- [ ] 비공개 영상의 경우 해시 코드가 포함된 전체 URL을 사용했나요?
- [ ] URL이 `https://vimeo.com/숫자` 또는 `https://vimeo.com/숫자/해시` 형식인가요?

---

## 추가 팁

### 비디오 썸네일 자동 추출

시스템이 자동으로 Vimeo 썸네일을 추출합니다:
- Vimeo URL: `https://vimeo.com/123456789`
- 자동 썸네일: `https://vumbnail.com/123456789.jpg`

별도로 썸네일을 지정하지 않아도 됩니다!

### 재생 옵션

embed 시 다음 옵션이 자동 적용됩니다:
- `autoplay=1`: 자동 재생
- `title=0`: 제목 숨김
- `byline=0`: 작성자 숨김
- `portrait=0`: 프로필 사진 숨김

---

## 도움이 필요하신가요?

Vimeo 설정 관련 문의: jshaworkshop@gmail.com

---

## 권장 설정 요약 (빠른 체크)

```
✅ Privacy: Unlisted (Link only)
✅ Embed: Anywhere (또는 특정 도메인)
✅ Password: None (제거)
✅ URL 형식: https://vimeo.com/VIDEO_ID 또는 https://vimeo.com/VIDEO_ID/HASH
```

이 설정으로 승인된 사용자만 웹사이트에서 영상을 볼 수 있으며, 직접 링크를 모르는 사람은 접근할 수 없습니다.
