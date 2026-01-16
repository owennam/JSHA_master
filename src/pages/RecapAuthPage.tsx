import { useState, useEffect } from "react";
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
import { auth } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    User,
} from "firebase/auth";
import { AlertCircle, Loader2, Video, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createRecapRegistrant, checkExistingServices, addRecapServiceToExistingUser, getRecapRegistrant, registerBookCode, validateBookCode } from "@/lib/firestore";
import { Checkbox } from "@/components/ui/checkbox";
import { PrivacyPolicyModal } from "@/components/common/PrivacyPolicyModal";

const RecapAuthPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // 유저 상태
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

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
    const [signupName, setSignupName] = useState("");
    const [signupClinic, setSignupClinic] = useState("");
    const [signupBatch, setSignupBatch] = useState("");
    const [signupError, setSignupError] = useState("");
    const [signupLoading, setSignupLoading] = useState(false);

    // 개인정보 동의 상태
    const [privacyAgreed, setPrivacyAgreed] = useState(false);
    const [marketingAgreed, setMarketingAgreed] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

    // 교과서 코드 상태
    const [bookCode, setBookCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // Firebase Auth 상태 감시
    useEffect(() => {
        if (!auth) {
            setAuthLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setAuthLoading(false);

            // 이미 로그인된 경우 RecapPage로 리다이렉트
            if (firebaseUser) {
                navigate("/recap");
            }
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            const userCredential = await signInWithEmailAndPassword(auth!, loginEmail, loginPassword);
            const loggedInUser = userCredential.user;

            // 로그인 성공 후 recapRegistrants에 문서가 있는지 확인
            const existingRegistrant = await getRecapRegistrant(loggedInUser.uid);
            if (!existingRegistrant) {
                // Firestore에 문서가 없으면 자동 생성 (pending 상태)
                await createRecapRegistrant(
                    loggedInUser.uid,
                    loggedInUser.email || loginEmail,
                    loggedInUser.email?.split('@')[0] || '이름미입력', // 이름이 없으면 이메일 앞부분 사용
                    '미입력' // 기존 로그인 사용자는 의료기관 정보 없음
                    // 나머지 파라미터는 기본값 사용
                );
                console.log('✅ Auto-created recapRegistrant for existing Auth user');
            }
            // onAuthStateChanged에서 리다이렉트 처리
        } catch (error: any) {
            setLoginError(getAuthErrorMessage(error.code));
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
            await sendPasswordResetEmail(auth!, resetEmail);
            toast({
                title: "이메일 전송 완료",
                description: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
            });
            setIsResetDialogOpen(false);
            setResetEmail("");
        } catch (error: any) {
            toast({
                title: "전송 실패",
                description: getAuthErrorMessage(error.code),
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
        if (!signupEmail || !signupPassword || !signupPasswordConfirm || !signupName || !signupClinic) {
            setSignupError("이름, 의료기관, 이메일, 비밀번호는 필수입니다.");
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

        if (!privacyAgreed) {
            setSignupError("개인정보 수집 및 이용에 동의해주세요.");
            setSignupLoading(false);
            return;
        }

        // 교과서 코드 입력 시 유효성 검증
        if (bookCode) {
            const codeConfig = validateBookCode(bookCode);
            if (!codeConfig) {
                setSignupError("유효하지 않은 교과서 코드입니다.");
                setSignupLoading(false);
                return;
            }
            if (!phoneNumber || phoneNumber.replace(/-/g, '').length < 10) {
                setSignupError("교과서 코드 등록 시 휴대폰 번호를 정확히 입력해주세요.");
                setSignupLoading(false);
                return;
            }
        }

        try {
            // 1. Firebase Auth에 사용자 생성
            const userCredential = await createUserWithEmailAndPassword(auth!, signupEmail, signupPassword);
            const newUser = userCredential.user;

            // 2. Firestore에 다시보기 등록자 저장
            // 교과서 코드가 유효하면 바로 approved + book 등급으로 가입
            const hasValidBookCode = bookCode && validateBookCode(bookCode);
            const initialStatus = hasValidBookCode ? 'approved' : 'pending';
            const initialAccessLevel = hasValidBookCode ? 'book' : 'preview';

            try {
                await createRecapRegistrant(
                    newUser.uid,
                    signupEmail,
                    signupName,
                    signupClinic,
                    signupBatch || undefined, // 빈 문자열일 경우 undefined로 처리
                    initialStatus,
                    initialAccessLevel,
                    privacyAgreed,
                    marketingAgreed
                );
                console.log('✅ Firestore registration successful for:', newUser.uid, 'clinic:', signupClinic, 'status:', initialStatus);

                // 3. 교과서 코드 등록 (입력된 경우)
                if (bookCode && phoneNumber) {
                    const bookResult = await registerBookCode(
                        newUser.uid,
                        signupEmail,
                        signupName,
                        signupClinic,
                        bookCode,
                        phoneNumber
                    );
                    if (bookResult.success) {
                        toast({
                            title: "📚 교과서 코드 등록 완료",
                            description: "특별 영상에 접근할 수 있습니다!",
                        });
                    } else {
                        toast({
                            title: "교과서 코드 등록 실패",
                            description: bookResult.error,
                            variant: "destructive",
                        });
                    }
                }
            } catch (firestoreError: any) {
                console.error('❌ Firestore registration failed:', firestoreError);
                // Firestore 실패해도 Auth는 성공했으므로 사용자에게 알림
                toast({
                    title: "등록 정보 저장 오류",
                    description: "계정은 생성되었으나 등록 정보 저장에 실패했습니다. 관리자에게 문의해주세요.",
                    variant: "destructive",
                });
                // 이 경우에도 로그인 상태이므로 RecapPage로 이동됨
                // RecapPage에서 recapRegistrant가 없으면 자동 생성 시도함
            }

            // 4. 관리자 알림 및 환영 이메일 발송
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                fetch(`${API_URL}/notify-recap-signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: signupEmail,
                        name: signupName,
                        batch: signupBatch || '',
                        status: 'pending',
                        bookCode: bookCode || ''
                    })
                }).catch(err => console.error('Failed to send recap signup notification:', err));
            } catch (notifyError) {
                console.error('Notification error:', notifyError);
            }

            toast({
                title: "회원가입 완료",
                description: bookCode
                    ? "교과서 코드가 등록되었습니다. 영상을 시청하실 수 있습니다!"
                    : "관리자 승인 후 영상을 시청하실 수 있습니다. 환영 이메일을 확인해주세요.",
            });

            // RecapPage로 이동 (onAuthStateChanged에서 처리)
        } catch (error: any) {
            console.error("Signup failed:", error);

            // Firebase Auth 에러인 경우
            if (error.code === "auth/email-already-in-use") {
                setSignupError("이미 등록된 이메일입니다. 로그인 후 다시보기 서비스를 신청해주세요.");
            } else if (error.code) {
                setSignupError(getAuthErrorMessage(error.code));
            } else {
                setSignupError(error.message || "회원가입 중 오류가 발생했습니다.");
            }
        } finally {
            setSignupLoading(false);
        }
    };

    // 로딩 중
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">인증 확인 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-20 pb-20">
                <section className="py-20 px-4 bg-gradient-to-br from-primary/7 via-background to-secondary/7">
                    <div className="container mx-auto max-w-full sm:max-w-md px-4">
                        <div className="text-center mb-8 animate-fade-in">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
                                <Video className="w-5 h-5 text-primary" />
                                <span className="text-sm font-semibold text-primary">다시보기 전용</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
                                JSHA 마스터 코스 다시보기
                                <span className="block text-xl md:text-2xl text-primary mt-2 font-semibold">
                                    수료자 전용 영상 서비스
                                </span>
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                지금 가입하고 <strong>평생 무제한</strong>으로 강의 영상에 접근하세요
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
                                                    placeholder="example@email.com"
                                                    value={loginEmail}
                                                    onChange={(e) => setLoginEmail(e.target.value)}
                                                    disabled={loginLoading}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="loginPassword">비밀번호</Label>
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
                                                <Alert variant="destructive" role="alert" aria-live="assertive">
                                                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
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
                                                                    placeholder="example@email.com"
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
                                                <Label htmlFor="signupName">이름 *</Label>
                                                <Input
                                                    id="signupName"
                                                    type="text"
                                                    placeholder="홍길동"
                                                    value={signupName}
                                                    onChange={(e) => setSignupName(e.target.value)}
                                                    disabled={signupLoading}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="signupClinic">소속 의료기관 *</Label>
                                                <Input
                                                    id="signupClinic"
                                                    type="text"
                                                    placeholder="예: 서울대학교병원"
                                                    value={signupClinic}
                                                    onChange={(e) => setSignupClinic(e.target.value)}
                                                    disabled={signupLoading}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    🏥 본 서비스는 의료인 전용입니다
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="signupEmail">이메일 *</Label>
                                                <Input
                                                    id="signupEmail"
                                                    type="email"
                                                    placeholder="example@email.com"
                                                    value={signupEmail}
                                                    onChange={(e) => setSignupEmail(e.target.value)}
                                                    disabled={signupLoading}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    * 수료 시 등록한 이메일과 동일하면 자동 승인됩니다
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="signupBatch">수료 기수 (선택)</Label>
                                                <Input
                                                    id="signupBatch"
                                                    type="text"
                                                    placeholder="예: 1기"
                                                    value={signupBatch}
                                                    onChange={(e) => setSignupBatch(e.target.value)}
                                                    disabled={signupLoading}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    💡 <strong>팁:</strong> 입학 때 등록한 이메일과 동일하고 기수를 정확히 입력하면
                                                    <strong className="text-primary"> 즉시 자동 승인</strong>됩니다!
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="signupPassword">비밀번호 *</Label>
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
                                                <Label htmlFor="signupPasswordConfirm">비밀번호 확인 *</Label>
                                                <Input
                                                    id="signupPasswordConfirm"
                                                    type="password"
                                                    placeholder="••••••"
                                                    value={signupPasswordConfirm}
                                                    onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                                                    disabled={signupLoading}
                                                />
                                            </div>

                                            {/* 교과서 코드 등록 (선택) */}
                                            <div className="space-y-3 pt-3 border-t border-dashed">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">📚 교과서 코드 등록 (선택)</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    교과서를 구매하셨다면 코드를 입력하여 특별 영상에 접근하세요.
                                                </p>
                                                <div className="space-y-2">
                                                    <Label htmlFor="bookCode">교과서 코드</Label>
                                                    <Input
                                                        id="bookCode"
                                                        type="text"
                                                        placeholder="교과서 뒷면의 코드를 입력하세요"
                                                        value={bookCode}
                                                        onChange={(e) => setBookCode(e.target.value.toUpperCase())}
                                                        disabled={signupLoading}
                                                    />
                                                </div>
                                                {bookCode && (
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phoneNumber">휴대폰 번호 *</Label>
                                                        <Input
                                                            id="phoneNumber"
                                                            type="tel"
                                                            placeholder="01012345678 (- 없이 입력)"
                                                            value={phoneNumber}
                                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                                            disabled={signupLoading}
                                                            maxLength={11}
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            ⚠️ 휴대폰 번호당 1회만 등록 가능합니다.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* 개인정보 동의 */}
                                            <div className="space-y-3 pt-2 border-t">
                                                <div className="flex items-start space-x-2">
                                                    <Checkbox
                                                        id="privacyAgreed"
                                                        checked={privacyAgreed}
                                                        onCheckedChange={(checked) => setPrivacyAgreed(checked === true)}
                                                        disabled={signupLoading}
                                                    />
                                                    <div className="grid gap-1.5 leading-none">
                                                        <label
                                                            htmlFor="privacyAgreed"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            개인정보 수집 및 이용 동의 (필수)
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsPrivacyModalOpen(true)}
                                                            className="text-xs text-primary hover:underline text-left"
                                                        >
                                                            내용 보기
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-start space-x-2">
                                                    <Checkbox
                                                        id="marketingAgreed"
                                                        checked={marketingAgreed}
                                                        onCheckedChange={(checked) => setMarketingAgreed(checked === true)}
                                                        disabled={signupLoading}
                                                    />
                                                    <div className="grid gap-1.5 leading-none">
                                                        <label
                                                            htmlFor="marketingAgreed"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            마케팅 정보 수신 동의 (선택)
                                                        </label>
                                                        <p className="text-xs text-muted-foreground">
                                                            이메일, SMS로 새로운 강의 및 이벤트 정보를 받습니다
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {signupError && (
                                                <Alert variant="destructive" role="alert" aria-live="assertive">
                                                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
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
                                        문의사항이 있으시면<br />
                                        <a href="mailto:jshaworkshop@gmail.com" className="text-primary hover:underline">
                                            jshaworkshop@gmail.com
                                        </a>
                                        <br className='md:hidden' />로 연락해주세요
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

            {/* 개인정보 처리방침 모달 */}
            <PrivacyPolicyModal
                open={isPrivacyModalOpen}
                onOpenChange={setIsPrivacyModalOpen}
            />
        </div>
    );
};

/**
 * Firebase Auth 에러 메시지를 한글로 변환
 */
const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case "auth/email-already-in-use":
            return "이미 사용 중인 이메일입니다.";
        case "auth/invalid-email":
            return "유효하지 않은 이메일 형식입니다.";
        case "auth/operation-not-allowed":
            return "이메일/비밀번호 로그인이 비활성화되어 있습니다.";
        case "auth/weak-password":
            return "비밀번호는 최소 6자 이상이어야 합니다.";
        case "auth/user-disabled":
            return "비활성화된 계정입니다.";
        case "auth/user-not-found":
            return "존재하지 않는 계정입니다.";
        case "auth/wrong-password":
            return "잘못된 비밀번호입니다.";
        case "auth/invalid-credential":
            return "이메일 또는 비밀번호가 올바르지 않습니다.";
        case "auth/too-many-requests":
            return "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
        default:
            console.error("Unknown auth error code:", errorCode);
            return `인증 오류가 발생했습니다. (${errorCode}) 다시 시도해주세요.`;
    }
};

export default RecapAuthPage;
