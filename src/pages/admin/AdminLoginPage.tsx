import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const AdminLoginPage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.success) {
                navigate('/admin/dashboard');
            } else {
                setError(data.message || '로그인에 실패했습니다.');
            }
        } catch (err) {
            setError('서버 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-2">
                        <Lock className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">관리자 로그인</CardTitle>
                    <CardDescription>
                        관리자 비밀번호를 입력해주세요
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 text-lg"
                                disabled={isLoading}
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-500 text-center font-medium">
                                {error}
                            </p>
                        )}
                        <Button
                            type="submit"
                            className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800"
                            disabled={isLoading}
                        >
                            {isLoading ? '로그인 중...' : '로그인'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLoginPage;
