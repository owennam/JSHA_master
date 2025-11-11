import { Button } from "@/components/ui/button";

export const MasterCareHeroSection = () => {
  const scrollToApplication = () => {
    document.getElementById("mastercare-application")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-[132px]">
      {/* Background with gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/85 to-accent/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
            <span className="text-white font-semibold">JSHA Master Course 수료생 전용</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            JSHA Master Care
            <br />
            <span className="text-white/90 text-3xl md:text-4xl lg:text-5xl">수료 후에도 계속되는 성장</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            전문가가 직접 방문하여 제공하는 <strong className="text-white">1:1 맞춤형 임상 컨설팅</strong>
            <br />
            배운 것을 실제 임상에 완벽히 적용하는 과정을 함께합니다
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              onClick={scrollToApplication}
              className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-7 rounded-2xl shadow-elevated hover:shadow-blue font-bold"
            >
              지금 신청하기
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white text-lg px-10 py-7 rounded-2xl backdrop-blur-sm"
            >
              패키지 살펴보기
            </Button>
          </div>

          <div className="pt-12 flex flex-wrap justify-center gap-12 text-white">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">1:1</div>
              <div className="text-base md:text-lg text-white/80">맞춤형 컨설팅</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">현장</div>
              <div className="text-base md:text-lg text-white/80">직접 방문 지원</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">전문가</div>
              <div className="text-base md:text-lg text-white/80">체계적 코칭</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
