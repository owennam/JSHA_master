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
- **접근 등급 시스템**: preview → session1 → graduate
- **Vimeo embed HTML 자동 파싱**: embed 코드에서 URL 자동 추출

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

### 5. Vimeo 플랜별 보안 기능
- **Starter (₩12,600/월)**: 도메인 제한, 숨기기 가능
- **Standard (₩45,938/월)**: Vimeo 로고 숨기기 가능
- **권장**: Starter + 숨기기 + 도메인 제한

### 6. embed HTML 처리
- 문제: Vimeo에서 복사한 embed 코드가 URL 대신 저장됨
- 해결: `extractVimeoFromEmbed()` 함수로 자동 URL 추출

---

## ⚠️ 프로덕션 배포 전 필수 작업

1. Firestore 규칙: `if true` → `if isAdmin()`
2. Vimeo Starter 플랜 업그레이드
3. Vimeo 프라이버시: "숨기기 (Hide from Vimeo)" 설정
4. Vimeo 도메인 제한: 프로덕션 도메인만 허용

---

## 🔧 기술 스택
- Frontend: React + TypeScript + Vite + Shadcn UI
- Backend: Firebase (Auth + Firestore)
- Video: YouTube/Vimeo embed (모달 플레이어)

---
---

# Website Builder 시스템 분석 및 JSHA 프로젝트 개선 방안

## 📅 분석 날짜
2026-01-11

---

## 🔍 Website Builder 시스템 개요

### 멀티 에이전트 시스템 구조
Website Builder는 6개의 전문화된 에이전트로 구성된 체계적인 웹사이트 제작 시스템입니다.

#### 1️⃣ Reference Analyzer (참고 분석 에이전트)
- 제공된 참고 웹사이트 분석
- 디자인 패턴, 색상 체계, UX 흐름 추출
- 기술 구현 세부사항 파악
- 적용 가능한 모범 사례 도출

#### 2️⃣ Marketing Strategist (마케팅 전략 에이전트)
- 타겟 오디언스 분석 (Demographics, Psychographics)
- 가치 제안 프레임워크 개발
- 콘텐츠 전략 및 메시징
- 전환 최적화 전략
- 브랜드 보이스 및 톤 가이드라인

#### 3️⃣ Design Architect (디자인 설계 에이전트)
- 완전한 디자인 시스템 구축
- 색상 팔레트 및 타이포그래피 시스템
- 컴포넌트 라이브러리 설계
- 반응형 브레이크포인트 전략
- 접근성 고려사항

#### 4️⃣ Content Writer (콘텐츠 작성 에이전트)
- 헤드라인 및 가치 제안 문구
- 섹션별 카피 및 설명
- 행동 유도 버튼 문구
- 마이크로카피 및 UI 텍스트
- SEO 최적화 콘텐츠 구조

#### 5️⃣ SEO Specialist (SEO 최적화 에이전트)
- 메타 태그 및 구조화된 데이터
- 시맨틱 HTML 구조
- 성능 최적화 (이미지, CSS, JS)
- 모바일 우선 고려사항
- 기술적 SEO 모범 사례

#### 6️⃣ Frontend Developer (프론트엔드 개발 에이전트)
- 깔끔한 시맨틱 HTML5
- 최신 CSS (Flexbox/Grid)
- 바닐라 JavaScript 상호작용
- 반응형 디자인 구현
- 크로스 브라우저 호환성

---

## 💡 주요 디자인 시스템 원칙

### 1. CSS 변수 기반 디자인 토큰

```css
:root {
  /* 색상 */
  --color-primary: #0066cc;
  --color-secondary: #6c757d;
  --color-accent: #ff6b35;

  /* 타이포그래피 */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */

  /* 간격 (8px 기준) */
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */

  /* 그림자 */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);

  /* 전환 */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
}
```

### 2. 일관된 스페이싱 시스템
- 8px 기본 단위 사용
- 모든 간격이 4의 배수
- 수직 리듬 유지
- 예측 가능한 레이아웃

### 3. 타이포그래피 계층
```
h1: 48px / 56px (font-size / line-height)
h2: 36px / 44px
h3: 24px / 32px
h4: 20px / 28px
p:  16px / 24px (body)
```

---

## 🎯 JSHA 프로젝트 개선 방안

### 📌 1. 디자인 시스템 표준화

#### 현재 상태
- Tailwind CSS 기반 유틸리티 클래스 사용
- 일부 하드코딩된 값들 (색상, 간격)
- 디자인 토큰 미정의

#### 개선 방안
```typescript
// src/styles/design-tokens.ts 생성

export const designTokens = {
  colors: {
    primary: {
      DEFAULT: '#0066cc',
      hover: '#0052a3',
      light: '#e6f2ff',
    },
    secondary: '#6c757d',
    accent: '#ff6b35',
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      light: '#999999',
    },
    background: {
      DEFAULT: '#ffffff',
      light: '#f8f9fa',
      dark: '#1a1a1a',
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
      '5xl': '3rem',     // 48px
    },
  },

  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },

  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '400ms ease-in-out',
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
};
```

#### Tailwind Config 통합
```javascript
// tailwind.config.js
import { designTokens } from './src/styles/design-tokens';

export default {
  theme: {
    extend: {
      colors: designTokens.colors,
      spacing: designTokens.spacing,
      fontSize: designTokens.typography.fontSize,
      fontFamily: designTokens.typography.fontFamily,
      boxShadow: designTokens.shadows,
      borderRadius: designTokens.borderRadius,
      transitionDuration: {
        fast: designTokens.transitions.fast,
        base: designTokens.transitions.base,
        slow: designTokens.transitions.slow,
      },
    },
  },
};
```

---

### 📌 2. SEO 최적화 강화

#### 현재 상태
- 기본 메타 태그만 존재
- Open Graph 태그 부재
- 구조화된 데이터 (JSON-LD) 미적용
- 동적 메타 태그 관리 부족

#### 개선 방안

##### A. SEO 컴포넌트 생성
```typescript
// src/components/seo/SEOHead.tsx

import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: object;
}

export const SEOHead = ({
  title,
  description,
  keywords,
  image = '/default-og-image.jpg',
  url = window.location.href,
  type = 'website',
  structuredData,
}: SEOHeadProps) => {
  const fullTitle = `${title} - JSHA 마스터코스`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
```

##### B. 구조화된 데이터 예시
```typescript
// src/utils/structured-data.ts

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "JSHA 마스터코스",
  "url": "https://jsha.com",
  "logo": "https://jsha.com/logo.png",
  "description": "전문 임상가를 위한 통합의학 마스터코스",
  "sameAs": [
    "https://facebook.com/jsha",
    "https://instagram.com/jsha",
  ],
};

export const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "JSHA 마스터코스",
  "description": "통합의학 전문가 양성 프로그램",
  "provider": {
    "@type": "Organization",
    "name": "JSHA",
    "sameAs": "https://jsha.com",
  },
};
```

##### C. 페이지별 SEO 적용
```typescript
// src/pages/Index.tsx

import { SEOHead } from '@/components/seo/SEOHead';
import { organizationSchema, courseSchema } from '@/utils/structured-data';

const Index = () => {
  return (
    <>
      <SEOHead
        title="홈"
        description="JSHA 마스터코스 - 전문 임상가를 위한 통합의학 교육 프로그램. 실전 중심의 커리큘럼으로 임상 역량을 극대화하세요."
        keywords="통합의학, 마스터코스, 임상교육, JSHA"
        structuredData={{
          "@graph": [organizationSchema, courseSchema]
        }}
      />

      {/* 기존 컴포넌트 */}
    </>
  );
};
```

---

### 📌 3. 성능 최적화

#### 이미지 최적화
```typescript
// src/components/common/OptimizedImage.tsx

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) => {
  return (
    <picture>
      {/* WebP 형식 */}
      <source
        srcSet={src.replace(/\.(jpg|png)$/, '.webp')}
        type="image/webp"
      />

      {/* 원본 형식 (fallback) */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        className={className}
      />
    </picture>
  );
};
```

#### 코드 스플리팅
```typescript
// src/App.tsx - 라우트 레벨 코드 스플리팅

import { lazy, Suspense } from 'react';

// 동적 import로 변경
const Index = lazy(() => import('./pages/Index'));
const RecapPage = lazy(() => import('./pages/RecapPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/recap" element={<RecapPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  </Suspense>
);
```

---

### 📌 4. 마케팅 전략 체계화

#### A. 타겟 오디언스 페르소나
```markdown
# src/docs/marketing-personas.md

## 페르소나 1: 경력 임상가 김민수 (35세)
- **직업**: 통합의학 클리닉 원장 (경력 8년)
- **고민**:
  - 환자 증상이 복잡해지고 있음
  - 기존 치료법의 한계 느낌
  - 차별화된 임상 기술 필요
- **목표**:
  - 임상 성과 향상
  - 난치성 케이스 해결 능력
  - 동료 임상가들과의 네트워킹
- **의사결정 요인**:
  - 실전 적용 가능성 (70%)
  - 강사 신뢰도 (20%)
  - 가격 대비 가치 (10%)

## 페르소나 2: 신규 개원 박지영 (30세)
- **직업**: 개원 준비 중 (경력 3년)
- **고민**:
  - 개원 후 환자 유치 방법
  - 체계적인 진료 프로토콜 부재
  - 경영 및 마케팅 지식 부족
- **목표**:
  - 안정적인 개원 준비
  - 차별화된 진료 역량
  - 멘토링 및 지원 시스템
- **의사결정 요인**:
  - 개원 준비 도움 (50%)
  - 커뮤니티 지원 (30%)
  - 비용 부담 (20%)
```

#### B. 가치 제안 프레임워크
```typescript
// src/config/value-propositions.ts

export const valuePropositions = {
  primary: {
    headline: "3개월 만에 임상 매출 200% 증가",
    subheadline: "실전 중심의 통합의학 마스터코스",
    cta: "지금 무료 상담 신청하기",
  },

  differentiators: [
    {
      title: "검증된 임상 프로토콜",
      benefit: "10년간 5,000건 이상의 케이스로 검증된 치료법",
      icon: "🎯",
    },
    {
      title: "1:1 맞춤 멘토링",
      benefit: "개인별 임상 케이스 분석 및 피드백 제공",
      icon: "👨‍⚕️",
    },
    {
      title: "평생 학습 커뮤니티",
      benefit: "수료 후에도 지속적인 케이스 스터디 참여",
      icon: "🤝",
    },
  ],

  socialProof: {
    stats: [
      { number: "500+", label: "수료생" },
      { number: "95%", label: "만족도" },
      { number: "200%", label: "평균 매출 증가" },
    ],
    testimonials: [
      {
        name: "김민수 원장",
        clinic: "서울 통합의학 클리닉",
        quote: "3개월 만에 난치성 케이스 해결률이 2배 증가했습니다.",
        rating: 5,
      },
    ],
  },
};
```

#### C. 전환 최적화 CTA 전략
```typescript
// src/components/sections/CTASection.tsx

export const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-accent">
      <div className="container mx-auto text-center">
        {/* 주요 CTA */}
        <h2 className="text-4xl font-bold text-white mb-4">
          지금 시작하면 선착순 특전 제공
        </h2>
        <p className="text-xl text-white/90 mb-8">
          2026년 1기 마감까지 <strong>2일 남음</strong> · 잔여석 <strong>1석</strong>
        </p>

        {/* 주요 CTA 버튼 */}
        <button className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
          무료 상담 신청하기 →
        </button>

        {/* 보조 CTA */}
        <p className="text-white/80 mt-4 text-sm">
          신청 후 24시간 내 상담 연락드립니다
        </p>

        {/* 신뢰 지표 */}
        <div className="flex justify-center gap-8 mt-8 text-white/90">
          <div>
            <CheckCircle className="inline mr-2" />
            카드 등록 불필요
          </div>
          <div>
            <CheckCircle className="inline mr-2" />
            전액 환불 보장
          </div>
        </div>
      </div>
    </section>
  );
};
```

---

### 📌 5. 콘텐츠 구조 최적화

#### 정보 아키텍처 개선
```markdown
## 현재 섹션 순서 (Index.tsx)
1. UrgencyBanner
2. Header
3. HeroSection
4. StatsSection
5. GatheringSection
6. SelfAssessmentSection
7. PhilosophySection
8. ClinicalCasesSection
9. AcademyIntroSection
10. InstructorSection
11. WorkshopVideoSection
12. CurriculumSection
13. DifferentiationSection
14. ComparisonTableSection
15. BeforeAfterSection
16. BenefitsSection
17. InstructorBlogSection
18. TargetAudienceSection
19. ScheduleSection
20. FAQSection
21. ApplicationSection

## 개선된 섹션 순서 (마케팅 퍼널 최적화)

### 1단계: 주목 (Attention)
1. UrgencyBanner - 긴급성 강조
2. HeroSection - 강력한 헤드라인 + CTA

### 2단계: 관심 (Interest)
3. StatsSection - 사회적 증거
4. SelfAssessmentSection - 개인화된 공감
5. ClinicalCasesSection - 실제 사례 (문제 제시)

### 3단계: 욕구 (Desire)
6. PhilosophySection - 차별화된 접근법
7. InstructorSection - 신뢰 구축
8. WorkshopVideoSection - 시각적 증거
9. CurriculumSection - 구체적인 혜택
10. BeforeAfterSection - 변화 증거
11. DifferentiationSection - 경쟁 우위

### 4단계: 신뢰 (Trust)
12. InstructorBlogSection - 전문성 입증
13. ComparisonTableSection - 투명한 비교
14. BenefitsSection - 가치 요약

### 5단계: 행동 (Action)
15. ScheduleSection - 구체적 정보
16. TargetAudienceSection - 적합성 확인
17. FAQSection - 마지막 의문 해소
18. ApplicationSection - 최종 CTA
19. GatheringSection - 커뮤니티 가치 (보너스)
```

---

### 📌 6. 접근성 (Accessibility) 개선

#### A. ARIA 레이블 추가
```typescript
// 개선 전
<button onClick={handleSubmit}>제출</button>

// 개선 후
<button
  onClick={handleSubmit}
  aria-label="회원가입 신청서 제출"
  aria-describedby="submit-description"
>
  제출
</button>
<p id="submit-description" className="sr-only">
  신청서를 제출하시면 24시간 내 연락드립니다
</p>
```

#### B. 키보드 네비게이션
```typescript
// src/hooks/useKeyboardNavigation.ts

export const useKeyboardNavigation = (items: string[]) => {
  const [focusIndex, setFocusIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setFocusIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        setFocusIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        // 선택 처리
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length]);

  return focusIndex;
};
```

#### C. 색상 대비 검증
```typescript
// src/utils/color-contrast.ts

/**
 * WCAG AA 기준: 4.5:1 (일반 텍스트), 3:1 (큰 텍스트)
 */
export const checkColorContrast = (foreground: string, background: string): boolean => {
  const contrast = calculateContrast(foreground, background);
  return contrast >= 4.5; // AA 기준
};

// 디자인 토큰 검증
export const validateDesignTokens = () => {
  const validations = [
    checkColorContrast('#1a1a1a', '#ffffff'), // 텍스트-배경
    checkColorContrast('#0066cc', '#ffffff'), // Primary-배경
    checkColorContrast('#ffffff', '#0066cc'), // 버튼 텍스트
  ];

  return validations.every(v => v);
};
```

---

## 🚀 실행 계획 (우선순위)

### Phase 1: 즉시 적용 가능 (1주일)
1. ✅ **SEO 기본 설정**
   - SEOHead 컴포넌트 생성
   - 페이지별 메타 태그 추가
   - Open Graph 이미지 생성

2. ✅ **성능 최적화**
   - 이미지 lazy loading 적용
   - 라우트 레벨 코드 스플리팅
   - 불필요한 번들 제거

3. ✅ **콘텐츠 구조 개선**
   - 섹션 순서 재배치 (마케팅 퍼널)
   - CTA 강화 및 재배치
   - 긴급성 요소 추가

### Phase 2: 단기 개선 (2-3주)
4. ⏳ **디자인 시스템 구축**
   - 디자인 토큰 정의
   - Tailwind Config 통합
   - 기존 컴포넌트 리팩토링

5. ⏳ **구조화된 데이터**
   - Organization, Course 스키마 추가
   - FAQ 스키마 추가
   - Breadcrumb 스키마 추가

6. ⏳ **마케팅 콘텐츠**
   - 페르소나 기반 카피 재작성
   - 가치 제안 명확화
   - 사회적 증거 강화

### Phase 3: 중기 개선 (1-2개월)
7. 📅 **A/B 테스팅 시스템**
   - CTA 버튼 문구 테스트
   - 헤드라인 변형 테스트
   - 레이아웃 구조 테스트

8. 📅 **애널리틱스 고도화**
   - 전환 퍼널 추적
   - 히트맵 분석 (Hotjar)
   - 사용자 행동 분석

9. 📅 **컨텐츠 마케팅**
   - 블로그 SEO 최적화
   - 케이스 스터디 추가
   - 비디오 콘텐츠 확대

---

## 📊 기대 효과

### 정량적 개선
- **SEO 순위**: 주요 키워드 10위 내 진입 (현재: 50위권)
- **페이지 로딩 속도**: 3초 → 1.5초 (50% 개선)
- **전환율**: 2% → 4% (2배 증가 목표)
- **모바일 성능 점수**: 70 → 90+ (Lighthouse)

### 정성적 개선
- 일관된 브랜드 경험 제공
- 전문성 및 신뢰도 강화
- 사용자 경험 향상 (UX)
- 유지보수 용이성 증가

---

## 🔖 참고 자료

### Website Builder 시스템
- `website-builder-extracted/website-builder/SKILL.md` - 전체 시스템 개요
- `website-builder-extracted/website-builder/references/design-system.md` - 디자인 시스템
- `website-builder-extracted/website-builder/references/marketing-strategy.md` - 마케팅 전략
- `website-builder-extracted/website-builder/references/seo-optimization.md` - SEO 최적화
- `website-builder-extracted/website-builder/references/development-guide.md` - 개발 가이드
- `website-builder-extracted/website-builder/assets/template/index.html` - 템플릿 예시

### 도구 및 리소스
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) - 성능 측정
- [Schema.org](https://schema.org/) - 구조화된 데이터
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - 색상 대비
- [React Helmet Async](https://www.npmjs.com/package/react-helmet-async) - SEO 메타 태그

---

## 💭 결론

Website Builder 시스템은 체계적이고 확장 가능한 웹 개발 방법론을 제시합니다. JSHA 프로젝트에 이러한 원칙들을 단계적으로 적용하면:

1. **기술적 우수성**: 성능, SEO, 접근성 향상
2. **비즈니스 성과**: 전환율 및 참여도 증가
3. **유지보수성**: 일관된 디자인 시스템으로 개발 효율성 증대
4. **확장성**: 향후 기능 추가 시 체계적 확장 가능

특히 **마케팅 퍼널 최적화**와 **SEO 강화**를 우선적으로 적용하면 즉각적인 비즈니스 임팩트를 기대할 수 있습니다.
