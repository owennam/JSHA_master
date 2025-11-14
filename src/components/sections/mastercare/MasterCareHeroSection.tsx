import { Button } from "@/components/ui/button";

export const MasterCareHeroSection = () => {
  const scrollToApplication = () => {
    document.getElementById("mastercare-application")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 md:pt-32 lg:pt-[132px]">
      {/* Background with image and gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/mastercare_hero.png"
          alt="JSHA Master Care"
          className="w-full h-full object-cover blur-sm scale-105 transition-transform duration-[10s]"
        />
        {/* Blue to white gradient (bottom to top) */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-white" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 shadow-sm">
            <span className="text-primary font-semibold">JSHA Master Course 수료생 전용</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight" style={{ textShadow: '0 2px 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)' }}>
            JSHA Master Care
            <br />
            <span className="text-gray-900 text-3xl md:text-4xl lg:text-5xl">수료 후에도 계속되는 성장</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-900 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 8px rgba(255, 255, 255, 0.7), 0 0 15px rgba(255, 255, 255, 0.4)' }}>
            전문가가 직접 방문하여 제공하는 <strong className="text-primary bg-white/90 px-4 py-2 rounded-lg shadow-sm"><br className='md:hidden' />1:1 맞춤형 임상 컨설팅</strong>
            <br />
            배운 것을 실제 임상에 완벽히 적용하는 과정을 함께합니다
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              onClick={scrollToApplication}
              className="bg-primary text-white hover:bg-primary/90 text-lg px-10 py-7 rounded-2xl shadow-[0_10px_40px_0_rgba(0,0,0,0.15)] hover:shadow-[0_15px_50px_0_rgba(0,0,0,0.25)] hover:scale-[1.05] active:scale-[0.98] transition-all duration-[250ms] font-bold"
            >
              지금 신청하기
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 text-lg px-10 py-7 rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_0_rgba(0,0,0,0.15)] transition-all duration-[250ms]"
            >
              패키지 살펴보기
            </Button>
          </div>

          <div className="pt-12 pb-16 flex flex-wrap justify-center gap-12 text-gray-900" style={{ textShadow: '0 2px 8px rgba(255, 255, 255, 0.7), 0 0 15px rgba(255, 255, 255, 0.4)' }}>
            <div className="text-center group cursor-default">
              <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-primary">1:1</div>
              <div className="text-base md:text-lg text-gray-700 transition-all duration-[250ms] group-hover:text-gray-900">맞춤형 컨설팅</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-primary">현장</div>
              <div className="text-base md:text-lg text-gray-700 transition-all duration-[250ms] group-hover:text-gray-900">직접 방문 지원</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-primary">전문가</div>
              <div className="text-base md:text-lg text-gray-700 transition-all duration-[250ms] group-hover:text-gray-900">체계적 코칭</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
