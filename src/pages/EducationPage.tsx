import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VideoCard } from "@/components/video/VideoCard";
import { videos } from "@/data/videos";
import { certifiedClinics } from "@/data/certifiedClinics";
import { MapPin, Phone } from "lucide-react";

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
            {/* Toss-style layered gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/85 to-accent/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto max-w-6xl text-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                내 몸을 살리는 건강한 습관<br />집에서 시작하세요.
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                의료진이 직접 제작한 교육 영상으로<br />
                통증 예방과 건강 증진을 위한 <br className='md:hidden' />올바른 운동법을 배워보세요.
              </p>

              <div className="pt-12 flex flex-wrap justify-center gap-12 text-white">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">전문의 검증</div>
                  <div className="text-base md:text-lg text-white/80">안전한 운동법</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">쉬운 따라하기</div>
                  <div className="text-base md:text-lg text-white/80">단계별 설명</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">실생활 적용</div>
                  <div className="text-base md:text-lg text-white/80">실용적 운동</div>
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
        <section className="py-20 px-4 bg-background overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">JS Healing Art <br className='md:hidden' />인증 의료기관</h2>
              <p className="text-lg text-muted-foreground">
                JSHA 철학을 기반으로 통증을 치료하는 전국의 인증 의료기관입니다.
              </p>
            </div>

            {/* Sliding Animation Container */}
            <div className="relative">
              <div className="flex gap-6 animate-slide">
                {/* 첫 번째 세트 */}
                {certifiedClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="flex-shrink-0 w-80 bg-card border-2 border-border rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{clinic.name}</h3>
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                        {clinic.location}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{clinic.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a href={`tel:${clinic.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                          {clinic.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {/* 두 번째 세트 (무한 루프를 위한 복제) */}
                {certifiedClinics.map((clinic) => (
                  <div
                    key={`${clinic.id}-duplicate`}
                    className="flex-shrink-0 w-80 bg-card border-2 border-border rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{clinic.name}</h3>
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                        {clinic.location}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{clinic.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a href={`tel:${clinic.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                          {clinic.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default EducationPage;
