import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const ClinicalCasesSection = () => {
  const bandUrl = "https://www.band.us/band/73478024/post";

  const stats = [
    {
      number: "1000+",
      label: "X-ray 치료 사례",
      description: "실제 변화를 확인하세요",
    },
    {
      number: "검증된",
      label: "치료 성과",
      description: "객관적 데이터 기반",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            실제 임상에서 검증된 JSHA
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            이론이 아닌, X-ray로 증명된 실제 사례
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            실제 원장님들이 직접 공유하는 치료 전후 변화와 생생한 후기
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all">
              <CardContent className="pt-6 text-center">
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
          ))}
        </div>

        {/* Main CTA */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-8 pb-8 text-center">
              <h3 className="text-2xl font-bold mb-3">
                전문가 커뮤니티에서 <br className='md:hidden' />실제 사례를 확인하세요
              </h3>
              <p className="text-muted-foreground mb-6">
                같은 고민을 했던 원장님들의 <br className='md:hidden' />치료 전후 X-ray 사례와 <br className="hidden md:block" />
                현장에서 <br className='md:hidden' />직접 겪은 생생한 치료 노하우를 공유합니다
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
                <span className="text-sm text-muted-foreground">실제 X-ray 사례</span>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                <span className="text-sm text-muted-foreground">원장님 후기</span>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                <span className="text-sm text-muted-foreground">치료 노하우 공유</span>
              </div>

              <Button
                size="lg"
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.open(bandUrl, '_blank')}
              >
                네이버 밴드 참여하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
