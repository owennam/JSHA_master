import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Users, FileCheck, TrendingUp } from "lucide-react";

export const ClinicalCasesSection = () => {
  const bandUrl = "https://www.band.us/band/73478024/post";

  const stats = [
    {
      icon: FileCheck,
      number: "100+",
      label: "X-ray 치료 사례",
      description: "실제 변화를 확인하세요",
    },
    {
      icon: Users,
      number: "200+",
      label: "전국 원장님",
      description: "현장에서 적용 중",
    },
    {
      icon: TrendingUp,
      number: "검증된",
      label: "치료 성과",
      description: "객관적 데이터 기반",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
              <FileCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            실제 임상에서 검증된 JSHA 테크닉
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            이론이 아닌, X-ray로 증명된 실제 성과
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            현장 원장님들이 직접 공유하는 치료 전후 변화와 생생한 후기
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="font-semibold text-foreground mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main CTA */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-8 pb-8 text-center">
              <h3 className="text-2xl font-bold mb-3">
                전문가 커뮤니티에서 실제 사례를 확인하세요
              </h3>
              <p className="text-muted-foreground mb-6">
                같은 고민을 했던 원장님들의 치료 전후 X-ray 사례와 <br className="hidden md:block" />
                현장에서 직접 겪은 생생한 치료 노하우를 공유합니다
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileCheck className="w-4 h-4" />
                  <span>실제 X-ray 사례</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>원장님 후기</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>치료 노하우 공유</span>
                </div>
              </div>

              <Button
                size="lg"
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.open(bandUrl, '_blank')}
              >
                실제 사례 커뮤니티 참여하기
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-sm text-muted-foreground mt-4">
                무료로 100+ 실제 사례 확인 가능
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
