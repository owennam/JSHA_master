/**
 * 병원 주소를 지오코딩하여 좌표를 추가하는 스크립트
 *
 * 실행 방법:
 * node scripts/geocode-hospitals.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// certifiedClinics.ts 파일 읽기
const clinicsFilePath = path.join(__dirname, '../src/data/certifiedClinics.ts');
const clinicsContent = fs.readFileSync(clinicsFilePath, 'utf-8');

// 병원 데이터 추출 (간단한 파싱)
const dataMatch = clinicsContent.match(/export const certifiedClinics: CertifiedClinic\[\] = \[([\s\S]*?)\];/);
if (!dataMatch) {
  console.error('❌ certifiedClinics 데이터를 찾을 수 없습니다.');
  process.exit(1);
}

// 주소와 이름 추출
const clinicsData = [];
const clinicMatches = dataMatch[1].matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*location:\s*'([^']+)',\s*address:\s*'([^']+)',\s*phone:\s*'([^']*)',\s*website\?:\s*'([^']*)'\s*\}/g);

for (const match of clinicMatches) {
  clinicsData.push({
    id: match[1],
    name: match[2],
    location: match[3],
    address: match[4],
    phone: match[5],
    website: match[6]
  });
}

console.log(`📍 총 ${clinicsData.length}개 병원을 찾았습니다.`);
console.log(`⏳ 지오코딩을 시작합니다... (약 ${Math.ceil(clinicsData.length * 1.2)}초 소요 예상)\n`);

// Nominatim API로 지오코딩
async function geocodeAddress(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=kr`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'JSHA Hospital Map (contact: admin@example.com)'
      }
    });

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }

    return null;
  } catch (error) {
    console.error(`❌ 지오코딩 실패: ${address}`, error.message);
    return null;
  }
}

// 딜레이 함수
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 모든 병원 지오코딩
const geocodedClinics = [];
let successCount = 0;
let failCount = 0;

for (let i = 0; i < clinicsData.length; i++) {
  const clinic = clinicsData[i];

  process.stdout.write(`\r진행중: ${i + 1}/${clinicsData.length} (성공: ${successCount}, 실패: ${failCount})`);

  const coords = await geocodeAddress(clinic.address);

  if (coords) {
    geocodedClinics.push({
      ...clinic,
      lat: coords.lat,
      lng: coords.lng
    });
    successCount++;
  } else {
    console.log(`\n⚠️  지오코딩 실패: ${clinic.name} (${clinic.address})`);
    // 실패해도 데이터는 포함 (좌표 없이)
    geocodedClinics.push({
      ...clinic,
      lat: null,
      lng: null
    });
    failCount++;
  }

  // Nominatim API 제한: 1 req/sec
  await delay(1200);
}

console.log(`\n\n✅ 지오코딩 완료!`);
console.log(`   성공: ${successCount}개`);
console.log(`   실패: ${failCount}개`);
console.log(`   총: ${geocodedClinics.length}개\n`);

// TypeScript 파일 생성
const outputContent = `// 자동 생성된 파일 - 수동 편집하지 마세요
// 생성 시간: ${new Date().toISOString()}
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

export const certifiedClinicsWithCoords: CertifiedClinicWithCoords[] = ${JSON.stringify(geocodedClinics, null, 2)};

// 좌표가 있는 병원만 필터링
export const validClinicsWithCoords = certifiedClinicsWithCoords.filter(
  clinic => clinic.lat !== null && clinic.lng !== null
);

console.log(\`📍 병원 데이터 로드 완료: \${validClinicsWithCoords.length}개 (총 \${certifiedClinicsWithCoords.length}개 중)\`);
`;

const outputPath = path.join(__dirname, '../src/data/certifiedClinicsWithCoords.ts');
fs.writeFileSync(outputPath, outputContent, 'utf-8');

console.log(`💾 파일 저장 완료: ${outputPath}`);
console.log(`\n다음 단계:`);
console.log(`1. HospitalMap 컴포넌트를 수정하여 로컬 데이터 사용`);
console.log(`2. 개발 서버 재시작`);
console.log(`3. /hospitals 페이지에서 지도 확인\n`);
