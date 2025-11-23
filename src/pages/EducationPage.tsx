import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VideoCard } from "@/components/video/VideoCard";
import { videos } from "@/data/videos";
import { referralHospitals } from "@/data/referralHospitals";

const EducationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20 px-4">
          {/* Background with image and gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/education_hero.png"
              alt="Patient Education"
              className="w-full h-full object-cover blur-sm scale-105 transition-transform duration-[10s]"
            />
            {/* Blue to white gradient (bottom to top) */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-white" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto max-w-6xl text-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                내 몸을 살리는 <br className='md:hidden' />건강한 습관<br />집에서 시작하세요.
              </h1>
              <p className="text-xl md:text-2xl text-gray-900 max-w-3xl mx-auto leading-relaxed font-bold">
                의료진이 직접 제작한 <br className='md:hidden' />교육 영상으로<br />
                통증 예방과 건강 증진을 위한 <br className='md:hidden' />올바른 운동법을 배워보세요.
              </p>

              <div className="pt-12 flex flex-wrap justify-center gap-12 text-white">
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-yellow-300">전문의 검증</div>
                  <div className="text-base md:text-lg text-white/90 font-bold transition-all duration-[250ms] group-hover:text-white">안전한 운동법</div>
                </div>
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-yellow-300">쉬운 따라하기</div>
                  <div className="text-base md:text-lg text-white/90 font-bold transition-all duration-[250ms] group-hover:text-white">단계별 설명</div>
                </div>
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-yellow-300">실생활 적용</div>
                  <div className="text-base md:text-lg text-white/90 font-bold transition-all duration-[250ms] group-hover:text-white">실용적 운동</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Gallery */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">교육 영상</h2>
              <p className="text-muted-foreground">
                각 영상을 클릭하여 자세한 설명과 함께 운동법을 배워보세요.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">JS Healing Art란?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              JS Healing Art는 <br className='md:hidden' />구조적 불균형을 바로잡아<br /> 근본적인 통증 치료를 추구합니다.
              <br />
              또한 환자 교육을 통해 스스로 건강을 <br className='md:hidden' />관리하는 힘을 기르도록 돕습니다.
            </p>
          </div>
        </section>

        {/* Certified Clinics Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">JS Healing Art <br className='md:hidden' />인증 의료기관</h2>
              <p className="text-lg text-muted-foreground">
                JSHA 철학을 기반으로 통증을 치료하는 전국의 인증 의료기관입니다.
              </p>
            </div>

            {/* Logo Grid Container */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center grayscale hover:grayscale-0 transition-all duration-500">
              {referralHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="flex flex-col items-center gap-3 group"
                  title={hospital.name}
                >
                  <div className="w-full max-w-[160px] aspect-square flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                    {hospital.logo ? (
                      <img
                        src={hospital.logo}
                        alt={`${hospital.name} 로고`}
                        className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-center">
                        <span className="text-sm font-bold text-gray-400 group-hover:text-primary transition-colors break-keep leading-tight">
                          {hospital.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EducationPage;
