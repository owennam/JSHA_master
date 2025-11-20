import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TrendingUp,
    Users,
    Calendar,
    CreditCard,
    ArrowUpRight
} from 'lucide-react';

interface DashboardData {
    totalRevenue: number;
    totalOrders: number;
    newApplications: number;
    pendingConsultations: number;
}

const AdminDashboard = () => {
    const [data, setData] = useState<DashboardData>({
        totalRevenue: 0,
        totalOrders: 0,
        newApplications: 0,
        pendingConsultations: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin/dashboard-summary');
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
    };

    const stats = [
        {
            title: "총 매출",
            value: formatCurrency(data.totalRevenue),
            icon: CreditCard,
            description: "전체 누적 매출",
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            title: "신규 신청",
            value: `${data.newApplications}명`,
            icon: Users,
            description: "마스터 코스 신청자",
            color: "text-green-600",
            bg: "bg-green-100"
        },
        {
            title: "상담 대기",
            value: `${data.pendingConsultations}건`,
            icon: Calendar,
            description: "Master Care 신청",
            color: "text-orange-600",
            bg: "bg-orange-100"
        },
        {
            title: "총 주문",
            value: `${data.totalOrders}건`,
            icon: TrendingUp,
            description: "전체 주문 건수",
            color: "text-purple-600",
            bg: "bg-purple-100"
        }
    ];

    if (isLoading) {
        return <div className="flex items-center justify-center h-96">로딩 중...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
                <p className="text-muted-foreground">
                    JSHA Master 운영 현황을 한눈에 확인하세요.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>최근 활동</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* 여기에 최근 활동 리스트 추가 예정 */}
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">시스템 준비 중</p>
                                    <p className="text-sm text-muted-foreground">
                                        최근 활동 내역 기능이 곧 업데이트됩니다.
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">Just now</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>빠른 바로가기</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <a href="https://docs.google.com/spreadsheets" target="_blank" rel="noreferrer"
                                className="flex items-center p-3 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="h-9 w-9 rounded bg-green-100 flex items-center justify-center mr-3">
                                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Google Sheets 열기</p>
                                    <p className="text-sm text-muted-foreground">원본 데이터 확인</p>
                                </div>
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
