export interface Newsletter {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  week: string;
  summary: string;
  featured: boolean;
}

export const newsletters: Newsletter[] = [
  {
    id: 'october-week-0',
    title: 'JSHA Newsletter',
    subtitle: '통증 치료의 패러다임을 다시 생각합니다',
    date: '2025-09-28',
    week: '10월 0주',
    summary: '통증(Pain)에 대한 재해석: 인체의 Fail-Safe 시스템. 통증을 단순히 제거해야 할 대상이 아닌, 더 큰 손상을 막기 위한 인체의 경고 시스템으로 이해합니다.',
    featured: true
  }
];
