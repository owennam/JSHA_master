import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// 빨간색 마커 아이콘
const RedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// 파란색 마커 아이콘
const BlueIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Hospital {
    name: string;
    address: string;
    lat: number;
    lng: number;
    color: 'red' | 'blue';
    zIndex: number;
    status: string;
}

interface HospitalData {
    hospitals: Hospital[];
    totalCount: number;
    redCount: number;
    blueCount: number;
    generatedAt: string;
}

interface HospitalMapProps {
    appsScriptUrl?: string;
}

// 지도 중심을 자동으로 조정하는 컴포넌트
function MapBounds({ hospitals }: { hospitals: Hospital[] }) {
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

export function HospitalMap({ appsScriptUrl }: HospitalMapProps) {
    const [hospitalData, setHospitalData] = useState<HospitalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const scriptUrl = appsScriptUrl || import.meta.env.VITE_APPS_SCRIPT_URL;

    useEffect(() => {
        const fetchHospitals = async () => {
            if (!scriptUrl) {
                setError('Apps Script URL이 설정되지 않았습니다. .env 파일을 확인해주세요.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(scriptUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: HospitalData = await response.json();

                if (data.hospitals && data.hospitals.length > 0) {
                    setHospitalData(data);
                } else {
                    setError('병원 데이터가 없습니다.');
                }
            } catch (err) {
                console.error('병원 데이터 로드 실패:', err);
                setError(
                    err instanceof Error
                        ? `데이터 로드 실패: ${err.message}`
                        : '알 수 없는 오류가 발생했습니다.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchHospitals();
    }, [scriptUrl]);

    if (loading) {
        return (
            <div className="w-full h-[600px] md:h-[700px] flex items-center justify-center bg-muted/30">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">병원 위치 정보를 불러오는 중...</p>
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
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    if (!hospitalData || hospitalData.hospitals.length === 0) {
        return (
            <div className="w-full h-[600px] md:h-[700px] flex items-center justify-center bg-muted/30">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">표시할 병원이 없습니다.</p>
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

                {hospitalData.hospitals.map((hospital, index) => (
                    <Marker
                        key={`${hospital.lat}-${hospital.lng}-${index}`}
                        position={[hospital.lat, hospital.lng]}
                        icon={hospital.color === 'red' ? RedIcon : BlueIcon}
                        zIndexOffset={hospital.zIndex}
                    >
                        <Popup>
                            <div className="space-y-2 min-w-[200px]">
                                <h3 className="font-bold text-base">{hospital.name}</h3>
                                <p className="text-sm text-gray-600">{hospital.address}</p>
                                {hospital.status === 'ON' && (
                                    <div className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                                        운영 중
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <MapBounds hospitals={hospitalData.hospitals} />
            </MapContainer>

            {/* 통계 정보 오버레이 */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000] text-sm">
                <div className="font-semibold mb-2">병원 현황</div>
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>운영 중: {hospitalData.redCount}개</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>기타: {hospitalData.blueCount}개</span>
                    </div>
                    <div className="pt-1 border-t mt-2">
                        <span className="font-semibold">총 {hospitalData.totalCount}개</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
