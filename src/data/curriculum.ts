export interface ModuleDay {
  day: number;
  dayName: string;
  duration: number;
  title: string;
  topics: string[];
}

export interface Module {
  module: number;
  title: string;
  description: string;
  totalDuration: number;
  price?: string;
  days: ModuleDay[];
  highlights?: string[];
  specialNote?: string;
}

export const curriculum: Module[] = [
  {
    module: 1,
    title: "JSHA 핵심 철학 및 통합 진단",
    description: "JSHA의 핵심 철학과 진단 시스템, DTR과 JS Insole의 원리를 마스터합니다.",
    totalDuration: 600, // 10시간
    days: [
      {
        day: 1,
        dayName: "토요일",
        duration: 180, // 3시간
        title: "JSHA 개요 및 핵심 철학",
        topics: [
          "교육 과정 소개 및 학습 로드맵",
          "JSHA 통증 치료 철학 (불균형-보상-통증)",
          "JSST 이해 및 활용 실습",
          "Q&A 및 네트워킹"
        ],
      },
      {
        day: 2,
        dayName: "일요일",
        duration: 420, // 7시간
        title: "JSST 및 JS Insole 실습",
        topics: [
          "JSHA 과학적 근거",
          "X-ray 분석 기초",
          "JSST 및 이학적 검사",
          "JS Insole의 원리와 적용",
          "JS 주사치료, DTR 시연 및 실습"
        ],
      },
    ],
    highlights: [
      "JSHA 철학의 이해",
      "X-ray 판독 능력 습득",
      "JS Insole 활용 가능",
      "DTR 마스터"
    ],
  },
  {
    module: 2,
    title: "중추 및 분절 신경계 치료 (DTR & STR)",
    description: "DTR, STR, 호흡 및 발가락 재활 운동 교육 등 JSHA 치료 기법을 습득합니다.",
    totalDuration: 600, // 10시간
    days: [
      {
        day: 1,
        dayName: "토요일",
        duration: 180, // 3시간
        title: "JSST 및 Insole 적용 복습",
        topics: [
          "수강생 임상 적용 사례 공유",
          "1:1 테스트 및 피드백",
          "JSST 및 JS Insole 검사 실습",
        ],
      },
      {
        day: 2,
        dayName: "일요일",
        duration: 420, // 7시간
        title: "DTR & STR 마스터",
        topics: [
          "DTR (Dural Tension Release) 실습",
          "STR (Segmental Tension Release) 이론 및 실습",
          "호흡 및 발가락락 기능 재활 교육 이론 및 실습",
          "JS core routine 1,2 시연 및 실습",
        ],
      },
    ],
    highlights: [
      "DTR & STR 완전 마스터",
      "호흡/발가락 기능 재활 교육 기법",
      "1:1 테스트 및 피드백"
    ],
    specialNote: "비밀 유지 서약서 작성 필수",
  },
  {
    module: 3,
    title: "Advance Course (심화)",
    description: "PTR 및 JSHA 고급 비기를 전수받고 공인 라이센스를 획득합니다.",
    totalDuration: 600, // 10시간 (3-4회차 통합)
    days: [
      {
        day: 1,
        dayName: "토요일",
        duration: 180, // 3시간
        title: "DTR & STR 집중 복습",
        topics: [
          "1:1 테스트 및 피드백",
          "DTR & STR 복습 및 실습",
          "수강생 임상 적용 사례 공유",
          "문제 해결 워크숍"
        ],
      },
      {
        day: 2,
        dayName: "일요일",
        duration: 420, // 7시간
        title: "Advance Technique (고급 기법)",
        topics: [
          "PTR (Peripheral Tension Release) 시연 및 실습",
          "주요 부위별 치료 프로토콜 (상지/하지)",,
          "PTR 및 호흡/발가락 기능 재활 교육 실습",
          "한 단계 더 나아간 JSHA 치료 테크닉 (비기)",
        ],
      },
    ],
    highlights: [
      "PTR 완전 마스터",
      "JSHA 비기 전수",
    ],
  },
  {
    module: 4,
    title: "임상 통합 및 증례 발표",
    description: "PTR 실습과 JS Core Routine을 마스터하고 증례를 발표합니다.",
    totalDuration: 600, // 10시간
    days: [
      {
        day: 1,
        dayName: "토요일",
        duration: 180, // 3시간
        title: "DTR, STR, PTR 집중 실습",
        topics: [
          "1:1 테스트 및 피드백",
          "DTR, STR, PTR 실습",
          "호흡 및 발가락 재활 실습",
          "JS core routine 실습"
        ],
      },
      {
        day: 2,
        dayName: "일요일",
        duration: 420, // 7시간
        title: "JS 증례 발표 및 토론",
        topics: [
          "JSHA 완전 마스터",
          "환자 증례 발표 (참가자)",
          "종합 토론 및 피드백",
          "최종 Q&A 세션",
          "수료식 및 네트워킹"
        ],
      },
    ],
    highlights: [
      "JSHA Master Course 수료",
      "증례 발표 및 토론",
    ],
  },
];
