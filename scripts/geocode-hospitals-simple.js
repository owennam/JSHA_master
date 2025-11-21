/**
 * 병원 주소를 지오코딩하여 좌표를 추가하는 스크립트 (간소화 버전)
 *
 * 실행 방법:
 * node scripts/geocode-hospitals-simple.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// certifiedClinics 데이터 (직접 복사)
const clinicsData = [
  { id: 'seoul-ak-neurosurgery-park', name: 'AK신경외과의원', location: '서울', address: '서울 강남구 테헤란로 413 태양빌딩 2층 AK신경외과의원', phone: '02-555-5757', website: '#' },
  { id: 'seoul-haegarden-pain-lee', name: '해가든제통의원', location: '서울', address: '서울특별시 동작구 서달로 150 이랜드해가든 해가든제통의원', phone: '02-814-1075', website: '#' },
  { id: 'seoul-bethesda-orthopedics-kang', name: '베데스다 정형외과의원', location: '서울', address: '서울특별시 강남구 언주로 309, 기성빌딩 2층 베데스다 정형외과', phone: '02-565-0191', website: '#' },
  { id: 'seoul-haneul-hospital-moon', name: '하늘병원', location: '서울', address: '서울특별시 동대문구 천호대로 317 하늘병원(답십리동)', phone: '070-4342-67', website: '#' },
  { id: 'seoul-gangnamkims-clinic-kim', name: '강남킴스의원', location: '서울', address: '서울시특별시 서초구 잠원로3길 40 태남빌딩3층 강남킴스의원', phone: '02-532-5975', website: '#' },
];

console.log(`📍 ${clinicsData.length}개 병원의 간소화 버전 테스트`);
console.log('이 스크립트는 테스트용입니다. 실제로는 212개 병원을 모두 처리해야 합니다.\n');

// Nominatim API로 지오코딩
async function geocodeAddress(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=kr`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'JSHA Hospital Map (github.com/owennam/JSHA_master)'
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

console.log('⏳ 지오코딩 시작...\n');

for (let i = 0; i < clinicsData.length; i++) {
  const clinic = clinicsData[i];

  console.log(`${i + 1}/${clinicsData.length}: ${clinic.name}...`);

  const coords = await geocodeAddress(clinic.address);

  if (coords) {
    geocodedClinics.push({
      ...clinic,
      lat: coords.lat,
      lng: coords.lng
    });
    console.log(`   ✓ 성공: ${coords.lat}, ${coords.lng}`);
    successCount++;
  } else {
    console.log(`   ✗ 실패`);
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

console.log(`\n✅ 테스트 지오코딩 완료!`);
console.log(`   성공: ${successCount}개`);
console.log(`   실패: ${failCount}개`);
console.log(`   총: ${geocodedClinics.length}개\n`);

console.log('결과 샘플:');
console.log(JSON.stringify(geocodedClinics.slice(0, 2), null, 2));

console.log('\n⚠️  이것은 테스트 버전입니다.');
console.log('실제 212개 병원을 처리하려면 전체 데이터를 사용해야 합니다.');
