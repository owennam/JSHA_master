import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const scrollToApplication = () => {
    document.getElementById("application")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 md:pt-24 lg:pt-28">
      {/* Background with image and enhanced gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/jsha_master_course.jpg"
          alt="JSHA Master Course"
          className="w-full h-full object-cover blur-sm scale-105 transition-transform duration-[10s]"
        />
        {/* Blue to white gradient (bottom to top) */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-white" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading with staggered animation */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
            환자가 다시 오지 않는 <br className='md:hidden' />이유,
            <br />
            <span className="inline-block text-gray-900 text-3xl md:text-4xl lg:text-5xl mt-2 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
              통증만 잡고 <br className='md:hidden' /> 원인은 놓쳤기 때문입니다
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-900 max-w-3xl mx-auto leading-relaxed font-bold animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
            5개월간의 체계적 교육으로{" "}
            <br className='md:hidden' />
            <strong className="text-primary font-bold bg-white/90 px-2 py-1 rounded-md shadow-sm text-base md:text-xl">
              불균형–보상–통증
            </strong>
            의 본질을 꿰뚫다
          </p>

          {/* CTA Buttons with enhanced hover effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-[fadeInUp_0.6s_ease-out_0.7s_both]">
            <Button
              size="lg"
              onClick={scrollToApplication}
              className="bg-primary text-white hover:bg-primary/90 text-lg px-10 py-7 rounded-2xl shadow-[0_10px_40px_0_rgba(0,0,0,0.15)] hover:shadow-[0_15px_50px_0_rgba(0,0,0,0.25)] hover:scale-[1.05] active:scale-[0.98] transition-all duration-[250ms] font-bold"
            >
              지금 지원하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("philosophy")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 text-lg px-10 py-7 rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_0_rgba(0,0,0,0.15)] transition-all duration-[250ms]"
            >
              더 알아보기
            </Button>
          </div>

          {/* Stats with enhanced design */}
          <div className="pt-12 flex flex-wrap justify-center gap-12 text-white animate-[fadeInUp_0.6s_ease-out_0.9s_both]">
            <div className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-yellow-300">
                5개월
              </div>
              <div className="text-base md:text-lg text-white/90 font-bold transition-all duration-[250ms] group-hover:text-white">
                집중 교육 과정
              </div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-yellow-300">
                8회차
              </div>
              <div className="text-base md:text-lg text-white/90 font-bold transition-all duration-[250ms] group-hover:text-white">
                1박 2일 실습
              </div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-yellow-300">
                40시간
              </div>
              <div className="text-base md:text-lg text-white/90 font-bold transition-all duration-[250ms] group-hover:text-white">
                실전 중심 교육
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
