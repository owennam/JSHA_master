import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    GraduationCap,
    Stethoscope,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // 화면 크기에 따른 사이드바 상태 조정
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
                setIsSidebarOpen(false);
            } else {
                setIsMobile(false);
                setIsSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 인증 체크 (간단한 쿠키 확인, 실제 검증은 API 호출 시 수행됨)
    useEffect(() => {
        // 여기서는 간단히 체크하고, 실제 데이터 로딩 시 401 에러가 나면 로그인 페이지로 튕기게 됨
        // 또는 별도의 /api/admin/check-auth 호출 가능
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const menuItems = [
        { icon: LayoutDashboard, label: '대시보드', path: '/admin/dashboard' },
        { icon: ShoppingBag, label: '주문 관리', path: '/admin/orders' },
        { icon: GraduationCap, label: '마스터 코스', path: '/admin/applications' },
        { icon: Stethoscope, label: 'Master Care', path: '/admin/mastercare' },
        // { icon: Users, label: '수료자 관리', path: '/admin/graduates' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside
                className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile && isSidebarOpen ? 'shadow-2xl' : ''}
          md:translate-x-0
        `}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <span className="text-xl font-bold">JSHA Admin</span>
                    {isMobile && (
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                            <X className="h-6 w-6" />
                        </button>
                    )}
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) setIsSidebarOpen(false);
                                }}
                                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">로그아웃</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white shadow-sm flex items-center px-6 justify-between md:justify-end">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden text-slate-600"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">관리자님, 환영합니다</span>
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};
