import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authenticateUser, saveAuthStatus } from "@/data/authorizedUsers";
import { AlertCircle } from "lucide-react";

const AuthPage = () => {
  const [clinicName, setClinicName] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 입력 검증
    if (!clinicName.trim() || !directorName.trim()) {
      setError("의료기관 이름과 원장님 성함을 모두 입력해주세요.");
      setIsLoading(false);
      return;
    }

    // 사용자 인증
    const isAuthenticated = authenticateUser(clinicName, directorName);

    if (isAuthenticated) {
      // 인증 성공
      saveAuthStatus(clinicName, directorName);
      setTimeout(() => {
        navigate("/products");
      }, 500);
    } else {
      // 인증 실패
      setError("인증되지 않은 사용자입니다. 의료기관 이름과 원장님 성함을 다시 확인해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-20">
        <section className="py-20 px-4 bg-gradient-to-br from-primary/7 via-background to-secondary/7">
          <div className="container mx-auto max-w-md">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">인증이 필요합니다</h1>
              <p className="text-lg text-muted-foreground">
                인솔 구매는 JSHA 인증 의료기관만 <br />이용 가능합니다
              </p>
            </div>

            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle>의료기관 인증</CardTitle>
                <CardDescription>
                  의료기관 이름과 원장님 성함을 <br className='md:hidden' />입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">의료기관 이름</Label>
                    <Input
                      id="clinicName"
                      type="text"
                      placeholder="예: 대전제이에스힐링의원"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="text-lg"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="directorName">원장님 성함</Label>
                    <Input
                      id="directorName"
                      type="text"
                      placeholder="예: 홍길동"
                      value={directorName}
                      onChange={(e) => setDirectorName(e.target.value)}
                      className="text-lg"
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full text-lg py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? "인증 중..." : "인증하기"}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    인증에 문제가 있으시면<br />
                    <a href="mailto:jshaworkshop@gmail.com" className="text-primary hover:underline">
                      jshaworkshop@gmail.com
                    </a>
                    <br className='md:hidden' />로 문의해주세요
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="text-base"
              >
                홈으로 돌아가기
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
