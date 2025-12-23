import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { authenticateUser, authorizedUsers } from "@/data/authorizedUsers";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const { signUp, signIn, resetPassword } = useAuth();
  const { toast } = useToast();

  // 로그인 상태
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // 비밀번호 재설정 상태
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // 회원가입 상태
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  /**
   * 로그인 처리
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    if (!loginEmail || !loginPassword) {
      setLoginError("이메일과 비밀번호를 모두 입력해주세요.");
      setLoginLoading(false);
      return;
    }

    try {
      await signIn(loginEmail, loginPassword);
      // 로그인 성공 시 제품 페이지로 이동
      navigate("/products");
    } catch (error: any) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  /**
   * 비밀번호 재설정 이메일 전송
   */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    if (!resetEmail) {
      toast({
        title: "이메일을 입력해주세요",
        description: "비밀번호 재설정 링크를 받을 이메일 주소가 필요합니다.",
        variant: "destructive",
      });
      setResetLoading(false);
      return;
    }

    try {
      await resetPassword(resetEmail);
      toast({
        title: "이메일 전송 완료",
        description: "비밀번호 재설정 링크가 이메일로 전송되었습니다. 메일함을 확인해주세요.",
      });
      setIsResetDialogOpen(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "전송 실패",
        description: error.message || "비밀번호 재설정 이메일을 보내는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  /**
   * 회원가입 처리
   */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setSignupLoading(true);

    // 입력 검증
    if (!signupEmail || !signupPassword || !signupPasswordConfirm || !clinicName || !directorName) {
      setSignupError("모든 필드를 입력해주세요.");
      setSignupLoading(false);
      return;
    }

    if (signupPassword !== signupPasswordConfirm) {
      setSignupError("비밀번호가 일치하지 않습니다.");
      setSignupLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError("비밀번호는 최소 6자 이상이어야 합니다.");
      setSignupLoading(false);
      return;
    }

    // authorizedUsers 목록에서 화이트리스트 확인
    const isWhitelisted = authenticateUser(clinicName, directorName);

    // 화이트리스트에 있으면 위치 정보 가져오기
    const authorizedUser = authorizedUsers.find(
      (user) =>
        user.clinicName.toLowerCase().replace(/\s+/g, '') === clinicName.toLowerCase().replace(/\s+/g, '') &&
        user.directorName.toLowerCase() === directorName.toLowerCase()
    );
    const location = authorizedUser?.location || "기타";

    try {
      // 화이트리스트에 있으면 즉시 승인('approved'), 없으면 승인 대기('pending')
      const status = isWhitelisted ? 'approved' : 'pending';
      await signUp(signupEmail, signupPassword, clinicName, directorName, location, status);

      // 관리자에게 알림 전송
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        fetch(`${API_URL}/notify-signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: signupEmail,
            clinicName,
            directorName,
            location,
            status
          })
        }).catch(err => console.error('Failed to send signup notification:', err));
      } catch (notifyError) {
        console.error('Notification error:', notifyError);
      }

      // 회원가입 성공
      if (isWhitelisted) {
        // 화이트리스트 사용자는 바로 제품 페이지로
        toast({
          title: "회원가입 완료",
          description: "환영합니다! 바로 인솔을 구매하실 수 있습니다.",
        });
        navigate("/products");
      } else {
        // 화이트리스트에 없는 사용자는 승인 대기 페이지로
        toast({
          title: "회원가입 완료",
          description: "관리자 승인 후 서비스를 이용하실 수 있습니다.",
        });
        navigate("/auth/pending");
      }
    } catch (error: any) {
      setSignupError(error.message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-20">
        <section className="py-20 px-4 bg-gradient-to-br from-primary/7 via-background to-secondary/7">
          <div className="container mx-auto max-w-md">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">회원 인증</h1>
              <p className="text-lg text-muted-foreground">
                인솔 구매는 JSHA 인증 의료기관만 <br />이용 가능합니다
              </p>
            </div>

            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle>로그인 / 회원가입</CardTitle>
                <CardDescription>
                  계정이 있으시면 로그인, 없으시면 회원가입해주세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">로그인</TabsTrigger>
                    <TabsTrigger value="signup">회원가입</TabsTrigger>
                  </TabsList>

                  {/* 로그인 탭 */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="loginEmail">이메일</Label>
                        <Input
                          id="loginEmail"
                          type="email"
                          placeholder="example@clinic.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          disabled={loginLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="loginPassword">비밀번호</Label>
                        </div>
                        <Input
                          id="loginPassword"
                          type="password"
                          placeholder="••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          disabled={loginLoading}
                        />
                      </div>

                      {loginError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{loginError}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loginLoading}
                      >
                        {loginLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            로그인 중...
                          </>
                        ) : (
                          "로그인"
                        )}
                      </Button>

                      <div className="text-center mt-2">
                        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="link" size="sm" className="text-muted-foreground px-0">
                              비밀번호를 잊으셨나요?
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>비밀번호 재설정</DialogTitle>
                              <DialogDescription>
                                가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleResetPassword} className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="resetEmail">이메일</Label>
                                <Input
                                  id="resetEmail"
                                  type="email"
                                  placeholder="example@clinic.com"
                                  value={resetEmail}
                                  onChange={(e) => setResetEmail(e.target.value)}
                                  disabled={resetLoading}
                                />
                              </div>
                              <DialogFooter>
                                <Button type="submit" disabled={resetLoading}>
                                  {resetLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      전송 중...
                                    </>
                                  ) : (
                                    "재설정 링크 보내기"
                                  )}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </form>
                  </TabsContent>

                  {/* 회원가입 탭 */}
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="clinicName">의료기관 이름</Label>
                        <Input
                          id="clinicName"
                          type="text"
                          placeholder="예: 대전제이에스힐링의원"
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                          disabled={signupLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          * JSHA 등록 의료기관 이름을 정확히 입력해주세요
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="directorName">원장님 성함</Label>
                        <Input
                          id="directorName"
                          type="text"
                          placeholder="예: 홍길동"
                          value={directorName}
                          onChange={(e) => setDirectorName(e.target.value)}
                          disabled={signupLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">이메일</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="example@clinic.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          disabled={signupLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">비밀번호</Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          placeholder="••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          disabled={signupLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          * 최소 6자 이상
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPasswordConfirm">비밀번호 확인</Label>
                        <Input
                          id="signupPasswordConfirm"
                          type="password"
                          placeholder="••••••"
                          value={signupPasswordConfirm}
                          onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                          disabled={signupLoading}
                        />
                      </div>

                      {signupError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{signupError}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={signupLoading}
                      >
                        {signupLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            회원가입 중...
                          </>
                        ) : (
                          "회원가입"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

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

      <Footer showBusinessInfo={true} />
    </div>
  );
};

export default AuthPage;
