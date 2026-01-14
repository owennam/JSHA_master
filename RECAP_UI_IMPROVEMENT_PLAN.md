# 다시보기 UI 개선 실행 계획

> 작성일: 2026-01-14
> 기반: UI 구조 분석 보고서 및 Website Builder 원칙

---

## 📋 목차

1. [Phase 1: 긴급 개선 (1-2주)](#phase-1-긴급-개선)
2. [Phase 2: 경험 개선 (2-3주)](#phase-2-경험-개선)
3. [Phase 3: 고급 기능 (3-4주)](#phase-3-고급-기능)
4. [우선순위 매트릭스](#우선순위-매트릭스)
5. [파일별 작업 가이드](#파일별-작업-가이드)

---

## Phase 1: 긴급 개선 (1-2주)

### 🎯 목표
- 모바일 UX 개선
- 접근성 기본 충족
- SEO 기초 구축

### 📝 작업 항목

#### 1. 모바일 반응형 최적화 (2일)

**영향도: 높음 | 난이도: 낮음**

##### RecapPage.tsx
```tsx
// 1.1 고정 배지 반응형 개선 (line 495)
// Before:
<div className="fixed top-24 right-4 z-40 flex items-center gap-3 ...">

// After:
<div className="fixed top-20 right-2 sm:top-24 sm:right-4 z-40 flex items-center gap-3 ...">
```

```tsx
// 1.2 비디오 그리드 브레이크포인트 추가 (line 557)
// Before:
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

// After:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
```

```tsx
// 1.3 사용자 배지 텍스트 길이 제한 개선 (line 500)
// Before:
<span className="text-sm font-medium text-foreground max-w-[150px] truncate">

// After:
<span className="text-xs sm:text-sm font-medium text-foreground max-w-[100px] sm:max-w-[150px] truncate">
```

##### RecapAuthPage.tsx
```tsx
// 1.4 카드 최대 너비 반응형 조정 (line 238)
// Before:
<div className="container mx-auto max-w-md">

// After:
<div className="container mx-auto max-w-full sm:max-w-md px-4">
```

---

#### 2. 접근성 개선 (3일)

**영향도: 높음 | 난이도: 낮음**

##### 2.1 포커스 상태 추가
```css
/* src/index.css에 추가 */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary;
}

/* 모든 Input, Button에 적용 */
Input, Button {
  @apply focus-ring;
}
```

##### 2.2 aria-label 추가

**RecapPage.tsx**
```tsx
// 사용자 상태 아이콘 (line 312, 384, 441, 497)
<div
  className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center"
  aria-label="다시보기 서비스 미등록"
>
  <Plus className="w-4 h-4 text-blue-600" aria-hidden="true" />
</div>

<div
  className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center"
  aria-label="승인 대기 중"
>
  <Clock className="w-4 h-4 text-amber-600" aria-hidden="true" />
</div>

<div
  className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center"
  aria-label="접근 거부됨"
>
  <XCircle className="w-4 h-4 text-red-600" aria-hidden="true" />
</div>

<div
  className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center"
  aria-label="접근 승인됨"
>
  <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
</div>
```

```tsx
// 비디오 카드 잠금 오버레이 (line 586)
<div
  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center"
  aria-label={`${getAccessLevelLabel(video.accessLevel)} 등급 이상 필요`}
>
  <Lock className="w-12 h-12 text-white mb-2" aria-hidden="true" />
  <Badge variant="outline" className={`${getAccessLevelColor(video.accessLevel)} border-white`}>
    {getAccessLevelLabel(video.accessLevel)} 이상 필요
  </Badge>
</div>
```

##### 2.3 키보드 네비게이션 지원

**RecapPage.tsx**
```tsx
// 비디오 카드에 키보드 지원 추가 (line 564)
<div
  key={video.id}
  onClick={() => canAccess && setSelectedVideo(video)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      canAccess && setSelectedVideo(video);
    }
  }}
  tabIndex={canAccess ? 0 : -1}
  role="button"
  aria-label={`${video.title} 비디오 재생`}
  className={`block ${canAccess ? 'cursor-pointer' : 'cursor-not-allowed'}`}
>
```

##### 2.4 에러 메시지 접근성

**RecapAuthPage.tsx**
```tsx
// 로그인 에러 (line 293)
{loginError && (
  <Alert variant="destructive" role="alert" aria-live="assertive">
    <AlertCircle className="h-4 w-4" aria-hidden="true" />
    <AlertDescription>{loginError}</AlertDescription>
  </Alert>
)}

// 회원가입 에러 (line 429)
{signupError && (
  <Alert variant="destructive" role="alert" aria-live="assertive">
    <AlertCircle className="h-4 w-4" aria-hidden="true" />
    <AlertDescription>{signupError}</AlertDescription>
  </Alert>
)}
```

##### 2.5 색상 대비 확인 및 수정

**필요시 수정할 부분:**
```tsx
// RecapPage.tsx - 접근 등급 배지 색상 (line 107-112)
const getAccessLevelColor = (level: AccessLevel): string => {
  const colors: Record<AccessLevel, string> = {
    'preview': 'bg-gray-200 text-gray-800 border-gray-400',      // 대비 개선
    'session1': 'bg-blue-200 text-blue-800 border-blue-400',     // 대비 개선
    'graduate': 'bg-green-200 text-green-800 border-green-400',  // 대비 개선
  };
  return colors[level];
};
```

---

#### 3. SEO 기초 구축 (2일)

**영향도: 중간 | 난이도: 낮음**

##### 3.1 메타 태그 추가

**src/components/seo/RecapSEO.tsx (새 파일)**
```tsx
import { Helmet } from 'react-helmet-async';

interface RecapSEOProps {
  title?: string;
  description?: string;
}

export const RecapSEO = ({
  title = "마스터 코스 다시보기",
  description = "JSHA 마스터 코스 수료자 및 등록자 전용 다시보기 서비스. 강의 영상을 언제든지 다시 시청하세요. 평생 무제한 접근 가능합니다."
}: RecapSEOProps) => {
  const fullTitle = `${title} - JSHA 마스터코스`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="다시보기, 강의영상, JSHA마스터코스, 수료자, 온라인강의, 평생교육" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/og-recap.jpg" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
```

**RecapAuthPage.tsx 적용**
```tsx
import { RecapSEO } from '@/components/seo/RecapSEO';

const RecapAuthPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <RecapSEO
        title="로그인 / 회원가입"
        description="JSHA 마스터 코스 다시보기 서비스 로그인 및 회원가입 페이지. 수료자라면 지금 바로 가입하고 평생 영상에 접근하세요."
      />
      <Header />
      {/* ... */}
    </div>
  );
};
```

##### 3.2 구조화된 데이터

**src/utils/structured-data.ts (새 파일)**
```tsx
export const recapServiceSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "JSHA 마스터 코스",
  "url": "https://jshamaster.com",
  "description": "전문 임상가를 위한 통합의학 마스터코스",
  "offers": {
    "@type": "Offer",
    "name": "다시보기 서비스",
    "description": "수료자 전용 강의 영상 다시보기",
    "category": "Educational",
    "priceCurrency": "KRW",
    "price": "0",
    "availability": "https://schema.org/InStock"
  }
};
```

**RecapSEO.tsx에 통합**
```tsx
export const RecapSEO = ({ title, description }: RecapSEOProps) => {
  return (
    <Helmet>
      {/* 기존 메타 태그 */}

      {/* 구조화된 데이터 */}
      <script type="application/ld+json">
        {JSON.stringify(recapServiceSchema)}
      </script>
    </Helmet>
  );
};
```

---

#### 4. 콘텐츠 개선 (1일)

##### 4.1 회원가입 페이지 헤더 개선

**RecapAuthPage.tsx (line 244-249)**
```tsx
// Before:
<h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
  마스터 코스 다시보기
</h1>
<p className="text-lg text-muted-foreground">
  수료자 및 등록자 전용 영상 서비스입니다
</p>

// After:
<h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
  JSHA 마스터 코스 다시보기
  <span className="block text-2xl md:text-3xl text-primary mt-2">
    수료자 전용 영상 서비스
  </span>
</h1>
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
  마스터 코스 수료자라면 지금 바로 가입하고 <strong>평생 무제한</strong>으로
  강의 영상에 접근하세요. JSHA 공식 다시보기 서비스로 언제든지 강의 내용을 복습할 수 있습니다.
</p>
```

##### 4.2 수료 기수 필드 설명 추가

**RecapAuthPage.tsx (line 390-399)**
```tsx
<div className="space-y-2">
  <Label htmlFor="signupBatch">수료 기수 (선택)</Label>
  <Input
    id="signupBatch"
    type="text"
    placeholder="예: 1기"
    value={signupBatch}
    onChange={(e) => setSignupBatch(e.target.value)}
    disabled={signupLoading}
  />
  <p className="text-xs text-muted-foreground">
    💡 <strong>팁:</strong> 입학 때 등록한 이메일과 동일하고 기수를 정확히 입력하면
    <strong className="text-primary"> 즉시 자동 승인</strong>됩니다!
  </p>
</div>
```

---

## Phase 2: 경험 개선 (2-3주)

### 🎯 목표
- 디자인 일관성 확보
- 마케팅 퍼널 최적화
- 성능 개선

### 📝 작업 항목

#### 1. 디자인 시스템 구축 (5일)

**영향도: 중간 | 난이도: 중간**

##### 1.1 디자인 토큰 정의

**src/styles/design-tokens.ts (새 파일)**
```typescript
export const designTokens = {
  colors: {
    primary: {
      DEFAULT: '#2F6FED',
      50: '#f0f6ff',
      100: '#e0ecff',
      500: '#2F6FED',
      600: '#1d4ed8',
      700: '#1e3a8a',
    },
    secondary: {
      DEFAULT: '#10b981',
      500: '#10b981',
      600: '#059669',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',

    // 접근 등급 색상
    accessLevel: {
      preview: {
        bg: 'rgb(229, 231, 235)',    // gray-200
        text: 'rgb(31, 41, 55)',      // gray-800
        border: 'rgb(156, 163, 175)', // gray-400
      },
      session1: {
        bg: 'rgb(191, 219, 254)',    // blue-200
        text: 'rgb(30, 64, 175)',     // blue-800
        border: 'rgb(96, 165, 250)',  // blue-400
      },
      graduate: {
        bg: 'rgb(167, 243, 208)',    // green-200
        text: 'rgb(22, 101, 52)',     // green-800
        border: 'rgb(74, 222, 128)',  // green-400
      },
    },
  },

  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      heading: 'Poppins, -apple-system, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
  },

  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
};
```

##### 1.2 Tailwind Config 통합

**tailwind.config.js**
```javascript
import { designTokens } from './src/styles/design-tokens';

export default {
  theme: {
    extend: {
      colors: {
        primary: designTokens.colors.primary,
        secondary: designTokens.colors.secondary,
        success: designTokens.colors.success,
        warning: designTokens.colors.warning,
        error: designTokens.colors.error,
      },
      spacing: designTokens.spacing,
      fontSize: designTokens.typography.fontSize,
      fontFamily: designTokens.typography.fontFamily,
      boxShadow: designTokens.shadows,
      borderRadius: designTokens.borderRadius,
    },
  },
};
```

##### 1.3 접근 등급 색상 리팩토링

**RecapPage.tsx (line 106-113)**
```tsx
import { designTokens } from '@/styles/design-tokens';

const getAccessLevelColor = (level: AccessLevel): string => {
  const { accessLevel } = designTokens.colors;
  const colors: Record<AccessLevel, string> = {
    'preview': `bg-[${accessLevel.preview.bg}] text-[${accessLevel.preview.text}] border-[${accessLevel.preview.border}]`,
    'session1': `bg-[${accessLevel.session1.bg}] text-[${accessLevel.session1.text}] border-[${accessLevel.session1.border}]`,
    'graduate': `bg-[${accessLevel.graduate.bg}] text-[${accessLevel.graduate.text}] border-[${accessLevel.graduate.border}]`,
  };
  return colors[level];
};
```

---

#### 2. 마케팅 퍼널 최적화 (5일)

**영향도: 높음 | 난이도: 중간**

##### 2.1 회원가입 가치 제안 강화

**RecapAuthPage.tsx - 회원가입 탭 상단에 추가 (line 361)**
```tsx
<TabsContent value="signup">
  {/* 가치 제안 배너 추가 */}
  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mb-6 border border-primary/20">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
        <CheckCircle className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">지금 가입하면</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span><strong>평생 무제한</strong> 영상 시청</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span><strong>즉시 자동 승인</strong> (조건: 등록 이메일 + 기수 입력)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span><strong>신규 영상 추가</strong> 시 이메일 알림</span>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <form onSubmit={handleSignup} className="space-y-4 mt-4">
    {/* 기존 폼 필드 */}
  </form>
</TabsContent>
```

##### 2.2 Pending 상태 개선

**RecapPage.tsx - Pending 화면 (line 375-430)**
```tsx
// 승인 대기 중
if (accessStatus === 'pending') {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* 우측 상단 사용자 정보 */}
      <div className="fixed top-20 right-2 sm:top-24 sm:right-4 z-40 flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center" aria-label="승인 대기 중">
            <Clock className="w-4 h-4 text-amber-600" aria-hidden="true" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-foreground max-w-[100px] sm:max-w-[150px] truncate">
            {user?.email || "인증된 사용자"}
          </span>
        </div>
        <div className="h-4 w-px bg-gray-300"></div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
        >
          <LogOut className="w-3 h-3 mr-1" />
          로그아웃
        </Button>
      </div>

      <main className="pt-40 pb-20 px-4 bg-gradient-to-br from-primary/7 via-background to-secondary/7 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-2 border-amber-500/20 bg-amber-500/5">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-3xl mb-4">승인 대기 중</CardTitle>
              <p className="text-muted-foreground">
                관리자가 등록 신청을 검토 중입니다.
                <br />
                승인 완료 후 영상을 시청하실 수 있습니다.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 진행률 시각화 추가 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>신청 완료</span>
                  <span>검토 중</span>
                  <span>승인 대기</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full animate-pulse" style={{ width: '66%' }}></div>
                  </div>
                </div>
              </div>

              {/* 예상 시간 안내 */}
              <div className="bg-white/50 rounded-lg p-4 text-sm">
                <p className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  예상 승인 시간
                </p>
                <p className="text-muted-foreground">
                  일반적으로 <strong className="text-foreground">24시간 이내</strong>에 승인이 완료됩니다.
                  <br />
                  입학 시 등록한 이메일과 기수를 정확히 입력하셨다면 더 빨리 처리됩니다.
                </p>
              </div>

              {/* 조기 승인 팁 */}
              <div className="bg-blue-50 rounded-lg p-4 text-sm border border-blue-200">
                <p className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  💡 조기 승인 팁
                </p>
                <ul className="text-blue-800 space-y-1">
                  <li>• 등록한 이메일이 입학 당시와 동일한지 확인하세요</li>
                  <li>• 수료 기수를 정확히 입력하셨나요?</li>
                  <li>• 승인 완료 시 이메일로 알림을 보내드립니다</li>
                </ul>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  문의: <a href="mailto:jshaworkshop@gmail.com" className="text-primary hover:underline">jshaworkshop@gmail.com</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

##### 2.3 첫 접근 경험 개선

**RecapPage.tsx - Approved 상태 (line 525 이후에 추가)**
```tsx
// 승인된 경우: 영상 목록 표시
return (
  <div className="min-h-screen bg-background">
    <Header />

    {/* 우측 상단 사용자 정보 - 기존 유지 */}

    <main className="pt-40 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">

        {/* 첫 방문자용 웰컴 배너 (sessionStorage로 1회만 표시) */}
        {!sessionStorage.getItem('recap_welcomed') && (
          <div className="mb-8 bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 shadow-lg animate-fade-in">
            <button
              onClick={() => {
                sessionStorage.setItem('recap_welcomed', 'true');
                document.getElementById('welcome-banner')?.remove();
              }}
              className="float-right text-white/80 hover:text-white"
              aria-label="배너 닫기"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">축하합니다! 승인이 완료되었습니다 🎉</h2>
                <p className="text-white/90 mb-4">
                  이제 마스터 코스의 모든 영상을 <strong>평생 무제한</strong>으로 시청할 수 있습니다.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                    <Video className="w-4 h-4" />
                    <span className="text-sm">{videos.length}개 영상 제공</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">{getAccessLevelLabel(registrantData?.accessLevel || 'preview')} 권한</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 헤더 - 기존 유지 */}
        <div className="text-center mb-12 animate-fade-in">
          {/* ... */}
        </div>

        {/* 영상 목록 - 기존 유지 */}
      </div>
    </main>
    <Footer />
  </div>
);
```

---

#### 3. 성능 최적화 (3일)

**영향도: 중간 | 난이도: 중간**

##### 3.1 이미지 Lazy Loading

**RecapPage.tsx - 비디오 썸네일 (line 577)**
```tsx
<img
  src={getVideoThumbnail(video.vimeoUrl, video.thumbnail)}
  alt={video.title}
  className={`w-full h-48 object-cover transition-transform duration-300 ${
    canAccess ? 'group-hover:scale-105' : 'filter grayscale'
  }`}
  loading="lazy"
  decoding="async"
/>
```

##### 3.2 React Query 도입

**src/hooks/useRecapVideos.ts (새 파일)**
```tsx
import { useQuery } from '@tanstack/react-query';
import { getAllRecapVideos } from '@/lib/firestore';

export const useRecapVideos = (publishedOnly: boolean = true) => {
  return useQuery({
    queryKey: ['recap-videos', publishedOnly],
    queryFn: () => getAllRecapVideos(publishedOnly),
    staleTime: 1000 * 60 * 5,  // 5분
    gcTime: 1000 * 60 * 10,     // 10분 (cacheTime의 새 이름)
  });
};
```

**RecapPage.tsx에 적용**
```tsx
import { useRecapVideos } from '@/hooks/useRecapVideos';

const RecapPage = () => {
  // 기존 state 제거
  // const [videos, setVideos] = useState<RecapVideo[]>([]);
  // const [videosLoading, setVideosLoading] = useState(true);

  // React Query로 대체
  const { data: videos = [], isLoading: videosLoading } = useRecapVideos(true);

  // useEffect 제거 (React Query가 자동 관리)
};
```

##### 3.3 Bundle 크기 최적화

**RecapPage.tsx - 아이콘 최적화 (line 7)**
```tsx
// Before: 모든 아이콘 한번에 import
import { PlayCircle, CheckCircle, Video, LogOut, Clock, XCircle, X, Lock, Shield, Plus } from "lucide-react";

// After: Tree-shaking 최적화
import PlayCircle from "lucide-react/dist/esm/icons/play-circle";
import CheckCircle from "lucide-react/dist/esm/icons/check-circle";
import Video from "lucide-react/dist/esm/icons/video";
import LogOut from "lucide-react/dist/esm/icons/log-out";
import Clock from "lucide-react/dist/esm/icons/clock";
import XCircle from "lucide-react/dist/esm/icons/x-circle";
import X from "lucide-react/dist/esm/icons/x";
import Lock from "lucide-react/dist/esm/icons/lock";
import Shield from "lucide-react/dist/esm/icons/shield";
import Plus from "lucide-react/dist/esm/icons/plus";
```

---

## Phase 3: 고급 기능 (3-4주)

### 🎯 목표
- 사용자 경험 극대화
- 데이터 기반 최적화
- 재방문 유도

### 📝 작업 항목

#### 1. 시청 진행률 추적 (5일)

**영향도: 중간 | 난이도: 높음**

##### 1.1 Firestore 데이터 구조

**새 컬렉션: `videoProgress` (users/{uid}/videoProgress/{videoId})**
```typescript
interface VideoProgress {
  videoId: string;
  userId: string;
  lastPosition: number;    // 초 단위
  duration: number;        // 총 길이 (초)
  completed: boolean;      // 90% 이상 시청 시 true
  lastWatchedAt: string;   // ISO 8601
}
```

##### 1.2 진행률 저장 함수

**src/lib/firestore.ts에 추가**
```typescript
export const saveVideoProgress = async (
  userId: string,
  videoId: string,
  position: number,
  duration: number
): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');

  const completed = (position / duration) >= 0.9; // 90% 이상

  await setDoc(
    doc(db, 'users', userId, 'videoProgress', videoId),
    {
      videoId,
      userId,
      lastPosition: position,
      duration,
      completed,
      lastWatchedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

export const getVideoProgress = async (
  userId: string,
  videoId: string
): Promise<VideoProgress | null> => {
  if (!db) throw new Error('Firestore is not initialized');

  const progressDoc = await getDoc(
    doc(db, 'users', userId, 'videoProgress', videoId)
  );

  if (progressDoc.exists()) {
    return progressDoc.data() as VideoProgress;
  }

  return null;
};
```

##### 1.3 Vimeo Player API 통합

**RecapPage.tsx - 모달 내 iframe 수정 (line 633-650)**
```tsx
import Player from '@vimeo/player';

// 비디오 플레이어 모달
<Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
  <DialogContent className="max-w-5xl w-full p-0 overflow-hidden">
    <DialogHeader className="p-4 pb-2">
      <DialogTitle className="pr-8">{selectedVideo?.title}</DialogTitle>
    </DialogHeader>
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      {selectedVideo && (
        <VimeoPlayer
          video={selectedVideo}
          userId={user?.uid}
        />
      )}
    </div>
  </DialogContent>
</Dialog>
```

**새 컴포넌트: src/components/recap/VimeoPlayer.tsx**
```tsx
import { useEffect, useRef } from 'react';
import Player from '@vimeo/player';
import { saveVideoProgress, getVideoProgress } from '@/lib/firestore';

interface VimeoPlayerProps {
  video: RecapVideo;
  userId?: string;
}

export const VimeoPlayer = ({ video, userId }: VimeoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const player = new Player(iframeRef.current);
    playerRef.current = player;

    // 마지막 재생 위치 로드
    if (userId) {
      getVideoProgress(userId, video.id).then((progress) => {
        if (progress && progress.lastPosition > 5) {
          player.setCurrentTime(progress.lastPosition);
        }
      });
    }

    // 진행률 저장 (30초마다)
    let progressInterval: NodeJS.Timeout;
    if (userId) {
      progressInterval = setInterval(async () => {
        const [currentTime, duration] = await Promise.all([
          player.getCurrentTime(),
          player.getDuration(),
        ]);

        await saveVideoProgress(userId, video.id, currentTime, duration);
      }, 30000); // 30초
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      player.destroy();
    };
  }, [video.id, userId]);

  return (
    <iframe
      ref={iframeRef}
      src={getEmbedUrl(video.vimeoUrl)}
      className="absolute inset-0 w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={video.title}
    />
  );
};
```

##### 1.4 진행률 표시

**RecapPage.tsx - 비디오 카드에 진행률 바 추가**
```tsx
<CardHeader className="p-0">
  <div className="relative overflow-hidden rounded-t-xl">
    <img ... />

    {/* 기존 오버레이들 */}

    {/* 진행률 바 (하단) */}
    {canAccess && videoProgress[video.id] && (
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${(videoProgress[video.id].lastPosition / videoProgress[video.id].duration) * 100}%` }}
        />
      </div>
    )}

    {/* 완료 뱃지 */}
    {canAccess && videoProgress[video.id]?.completed && (
      <div className="absolute top-2 left-2 bg-success text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        완료
      </div>
    )}
  </div>
</CardHeader>
```

---

#### 2. 추천 시스템 (4일)

**영향도: 낮음 | 난이도: 높음**

##### 2.1 비슷한 비디오 추천

**src/utils/video-recommendations.ts (새 파일)**
```typescript
import { RecapVideo } from '@/lib/firestore';

export const getSimilarVideos = (
  currentVideo: RecapVideo,
  allVideos: RecapVideo[],
  limit: number = 3
): RecapVideo[] => {
  return allVideos
    .filter(v => v.id !== currentVideo.id)
    .filter(v => v.module === currentVideo.module) // 같은 모듈
    .slice(0, limit);
};

export const getNextVideo = (
  currentVideo: RecapVideo,
  allVideos: RecapVideo[]
): RecapVideo | null => {
  const sortedVideos = allVideos.sort((a, b) => a.order - b.order);
  const currentIndex = sortedVideos.findIndex(v => v.id === currentVideo.id);

  if (currentIndex >= 0 && currentIndex < sortedVideos.length - 1) {
    return sortedVideos[currentIndex + 1];
  }

  return null;
};
```

##### 2.2 모달에 추천 비디오 표시

**RecapPage.tsx - Dialog 하단에 추가**
```tsx
<Dialog open={!!selectedVideo} onOpenChange={...}>
  <DialogContent className="max-w-5xl w-full p-0 overflow-hidden">
    {/* 비디오 플레이어 */}

    {/* 추천 비디오 섹션 */}
    {selectedVideo && (
      <div className="p-4 bg-muted/30">
        <h3 className="font-semibold mb-3">다음 영상</h3>
        <div className="grid grid-cols-3 gap-3">
          {getSimilarVideos(selectedVideo, videos, 3).map((video) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="text-left hover:bg-muted/50 rounded-lg p-2 transition-colors"
            >
              <img
                src={getVideoThumbnail(video.vimeoUrl, video.thumbnail)}
                alt={video.title}
                className="w-full h-20 object-cover rounded mb-2"
              />
              <p className="text-sm font-medium line-clamp-2">{video.title}</p>
              <p className="text-xs text-muted-foreground">{video.duration}</p>
            </button>
          ))}
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
```

---

#### 3. 이메일 알림 시스템 (3일)

**영향도: 중간 | 난이도: 중간**

##### 3.1 새 영상 알림

**Firestore Trigger (Firebase Functions 필요)**
```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

export const notifyNewVideo = functions.firestore
  .document('recapVideos/{videoId}')
  .onCreate(async (snap, context) => {
    const video = snap.data();

    // 승인된 모든 사용자 조회
    const usersSnapshot = await admin.firestore()
      .collection('recapRegistrants')
      .where('status', '==', 'approved')
      .get();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: functions.config().email.user,
        pass: functions.config().email.pass,
      },
    });

    // 이메일 발송
    const promises = usersSnapshot.docs.map(async (doc) => {
      const user = doc.data();

      if (!user.marketingAgreed) return; // 마케팅 동의 확인

      return transporter.sendMail({
        from: '"JSHA 마스터코스" <noreply@jshamaster.com>',
        to: user.email,
        subject: `📹 새로운 강의 영상이 추가되었습니다 - ${video.title}`,
        html: `
          <h2>새로운 강의 영상이 추가되었습니다!</h2>
          <p><strong>${video.title}</strong></p>
          <p>${video.description}</p>
          <p>
            <a href="https://jshamaster.com/recap"
               style="background: #2F6FED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              지금 시청하기
            </a>
          </p>
        `,
      });
    });

    await Promise.all(promises);
  });
```

---

## 우선순위 매트릭스

```
높은 영향도 | 낮은 난이도 → 최우선
├─ 모바일 반응형 최적화 ⭐⭐⭐
├─ 접근성 개선 ⭐⭐⭐
└─ 콘텐츠 개선 ⭐⭐

높은 영향도 | 중간 난이도 → 우선
├─ 마케팅 퍼널 최적화 ⭐⭐
└─ SEO 기초 구축 ⭐⭐

중간 영향도 | 중간 난이도 → 보통
├─ 디자인 시스템 구축 ⭐
├─ 성능 최적화 ⭐
└─ 시청 진행률 추적 ⭐

낮은 영향도 | 높은 난이도 → 후순위
├─ 추천 시스템
└─ 이메일 알림 시스템
```

---

## 파일별 작업 가이드

### 우선순위 1: RecapPage.tsx

```
📂 src/pages/RecapPage.tsx
├─ Line 7: 아이콘 import 최적화
├─ Line 106-113: 접근 등급 색상 개선 (대비)
├─ Line 312, 384, 441, 497: aria-label 추가
├─ Line 495: 고정 배지 반응형
├─ Line 557: 비디오 그리드 브레이크포인트
├─ Line 564: 키보드 네비게이션
├─ Line 577: 이미지 lazy loading
└─ Line 586: 잠금 오버레이 aria-label
```

### 우선순위 2: RecapAuthPage.tsx

```
📂 src/pages/RecapAuthPage.tsx
├─ Line 244-249: 헤더 개선
├─ Line 238: 카드 최대 너비 반응형
├─ Line 293, 429: 에러 메시지 접근성
├─ Line 361: 회원가입 가치 제안 배너
└─ Line 390-399: 수료 기수 설명 추가
```

### 우선순위 3: 새 파일 생성

```
📂 src/
├─ components/
│  ├─ seo/
│  │  └─ RecapSEO.tsx (새로 생성)
│  └─ recap/
│     └─ VimeoPlayer.tsx (새로 생성)
├─ styles/
│  └─ design-tokens.ts (새로 생성)
├─ hooks/
│  └─ useRecapVideos.ts (새로 생성)
└─ utils/
   ├─ structured-data.ts (새로 생성)
   └─ video-recommendations.ts (새로 생성)
```

### 우선순위 4: 설정 파일

```
📂 프로젝트 루트
├─ tailwind.config.js (수정)
├─ src/index.css (focus-ring 추가)
└─ package.json (React Query 추가)
```

---

## 체크리스트

### Phase 1 완료 조건

- [ ] 모바일에서 고정 배지가 올바르게 표시됨
- [ ] 비디오 그리드가 sm 브레이크포인트에서 2열로 표시됨
- [ ] 모든 인터랙티브 요소에 포커스 링이 표시됨
- [ ] 스크린 리더로 모든 주요 요소 읽기 가능
- [ ] 엔터 키로 비디오 카드 클릭 가능
- [ ] 색상 대비가 WCAG AA 기준 충족
- [ ] 메타 태그가 모든 페이지에 추가됨
- [ ] 구조화된 데이터가 포함됨
- [ ] 회원가입 헤더가 개선됨
- [ ] 수료 기수 필드에 설명이 추가됨

### Phase 2 완료 조건

- [ ] 디자인 토큰이 정의되고 Tailwind에 통합됨
- [ ] 접근 등급 색상이 토큰 기반으로 변경됨
- [ ] 회원가입 탭에 가치 제안 배너가 표시됨
- [ ] Pending 상태에 진행률 바가 표시됨
- [ ] 첫 방문자에게 웰컴 배너가 표시됨
- [ ] 이미지에 lazy loading이 적용됨
- [ ] React Query가 도입되어 비디오 데이터 캐싱됨
- [ ] Bundle 크기가 최적화됨

### Phase 3 완료 조건

- [ ] 비디오 진행률이 Firestore에 저장됨
- [ ] 비디오 카드에 진행률 바가 표시됨
- [ ] 완료된 비디오에 완료 뱃지가 표시됨
- [ ] 비디오 모달에 추천 비디오가 표시됨
- [ ] 새 영상 추가 시 이메일 알림 발송됨

---

## 성공 지표

### 정량적 지표

| 메트릭 | 현재 | 목표 | 측정 방법 |
|--------|------|------|---------|
| 모바일 이탈률 | - | <30% | Google Analytics |
| 회원가입 전환율 | - | 80% | Firestore 분석 |
| 첫 시청까지 시간 | - | <2분 | 시간 추적 |
| 재방문율 (7일) | - | 40% | Google Analytics |
| 페이지 로딩 속도 | - | <2초 | Lighthouse |
| 접근성 점수 | - | >90 | Lighthouse |

### 정성적 지표

- [ ] 사용자 피드백 수집 (설문조사)
- [ ] 모바일 사용성 테스트 통과
- [ ] 스크린 리더 테스트 통과
- [ ] 키보드 네비게이션 테스트 통과

---

## 다음 단계

1. **Phase 1 작업 시작**
   - TodoList 생성
   - 각 작업 항목별 담당자 배정
   - 일정 수립

2. **개발 환경 설정**
   - React Query 설치
   - Vimeo Player SDK 설치
   - 필요한 타입 정의

3. **테스트 계획 수립**
   - 모바일 테스트 시나리오
   - 접근성 체크리스트
   - 성능 벤치마크

4. **배포 전략**
   - 스테이징 환경 테스트
   - A/B 테스트 계획
   - 롤백 계획

---

## 참고 자료

- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Query 문서](https://tanstack.com/query/latest)
- [Vimeo Player API](https://developer.vimeo.com/player/sdk)
- [Lighthouse 성능 가이드](https://web.dev/lighthouse-performance/)
- Website Builder 시스템 분석 (lessons.md)

---

**작성자:** Claude Code
**버전:** 1.0
**최종 수정:** 2026-01-14
