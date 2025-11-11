import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const TargetAudienceSection = () => {
  const targetGroups = [
    {
      title: "더 이상 환자에게 스테로이드를 쓰지 않고 통증의 근본 원인을 해결하고 싶은 의사",
    },
    {
      title: "재발하는 통증에 답답함을 느끼는 의사",
    },
    {
      title: "과학적 근거에 기반한 치료를 원하는 의사",
    },
    {
      title: "단순한 증상 완화가 아니라 환자에게 실질적인 도움을 주고 싶은 의사",
    },
    {
      title: "침습적이지 않은 안전한 치료를 원하는 의사",
    },
    {
      title: "진료 스트레스를 줄이고 싶은 의사",
    },
  ];

  const outcomes = [
    "통증의 근본 원인을 정확히 진단할 수 있습니다",
    "X-ray를 읽고 불균형을 파악할 수 있습니다",
    "JS 주사 치료를 임상에 바로 적용할 수 있습니다",
    "JS Insole로 즉각적인 변화를 만들어낼 수 있습니다",
    "환자별 맞춤 치료 프로그램을 설계할 수 있습니다",
    "재발 없는 통증 치료를 제공할 수 있습니다",
  ];

  return (
    <section id="target-audience" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            이런 분들을 위한 과정입니다
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            JSHA Master Course는 통증 치료의 본질을 추구하는 의사를 위한 프로그램입니다
          </p>
        </div>

        {/* 수강 대상 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {targetGroups.map((group, idx) => (
            <Card
              key={idx}
              className="border-2 hover:border-primary transition-all hover:shadow-elevated hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground leading-relaxed font-medium">
                    {group.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 교육 과정의 가치 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 border-2 border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              JSHA Master Course 수료 후, 당신은
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground leading-relaxed">{outcome}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t-2 border-primary/20 text-center">
              <p className="text-lg text-foreground font-semibold">
                당신의 진료실이 행복해지고, 환자의 삶이 행복해집니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
