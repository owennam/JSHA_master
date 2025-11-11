import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const scrollToApplication = () => {
    document.getElementById("application")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-[132px]">
      {/* Background with image and enhanced gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/jsha_master_course.jpg"
          alt="JSHA Master Course"
          className="w-full h-full object-cover blur-sm scale-105 transition-transform duration-[10000ms]"
        />
        {/* Toss-style layered gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/85 to-primary/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading with staggered animation */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
            환자가 다시 돌아오지 않는 이유,
            <br />
            <span className="inline-block text-white text-3xl md:text-4xl lg:text-5xl mt-2 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
              통증만 잡고 원인은 놓쳤기 때문입니다
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-medium animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
            4개월간의 체계적 교육으로{" "}
            <strong className="text-white font-bold bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
              불균형–보상–통증
            </strong>
            의 본질을 꿰뚫다
          </p>

          {/* CTA Buttons with enhanced hover effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-[fadeInUp_0.6s_ease-out_0.7s_both]">
            <Button
              size="lg"
              onClick={scrollToApplication}
              className="bg-white text-primary hover:bg-white/95 text-lg px-10 py-7 rounded-2xl shadow-[0_10px_40px_0_rgba(0,0,0,0.15)] hover:shadow-[0_15px_50px_0_rgba(0,0,0,0.25)] hover:scale-[1.05] active:scale-[0.98] transition-all duration-[250ms] font-bold"
            >
              지금 지원하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("philosophy")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white/5 border-2 border-white/40 text-white hover:bg-white/15 hover:border-white/80 text-lg px-10 py-7 rounded-2xl backdrop-blur-md shadow-[0_4px_20px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_0_rgba(255,255,255,0.2)] transition-all duration-[250ms]"
            >
              더 알아보기
            </Button>
          </div>

          {/* Stats with enhanced design */}
          <div className="pt-12 flex flex-wrap justify-center gap-12 text-white animate-[fadeInUp_0.6s_ease-out_0.9s_both]">
            <div className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-white/90">
                4개월
              </div>
              <div className="text-base md:text-lg text-white/80 transition-all duration-[250ms] group-hover:text-white/90">
                집중 교육 과정
              </div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-white/90">
                4회차
              </div>
              <div className="text-base md:text-lg text-white/80 transition-all duration-[250ms] group-hover:text-white/90">
                1박 2일 실습
              </div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-white/90">
                40시간
              </div>
              <div className="text-base md:text-lg text-white/80 transition-all duration-[250ms] group-hover:text-white/90">
                실전 중심 교육
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
