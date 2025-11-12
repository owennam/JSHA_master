import { ArrowRight } from "lucide-react";

export const PhilosophySection = () => {
  return (
    <section id="philosophy" className="py-20 bg-gradient-to-b from-background via-muted to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* 경고등 비유 추가 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 leading-tight">
              통증이 생겼을 때,
              <br />
              경고등만 끄는 것이 해결책일까요?
            </h2>
            <div className="max-w-3xl mx-auto space-y-6 text-xl">
              <p className="text-foreground font-medium">
                대부분의 통증 치료는 <strong className="font-bold">증상 완화</strong>에 집중합니다.
              </p>
              <ul className="space-y-3 text-foreground font-medium">
                <li>• 진통제로 통증을 억제</li>
                <li>• 스테로이드 주사로 염증 차단</li>
                <li>• 신경차단술로 신호 차단</li>
              </ul>
              <p className="text-foreground font-medium pt-4">
                하지만 이는 마치 <strong className="text-destructive font-bold">자동차의 경고등만 끄는 것</strong> 과 같습니다.
                <br />
                진짜 문제는 해결되지 않은 채, 더 심각한 손상으로 이어질 뿐입니다.
              </p>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              JSHA 핵심 철학: 근본 원인을 찾아라
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              왜 통증은 자꾸 재발할까? 증상만 치료해서는 근본적인 해결이 어렵습니다.
              <br />
              <span className="mt-2 inline-block">
                JSHA는{" "}
                <strong className="text-black font-bold bg-primary/10 px-3 py-1 rounded-lg">
                  구조적 불균형
                </strong>
                에서 시작합니다.
              </span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-6">
            {/* Step 1 */}
            <div className="relative group flex-1 w-full animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/20 shadow-[0_8px_16px_0_rgba(0,27,55,0.08)] hover:shadow-[0_12px_24px_0_rgba(0,27,55,0.12)] hover:border-primary/40 transition-all duration-[250ms] hover:-translate-y-1 h-full">
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-primary transition-colors duration-[250ms]">
                  구조적 불균형
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-[250ms]">
                  발, 골반, 척추의 불균형이 시작점입니다.
                </p>
              </div>
            </div>

            {/* Arrow between 1 and 2 */}
            <div className="hidden md:flex items-center justify-center flex-shrink-0 animate-[fadeIn_0.6s_ease-out_0.4s_both]">
              <ArrowRight className="h-8 w-8 text-primary transition-transform duration-[250ms] hover:scale-125" />
            </div>

            {/* Step 2 */}
            <div className="relative group flex-1 w-full animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/20 shadow-[0_8px_16px_0_rgba(0,27,55,0.08)] hover:shadow-[0_12px_24px_0_rgba(0,27,55,0.12)] hover:border-primary/40 transition-all duration-[250ms] hover:-translate-y-1 h-full">
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-primary transition-colors duration-[250ms]">
                  보상 작용
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-[250ms]">
                  몸은 균형을 맞추려 애씁니다. 그 결과 근육과 관절이 과부하를 받게 됩니다.
                </p>
              </div>
            </div>

            {/* Arrow between 2 and 3 */}
            <div className="hidden md:flex items-center justify-center flex-shrink-0 animate-[fadeIn_0.6s_ease-out_0.5s_both]">
              <ArrowRight className="h-8 w-8 text-primary transition-transform duration-[250ms] hover:scale-125" />
            </div>

            {/* Step 3 */}
            <div className="group flex-1 w-full animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/20 shadow-[0_8px_16px_0_rgba(0,27,55,0.08)] hover:shadow-[0_12px_24px_0_rgba(0,27,55,0.12)] hover:border-primary/40 transition-all duration-[250ms] hover:-translate-y-1 h-full">
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-primary transition-colors duration-[250ms]">
                  만성 통증
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-[250ms]">
                  보상이 한계를 넘으면 통증이 발생합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center animate-[fadeInUp_0.6s_ease-out_0.7s_both]">
            <div className="inline-block bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-2 border-primary/30 rounded-3xl p-8 md:p-10 max-w-2xl shadow-[0_8px_16px_0_rgba(0,27,55,0.08)] hover:shadow-[0_12px_24px_0_rgba(0,27,55,0.12)] transition-all duration-[250ms] backdrop-blur-sm">
              <p className="text-xl text-foreground leading-relaxed">
                <strong className="text-black font-bold bg-primary/10 px-3 py-1 rounded-lg">
                  JSHA Master Course
                </strong>
                는 이 철학을 기반으로
                <br />
                <strong className="text-black">
                  구조적 평가 → 정확한 진단 → 근본적 교정
                </strong>
                을 교육합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
