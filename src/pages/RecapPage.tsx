import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle, Video, LogOut, Clock, XCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { getRecapRegistrant, RecapRegistrant, getAllRecapVideos, RecapVideo } from "@/lib/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// 비디오 URL에서 썸네일 자동 추출
const getVideoThumbnail = (url: string, fallback?: string): string => {
  if (!url) return fallback || "https://placehold.co/400x225/2F6FED/FFFFFF/png?text=Video";

  // YouTube 썸네일 추출
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
  }

  // Vimeo 썸네일 (vumbnail 서비스 사용)
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
  }

  // 기존 썸네일이 있으면 사용, 없으면 기본 이미지
  return fallback || "https://placehold.co/400x225/2F6FED/FFFFFF/png?text=Video";
};

// 비디오 URL을 embed URL로 변환
const getEmbedUrl = (url: string): string => {
  if (!url) return "";

  // YouTube embed URL 변환
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
  }

  // Vimeo embed URL 변환
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return url;
};

type AccessStatus = 'loading' | 'not_authenticated' | 'pending' | 'rejected' | 'approved';

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
        // 등록되지 않은 사용자 - 로그아웃 후 등록 페이지로 이동
        console.log("Not registered, logging out and redirecting to auth page");
        await signOut(auth!);
        toast({
          title: "등록이 필요합니다",
          description: "다시보기 서비스를 이용하려면 먼저 등록해주세요.",
          variant: "destructive",
        });
        navigate('/recap/auth');
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
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="block cursor-pointer"
                >
                  <Card
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2"
                  >
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img
                          src={getVideoThumbnail(video.vimeoUrl, video.thumbnail)}
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
                </div>
              ))}
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
