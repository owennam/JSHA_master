// 자동 생성된 파일 - 수동 편집하지 마세요
// 생성 시간: 2025-11-21T07:32:27.970Z
// 생성 스크립트: scripts/geocode-hospitals.js

export interface CertifiedClinicWithCoords {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  website?: string;
  lat: number | null;
  lng: number | null;
}

export const certifiedClinicsWithCoords: CertifiedClinicWithCoords[] = [];

// 좌표가 있는 병원만 필터링
export const validClinicsWithCoords = certifiedClinicsWithCoords.filter(
  clinic => clinic.lat !== null && clinic.lng !== null
);

console.log(`📍 병원 데이터 로드 완료: ${validClinicsWithCoords.length}개 (총 ${certifiedClinicsWithCoords.length}개 중)`);
