export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnailUrl: string;
  duration: string;
  category: 'balance' | 'posture' | 'breathing' | 'flexibility';
  tags: string[];
  targetAudience: string[];
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
}

export const videos: Video[] = [
  {
    id: 'one-foot-standing',
    title: '한발 서기',
    description: '고관절과 하지의 균형 감각을 평가하고 강화하는 운동입니다. 일상생활에서의 안정성을 높이고 낙상을 예방하는데 도움이 됩니다.',
    youtubeId: '9myxgtgHo_w',
    thumbnailUrl: 'https://img.youtube.com/vi/9myxgtgHo_w/maxresdefault.jpg',
    duration: '6:05',
    category: 'balance',
    tags: ['균형감각', '고관절', '하지근력', '낙상예방'],
    targetAudience: ['균형감각 저하', '낙상 위험', '고관절 약화'],
    benefits: ['보행 안정성 향상', '근력 강화', '낙상 예방'],
    difficulty: 'beginner',
    equipment: []
  },
  {
    id: 'walking-in-place',
    title: '제자리 걷기',
    description: '전신의 협응성과 리듬감을 향상시키는 기본 운동입니다. 실내에서 안전하게 할 수 있는 유산소 운동으로 효과적입니다.',
    youtubeId: '8AtoY68g5kE',
    thumbnailUrl: 'https://img.youtube.com/vi/8AtoY68g5kE/maxresdefault.jpg',
    duration: '5:34',
    category: 'balance',
    tags: ['협응성', '유산소', '전신운동'],
    targetAudience: ['운동 부족', '실내 운동 필요'],
    benefits: ['심폐 기능 향상', '전신 협응성 개선', '체력 증진'],
    difficulty: 'beginner',
    equipment: []
  },
  {
    id: 'mouth-tape',
    title: '입 테이프',
    description: '코 호흡을 유도하여 수면의 질을 개선하고 구강 건강을 증진시키는 방법입니다.',
    youtubeId: 'gqd1Neywdz0',
    thumbnailUrl: 'https://img.youtube.com/vi/gqd1Neywdz0/maxresdefault.jpg',
    duration: '4:41',
    category: 'breathing',
    tags: ['호흡', '수면', '코골이'],
    targetAudience: ['구강 호흡', '수면 장애', '코골이'],
    benefits: ['수면의 질 향상', '구강 건강 개선', '코 호흡 습관화'],
    difficulty: 'beginner',
    equipment: ['입 테이프']
  },
  {
    id: 'kurunta',
    title: '쿠룬타',
    description: '요가에서 영감을 받은 전신 스트레칭 운동으로, 척추와 관절의 유연성을 높입니다.',
    youtubeId: '1F-F4vcnF0Y',
    thumbnailUrl: 'https://img.youtube.com/vi/1F-F4vcnF0Y/maxresdefault.jpg',
    duration: '5:02',
    category: 'flexibility',
    tags: ['스트레칭', '유연성', '척추'],
    targetAudience: ['척추 경직', '유연성 부족', '만성 통증'],
    benefits: ['척추 유연성 향상', '관절 가동범위 증가', '통증 완화'],
    difficulty: 'intermediate',
    equipment: ['요가 매트', '벨트(선택)']
  },
  {
    id: 'toe-exercise',
    title: '발가락 운동',
    description: '발가락의 유연성과 근력을 강화하는 운동입니다. 발바닥 아치를 지지하고 발목 안정성을 높이는데 도움이 됩니다.',
    youtubeId: 'ucuHo-IQOoQ',
    thumbnailUrl: 'https://img.youtube.com/vi/ucuHo-IQOoQ/maxresdefault.jpg',
    duration: '1:00',
    category: 'flexibility',
    tags: ['발가락', '발바닥', '유연성', '족부'],
    targetAudience: ['족부 통증', '발목 불안정', '평발'],
    benefits: ['발가락 근력 강화', '발바닥 아치 개선', '발목 안정성 향상'],
    difficulty: 'beginner',
    equipment: []
  },
  {
    id: 'proper-walking',
    title: '바르게 걷기',
    description: '올바른 보행 자세와 방법을 배우는 영상입니다. 바른 걸음걸이는 관절과 척추 건강에 매우 중요합니다.',
    youtubeId: 'cVVBE1AoW04',
    thumbnailUrl: 'https://img.youtube.com/vi/cVVBE1AoW04/maxresdefault.jpg',
    duration: '10:00',
    category: 'posture',
    tags: ['보행', '자세', '걷기', '정렬'],
    targetAudience: ['잘못된 보행 습관', '관절 통증', '자세 불량'],
    benefits: ['올바른 보행 습관 형성', '관절 부담 감소', '자세 개선'],
    difficulty: 'beginner',
    equipment: []
  }
];
