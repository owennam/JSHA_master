```
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const AdminLoginPage = () => {
  // 숨겨진 관리자 이메일 계정
  const ADMIN_EMAIL = "admin@jsha.com";
  
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      
      toast({
        title: "로그인 성공",
        description: "관리자 페이지로 이동합니다.",
      });
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // 계정이 없는 경우 (최초 1회 자동 생성 시도 - 편의성 위함)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        // 보안상 비밀번호가 틀린건지 계정이 없는건지 구분하지 않는 게 좋지만, 
        // 여기서는 마이그레이션 편의를 위해 계정 생성 로직을 고려할 수 있음.
        // 하지만 'admin1234'같은 쉬운 비번으로 자동생성을 열어두면 위험할 수 있으므로
        // 실패 메시지만 띄움.
        toast({
          title: "로그인 실패",
          description: "비밀번호가 올바르지 않습니다. (초기 설정이 필요하면 문의해주세요)",
          variant: "destructive",
        });
      } else {
        toast({
          title: "로그인 오류",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">JSHA 관리자 로그인</CardTitle>
          <CardDescription>
            관리자 비밀번호를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* 이메일 입력 필드는 숨김 */}
            <div className="hidden">
               <Input value={ADMIN_EMAIL} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
```
