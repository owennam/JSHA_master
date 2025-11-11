export interface InstructorBlog {
  id: string;
  instructorName: string;
  clinic: string;
  position: string;
  blogUrl: string;
  description: string;
  featured?: boolean;
}

export const instructorBlogs: InstructorBlog[] = [
  {
    id: 'kim-seong-hun',
    instructorName: '김성훈 원장',
    clinic: '상도시원마취통증의학과의원',
    position: '원장',
    blogUrl: 'https://blog.naver.com/sdsiwon2022/223837876172',
    description: '마취통증의학과 전문의의 전문 지식과 치료 경험',
    featured: true
  },
  {
    id: 'lee-yong-gi',
    instructorName: '이용기 원장',
    clinic: '이용기재활의학과의원',
    position: '원장',
    blogUrl: 'https://blog.naver.com/braverm/223789904508',
    description: '재활의학과 전문의의 실전 재활 치료 노하우',
    featured: true
  },
  {
    id: 'nam-seung-kyun',
    instructorName: '남승균 원장',
    clinic: '대전제이에스힐링의원',
    position: '원장',
    blogUrl: 'https://blog.naver.com/drwakeup/223874906885',
    description: '통증 치료의 새로운 관점과 임상 경험 공유',
    featured: true
  },
  {
    id: 'so-mu-cheol',
    instructorName: '소무철 원장',
    clinic: '대전제이에스힐링의원',
    position: '원장',
    blogUrl: 'https://blog.naver.com/jshahub',
    description: 'JSHA 통증 치료 시스템의 임상 적용과 치료 경험',
    featured: true
  }
];
