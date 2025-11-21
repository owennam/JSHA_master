/**
 * certifiedClinics.ts에서 JSON을 추출하는 스크립트
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// certifiedClinics.ts 읽기
const clinicsPath = path.join(__dirname, '../src/data/certifiedClinics.ts');
const content = fs.readFileSync(clinicsPath, 'utf-8');

// export const certifiedClinics 부분 추출
const match = content.match(/export const certifiedClinics[^=]*=\s*(\[[\s\S]*?\]);/);

if (!match) {
  console.error('❌ certifiedClinics 데이터를 찾을 수 없습니다.');
  process.exit(1);
}

// JavaScript 평가를 위해 수정
const dataString = match[1]
  .replace(/website\?:/g, 'website:')  // optional 제거
  .replace(/'/g, '"');  // 작은따옴표를 큰따옴표로

try {
  const clinics = JSON.parse(dataString);

  console.log(`✅ ${clinics.length}개 병원 데이터 추출 완료`);

  // JSON 파일로 저장
  const outputPath = path.join(__dirname, '../src/data/clinics.json');
  fs.writeFileSync(outputPath, JSON.stringify(clinics, null, 2), 'utf-8');

  console.log(`💾 저장 완료: ${outputPath}`);
  console.log(`\n샘플:`);
  console.log(JSON.stringify(clinics[0], null, 2));

} catch (error) {
  console.error('❌ JSON 파싱 실패:', error.message);
  process.exit(1);
}
