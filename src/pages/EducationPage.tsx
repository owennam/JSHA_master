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
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black">
                내 몸을 살리는 건강한 습관<br />집에서 시작하세요.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                의료진이 직접 제작한 교육 영상으로<br />
                통증 예방과 건강 증진을 위한 올바른 운동법을 배워보세요.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-card hover:shadow-elevated transition-all">
                <h3 className="font-semibold mb-2 text-black">전문의 검증</h3>
                <p className="text-sm text-muted-foreground">의료진이 직접 제작하고 검증한 안전한 운동법</p>
              </div>
              <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-card hover:shadow-elevated transition-all">
                <h3 className="font-semibold mb-2 text-black">쉬운 따라하기</h3>
                <p className="text-sm text-muted-foreground">누구나 쉽게 따라할 수 있는 단계별 설명</p>
              </div>
              <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-card hover:shadow-elevated transition-all">
                <h3 className="font-semibold mb-2 text-black">실생활 적용</h3>
                <p className="text-sm text-muted-foreground">일상에서 바로 실천 가능한 실용적 운동</p>
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
              JS Healing Art는 구조적 불균형을 바로잡아<br /> 근본적인 통증 치료를 추구합니다.
            <br />
              또한 환자 교육을 통해 스스로 건강을 관리하는 힘을 기르도록 돕습니다.
            </p>
          </div>
        </section>

        {/* Certified Clinics Section */}
        <section className="py-20 px-4 bg-background overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">JS Healing Art 인증 의료기관</h2>
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
