import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle, Video, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

// 임시 영상 데이터 (나중에 추가할 영상들)
const recapVideos = [
  {
    id: 1,
    title: "세션 1-1: 통증의 이해",
    description: "통증의 기본 원리와 JSHA 접근법",
    vimeoUrl: "https://vimeo.com/placeholder",
    duration: "45분",
    module: "세션 1",
    thumbnail: "https://placehold.co/400x225/2F6FED/FFFFFF/png?text=Module+1-1",
  },
  {
    id: 2,
    title: "세션 1-2: 구조적 불균형 진단",
    description: "실전 진단 기법과 임상 적용",
    vimeoUrl: "https://vimeo.com/placeholder",
    duration: "50분",
    module: "세션 1",
    thumbnail: "https://placehold.co/400x225/2F6FED/FFFFFF/png?text=Module+1-2",
  },
  // 더 많은 영상들...
];

const RecapPage = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Firebase 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsCheckingAuth(true);
      if (user && user.email) {
        setIsAuthenticated(true);
        setUserEmail(user.email);
        // 수료자 확인
        await checkAuthorization(user.email);
      } else {
        setIsAuthenticated(false);
        setIsAuthorized(false);
        setUserEmail("");
      }
      setIsCheckingAuth(false);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google 로그인 처리
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user.email) {
        toast({
          title: "로그인 성공",
          description: `${user.email}로 로그인되었습니다.`,
        });
        // 인증 상태는 onAuthStateChanged에서 자동 처리
      }
    } catch (error: any) {
      console.error("로그인 에러:", error);
      toast({
        title: "로그인 실패",
        description: error.message || "다시 시도해주세요.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "로그아웃 완료",
        description: "안전하게 로그아웃되었습니다.",
      });
    } catch (error: any) {
      toast({
        title: "로그아웃 실패",
        description: error.message || "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 이메일 승인 확인 (백엔드 API 호출)
  const checkAuthorization = async (email: string) => {
    try {
      const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";
      const response = await fetch(`${SERVER_URL}/check-graduate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      setIsAuthorized(result.authorized);
    } catch (error) {
      console.error("Authorization check failed:", error);
      setIsAuthorized(false);
    }
  };

  // 초기 로딩 중
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 로그인 안 된 경우
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-40 pb-20 px-4 bg-gradient-to-br from-primary/7 via-background to-secondary/7 min-h-[calc(100vh-80px)]">
          <div className="container mx-auto max-w-2xl">
            <Card className="border-2 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4 text-black">수료자 전용 영상</CardTitle>
                <p className="text-muted-foreground">
                  JSHA 마스터 코스 수료자만 접근할 수 있습니다.
                  <br />
                  Google 계정으로 로그인하여 인증해주세요.
                </p>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8"
                >
                  {isLoading ? "로그인 중..." : "Google로 로그인"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  수료증에 등록된 이메일 계정으로 로그인하세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 로그인 했지만 승인 안 된 경우
  if (isAuthenticated && !isAuthorized) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-40 pb-20 px-4 bg-gradient-to-br from-primary/7 via-background to-secondary/7 min-h-[calc(100vh-80px)]">
          <div className="container mx-auto max-w-2xl">
            <Card className="border-2 border-amber-500/20 bg-amber-500/5">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">접근 권한 없음</CardTitle>
                <p className="text-muted-foreground">
                  로그인한 계정 ({userEmail})은
                  <br />
                  수료자 명단에 등록되어 있지 않습니다.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">접근 방법:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>JSHA 마스터 코스를 수료하신 경우, 관리자에게 문의하세요.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>수료증에 등록된 이메일 계정으로 로그인하세요.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>다른 계정으로 다시 시도하려면 로그아웃하세요.</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <a
                      href="mailto:jshaworkshop@gmail.com"
                      className="text-primary hover:underline font-medium"
                    >
                      jshaworkshop@gmail.com
                    </a>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 로그인 + 승인된 경우: 영상 목록 표시
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-40 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* 헤더 */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">인증 완료</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              마스터 코스 다시보기
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              수업 영상을 다시 확인하고 복습하세요.
              <br />
              언제든지 필요한 내용을 다시 학습할 수 있습니다.
            </p>
          </div>

          {/* 사용자 정보 */}
          <div className="mb-8 max-w-4xl mx-auto">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {userEmail || "인증된 사용자"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        JSHA 마스터 코스 수료자
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 영상 목록 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recapVideos.map((video) => (
              <Card
                key={video.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 cursor-pointer"
                onClick={() => {
                  toast({
                    title: "영상 준비 중",
                    description: "수업 영상은 순차적으로 업로드될 예정입니다.",
                  });
                }}
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {video.module}
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 안내 메시지 */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="bg-muted/30 border-2">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Video className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">이용 안내</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>
                          모든 영상은 Vimeo를 통해 안전하게 제공됩니다.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>
                          영상은 수료 후 평생 무제한으로 시청 가능합니다.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>
                          새로운 영상이 추가되면 이메일로 알림을 보내드립니다.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>
                          영상 관련 문의는 jshaworkshop@gmail.com으로 연락주세요.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecapPage;
