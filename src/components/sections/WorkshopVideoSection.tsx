import { lectureVideos, qaVideos } from "@/data/workshopVideos";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const WorkshopVideoSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* 강의 영상 섹션 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            JSHA 강의 영상
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            실제 진행된 JSHA 집담회 및 학회 강의 영상을 확인해보세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {lectureVideos.map((video) => (
            <Link key={video.id} to={`/workshop/${video.id}`}>
              <Card
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
              >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{video.instructor}</span>
                  </div>
                  {video.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{video.date}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Q&A 섹션 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Q&A with 이종성 원장님
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            JSHA와 JS 인솔에 대한 자주 묻는 질문에 이종성 원장님이 답변합니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {qaVideos.map((video) => (
            <Link key={video.id} to={`/workshop/${video.id}`}>
              <Card
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
              >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{video.instructor}</span>
                </div>
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
