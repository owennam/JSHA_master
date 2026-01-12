import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TrendingUp,
    Users,
    AlertCircle,
    CreditCard,
    ArrowUpRight,
    UserCheck,
    ShoppingBag,
    XCircle,
    Video,
    Clock
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getRecapRegistrantsByStatus } from '@/lib/firestore';

interface OrderInfo {
    orderId: string;
    amount: number;
    status: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    productName: string;
    createdAt: string;
    paymentKey: string;
}

interface DashboardData {
    totalRevenue: number;
    totalOrders: number;
    masterCourseRegistrations: number;
    pendingUsers: number;
    pendingOrderCancels: number;
    recapPending: number;
    recapApproved: number;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData>({
        totalRevenue: 0,
        totalOrders: 0,
        masterCourseRegistrations: 0,
        pendingUsers: 0,
        pendingOrderCancels: 0,
        recapPending: 0,
        recapApproved: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    // Firebase Auth 상태 확인 및 자동 로그인
    useEffect(() => {
        if (!auth) {
            setAuthChecked(true);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                try {
                    console.log("Dashboard not authenticated, signing in anonymously...");
                    await signInAnonymously(auth);
                    console.log("✅ Dashboard anonymous sign-in successful");
                } catch (error) {
                    console.error("Dashboard anonymous sign-in failed:", error);
                }
            }
            setAuthChecked(true);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!authChecked) return;

            try {
                const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_SERVER_URL || '';
                const token = localStorage.getItem('admin_token');

                // 주문 관리 페이지와 동일한 방식으로 데이터 가져오기 + 다시보기 데이터 추가
                const [ordersResponse, applicationsResponse, usersResponse, recapPendingData, recapApprovedData] = await Promise.all([
                    fetch(`${API_URL}/api/admin/orders`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    }),
                    fetch(`${API_URL}/api/admin/applications`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    }),
                    fetch(`${API_URL}/api/admin/users?status=pending`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    }),
                    // Firestore에서 다시보기 등록자 데이터 가져오기
                    getRecapRegistrantsByStatus('pending'),
                    getRecapRegistrantsByStatus('approved')
                ]);

                if (!ordersResponse.ok || !applicationsResponse.ok || !usersResponse.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const ordersResult = await ordersResponse.json();
                const applicationsResult = await applicationsResponse.json();
                const usersResult = await usersResponse.json();

                if (!ordersResult.success || !applicationsResult.success || !usersResult.success) {
                    throw new Error('Failed to load dashboard data');
                }

                const orders: OrderInfo[] = ordersResult.data || [];
                const applications = applicationsResult.data || [];
                const pendingUsers = usersResult.data || [];

                // 주문 관리 페이지와 동일한 방식으로 통계 계산 (lines 283-300)
                const totalRevenue = orders.reduce((sum, order) => {
                    if (order.status === 'completed') return sum + (order.amount || 0);
                    return sum;
                }, 0);

                const pendingOrderCancels = orders.filter(o => o.status === 'cancel_requested').length;

                // 취소된 주문 제외한 총 주문 건수
                const totalOrders = orders.filter(o => o.status !== 'canceled').length;

                setData({
                    totalRevenue,
                    totalOrders,
                    masterCourseRegistrations: applications.length,
                    pendingUsers: pendingUsers.length,
                    pendingOrderCancels,
                    recapPending: recapPendingData.length,
                    recapApproved: recapApprovedData.length
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [authChecked]);

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
            bg: "bg-blue-100",
            clickable: false
        },
        {
            title: "총 주문",
            value: `${data.totalOrders}건`,
            icon: ShoppingBag,
            description: "전체 주문 건수",
            color: "text-purple-600",
            bg: "bg-purple-100",
            clickable: false
        },
        {
            title: "마스터코스 등록자",
            value: `${data.masterCourseRegistrations}명`,
            icon: Users,
            description: "총 신청자 수",
            color: "text-green-600",
            bg: "bg-green-100",
            clickable: false
        },
        {
            title: "신규 회원 승인 대기",
            value: `${data.pendingUsers}명`,
            icon: UserCheck,
            description: "승인 대기 회원",
            color: "text-amber-600",
            bg: "bg-amber-100",
            clickable: true,
            onClick: () => navigate('/admin/users?status=pending')
        },
        {
            title: "다시보기 승인 대기",
            value: `${data.recapPending}명`,
            icon: Clock,
            description: "승인 대기 중",
            color: "text-orange-600",
            bg: "bg-orange-100",
            clickable: true,
            onClick: () => navigate('/admin/recap')
        },
        {
            title: "다시보기 승인됨",
            value: `${data.recapApproved}명`,
            icon: Video,
            description: "접근 승인 완료",
            color: "text-teal-600",
            bg: "bg-teal-100",
            clickable: true,
            onClick: () => navigate('/admin/recap')
        },
        {
            title: "주문 취소 승인 대기",
            value: `${data.pendingOrderCancels}건`,
            icon: XCircle,
            description: "환불 승인 대기",
            color: "text-red-600",
            bg: "bg-red-100",
            clickable: true,
            onClick: () => navigate('/admin/orders?status=cancel_requested')
        }
    ];

    if (isLoading) {
        return <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>;
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
                    <Card
                        key={index}
                        className={`hover:shadow-md transition-shadow ${stat.clickable ? 'cursor-pointer' : ''}`}
                        onClick={stat.clickable ? stat.onClick : undefined}
                    >
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
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>빠른 바로가기</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer"
                                className="flex items-center p-4 rounded-lg border hover:bg-slate-50 transition-colors flex-1">
                                <div className="h-10 w-10 rounded bg-orange-100 flex items-center justify-center mr-3">
                                    <ArrowUpRight className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Firebase 콘솔</p>
                                    <p className="text-sm text-muted-foreground">데이터베이스 관리</p>
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
