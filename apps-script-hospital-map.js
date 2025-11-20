/**
 * ========================================
 * JSHA 병원 지도 자동 업데이트 Apps Script
 * ========================================
 * 
 * 이 스크립트를 Google Sheets의 Apps Script에 복사하여 사용하세요.
 * 
 * 설정 방법:
 * 1. Google Sheets에서 "확장 프로그램 > Apps Script" 열기
 * 2. 이 코드를 복사하여 붙여넣기
 * 3. "배포 > 새 배포" 클릭
 *    - 유형: 웹 앱
 *    - 실행 계정: 나
 *    - 액세스 권한: 누구나
 * 4. 배포 URL을 복사하여 .env 파일에 추가
 */

/**
 * Apps Script 실행 시 맨 처음에 실행되어 커스텀 메뉴를 추가합니다.
 */
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('📍 병원 지도 관리')
        .addItem('KML 파일 생성 (기존 기능)', 'createKmlFile')
        .addSeparator()
        .addItem('🔄 캐시 새로고침', 'clearCache')
        .addItem('🧪 JSON 데이터 테스트', 'testJsonData')
        .addToUi();
}

/**
 * 웹 앱으로 배포 시 HTTP GET 요청을 처리하여 병원 데이터를 JSON으로 반환
 */
function doGet(e) {
    try {
        const cache = CacheService.getScriptCache();
        let jsonData = cache.get('hospitalData');

        if (!jsonData) {
            Logger.log('캐시 없음 - 새로 데이터 생성');
            const data = getHospitalData();
            jsonData = JSON.stringify(data);
            cache.put('hospitalData', jsonData, 3600); // 1시간 캐시
        } else {
            Logger.log('캐시에서 데이터 반환');
        }

        return ContentService
            .createTextOutput(jsonData)
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        Logger.log('Error in doGet: ' + error.toString());
        return ContentService
            .createTextOutput(JSON.stringify({ error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * 시트에서 병원 데이터를 읽어 JSON 형식으로 반환
 */
function getHospitalData() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("시트1");

    if (!sheet) {
        throw new Error("'시트1' 시트를 찾을 수 없습니다.");
    }

    const data = sheet.getDataRange().getValues();

    if (data.length < 2) {
        return { hospitals: [], message: "데이터가 없습니다." };
    }

    const headers = data[0];
    const addressIndex = headers.indexOf("주소");
    const remarksIndex = headers.indexOf("비고");
    const nameIndex = headers.indexOf("이름");

    if (addressIndex === -1) {
        throw new Error("'주소' 컬럼을 찾을 수 없습니다.");
    }
    if (remarksIndex === -1) {
        throw new Error("'비고' 컬럼을 찾을 수 없습니다.");
    }

    const hospitals = [];
    const locationMap = {}; // 같은 위치의 병원들을 그룹화

    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const remarks = (row[remarksIndex] || "").toString().trim().toUpperCase();
        const address = row[addressIndex];
        const name = row[nameIndex] || address;

        // OFF이거나 주소가 없으면 건너뛰기
        if (remarks === "OFF" || !address) {
            continue;
        }

        try {
            const geo = Maps.newGeocoder().geocode(address);

            if (geo.status === 'OK' && geo.results.length > 0) {
                const location = geo.results[0].geometry.location;
                const lat = location.lat;
                const lng = location.lng;
                const color = remarks === "ON" ? "red" : "blue";
                const zIndex = remarks === "ON" ? 1000 : 0; // 빨간색 마커가 위에 표시

                const locationKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;

                const hospitalData = {
                    name: name,
                    address: address,
                    lat: lat,
                    lng: lng,
                    color: color,
                    zIndex: zIndex,
                    status: remarks
                };

                // 같은 위치에 여러 병원이 있는 경우 그룹화
                if (locationMap[locationKey]) {
                    locationMap[locationKey].push(hospitalData);
                } else {
                    locationMap[locationKey] = [hospitalData];
                }

                hospitals.push(hospitalData);
            } else {
                Logger.log(`지오코딩 실패: ${address} (상태: ${geo.status})`);
            }
        } catch (e) {
            Logger.log(`지오코딩 오류: ${address} - ${e.toString()}`);
        }

        // API 할당량 초과 방지
        Utilities.sleep(200);
    }

    return {
        hospitals: hospitals,
        totalCount: hospitals.length,
        redCount: hospitals.filter(h => h.color === 'red').length,
        blueCount: hospitals.filter(h => h.color === 'blue').length,
        generatedAt: new Date().toISOString()
    };
}

/**
 * 캐시를 수동으로 삭제하는 함수
 */
function clearCache() {
    CacheService.getScriptCache().remove('hospitalData');
    Browser.msgBox('✅ 캐시가 삭제되었습니다. 다음 요청 시 새로운 데이터가 생성됩니다.');
}

/**
 * JSON 데이터를 테스트하는 함수
 */
function testJsonData() {
    try {
        const data = getHospitalData();
        Logger.log(JSON.stringify(data, null, 2));
        Browser.msgBox(
            '✅ 데이터 생성 성공!\\n\\n' +
            '총 병원 수: ' + data.totalCount + '\\n' +
            '빨간색(ON): ' + data.redCount + '\\n' +
            '파란색: ' + data.blueCount + '\\n\\n' +
            '자세한 내용은 로그를 확인하세요.'
        );
    } catch (error) {
        Browser.msgBox('❌ 오류 발생: ' + error.toString());
        Logger.log('Error: ' + error.toString());
    }
}

/**
 * ========================================
 * 기존 KML 파일 생성 함수 (유지)
 * ========================================
 */
function createKmlFile() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("시트1");
    if (!sheet) {
        Logger.log("Sheet '시트1' not found.");
        Browser.msgBox("Sheet '시트1' not found.");
        return;
    }

    const data = sheet.getDataRange().getValues();

    if (data.length < 2) {
        Logger.log("No data found in the sheet.");
        return;
    }

    const headers = data[0];
    const addressIndex = headers.indexOf("주소");
    const remarksIndex = headers.indexOf("비고");
    const nameIndex = headers.indexOf("이름");

    if (addressIndex === -1) {
        Browser.msgBox("Column '주소' not found.");
        return;
    }
    if (remarksIndex === -1) {
        Browser.msgBox("Column '비고' not found.");
        return;
    }

    let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <Style id="redMarker">
      <IconStyle>
        <color>ff0000ff</color>
        <Icon>
          <href>http://maps.google.com/mapfiles/ms/icons/red-dot.png</href>
        </Icon>
      </IconStyle>
    </Style>
    
    <Style id="blueMarker">
      <IconStyle>
        <color>ffff0000</color>
        <Icon>
          <href>http://maps.google.com/mapfiles/ms/icons/blue-dot.png</href>
        </Icon>
      </IconStyle>
    </Style>
    
    <name>주소록 지도</name>\n`;

    let placemarkCount = 0;

    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const address = row[addressIndex];
        const remarks = (row[remarksIndex] || "").toString().trim().toUpperCase();

        if (remarks === "OFF" || !address) {
            continue;
        }

        let styleUrl = "";
        if (remarks === "ON") {
            styleUrl = "#redMarker";
        } else {
            styleUrl = "#blueMarker";
        }

        try {
            const geo = Maps.newGeocoder().geocode(address);

            if (geo.status === 'OK' && geo.results.length > 0) {
                const location = geo.results[0].geometry.location;
                const lat = location.lat;
                const lng = location.lng;
                const name = row[nameIndex] ? row[nameIndex] : address;

                kmlContent += `    <Placemark>
      <name><![CDATA[${name}]]></name>
      <description><![CDATA[${address}]]></description>
      <styleUrl>${styleUrl}</styleUrl>
      <Point>
        <coordinates>${lng},${lat},0</coordinates>
      </Point>
    </Placemark>\n`;
                placemarkCount++;
            } else {
                Logger.log(`Geocoding failed for address: ${address} (Status: ${geo.status})`);
            }
        } catch (e) {
            Logger.log(`Error geocoding address: ${address}. Error: ${e}`);
        }

        Utilities.sleep(1000);
    }

    kmlContent += `  </Document>
</kml>`;

    try {
        DriveApp.createFile("map_locations.kml", kmlContent, "application/vnd.google-earth.kml+xml");

        Browser.msgBox(`성공! 'map_locations.kml' 파일이 구글 드라이브에 생성되었습니다. (총 ${placemarkCount}개 위치)`);
    } catch (e) {
        Browser.msgBox(`파일 생성 실패. Error: ${e}`);
        Logger.log(`Failed to create KML file. Error: ${e}`);
    }
}
