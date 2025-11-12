import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export const MasterCareServicesSection = () => {
  const visitServices = [
    {
      title: "현장 진료 참관 및 피드백",
      description: "실제 진료 과정을 참관하고 즉각적인 피드백 제공",
    },
    {
      title: "어려운 케이스 직접 시연",
      description: "복잡한 케이스에 대한 전문가의 직접 시연 및 설명",
    },
    {
      title: "병원 시스템 점검",
      description: "현재 시스템 분석 및 개선안 제시",
    },
    {
      title: "직원 교육 및 표준화",
      description: "직원 대상 JSHA 기법 교육 및 프로토콜 표준화",
    },
  ];

  const onlineSupport = [
    {
      title: "카카오톡 1:1 채널",
      description: "언제든지 질문하고 빠른 피드백 받기",
    },
    {
      title: "케이스별 영상/사진 리뷰",
      description: "환자 케이스를 영상이나 사진으로 공유하여 상세 분석",
    },
  ];

  const targetAudience = [
    {
      title: "마스터 코스 수료 후 임상 적용에 어려움을 겪는 분",
    },
    {
      title: "특정 케이스에 대한 심화 컨설팅이 필요한 분",
    },
    {
      title: "병원 내 JSHA 시스템 구축을 원하는 분",
    },
    {
      title: "직원 교육 및 표준화가 필요한 분",
    },
    {
      title: "지속적인 전문가 피드백을 원하는 분",
    },
  ];

  return (
    <>
      {/* Who is this for */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              이런 분들께 추천합니다
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master Care는 마스터 코스 수료생의 성공적인 임상 적용을 위해 설계되었습니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {targetAudience.map((item, idx) => (
              <Card
                key={idx}
                className="border-2 hover:border-primary transition-all hover:shadow-elevated hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-foreground leading-relaxed font-medium">
                      {item.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              방문 컨설팅 프로그램
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              1회 방문시 제공되는 체계적인 서비스 구성
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            {visitServices.map((service, idx) => {
              return (
                <Card
                  key={idx}
                  className="border-2 hover:border-primary transition-all duration-300 hover:shadow-elevated"
                >
                  <CardContent className="p-8">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-black mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-black mb-3">
                  총 5시간의 집중 컨설팅
                </h3>
                <p className="text-muted-foreground">
                  현장 참관부터 직원 교육까지, 체계적인 프로세스로 귀하의 병원을 완벽히 지원합니다
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Online Support */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              온라인 지원 시스템
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              방문 컨설팅 외에도 지속적인 온라인 지원을 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {onlineSupport.map((support, idx) => {
              return (
                <Card
                  key={idx}
                  className="border-2 hover:border-primary transition-all hover:shadow-elevated hover:-translate-y-1"
                >
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-bold text-black mb-3">
                      {support.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {support.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
