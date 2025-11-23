export interface AuthorizedUser {
  id: string;
  clinicName: string;
  directorName: string;
  location: string;
}

// 인증된 사용자 목록 (의료기관 이름과 원장님 성함)
export const authorizedUsers: AuthorizedUser[] = [
  // Test account
  { id: 'test-clinic-myname', clinicName: 'testclinic', directorName: 'myname', location: '테스트' },

  { id: 'seoul-ak-neurosurgery-park', clinicName: 'AK신경외과의원', directorName: '박성만', location: '서울' },
  { id: 'seoul-haegarden-pain-lee', clinicName: '해가든제통의원', directorName: '이승구', location: '서울' },
  { id: 'seoul-bethesda-orthopedics-kang', clinicName: '베데스다 정형외과의원', directorName: '강동헌', location: '서울' },
  { id: 'seoul-haneul-hospital-moon', clinicName: '하늘병원', directorName: '문진규', location: '서울' },
  { id: 'seoul-gangnamkims-clinic-kim', clinicName: '강남킴스의원', directorName: '김윤진', location: '서울' },
  { id: 'seoul-barun-pain-no', clinicName: '서울바른마취통증의학과의원', directorName: '노재헌', location: '서울' },
  { id: 'seoul-guro-ace-orthopedics-lee', clinicName: '구로에이스정형외과', directorName: '이광진', location: '서울' },
  { id: 'seoul-sun-orthopedics-park-kwang', clinicName: '서울선정형외과', directorName: '박광선', location: '서울' },
  { id: 'seoul-sun-orthopedics-shim', clinicName: '서울선정형외과', directorName: '심정인', location: '서울' },
  { id: 'seoul-sun-orthopedics-park-shin', clinicName: '서울선정형외과', directorName: '박신후', location: '서울' },
  { id: 'seoul-malgeum-clinic-choi', clinicName: '맑은의원', directorName: '최윤정', location: '서울' },
  { id: 'seoul-gayang-barun-orthopedics-byun', clinicName: '가양바른성모정형외과의원', directorName: '변주환', location: '서울' },
  { id: 'seoul-yonsei-rehab-lee', clinicName: '연세재활의학과의원', directorName: '이진우', location: '서울' },
  { id: 'seoul-jeongneung-baro-lee', clinicName: '정릉바로척의원', directorName: '이정훈', location: '서울' },
  { id: 'seoul-yonsei-su-rehab-jung', clinicName: '연세수재활의학과', directorName: '정호익', location: '서울' },
  { id: 'seoul-bes-healing-pain-oh', clinicName: '베스힐링마취통증의학과의원', directorName: '오지훈', location: '서울' },
  { id: 'seoul-himton-clinic-lee', clinicName: '힘튼의원', directorName: '이건우', location: '서울' },
  { id: 'seoul-sadang-ttokbareun-lee', clinicName: '사당똑바른정형외과의원', directorName: '이상희', location: '서울' },
  { id: 'seoul-sadang-ttokbareun-ju', clinicName: '사당똑바른정형외과의원', directorName: '주지운', location: '서울' },
  { id: 'seoul-yonsei-roy-rehab-ko', clinicName: '연세로이재활의학과의원', directorName: '고유라', location: '서울' },
  { id: 'seoul-gangnam-samsung-neuro-park', clinicName: '강남삼성신경외과', directorName: '박형수', location: '서울' },
  { id: 'seoul-asan-daon-rehab-kim', clinicName: '서울아산다온재활의학과의원', directorName: '김대하', location: '서울' },
  { id: 'seoul-movinci-clinic-kwon', clinicName: '모빈치의원', directorName: '권오덕', location: '서울' },
  { id: 'seoul-sangdo-siwon-pain-kim', clinicName: '상도시원통증의학과의원', directorName: '김성훈', location: '서울' },
  { id: 'seoul-samsung-balance-hwang', clinicName: '삼성밸런스의원', directorName: '황정민', location: '서울' },
  { id: 'seoul-samsung-balance-na', clinicName: '삼성밸런스의원', directorName: '나건엽', location: '서울' },
  { id: 'seoul-yes-pain-kim', clinicName: '예스마취통증의학과의원', directorName: '김은하', location: '서울' },
  { id: 'seoul-naeilmaleum-rehab-jung', clinicName: '내일맑음재활의학과의원', directorName: '정필교', location: '서울' },
  { id: 'seoul-gangnam-sinnonhyeon-jung', clinicName: '강남신논현본튼튼의원', directorName: '정호중', location: '서울' },
  { id: 'seoul-sindaebang-chamjoheun-baek', clinicName: '신대방참좋은정형외과의원', directorName: '백제원', location: '서울' },
  { id: 'seoul-gangdong-top-orthopedics-hwang', clinicName: '강동탑정형외과의원', directorName: '황도현', location: '서울' },
  { id: 'seoul-sindaebang-chamjoheun-jung', clinicName: '신대방참좋은정형외과의원', directorName: '정영하', location: '서울' },
  { id: 'seoul-smile-pain-lee', clinicName: '스마일마취통증의학과의원', directorName: '이한영', location: '서울' },
  { id: 'seoul-leadhill-orthopedics-kang', clinicName: '리드힐정형외과의원', directorName: '강태환', location: '서울' },
  { id: 'seoul-leadhill-orthopedics-lim', clinicName: '리드힐정형외과의원', directorName: '임형룡', location: '서울' },
  { id: 'seoul-ahyeon-orthopedics-kim', clinicName: '아현정형외과의원', directorName: '김형직', location: '서울' },
  { id: 'seoul-sigma-pain-jung', clinicName: '시그마마취통증의학과의원', directorName: '정명진', location: '서울' },
  { id: 'seoul-nowon-jin-pain-lee', clinicName: '노원진마취통증의학과의원', directorName: '이인화', location: '서울' },
  { id: 'seoul-nowon-baek-orthopedics-baek', clinicName: '노원백정형외과의원', directorName: '백상훈', location: '서울' },
  { id: 'seoul-yeouido-neurosurgery-yang', clinicName: '여의도신경외과', directorName: '양지웅', location: '서울' },
  { id: 'seoul-yeouido-neurosurgery-kim', clinicName: '여의도신경외과', directorName: '김우현', location: '서울' },
  { id: 'seoul-baeknyeon-tunton-park', clinicName: '백년튼튼정형외과재활의학과의원', directorName: '박민호', location: '서울' },
  { id: 'seoul-dr-hong-family-hong', clinicName: '닥터홍 가정의학과의원', directorName: '홍인표', location: '서울' },
  { id: 'seoul-jamsil-yonsei-rehab-jang', clinicName: '잠실연세재활의학과의원', directorName: '장지훈', location: '서울' },
  { id: 'seoul-danaeun-pain-jeon', clinicName: '다나은마취통증의학과의원', directorName: '전순신', location: '서울' },
  { id: 'seoul-yeoksam-saengsaengbon-na', clinicName: '역삼생생본의원', directorName: '나명준', location: '서울' },
  { id: 'seoul-myungjin-radiology-jo', clinicName: '명진단영상의학과의원', directorName: '조재현', location: '서울' },
  { id: 'seoul-geon-rehab-kim', clinicName: '건재활의학과의원', directorName: '김병희', location: '서울' },
  { id: 'seoul-ok-madi-tunton-park', clinicName: '오케이마디튼튼의원', directorName: '박청옥', location: '서울' },
  { id: 'seoul-fatima-clinic-park', clinicName: '파티마의원', directorName: '박형민', location: '서울' },
  { id: 'seoul-siwon-high-neuro-choi', clinicName: '시원하이신경외과의원', directorName: '최승현', location: '서울' },
  { id: 'seoul-gasan-miso-chan-jo', clinicName: '가산미소찬마취통증의학과의원', directorName: '조재근', location: '서울' },
  { id: 'seoul-tip-rehab-na', clinicName: '티아이피재활의학과의원', directorName: '나효진', location: '서울' },
  { id: 'seoul-banpo-ildeung-orthopedics-jang', clinicName: '반포일등정형외과', directorName: '장병근', location: '서울' },
  { id: 'seoul-barunbody-neurology-park', clinicName: '바른바디신경과', directorName: '박재홍', location: '서울' },
  { id: 'seoul-geunbon-orthopedics-oh', clinicName: '근본정형외과의원', directorName: '오현근', location: '서울' },
  { id: 'seoul-mapo-gongdeok-tunton-kwon', clinicName: '마포공덕튼튼본정형외과의원', directorName: '권회영', location: '서울' },
  { id: 'seoul-bandeuthan-orthopedics-jo', clinicName: '반듯한정형외과의원', directorName: '조한솔', location: '서울' },
  { id: 'gyeonggi-pyeongchon-beomgye-park', clinicName: '평촌범계연세바로걷는의원', directorName: '박상혁', location: '경기' },
  { id: 'gyeonggi-pyeongchon-beomgye-jang', clinicName: '평촌범계연세바로걷는의원', directorName: '장솔', location: '경기' },
  { id: 'gyeonggi-beomgye-hearin-lee', clinicName: '범계헤아린정형외과', directorName: '이준구', location: '경기' },
  { id: 'gyeonggi-beomgye-hearin-ha', clinicName: '범계헤아린정형외과', directorName: '하지윤', location: '경기' },
  { id: 'gyeonggi-anyang-joeun-pain-lim', clinicName: '안양조은마취통증의학과의원', directorName: '임종성', location: '경기' },
  { id: 'gyeonggi-suwon-son-pain-son', clinicName: '손덕희마취통증의학과', directorName: '손덕희', location: '경기' },
  { id: 'gyeonggi-suwon-myungsung-park', clinicName: '명성의원', directorName: '박상욱', location: '경기' },
  { id: 'gyeonggi-suwon-yonsei-ace365-jung', clinicName: '연세에이스365', directorName: '정홍선', location: '경기' },
  { id: 'gyeonggi-uiwang-jeil-neuro-shin', clinicName: '제일신경외과 의원', directorName: '신동일', location: '경기' },
  { id: 'gyeonggi-uiwang-seoul-sungmo-kim-dong', clinicName: '서울성모정형외과', directorName: '김동진', location: '경기' },
  { id: 'gyeonggi-uiwang-seoul-sungmo-kim-shin', clinicName: '서울성모정형외과', directorName: '김신형', location: '경기' },
  { id: 'gyeonggi-namyangju-dana-lee', clinicName: '다나의원', directorName: '이정민', location: '경기' },
  { id: 'gyeonggi-namyangju-yes-orthopedics-jang', clinicName: '예스정형외과', directorName: '장기영', location: '경기' },
  { id: 'gyeonggi-seongnam-hyundai-rehab-jo', clinicName: '현대재활의학과 의원', directorName: '조홍구', location: '경기' },
  { id: 'gyeonggi-gimpo-masong-sungmo-kim', clinicName: '마송성모의원', directorName: '김병찬', location: '경기' },
  { id: 'gyeonggi-gimpo-mideum-neuro-lee', clinicName: '믿음신경외과의원', directorName: '이현우', location: '경기' },
  { id: 'gyeonggi-dongtan-pain-kim', clinicName: '동탄마취통증의학과의원', directorName: '김태완', location: '경기' },
  { id: 'gyeonggi-bucheon-yeokgok-orthopedics-choi', clinicName: '역곡정형외과의원', directorName: '최용길', location: '경기' },
  { id: 'gyeonggi-bucheon-hyundai-orthopedics-hong', clinicName: '현대정형외과', directorName: '홍경진', location: '경기' },
  { id: 'gyeonggi-hanam-yes-rehab-park', clinicName: '예스재활의학과의원', directorName: '박헌종', location: '경기' },
  { id: 'gyeonggi-goyang-joeun-orthopedics-choi', clinicName: '조은정형외과의원', directorName: '최인용', location: '경기' },
  { id: 'gyeonggi-yangju-goeup-bon-hwang', clinicName: '고읍 본 정형외과', directorName: '황훈', location: '경기' },
  { id: 'gyeonggi-ansan-madiwell-ko', clinicName: '마디웰정형외과의원', directorName: '고진홍', location: '경기' },
  { id: 'gyeonggi-ansan-gojan-baro-lee', clinicName: '안산고잔바로튼튼의원', directorName: '이성영', location: '경기' },
  { id: 'gyeonggi-ansan-woori-surgery-han', clinicName: '우리외과의원', directorName: '한찬홍', location: '경기' },
  { id: 'gyeonggi-gunpo-sanbon-top-kim', clinicName: '산본탑정형외과', directorName: '김상열', location: '경기' },
  { id: 'gyeonggi-gunpo-sanbon-barun-lim', clinicName: '산본바른재활의학과', directorName: '임달재', location: '경기' },
  { id: 'gyeonggi-goyang-yonsei-ieum-mok', clinicName: '연세이음정형외과의원', directorName: '목영준', location: '경기' },
  { id: 'gyeonggi-goyang-good-yonsei-park', clinicName: '굿연세재활의학과의원', directorName: '박천웅', location: '경기' },
  { id: 'gyeonggi-goyang-good-yonsei-song', clinicName: '굿연세재활의학과의원', directorName: '송윤희', location: '경기' },
  { id: 'gyeonggi-paju-geumchon-tunton-yoo', clinicName: '금촌튼튼본의원', directorName: '유영열', location: '경기' },
  { id: 'gyeonggi-paju-geumchon-tunton-kim', clinicName: '금촌튼튼본의원', directorName: '김효중', location: '경기' },
  { id: 'gyeonggi-paju-geumchon-tunton-jung', clinicName: '금촌튼튼본의원', directorName: '정지상', location: '경기' },
  { id: 'gyeonggi-siheung-miso-korean-park', clinicName: '시흥미소한방병원', directorName: '박서영', location: '경기' },
  { id: 'gyeonggi-siheung-sihwa-hospital-kim', clinicName: '시화병원', directorName: '김희재', location: '경기' },
  { id: 'gyeonggi-yangju-yonsei-top-lee', clinicName: '연세탑신경외과의원', directorName: '이상원', location: '경기' },
  { id: 'gyeonggi-seongnam-bundang-jeil-lee', clinicName: '분당제일마디의원', directorName: '이중호', location: '경기' },
  { id: 'gyeonggi-seongnam-bundang-yeonhap-choi', clinicName: '분당연합의원', directorName: '최기운', location: '경기' },
  { id: 'gyeonggi-uijeongbu-orthopedics-chae', clinicName: '의정부정형외과', directorName: '채진언', location: '경기' },
  { id: 'gyeonggi-seongnam-bon-cheok-han', clinicName: '본척척재활의학과의원', directorName: '한승희', location: '경기' },
  { id: 'gyeonggi-seongnam-segyero-neuro-choi', clinicName: '세계로신경외과의원', directorName: '최창명', location: '경기' },
  { id: 'gyeonggi-yongin-suji-tunton-lim', clinicName: '수지튼튼신경외과의원', directorName: '임채홍', location: '경기' },
  { id: 'gyeonggi-ansan-godeun-hospital-hwang', clinicName: '고든병원', directorName: '황준민', location: '경기' },
  { id: 'gyeonggi-guri-top-bon-lee', clinicName: '구리탑본의원', directorName: '이성욱', location: '경기' },
  { id: 'gyeonggi-pyeongtaek-aju-cheok-park', clinicName: '아주척마디의원', directorName: '박광호', location: '경기' },
  { id: 'gyeonggi-yongin-suji-madi-kim', clinicName: '수지마디의원', directorName: '김성근', location: '경기' },
  { id: 'gyeonggi-ansan-sangrok-top-park', clinicName: '상록탑정형외과', directorName: '박지완', location: '경기' },
  { id: 'gyeonggi-goyang-onbom-kim', clinicName: '온봄의원', directorName: '김완서', location: '경기' },
  { id: 'gyeonggi-anseong-top-tunton-lee', clinicName: '안성탑튼튼의원', directorName: '이필섭', location: '경기' },
  { id: 'incheon-michuhol-sungmo-surgery-kim', clinicName: '성모외과의원', directorName: '김명선', location: '인천' },
  { id: 'incheon-yeonsu-songdo-madi-chae', clinicName: '송도마디재활의학과', directorName: '채상한', location: '인천' },
  { id: 'incheon-gyeyang-cheok-pain-lee', clinicName: '계양척척마취통증의학과의원', directorName: '이상모', location: '인천' },
  { id: 'incheon-gyeyang-gyesan-orthopedics-lee', clinicName: '계산역정형외과의원', directorName: '이동환', location: '인천' },
  { id: 'incheon-bupyeong-gukmin-orthopedics-kang', clinicName: '부평국민정형외과의원', directorName: '강대명', location: '인천' },
  { id: 'incheon-yeonsu-beot-orthopedics-shim', clinicName: '벗정형외과', directorName: '심희종', location: '인천' },
  { id: 'incheon-michuhol-heoripyeonan-lee', clinicName: '허리편안통증의학과', directorName: '이승아', location: '인천' },
  { id: 'incheon-jung-yeongjong-the-good-shin', clinicName: '영종더굿정형외과', directorName: '신대도', location: '인천' },
  { id: 'incheon-jung-unseo-the-good-hwang', clinicName: '운서더굿정형외과', directorName: '황재호', location: '인천' },
  { id: 'daejeon-yuseong-euljiro-orthopedics-ryu', clinicName: '을지정형외과의원', directorName: '류천환', location: '대전' },
  { id: 'daejeon-yuseong-banseok-pyeonhan-lee', clinicName: '반석편한신경외과', directorName: '이창주', location: '대전' },
  { id: 'daejeon-seo-samsung-rehab-kang', clinicName: '삼성재활의학과 의원', directorName: '강경주', location: '대전' },
  { id: 'daejeon-seo-js-healing-lee', clinicName: '제이에스힐링의원', directorName: '이종성', location: '대전' },
  { id: 'daejeon-seo-js-healing-so', clinicName: '제이에스힐링의원', directorName: '소무철', location: '대전' },
  { id: 'daejeon-dong-madi-neurosurgery-jung', clinicName: '대전마디신경외과', directorName: '정재현', location: '대전' },
  { id: 'daejeon-seo-mj-pain-gu', clinicName: '엠제이마취통증의학과의원', directorName: '구승룡', location: '대전' },
  { id: 'daejeon-daedeok-madi-pyeonhan-yoo', clinicName: '마디편한신경외과의원', directorName: '유장수', location: '대전' },
  { id: 'daejeon-seo-lee-yonggi-rehab-lee', clinicName: '이용기재활의학과', directorName: '이용기', location: '대전' },
  { id: 'daejeon-jung-anapa-shin', clinicName: '아나파의원', directorName: '신석민', location: '대전' },
  { id: 'sejong-sejong-orthopedics-lee-sung', clinicName: '세종정형외과', directorName: '이성진', location: '세종' },
  { id: 'sejong-sejong-orthopedics-lee-kyu', clinicName: '세종정형외과', directorName: '이규호', location: '세종' },
  { id: 'sejong-seomun365-orthopedics-seo', clinicName: '서문365정형외과의원', directorName: '서형원', location: '세종' },
  { id: 'sejong-jochiwon-hanaro-internal-lee', clinicName: '하나로내과의원', directorName: '이정찬', location: '세종' },
  { id: 'chungnam-asan-barun-rehab-kim', clinicName: '바른재활의학과의원', directorName: '김형준', location: '충남' },
  { id: 'chungnam-cheonan-saehim-pain-lee', clinicName: '새힘마취통증의학과의원', directorName: '이주호', location: '충남' },
  { id: 'chungnam-boryeong-jungang-rehab-lee', clinicName: '중앙재활의학과의원', directorName: '이석재', location: '충남' },
  { id: 'chungnam-asan-samsung-display-so', clinicName: '삼성디스플레이 부속의원', directorName: '소경섭', location: '충남' },
  { id: 'chungnam-nonsan-koryo-hospital-choi', clinicName: '고려병원', directorName: '최은창', location: '충남' },
  { id: 'chungbuk-cheongju-barun-neuro-lee', clinicName: '바른신경외과의원', directorName: '이종혁', location: '충북' },
  { id: 'chungbuk-cheongju-micro-hospital-lee', clinicName: '청주마이크로병원', directorName: '이찬호', location: '충북' },
  { id: 'chungbuk-cheongju-baekseung-orthopedics-oh', clinicName: '백승일의 참정형외과의원', directorName: '오건우', location: '충북' },
  { id: 'chungbuk-yeongdong-yeon', clinicName: '연천일의원', directorName: '연천일', location: '충북' },
  { id: 'chungbuk-cheongju-heimbridge-kim', clinicName: '하임브릿지정형외과', directorName: '김도균', location: '충북' },
  { id: 'chungnam-seosan-himsen-madi-yoo', clinicName: '힘센마디의원', directorName: '유이영', location: '충남' },
  { id: 'chungnam-cheonan-seoul-clinic-park', clinicName: '서울의원', directorName: '박선영', location: '충남' },
  { id: 'chungnam-gyeryong-kim-surgery-kim', clinicName: '김광석외과의원', directorName: '김광석', location: '충남' },
  { id: 'chungnam-cheonan-ollibon-kim', clinicName: '올리본 의원', directorName: '김병균', location: '충남' },
  { id: 'chungnam-asan-tunton-orthopedics-jung', clinicName: '아산튼튼정형외과 의원', directorName: '정재윤', location: '충남' },
  { id: 'chungnam-asan-w-orthopedics-hong', clinicName: '더블유 정형외과 의원', directorName: '홍우성', location: '충남' },
  { id: 'gyeongnam-sacheon-jeil-jeon', clinicName: '사천제일의원', directorName: '전성철', location: '경남' },
  { id: 'gyeongnam-changwon-hanmaeum-orthopedics-choi', clinicName: '한마음정형외과의원', directorName: '최문도', location: '경남' },
  { id: 'gyeongnam-gimhae-jangyu-anapa-choi', clinicName: '장유 아나파 마취통증의학과 의원', directorName: '최원영', location: '경남' },
  { id: 'gyeongnam-changwon-barunsongil-son', clinicName: '바른손길마취통증의학과의원', directorName: '손운락', location: '경남' },
  { id: 'gyeongnam-changwon-haechang-tunton-kim', clinicName: '해창튼튼마취통증의학과 의원', directorName: '김재연', location: '경남' },
  { id: 'gyeongbuk-pohang-jukdo-yeonhap-kim', clinicName: '죽도경대연합의원', directorName: '김정수', location: '경북' },
  { id: 'gyeongbuk-gyeongju-pain-do', clinicName: '경주통증의학과', directorName: '도황', location: '경북' },
  { id: 'gyeongbuk-gumi-the-tunton-pain-park', clinicName: '더튼튼마취통증의학과의원', directorName: '박상영', location: '경북' },
  { id: 'gyeongbuk-gumi-barunyou-hospital-sung', clinicName: '바른유병원', directorName: '성동연', location: '경북' },
  { id: 'gyeongbuk-gumi-madiwa-neuro-lee', clinicName: '마디와신경외과의원', directorName: '이근우', location: '경북' },
  { id: 'gyeongbuk-gumi-yeonhap-neuro-ahn', clinicName: '구미연합신경외과의원', directorName: '안규환', location: '경북' },
  { id: 'gyeongbuk-gyeongsan-eden-yeonhap-ha', clinicName: '이든 연합의원', directorName: '하석효', location: '경북' },
  { id: 'jeonnam-suncheon-ophilseung-oh', clinicName: '오필승정형외과', directorName: '오종수', location: '전남' },
  { id: 'jeonnam-boseong-beolgyo-samho-shin', clinicName: '벌교삼호병원', directorName: '신형철', location: '전남' },
  { id: 'jeonnam-yeosu-seo-yeonhap-seo', clinicName: '서연합의원', directorName: '서인완', location: '전남' },
  { id: 'jeonnam-yeosu-365-yeonhap-chae', clinicName: '365연합의원', directorName: '채현오', location: '전남' },
  { id: 'jeonnam-suncheon-hana-hospital-kim', clinicName: '하나병원', directorName: '김창모', location: '전남' },
  { id: 'jeonnam-mokpo-medical-center-kang', clinicName: '목포의료원', directorName: '강정중', location: '전남' },
  { id: 'jeonnam-mokpo-dawit365-kim', clinicName: '다윗365내과재활의학과', directorName: '김진홍', location: '전남' },
  { id: 'jeonnam-suncheon-sam-yeonhap-yang', clinicName: '샘연합의원', directorName: '양주용', location: '전남' },
  { id: 'jeonnam-suncheon-himang-hospital-lee', clinicName: '순천희망병원', directorName: '이민경', location: '전남' },
  { id: 'jeonbuk-iksan-yonsei-best-neuro-lee', clinicName: '연세베스트신경외과', directorName: '이시우', location: '전북' },
  { id: 'jeonbuk-jeonju-the-better-madi-kim', clinicName: '더나은마디의원', directorName: '김현송', location: '전북' },
  { id: 'jeonbuk-iksan-naeun-hospital-kang', clinicName: '나은병원', directorName: '강태욱', location: '전북' },
  { id: 'jeonbuk-jeonju-wooju-pain-jung', clinicName: '우주마취통증의학과의원', directorName: '정우주', location: '전북' },
  { id: 'jeonbuk-jeonju-wooju-pain-lee', clinicName: '우주마취통증의학과의원', directorName: '이재형', location: '전북' },
  { id: 'jeonbuk-jeonju-the-bom-tong-jang', clinicName: '더봄통의학과의원', directorName: '장은주', location: '전북' },
  { id: 'jeonbuk-namwon-the-joeun-rehab-lee', clinicName: '더조은재활의학과', directorName: '이강근', location: '전북' },
  { id: 'jeonbuk-iksan-woori-family-ji', clinicName: '우리가정의원', directorName: '지초암', location: '전북' },
  { id: 'busan-haeundae-ak-orthopedics-lee', clinicName: 'AK정형외과', directorName: '이승원', location: '부산' },
  { id: 'busan-haeundae-ak-orthopedics-jeon', clinicName: 'AK정형외과', directorName: '전진우', location: '부산' },
  { id: 'busan-haeundae-ak-orthopedics-yoo', clinicName: 'AK정형외과', directorName: '유준호', location: '부산' },
  { id: 'busan-busanjin-goseumdochi-ju', clinicName: '고슴도치프롤노의원', directorName: '주윤석', location: '부산' },
  { id: 'busan-dongnae-seoul-leaders-kim', clinicName: '서울리더스 정형외과', directorName: '김우', location: '부산' },
  { id: 'busan-nam-line-orthopedics-park', clinicName: '라인정형외과의원', directorName: '박현수', location: '부산' },
  { id: 'busan-dong-madi-choi', clinicName: '마디의원', directorName: '최창동', location: '부산' },
  { id: 'busan-haeundae-cheokbareun-kim', clinicName: '척바른의원', directorName: '김지태', location: '부산' },
  { id: 'busan-haeundae-centum-anapa-yoon', clinicName: '센텀아나파마취통증의학과의원', directorName: '윤백현', location: '부산' },
  { id: 'busan-haeundae-centum-anapa-choi', clinicName: '센텀아나파마취통증의학과의원', directorName: '최규빈', location: '부산' },
  { id: 'busan-haeundae-u-and-balance-kim', clinicName: '유앤밸런스의원', directorName: '김형영', location: '부산' },
  { id: 'busan-gijang-bareuda-pain-ko', clinicName: '바르다통증의학과의원', directorName: '고현학', location: '부산' },
  { id: 'busan-nam-ok-orthopedics-lim', clinicName: '오케이정형외과 의원', directorName: '임영훈', location: '부산' },
  { id: 'busan-buk-seoul-orthopedics-lee', clinicName: '서울정형외과의원', directorName: '이병국', location: '부산' },
  { id: 'daegu-suseong-dr-bearfoot-shin', clinicName: '닥터베어풋신효상마취통증의학과 의원', directorName: '신효상', location: '대구' },
  { id: 'daegu-suseong-balance-one-ahn', clinicName: '밸런스원 정형외과', directorName: '안면중', location: '대구' },
  { id: 'daegu-suseong-cheok-madi-lim', clinicName: '척척마디의원', directorName: '임병하', location: '대구' },
  { id: 'daegu-suseong-siji-danaa-kim', clinicName: '시지 다나아 마취통증의학과 의원', directorName: '김영웅', location: '대구' },
  { id: 'daegu-buk-gyeongbuk-pain-kim', clinicName: '경북마취제통의원', directorName: '김현구', location: '대구' },
  { id: 'daegu-jung-woorideul-pain-ha', clinicName: '우리들제통마취통증의학과의원', directorName: '하미희', location: '대구' },
  { id: 'daegu-seo-bisan-yeonhap-park', clinicName: '비산연합마취통증의학과의원', directorName: '박종흠', location: '대구' },
  { id: 'daegu-suseong-won-pain-lee', clinicName: '원마취통증의학과의원', directorName: '이은준', location: '대구' },
  { id: 'daegu-nam-seobu-tong-neuro-kim', clinicName: '서부통신경외과의원', directorName: '김현준', location: '대구' },
  { id: 'daegu-dalseo-baekdu-hospital-kwak', clinicName: '백두병원', directorName: '곽민전', location: '대구' },
  { id: 'daegu-nam-hyosung-madi-kim', clinicName: '효성마디재활의학과의원', directorName: '김효성', location: '대구' },
  { id: 'daegu-dalseo-bogwang-hospital-lim', clinicName: '보광병원', directorName: '임좌혁', location: '대구' },
  { id: 'daegu-buk-lee-yunche-tong-lee', clinicName: '이윤채통합의원', directorName: '이윤채', location: '대구' },
  { id: 'daegu-buk-vwell-pain-kim', clinicName: '브이웰마취통증의학과의원', directorName: '김상균', location: '대구' },
  { id: 'daegu-buk-vwell-pain-no', clinicName: '브이웰마취통증의학과의원', directorName: '노희윤', location: '대구' },
  { id: 'daegu-suseong-yuhan-pain-yoo', clinicName: '유한마취통증의학과의원', directorName: '유한목', location: '대구' },
  { id: 'daegu-dong-ansim-tunton-kwon', clinicName: '안심튼튼마취통증의학과의원', directorName: '권진열', location: '대구' },
  { id: 'daegu-dalseo-seongse-madi-jung', clinicName: '성서마디정형외과의원', directorName: '정대근', location: '대구' },
  { id: 'daegu-nam-the-tunton-pain-lee', clinicName: '더튼튼마취통증의학과', directorName: '이용배', location: '대구' },
  { id: 'daegu-nam-the-tunton-pain-park', clinicName: '더튼튼마취통증의학과', directorName: '박수용', location: '대구' },
  { id: 'daegu-jung-prolo-daegu-jung', clinicName: '프롤로의원 대구', directorName: '정재욱', location: '대구' },
  { id: 'daegu-dalseo-the-himchan-neuro-seo', clinicName: '더힘찬신경외과의원', directorName: '서성원', location: '대구' },
  { id: 'daegu-suseong-tonghae-park', clinicName: '통해의원', directorName: '박지웅', location: '대구' },
  { id: 'ulsan-nam-suam-yeonhap-park', clinicName: '수암연합의원', directorName: '박현준', location: '울산' },
  { id: 'gwangju-nam-madi-lee', clinicName: '마디의원', directorName: '이경무', location: '광주' },
  { id: 'gwangju-gwangsan-danaa-lee', clinicName: '다나아의원', directorName: '이기창', location: '광주' },
  { id: 'gwangju-buk-nuga-hong', clinicName: '누가의원', directorName: '홍성범', location: '광주' },
  { id: 'gwangju-gwangsan-hana-yoo', clinicName: '하나의원', directorName: '유현호', location: '광주' },
  { id: 'jeju-seogwipo-gangnam-madi-kim', clinicName: '강남마디척의원', directorName: '김희영', location: '제주' },
  { id: 'jeju-jeju-thankyou-very-jo', clinicName: '땡큐베리마취통증의학과의원', directorName: '조승연', location: '제주' },
  { id: 'jeju-seogwipo-365-kim', clinicName: '서귀포365의원', directorName: '김무현', location: '제주' },
  { id: 'gangwon-chuncheon-seoul-jin-pain-baek', clinicName: '서울진통증의학과', directorName: '백승우', location: '강원' },
  { id: 'gangwon-gangneung-seoul-ace-lee', clinicName: '서울에이스정형외과의원', directorName: '이정동', location: '강원' },
  { id: 'gangwon-gangneung-seoul-ace-cheon', clinicName: '서울에이스정형외과의원', directorName: '천윤길', location: '강원' },
  { id: 'gangwon-wonju-miso-pain-choi', clinicName: '미소마취통증의학과', directorName: '최영실', location: '강원' },
  { id: 'gangwon-donghae-han', clinicName: '한연식의원', directorName: '한연식', location: '강원' }
];

// 병원명 정규화 함수 (접미사 제거 및 공백 제거)
const normalizeClinicName = (name: string): string => {
  const suffixes = [
    '의원',
    '병원',
    '클리닉',
    '재활의학과',
    '마취통증의학과',
    '정형외과',
    '신경외과',
    '가정의학과',
    '통증의학과',
    '영상의학과',
    '내과',
    '외과',
  ];

  let normalized = name.trim().toLowerCase().replace(/\s+/g, '');

  // 접미사 제거
  for (const suffix of suffixes) {
    if (normalized.endsWith(suffix)) {
      normalized = normalized.slice(0, -suffix.length);
    }
  }

  return normalized;
};

// 사용자 인증 함수 (부분 매칭 + 접미사 자동 제외)
export const authenticateUser = (clinicName: string, directorName: string): boolean => {
  const inputClinicNormalized = normalizeClinicName(clinicName);
  const inputDirectorNormalized = directorName.trim().toLowerCase();

  return authorizedUsers.some(user => {
    const dbClinicNormalized = normalizeClinicName(user.clinicName);
    const dbDirectorNormalized = user.directorName.trim().toLowerCase();

    // 원장명은 정확히 일치해야 함
    const directorMatch = dbDirectorNormalized === inputDirectorNormalized;

    // 병원명은 부분 매칭 허용 (입력값이 DB값에 포함되거나, DB값이 입력값에 포함)
    const clinicMatch =
      dbClinicNormalized.includes(inputClinicNormalized) ||
      inputClinicNormalized.includes(dbClinicNormalized);

    return directorMatch && clinicMatch;
  });
};

// 인증 상태 관리
const AUTH_KEY = 'jsha_auth_status';
const AUTH_CLINIC_KEY = 'jsha_auth_clinic';
const AUTH_DIRECTOR_KEY = 'jsha_auth_director';

export const saveAuthStatus = (clinicName: string, directorName: string): void => {
  sessionStorage.setItem(AUTH_KEY, 'true');
  sessionStorage.setItem(AUTH_CLINIC_KEY, clinicName);
  sessionStorage.setItem(AUTH_DIRECTOR_KEY, directorName);
};

export const getAuthStatus = (): boolean => {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
};

export const getAuthInfo = (): { clinicName: string; directorName: string } | null => {
  const clinicName = sessionStorage.getItem(AUTH_CLINIC_KEY);
  const directorName = sessionStorage.getItem(AUTH_DIRECTOR_KEY);

  if (clinicName && directorName) {
    return { clinicName, directorName };
  }
  return null;
};

export const clearAuthStatus = (): void => {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_CLINIC_KEY);
  sessionStorage.removeItem(AUTH_DIRECTOR_KEY);
};
