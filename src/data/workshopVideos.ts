export interface WorkshopVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnailUrl: string;
  instructor: string;
  date: string;
  type: 'lecture' | 'qa';
}

export const lectureVideos: WorkshopVideo[] = [
  {
    id: 'lee-jong-seong-2025',
    title: '2025년 이종성 원장님 집담회 개회사',
    description: '이종성 원장님의 JSHA 집담회 개회사 영상입니다.',
    youtubeId: 'M0K0TQ_j3Ig',
    thumbnailUrl: 'https://img.youtube.com/vi/M0K0TQ_j3Ig/maxresdefault.jpg',
    instructor: '이종성 원장',
    date: '2025',
    type: 'lecture'
  },
  {
    id: 'so-mu-chul-2024',
    title: '2024년 소무철 원장님 정맥통증학회 강의',
    description: '소무철 원장님의 정맥통증학회 강의 영상입니다.',
    youtubeId: 'x__m51eWvf4',
    thumbnailUrl: 'https://img.youtube.com/vi/x__m51eWvf4/maxresdefault.jpg',
    instructor: '소무철 원장',
    date: '2024',
    type: 'lecture'
  }
];

export const qaVideos: WorkshopVideo[] = [
  {
    id: 'qa-master-course',
    title: 'JSHA Q&A with 박지웅 원장님',
    description: 'JSHA 강사 통해의원 박지웅 원장님의 Q&A 영상입니다.',
    youtubeId: '21v6chx7nFk',
    thumbnailUrl: 'https://img.youtube.com/vi/21v6chx7nFk/maxresdefault.jpg',
    instructor: '박지웅 원장',
    date: '',
    type: 'qa'
  },
  {
    id: 'qa-what-is-jsha',
    title: 'JSHA는 어떤 치료입니까?',
    description: '이종성 원장님이 JSHA 치료에 대해 설명합니다.',
    youtubeId: 'ZeWsGckzRG0',
    thumbnailUrl: 'https://img.youtube.com/vi/ZeWsGckzRG0/maxresdefault.jpg',
    instructor: '이종성 원장',
    date: '',
    type: 'qa'
  },
  {
    id: 'qa-indication',
    title: 'JSHA의 적응증은?',
    description: '이종성 원장님이 JSHA의 적응증에 대해 설명합니다.',
    youtubeId: 'p7qCxM6wVhY',
    thumbnailUrl: 'https://img.youtube.com/vi/p7qCxM6wVhY/maxresdefault.jpg',
    instructor: '이종성 원장',
    date: '',
    type: 'qa'
  },
  {
    id: 'qa-insole-difference',
    title: 'JS 인솔과 다른 교정 인솔의 차이',
    description: '이종성 원장님이 JS 인솔의 차별점을 설명합니다.',
    youtubeId: 'F8V5x9GzLv8',
    thumbnailUrl: 'https://img.youtube.com/vi/F8V5x9GzLv8/maxresdefault.jpg',
    instructor: '이종성 원장',
    date: '',
    type: 'qa'
  },
  {
    id: 'qa-how-long',
    title: 'JS 인솔은 언제까지 써야하나요?',
    description: '이종성 원장님이 JS 인솔 사용 기간에 대해 설명합니다.',
    youtubeId: 'ohrPCOTW_MA',
    thumbnailUrl: 'https://img.youtube.com/vi/ohrPCOTW_MA/maxresdefault.jpg',
    instructor: '이종성 원장',
    date: '',
    type: 'qa'
  },
  {
    id: 'qa-recurrence',
    title: 'JS 인솔 제거 후 다시 재발하지 않나요?',
    description: '이종성 원장님이 재발 가능성에 대해 설명합니다.',
    youtubeId: 'TPohM5puTFY',
    thumbnailUrl: 'https://img.youtube.com/vi/TPohM5puTFY/maxresdefault.jpg',
    instructor: '이종성 원장',
    date: '',
    type: 'qa'
  },
  {
    id: 'qa-without-injection',
    title: '주사 치료 없이 JSHA하면 어떨까요?',
    description: '이종성 원장님이 주사 치료 없는 JSHA에 대해 설명합니다.',
    youtubeId: 'jEniDgul77w',
    thumbnailUrl: 'https://img.youtube.com/vi/jEniDgul77w/maxresdefault.jpg',
    instructor: '이종성 원장',
    date: '',
    type: 'qa'
  }
];
