import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";

const HospitalsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20 px-4">
          {/* Background with image and gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/jsha_master_course.jpg"
              alt="JSHA Hospitals"
              className="w-full h-full object-cover blur-sm scale-105 transition-transform duration-[10s]"
            />
            {/* Blue to white gradient (bottom to top) */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-white" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto max-w-6xl text-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                JSHA <br className='md:hidden' />치료 병원 찾기
              </h1>
              <p className="text-xl md:text-2xl text-gray-900 max-w-3xl mx-auto leading-relaxed font-bold">
                전국의 JSHA 치료가 가능한 병원을 확인하고<br />
                가까운 병원을 찾아보세요
              </p>

              <div className="pt-12 flex flex-wrap justify-center gap-12 text-white">
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-yellow-300">전국 네트워크</div>
                  <div className="text-base md:text-lg text-white/90 font-bold transition-all duration-[250ms] group-hover:text-white">인증 의료기관</div>
                </div>
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-yellow-300">전문 치료</div>
                  <div className="text-base md:text-lg text-white/90 font-bold transition-all duration-[250ms] group-hover:text-white">검증된 기술</div>
                </div>
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-yellow-300">예약 가능</div>
                  <div className="text-base md:text-lg text-white/90 font-bold transition-all duration-[250ms] group-hover:text-white">빠른 상담</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 py-12">
          {/* Google Maps Embed */}
          <Card className="overflow-hidden shadow-2xl">
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-black">
                전국 JSHA 치료 가능 병원 지도
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[600px] md:h-[700px]">
                <iframe
                  src="https://www.google.com/maps/d/embed?mid=1InZHLwdQiOsDT6bsRGQc8onqVq6Ch00"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="JSHA 치료 가능 병원 지도"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="mt-8 bg-white">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-black">이용 안내</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>
                        지도에 표시된 병원은 JSHA 워크숍을 수료하고 JSHA 치료를 시행하는 의료기관입니다
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>
                        방문 전 반드시 해당 병원에 전화하여 JSHA 치료 가능 여부와 예약을 확인하세요
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>
                        병원별로 제공하는 JSHA 치료 범위와 방식이 다를 수 있으니 자세한 사항은 직접 문의해주세요
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>
                        지도 정보가 최신이 아닐 수 있으니 방문 전 확인이 필요합니다
                      </span>
                    </li>
                  </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-3">
              JSHA 치료에 대해 더 궁금하신가요?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              JSHA 마스터 코스를 통해 <br className='md:hidden' />JS Healing Art를 배우고 <br className='md:hidden' />귀하의 병원에서도 <br className='md:hidden' />바로 시작하실 수 있습니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#curriculum"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                마스터 코스 보기
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-semibold"
              >
                문의하기
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HospitalsPage;
