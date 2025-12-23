import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { videos } from "@/data/videos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Target, Wrench, TrendingUp } from "lucide-react";

const difficultyLabels = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급'
};

const categoryLabels = {
  balance: '균형',
  posture: '자세',
  breathing: '호흡',
  flexibility: '유연성'
};

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const video = videos.find(v => v.id === id);

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-40 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold mb-4">영상을 찾을 수 없습니다</h1>
            <Link to="/education">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                교육 페이지로 돌아가기
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
          <Link to="/education">
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
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{video.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {video.duration}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {categoryLabels[video.category]}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {difficultyLabels[video.difficulty]}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {video.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Target Audience */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-primary" />
                  추천 대상
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {video.targetAudience.map((audience, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {audience}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  기대 효과
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {video.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Equipment */}
          {video.equipment.length > 0 && (
            <Card className="border-border/50 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench className="w-5 h-5 text-accent" />
                  필요한 준비물
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {video.equipment.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warning */}
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="text-2xl">⚠️</div>
                <div>
                  <h3 className="font-semibold mb-2">주의사항</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    운동 중 통증이나 불편함이 느껴지면 즉시 중단하고 의료진과 상담하세요. 
                    이 영상은 일반적인 교육 목적으로 제공되며, 개인의 건강 상태에 따라 적합하지 않을 수 있습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VideoDetailPage;
