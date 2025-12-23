import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { lectureVideos, qaVideos } from "@/data/workshopVideos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Video, Lightbulb } from "lucide-react";

const WorkshopVideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // 강의 영상과 Q&A 영상을 모두 검색
  const allVideos = [...lectureVideos, ...qaVideos];
  const video = allVideos.find(v => v.id === id);

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-40 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold mb-4">영상을 찾을 수 없습니다</h1>
            <Link to="/#workshop">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                강의 영상 목록으로 돌아가기
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-40 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Back Button */}
          <Link to="/#workshop">
            <Button variant="ghost" className="mb-6 hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
          </Link>

          {/* Video Player */}
          <div className="mb-8">
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl mb-6">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Video Title and Meta */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {video.type === 'lecture' ? '강의' : 'Q&A'}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{video.title}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {video.description}
                </p>

                {/* Video Info */}
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium">{video.instructor}</span>
                  </div>
                  {video.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>{video.date}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Video Information Card */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Video className="w-5 h-5 text-primary" />
                영상 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">강사</span>
                  <span className="font-medium text-right">{video.instructor}</span>
                </div>
                {video.date && (
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">촬영일</span>
                    <span className="font-medium text-right">{video.date}</span>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">유형</span>
                  <span className="font-medium text-right">
                    {video.type === 'lecture' ? 'JSHA 강의' : 'Q&A 세션'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information for Q&A */}
          {video.type === 'qa' && (
            <Card className="border-primary/20 bg-primary/5 mt-6">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Q&A 영상 안내</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      이 영상은 JSHA와 JS 인솔에 대한 자주 묻는 질문에 이종성 원장님이 답변하는 내용입니다.
                      JSHA 치료 방법과 JS 인솔 사용에 대한 궁금증을 해결하실 수 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information for Lecture */}
          {video.type === 'lecture' && (
            <Card className="border-secondary/20 bg-secondary/5 mt-6">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="text-2xl">📚</div>
                  <div>
                    <h3 className="font-semibold mb-2">강의 영상 안내</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      실제 진행된 JSHA 집담회 및 학회 강의 영상입니다.
                      JSHA의 핵심 원리와 임상 적용 사례를 확인하실 수 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WorkshopVideoDetailPage;
