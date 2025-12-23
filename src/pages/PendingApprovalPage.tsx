import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, Mail, LogOut } from "lucide-react";

const PendingApprovalPage = () => {
  const navigate = useNavigate();
  const { userProfile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 승인된 사용자가 이 페이지에 접근하면 products로 리다이렉트
  if (userProfile?.status === 'approved') {
    navigate("/products");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-40 pb-20">
        <section className="py-20 px-4 bg-gradient-to-br from-primary/7 via-background to-secondary/7">
          <div className="container mx-auto max-w-md">
            <Card className="shadow-elevated border-2">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-black">
                  승인 대기 중
                </CardTitle>
                <CardDescription className="text-base">
                  관리자가 가입 신청을 검토하고 있습니다
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-foreground">가입 정보</h3>
                  {userProfile && (
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>의료기관:</strong> {userProfile.clinicName}</p>
                      <p><strong>원장님:</strong> {userProfile.directorName}</p>
                      <p><strong>이메일:</strong> {userProfile.email}</p>
                      <p><strong>지역:</strong> {userProfile.location}</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">승인 안내</p>
                      <p className="leading-relaxed">
                        관리자가 화이트리스트를 확인하여 승인 처리합니다.
                        보통 1-2 영업일 내에 승인 여부를 이메일로 알려드립니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.reload()}
                  >
                    승인 상태 새로고침
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    문의사항이 있으시면
                  </p>
                  <a
                    href="mailto:jshaworkshop@gmail.com"
                    className="text-primary hover:underline font-medium"
                  >
                    jshaworkshop@gmail.com
                  </a>
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

      <Footer showBusinessInfo={true} />
    </div>
  );
};

export default PendingApprovalPage;
