import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { certifiedClinics } from '@/data/certifiedClinics';

// Leaflet 기본 아이콘 경로 수정
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// 기본 아이콘 설정
const DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// 빨간색 마커 아이콘 (진료 가능)
const RedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface HospitalWithCoords {
    id: string;
    name: string;
    location: string;
    address: string;
    phone: string;
    website?: string;
    lat: number;
    lng: number;
}

// localStorage 캐시 키
const CACHE_KEY = 'jsha_hospital_coords_v1';
const CACHE_TIMESTAMP_KEY = 'jsha_hospital_coords_timestamp';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30일

// 지도 중심을 자동으로 조정하는 컴포넌트
function MapBounds({ hospitals }: { hospitals: HospitalWithCoords[] }) {
    const map = useMap();

    useEffect(() => {
        if (hospitals.length > 0) {
            const bounds = L.latLngBounds(
                hospitals.map(h => [h.lat, h.lng] as [number, number])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [hospitals, map]);

    return null;
}

export function HospitalMapLocal() {
    const [hospitals, setHospitals] = useState<HospitalWithCoords[]>([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadHospitals();
    }, []);

    // Nominatim API로 지오코딩
    async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=kr`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'JSHA Hospital Map'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }

            return null;
        } catch (error) {
            console.error(`지오코딩 실패: ${address}`, error);
            return null;
        }
    }

    // 딜레이 함수
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // 캐시에서 로드 또는 새로 지오코딩
    async function loadHospitals() {
        try {
            setLoading(true);
            setError(null);

            // 캐시 확인
            const cachedData = localStorage.getItem(CACHE_KEY);
            const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

            if (cachedData && cachedTimestamp) {
                const age = Date.now() - parseInt(cachedTimestamp);
                if (age < CACHE_DURATION) {
                    console.log('📦 캐시에서 병원 데이터 로드');
                    const parsed = JSON.parse(cachedData);
                    setHospitals(parsed);
                    setLoading(false);
                    return;
                }
            }

            // 캐시가 없거나 만료됨 - 새로 지오코딩
            console.log('🌍 병원 주소 지오코딩 시작...');
            const geocoded: HospitalWithCoords[] = [];

            setProgress({ current: 0, total: certifiedClinics.length });

            for (let i = 0; i < certifiedClinics.length; i++) {
                const clinic = certifiedClinics[i];
                setProgress({ current: i + 1, total: certifiedClinics.length });

                const coords = await geocodeAddress(clinic.address);

                if (coords) {
                    geocoded.push({
                        ...clinic,
                        lat: coords.lat,
                        lng: coords.lng
                    });
                }

                // Nominatim API 제한: 1 req/sec
                await delay(1100);
            }

            console.log(`✅ ${geocoded.length}개 병원 지오코딩 완료`);

            // localStorage에 저장
            localStorage.setItem(CACHE_KEY, JSON.stringify(geocoded));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());

            setHospitals(geocoded);
            setLoading(false);

        } catch (err) {
            console.error('병원 데이터 로드 실패:', err);
            setError(
                err instanceof Error
                    ? `데이터 로드 실패: ${err.message}`
                    : '알 수 없는 오류가 발생했습니다.'
            );
            setLoading(false);
        }
    }

    // 캐시 새로고침
    const refreshCache = () => {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        setHospitals([]);
        loadHospitals();
    };

    if (loading) {
        const isCached = localStorage.getItem(CACHE_KEY);
        const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

        return (
            <div className="w-full h-[600px] md:h-[700px] flex items-center justify-center bg-muted/30">
                <div className="text-center space-y-4 max-w-md px-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>

                    {!isCached && progress.total > 0 ? (
                        <>
                            <p className="text-muted-foreground font-semibold">
                                병원 위치 정보를 불러오는 중...
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {progress.current} / {progress.total} ({percentage}%)
                            </p>
                            <p className="text-xs text-muted-foreground">
                                처음 방문 시에만 시간이 걸립니다.<br/>
                                다음 방문부터는 즉시 로드됩니다.
                            </p>
                        </>
                    ) : (
                        <p className="text-muted-foreground">병원 위치 정보를 불러오는 중...</p>
                    )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[600px] md:h-[700px] flex items-center justify-center bg-muted/30">
                <div className="text-center space-y-4 max-w-md px-4">
                    <div className="text-destructive text-4xl">⚠️</div>
                    <h3 className="font-semibold text-lg">지도를 불러올 수 없습니다</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <button
                        onClick={refreshCache}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    if (hospitals.length === 0) {
        return (
            <div className="w-full h-[600px] md:h-[700px] flex items-center justify-center bg-muted/30">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">표시할 병원이 없습니다.</p>
                    <button
                        onClick={refreshCache}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        새로고침
                    </button>
                </div>
            </div>
        );
    }

    // 한국 중심 좌표 (기본값)
    const defaultCenter: [number, number] = [36.5, 127.5];
    const defaultZoom = 7;

    return (
        <div className="w-full h-[600px] md:h-[700px] relative">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                className="w-full h-full rounded-lg"
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {hospitals.map((hospital, index) => (
                    <Marker
                        key={`${hospital.id}-${index}`}
                        position={[hospital.lat, hospital.lng]}
                        icon={RedIcon}
                    >
                        <Popup>
                            <div className="space-y-2 min-w-[200px]">
                                <h3 className="font-bold text-base">{hospital.name}</h3>
                                <p className="text-sm text-gray-600">{hospital.address}</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500">📞</span>
                                    <span>{hospital.phone}</span>
                                </div>
                                <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                                    {hospital.location}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <MapBounds hospitals={hospitals} />
            </MapContainer>

            {/* 통계 정보 오버레이 */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000] text-sm">
                <div className="font-semibold mb-2">JSHA 인증 병원</div>
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>총 {hospitals.length}개</span>
                    </div>
                    <button
                        onClick={refreshCache}
                        className="mt-2 w-full text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        title="캐시 새로고침"
                    >
                        🔄 새로고침
                    </button>
                </div>
            </div>
        </div>
    );
}
