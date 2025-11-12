import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check } from "lucide-react";

export const BeforeAfterSection = () => {
  const beforeItems = [
    "환자가 3개월마다 재발하여 돌아옴",
    "진통제와 스테로이드 처방만 반복",
    "환자 만족도 낮고 불만 증가",
    "근본 원인을 모른 채 대증 치료만",
    "재발률 높아 신뢰도 하락",
  ];

  const afterItems = [
    "근본 원인 해결로 재발률 70% 감소",
    "구조 교정 + 맞춤 치료 프로그램 제공",
    "환자 만족도 94.3%로 급상승",
    "X-ray 분석으로 정확한 진단 가능",
    "환자 추천율 증가로 자연스러운 성장",
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            JSHA 수료 후  <br className='md:hidden' />달라진 진료실
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            실제 수료생들의 변화된 모습입니다
          </p>
        </div>

        {/* Before/After Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Before Card */}
          <Card className="border-2 border-border bg-white hover:shadow-lg transition-all">
            <CardHeader className="bg-muted border-b-2 border-border">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <X className="h-6 w-6 text-foreground" />
                </div>
                <span className="text-foreground">Before JSHA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {beforeItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <X className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* After Card */}
          <Card className="border-2 border-primary/30 bg-primary/5 hover:shadow-lg transition-all">
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <span className="text-black">After JSHA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {afterItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-xl text-foreground font-semibold mb-4">
            당신의 진료실도 변화할 수 있습니다
          </p>
          <button
            onClick={() => document.getElementById("application")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            지금 시작하기
          </button>
        </div>
      </div>
    </section>
  );
};
