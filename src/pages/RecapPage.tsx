import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle, Video, LogOut, Clock, XCircle, X, Lock, Shield, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { getRecapRegistrant, RecapRegistrant, getAllRecapVideos, RecapVideo, AccessLevel, canAccessLevel, getUserProfile, addRecapServiceToExistingUser } from "@/lib/firestore";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// embed HTML에서 Vimeo URL 추출
const extractVimeoFromEmbed = (input: string): string => {
  if (!input) return "";

  // 이미 일반 URL이면 그대로 반환
  if (input.startsWith('http') && !input.includes('<')) {
    return input;
  }

  // embed HTML에서 player.vimeo.com URL 추출
  const playerMatch = input.match(/player\.vimeo\.com\/video\/(\d+)(?:\?h=([a-zA-Z0-9]+))?/);
  if (playerMatch) {
    const videoId = playerMatch[1];
    const hash = playerMatch[2];
    return hash ? `https://vimeo.com/${videoId}/${hash}` : `https://vimeo.com/${videoId}`;
  }

  // iframe src에서 일반 vimeo.com URL 추출
  const vimeoMatch = input.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    const hash = vimeoMatch[2];
    return hash ? `https://vimeo.com/${videoId}/${hash}` : `https://vimeo.com/${videoId}`;
  }

  return input;
};

// 비디오 URL에서 썸네일 자동 추출
const getVideoThumbnail = (url: string, fallback?: string): string => {
  if (!url) return fallback || "https://placehold.co/400x225/2F6FED/FFFFFF/png?text=Video";

  // embed HTML에서 URL 추출
  const cleanUrl = extractVimeoFromEmbed(url);

  // YouTube 썸네일 추출
  const youtubeMatch = cleanUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
  }

  // Vimeo 썸네일 (vumbnail 서비스 사용)
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
  }

  // 기존 썸네일이 있으면 사용, 없으면 기본 이미지
  return fallback || "https://placehold.co/400x225/2F6FED/FFFFFF/png?text=Video";
};

// 비디오 URL을 embed URL로 변환
const getEmbedUrl = (url: string): string => {
  if (!url) return "";

  // embed HTML에서 URL 추출
  const cleanUrl = extractVimeoFromEmbed(url).split('?')[0];

  // YouTube embed URL 변환
  const youtubeMatch = cleanUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
  }

  // Vimeo embed URL 변환 (비밀 해시 포함, 공유/제목/작성자 숨김)
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    const hash = vimeoMatch[2];
    const hashParam = hash ? `&h=${hash}` : '';
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0${hashParam}`;
  }

  return url;
};

// 접근 등급 레이블 및 색상
const getAccessLevelLabel = (level: AccessLevel): string => {
  const labels: Record<AccessLevel, string> = {
    'preview': '맛보기',
    'session1': '세션 1',
    'graduate': '수료자',
  };
  return labels[level];
};

const getAccessLevelColor = (level: AccessLevel): string => {
  const colors: Record<AccessLevel, string> = {
    'preview': 'bg-gray-100 text-gray-700 border-gray-300',
    'session1': 'bg-blue-100 text-blue-700 border-blue-300',
    'graduate': 'bg-green-100 text-green-700 border-green-300',
  };
  return colors[level];
};

type AccessStatus = 'loading' | 'not_authenticated' | 'not_registered' | 'pending' | 'rejected' | 'approved';

const RecapPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [accessStatus, setAccessStatus] = useState<AccessStatus>('loading');
  const [registrantData, setRegistrantData] = useState<RecapRegistrant | null>(null);
  const [videos, setVideos] = useState<RecapVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<RecapVideo | null>(null);

  // Firebase 인증 상태 감지
  useEffect(() => {
    if (!auth) {
      navigate('/recap/auth');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // 로그인된 경우에만 접근 권한 확인
        await checkRecapAccess(firebaseUser.uid);
      } else {
        // 로그인 안 되어 있으면 바로 인증 페이지로 이동
        navigate('/recap/auth');
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 접근 권한 확인 (Firestore에서 등록자 상태 조회)
  const checkRecapAccess = async (uid: string) => {
    try {
      // Firestore에서 다시보기 등록자 조회
      const registrant = await getRecapRegistrant(uid);

      if (!registrant) {
        // 다시보기에 등록되지 않은 사용자
        // 인솔 사용자인지 확인
        const insoleProfile = await getUserProfile(uid);

        if (insoleProfile) {
          // 인솔 사용자 - 다시보기 서비스 신청 화면 표시
          setAccessStatus('not_registered');
          console.log("Insole user, showing recap service request UI");
        } else {
          // 어떤 서비스에도 등록되지 않은 사용자 - 로그아웃 후 등록 페이지로 이동
          console.log("Not registered in any service, logging out and redirecting to auth page");
          await signOut(auth!);
          toast({
            title: "등록이 필요합니다",
            description: "다시보기 서비스를 이용하려면 먼저 등록해주세요.",
            variant: "destructive",
          });
          navigate('/recap/auth');
        }
        return;
      }

      // 등록자 데이터 저장
      setRegistrantData(registrant);

      // 상태에 따라 처리
      if (registrant.status === 'approved') {
        setAccessStatus('approved');
      } else if (registrant.status === 'pending') {
        setAccessStatus('pending');
      } else if (registrant.status === 'rejected') {
        setAccessStatus('rejected');
      } else {
        // 기타 상태 - 로그아웃 후 등록 페이지로 이동
        await signOut(auth!);
        navigate('/recap/auth');
      }
    } catch (error) {
      console.error("Access check failed:", error);
      // 에러 발생 시 로그아웃 후 등록 페이지로 이동
      await signOut(auth!);
      toast({
        title: "접근 오류",
        description: "접근 권한 확인 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      navigate('/recap/auth');
    }
  };

  // 비디오 목록 로드
  useEffect(() => {
    const loadVideos = async () => {
      if (accessStatus === 'approved') {
        try {
          setVideosLoading(true);
          const videoList = await getAllRecapVideos(true);
          setVideos(videoList);
        } catch (error) {
          console.error("Failed to load videos:", error);
          toast({
            title: "비디오 로드 실패",
            description: "비디오 목록을 불러올 수 없습니다.",
            variant: "destructive",
          });
        } finally {
          setVideosLoading(false);
        }
      }
    };

    loadVideos();
  }, [accessStatus, toast]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signOut(auth!);
      toast({
        title: "로그아웃 완료",
        description: "안전하게 로그아웃되었습니다.",
      });
      navigate('/recap/auth');
    } catch (error: any) {
      toast({
        title: "로그아웃 실패",
        description: error.message || "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 다시보기 서비스 신청 처리
  const handleRequestRecapService = async () => {
    if (!user) return;

    try {
      // 인솔 사용자 정보 가져오기
      const insoleProfile = await getUserProfile(user.uid);
      if (!insoleProfile) {
        toast({
          title: "오류",
          description: "사용자 정보를 찾을 수 없습니다.",
          variant: "destructive",
        });
        return;
      }

      // 다시보기 서비스 신청 (insole 사용자의 directorName을 이름으로 사용)
      await addRecapServiceToExistingUser(
        user.uid,
        user.email || insoleProfile.email,
        insoleProfile.directorName
        // batch, status, accessLevel은 기본값 사용
      );

      toast({
        title: "신청 완료",
        description: "다시보기 서비스 신청이 완료되었습니다. 관리자 승인 후 이용 가능합니다.",
      });

      // 상태를 pending으로 변경
      setAccessStatus('pending');
    } catch (error: any) {
      console.error("Failed to request recap service:", error);
      toast({
        title: "신청 실패",
        description: error.message || "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 로딩 중
  if (accessStatus === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">접근 권한 확인 중...</p>
        </div>
      </div>
    );
  }

  // 다시보기 서비스 미등록 (인솔 사용자)
  if (accessStatus === 'not_registered') {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        {/* 우측 상단 사용자 정보 */}
        <div className="fixed top-24 right-4 z-40 flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-foreground max-w-[150px] truncate">
              {user?.email || "인증된 사용자"}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
          >
            <LogOut className="w-3 h-3 mr-1" />
            로그아웃
          </Button>
        </div>

        <main className="pt-40 pb-20 px-4 bg-gradient-to-br from-primary/7 via-background to-secondary/7 min-h-[calc(100vh-80px)]">
          <div className="container mx-auto max-w-2xl">
            <Card className="border-2 border-blue-500/20 bg-blue-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-3xl mb-4">다시보기 서비스 신청</CardTitle>
                <p className="text-muted-foreground">
                  안녕하세요! 인솔 구매 회원님이시군요.
                  <br />
                  마스터 코스 다시보기 서비스를 이용하시려면 신청이 필요합니다.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">안내사항</p>
                  <ul className="space-y-1">
                    <li>• 다시보기 서비스는 마스터 코스 수료자 및 등록자를 위한 서비스입니다.</li>
                    <li>• 신청 후 관리자 승인이 완료되면 영상을 시청하실 수 있습니다.</li>
                  </ul>
                </div>

                <Button
                  onClick={handleRequestRecapService}
                  className="w-full"
                  size="lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  다시보기 서비스 신청하기
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  문의: <a href="mailto:jshaworkshop@gmail.com" className="text-primary hover:underline">jshaworkshop@gmail.com</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 승인 대기 중
  if (accessStatus === 'pending') {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        {/* 우측 상단 사용자 정보 */}
        <div className="fixed top-24 right-4 z-40 flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-foreground max-w-[150px] truncate">
              {user?.email || "인증된 사용자"}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
          >
            <LogOut className="w-3 h-3 mr-1" />
            로그아웃
          </Button>
        </div>

        <main className="pt-40 pb-20 px-4 bg-gradient-to-br from-primary/7 via-background to-secondary/7 min-h-[calc(100vh-80px)]">
          <div className="container mx-auto max-w-2xl">
            <Card className="border-2 border-amber-500/20 bg-amber-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-3xl mb-4">승인 대기 중</CardTitle>
                <p className="text-muted-foreground">
                  관리자가 등록 신청을 검토 중입니다.
                  <br />
                  승인 완료 후 영상을 시청하실 수 있습니다.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    문의: <a href="mailto:jshaworkshop@gmail.com" className="text-primary hover:underline">jshaworkshop@gmail.com</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 거부된 경우
  if (accessStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        {/* 우측 상단 사용자 정보 */}
        <div className="fixed top-24 right-4 z-40 flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm font-medium text-foreground max-w-[150px] truncate">
              {user?.email || "인증된 사용자"}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
          >
            <LogOut className="w-3 h-3 mr-1" />
            로그아웃
          </Button>
        </div>

        <main className="pt-40 pb-20 px-4 bg-gradient-to-br from-primary/7 via-background to-secondary/7 min-h-[calc(100vh-80px)]">
          <div className="container mx-auto max-w-2xl">
            <Card className="border-2 border-red-500/20 bg-red-500/5">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">접근이 거부되었습니다</CardTitle>
                <p className="text-muted-foreground">
                  등록 신청이 거부되었습니다.
                  <br />
                  문의사항이 있으시면 관리자에게 연락해주세요.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-3">
                  <a
                    href="mailto:jshaworkshop@gmail.com"
                    className="text-primary hover:underline font-medium"
                  >
                    jshaworkshop@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 승인된 경우: 영상 목록 표시
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* 우측 상단 사용자 정보 */}
      <div className="fixed top-24 right-4 z-40 flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground max-w-[150px] truncate">
            {user?.email || "인증된 사용자"}
          </span>
        </div>
        {registrantData?.accessLevel && (
          <>
            <div className="h-4 w-px bg-gray-300"></div>
            <Badge variant="outline" className={`text-xs ${getAccessLevelColor(registrantData.accessLevel)}`}>
              <Shield className="w-3 h-3 mr-1" />
              {getAccessLevelLabel(registrantData.accessLevel)}
            </Badge>
          </>
        )}
        <div className="h-4 w-px bg-gray-300"></div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
        >
          <LogOut className="w-3 h-3 mr-1" />
          로그아웃
        </Button>
      </div>

      <main className="pt-40 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* 헤더 */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {registrantData?.batch ? '수료자 인증 완료' : '접근 승인됨'}
              </span>
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

          {/* 영상 목록 */}
          {videosLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20">
              <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-lg text-muted-foreground">아직 등록된 영상이 없습니다.</p>
              <p className="text-sm text-muted-foreground mt-2">영상이 추가되면 이메일로 알려드리겠습니다.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                const canAccess = registrantData?.accessLevel
                  ? canAccessLevel(registrantData.accessLevel, video.accessLevel)
                  : false;

                return (
                  <div
                    key={video.id}
                    onClick={() => canAccess && setSelectedVideo(video)}
                    className={`block ${canAccess ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  >
                    <Card
                      className={`group transition-all duration-300 border-2 ${canAccess
                        ? 'hover:shadow-xl hover:-translate-y-1'
                        : 'opacity-75'
                        }`}
                    >
                      <CardHeader className="p-0">
                        <div className="relative overflow-hidden rounded-t-xl">
                          <img
                            src={getVideoThumbnail(video.vimeoUrl, video.thumbnail)}
                            alt={video.title}
                            className={`w-full h-48 object-cover transition-transform duration-300 ${canAccess ? 'group-hover:scale-105' : 'filter grayscale'
                              }`}
                          />

                          {/* 잠금 오버레이 (접근 불가) */}
                          {!canAccess && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                              <Lock className="w-12 h-12 text-white mb-2" />
                              <Badge variant="outline" className={`${getAccessLevelColor(video.accessLevel)} border-white`}>
                                {getAccessLevelLabel(video.accessLevel)} 이상 필요
                              </Badge>
                            </div>
                          )}

                          {/* 재생 아이콘 (접근 가능) */}
                          {canAccess && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <PlayCircle className="w-16 h-16 text-white" />
                            </div>
                          )}

                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                            {video.module}
                          </div>
                          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            {video.duration}
                          </div>

                          {/* 접근 등급 뱃지 */}
                          {canAccess && (
                            <div className="absolute bottom-2 right-2">
                              <Badge variant="outline" className={`text-xs ${getAccessLevelColor(video.accessLevel)}`}>
                                {getAccessLevelLabel(video.accessLevel)}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className={`text-lg mb-2 transition-colors ${canAccess ? 'group-hover:text-primary' : 'text-muted-foreground'
                          }`}>
                          {video.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}

          {/* 비디오 플레이어 모달 */}
          <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
            <DialogContent className="max-w-5xl w-full p-0 overflow-hidden">
              <DialogHeader className="p-4 pb-2">
                <DialogTitle className="pr-8">{selectedVideo?.title}</DialogTitle>
              </DialogHeader>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {selectedVideo && (
                  <iframe
                    src={getEmbedUrl(selectedVideo.vimeoUrl)}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={selectedVideo.title}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>

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
