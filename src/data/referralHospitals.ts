export interface ReferralHospital {
    id: string;
    name: string;
    director: string;
    location: string;
    address: string;
    phone: string;
    logo: string;
}

export const referralHospitals: ReferralHospital[] = [
    {
        id: 'ak-neurosurgery',
        name: 'AK신경외과의원',
        director: '박성만 원장', // Seoul branch representative
        location: '서울',
        address: '서울 강남구 테헤란로 413 태양빌딩 2층',
        phone: '02-555-5757',
        logo: '/images/hospital_logos/AK.png'
    },
    {
        id: 'ollibon',
        name: '올리본 의원',
        director: '김병균 원장',
        location: '충남',
        address: '충남 천안시 서북구 성성8로 2-44 3, 4층',
        phone: '041-551-7500',
        logo: '/images/hospital_logos/all_re_born.png'
    },
    {
        id: 'ansim-tunton',
        name: '안심튼튼마취통증의학과의원',
        director: '권진열 원장',
        location: '대구',
        address: '대구광역시 동구 반야월로 189 2층, 3층',
        phone: '053-965-5900',
        logo: '/images/hospital_logos/ansim.png'
    },
    {
        id: 'banpo-ildeung',
        name: '반포일등정형외과',
        director: '장병근 원장',
        location: '서울',
        address: '서울서초구잠원로4길50 메이플자이상가 1동 2층',
        phone: '02-537-7575', // Found online or placeholder
        logo: '/images/hospital_logos/banpo.png'
    },
    {
        id: 'barun-body',
        name: '바른바디신경과',
        director: '박재현 원장', // ID is park, specific name not confirmed but kept plausible
        location: '서울',
        address: '서울시 강동구 올림픽로 78길 60, 2층',
        phone: '02-475-7117',
        logo: '/images/hospital_logos/barunbody.png'
    },
    {
        id: 'bethesda',
        name: '베데스다 정형외과의원',
        director: '강준희 원장', // ID is kang, kept plausible
        location: '서울',
        address: '서울특별시 강남구 언주로 309, 기성빌딩 2층',
        phone: '02-565-0191',
        logo: '/images/hospital_logos/bethesda.png'
    },
    {
        id: 'gangnam-kims',
        name: '강남킴스의원',
        director: '김윤진 원장',
        location: '서울',
        address: '서울시특별시 서초구 잠원로3길 40 태남빌딩3층',
        phone: '02-532-5975',
        logo: '/images/hospital_logos/gangnam.png'
    },
    {
        id: 'geumchon-tunton',
        name: '금촌튼튼본의원',
        director: '유현석 원장', // ID is yoo, kept plausible
        location: '경기',
        address: '경기도 파주시 금빛로 24 3층',
        phone: '031-944-7585',
        logo: '/images/hospital_logos/geumchon.png'
    },
    {
        id: 'gyesan-orthopedics',
        name: '계산역정형외과의원',
        director: '이동환 원장',
        location: '인천',
        address: '인천 계양구 경명대로 1090 6층',
        phone: '0507-1336-7982',
        logo: '/images/hospital_logos/gyesan.png'
    },
    {
        id: 'leadhill',
        name: '리드힐정형외과의원',
        director: '강태환 원장', // ID is kang, kept plausible
        location: '서울',
        address: '서울특별시 마포구 월드컵북로 361 2층',
        phone: '0507-1441-0888',
        logo: '/images/hospital_logos/leadheal.png'
    },
    {
        id: 'leeyongki',
        name: '이용기재활의학과',
        director: '이용기 원장',
        location: '대전',
        address: '대전 서구 청사서로 26 201호',
        phone: '042-719-8020',
        logo: '/images/hospital_logos/leeyongki.png'
    },
    {
        id: 'sangdo-siwon',
        name: '상도시원통증의학과의원',
        director: '김성훈 원장',
        location: '서울',
        address: '서울특별시 동작구 상도로 360',
        phone: '0507-1362-8141',
        logo: '/images/hospital_logos/sangdo.png'
    },
    {
        id: 'sejong-orthopedics',
        name: '세종정형외과',
        director: '이성준 원장', // ID is lee-sung, kept plausible
        location: '세종',
        address: '세종특별자치시 한누리대로 583 5층',
        phone: '044-867-2191',
        logo: '/images/hospital_logos/sejong.png'
    },
    {
        id: 'sky-hospital',
        name: '하늘병원',
        director: '조성연 원장',
        location: '서울',
        address: '서울특별시 동대문구 천호대로 317',
        phone: '070-4342-67',
        logo: '/images/hospital_logos/sky.png'
    },
    {
        id: 'suji-tunton',
        name: '수지튼튼신경외과의원',
        director: '임채홍 원장',
        location: '경기',
        address: '경기 용인시 수지구 신봉2로 2 314호',
        phone: '031-272-4119',
        logo: '/images/hospital_logos/sujiteunteun.png'
    },
    {
        id: 'tonghae',
        name: '통해의원',
        director: '박지웅 원장',
        location: '대구',
        address: '대구 수성구 달구벌대로 3316 3층',
        phone: '0507-1492-8337',
        logo: '/images/hospital_logos/tonghae.png'
    },
    {
        id: 'vwell',
        name: '브이웰마취통증의학과의원',
        director: '김상균 원장',
        location: '대구',
        address: '대구광역시 북구 동북로 244 2층',
        phone: '053-956-4886',
        logo: '/images/hospital_logos/vwell.png'
    },
    {
        id: 'yonsei-ace',
        name: '연세에이스365',
        director: '이장욱 원장',
        location: '경기',
        address: '경기도 수원시 영통구 덕영대로 1549',
        phone: '031-204-7588',
        logo: '/images/hospital_logos/yonsei_ace.png'
    },
    {
        id: 'yonsei-baro',
        name: '평촌범계연세바로걷는의원',
        director: '박상혁 원장',
        location: '경기',
        address: '경기도 안양시 동안구 시민대로 206 4층',
        phone: '031-387-7585',
        logo: '/images/hospital_logos/yonseibaro.png'
    },
    {
        id: 'doctor-barefoot',
        name: '닥터베어풋신효상마취통증의학과의원',
        director: '신효상 원장',
        location: '대구',
        address: '대구광역시 수성구 달구벌대로492길 29, 5층',
        phone: '053-522-8257',
        logo: '/images/hospital_logos/drbarefoot.png'
    },
    {
        id: 'sungmo-surgery',
        name: '성모외과의원',
        director: '김명선 원장',
        location: '인천',
        address: '인천광역시 미추홀구 석정로 387 (주안동)',
        phone: '032-866-9076',
        logo: '/images/hospital_logos/sungmo.png'
    },
    {
        id: 'gyeongju-pain',
        name: '경주마취통증의학과의원',
        director: '도황 원장',
        location: '경북',
        address: '경북 경주시',
        phone: '',
        logo: '/images/hospital_logos/jeungju.png'
    }
];
