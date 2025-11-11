import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      title: "평생 회원 등록",
      description: "향후 워크숍 90%, 도수 워크숍 50% 할인 혜택, 평생 교육 자료 접근 권한을 제공합니다.",
    },
    {
      title: "토요일 피지컬 시간 참석 우선권",
      description: "Free Pass 제공! 실습 위주의 특별 세션에 우선적으로 참여할 수 있습니다.",
    },
    {
      title: "외래 참관 우선권",
      description: "제이에스힐링의원 외래 참관 기회를 통해 실제 임상 케이스를 직접 경험합니다.",
    },
    {
      title: "네트워킹 및 지속적 지원",
      description: "수료생 전용 카카오톡 채팅방에서 이루어지는 Q&A와 지속적인 교육 자료 업데이트를 통해 꾸준히 성장할 수 있습니다.",
    },
    {
      title: "교과서 제공",
      description: "수강생 전원 JSHA 교과서 혹은 교과서에 준하는 E-book을 제공하여 학습을 지원합니다.",
    },
    {
      title: "예비 강사 자격 부여",
      description: "마스터 코스 수료자는 예비 강사 자격을 부여받아 JSHA 교육 프로그램의 강사로 활동할 수 있는 기회를 얻게 됩니다.",
    },
    {
      title: "다시보기 영상 제공",
      description: "교육 내용을 복습할 수 있도록 다시보기 영상을 제공하여 언제든지 학습 내용을 되짚어볼 수 있습니다.",
    },
    {
      title: "Master Care (추가 비용 발생)",
      description: "수료 후에도 전문가의 1:1 방문 컨설팅을 신청하여 지속적인 임상 지원과 맞춤형 코칭을 받을 수 있습니다.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            수강생 혜택
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            JSHA Master Course 수강생에게 제공되는 특별한 혜택들
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, idx) => (
            <Card
              key={idx}
              className="group border-2 border-border/50 hover:border-primary/60 bg-card/80 backdrop-blur-sm overflow-hidden animate-[fadeInUp_0.6s_ease-out_both]"
              style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
            >
              <CardContent className="p-8">
                <div className="flex flex-col gap-4">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-[250ms]">
                      <Check className="h-5 w-5 text-primary transition-all duration-[250ms] group-hover:scale-110" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground flex-1 transition-colors duration-[250ms] group-hover:text-primary">
                      {benefit.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed pl-[52px] transition-colors duration-[250ms] group-hover:text-foreground/80">
                    {benefit.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 추가 혜택 하이라이트 */}
        <div className="mt-16 max-w-5xl mx-auto animate-[fadeInUp_0.6s_ease-out_0.8s_both]">
          <div className="bg-gradient-to-br from-primary/8 via-primary/5 to-accent/8 rounded-3xl p-8 md:p-10 border-2 border-primary/20 shadow-[0_8px_16px_0_rgba(0,27,55,0.12),0_4px_8px_0_rgba(2,32,71,0.08)] backdrop-blur-sm hover:shadow-[0_12px_24px_0_rgba(0,27,55,0.15),0_6px_12px_0_rgba(2,32,71,0.1)] transition-all duration-[250ms]">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              마스터 코스 수료 후 혜택
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group cursor-default">
                <div className="text-4xl mb-3 transition-transform duration-[250ms] group-hover:scale-110">🎓</div>
                <div className="font-bold text-foreground mb-2 text-lg transition-colors duration-[250ms] group-hover:text-primary">
                  JSHA 공인 라이센스
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  JSHA 공인 자격 인증
                </div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-4xl mb-3 transition-transform duration-[250ms] group-hover:scale-110">⭐</div>
                <div className="font-bold text-foreground mb-2 text-lg transition-colors duration-[250ms] group-hover:text-primary">
                  평생 회원 자격 부여
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  JSHA 평생 회원 자격
                </div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-4xl mb-3 transition-transform duration-[250ms] group-hover:scale-110">📊</div>
                <div className="font-bold text-foreground mb-2 text-lg transition-colors duration-[250ms] group-hover:text-primary">
                  평생 학습 자료
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  최신 자료 지속 업데이트
                </div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-4xl mb-3 transition-transform duration-[250ms] group-hover:scale-110">🤝</div>
                <div className="font-bold text-foreground mb-2 text-lg transition-colors duration-[250ms] group-hover:text-primary">
                  전문가 네트워크
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  동료 의사들과 지속적 교류
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
