import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";

const HospitalsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 px-4">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-primary/7 via-background to-secondary/7">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              JSHA <br className='md:hidden' />치료 병원 찾기
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              전국의 JSHA 치료가 가능한 병원을 확인하고 가까운 병원을 찾아보세요
            </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4">
          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-primary/30 bg-primary/10 shadow-card hover:shadow-elevated transition-all">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-1 text-black">지도에서 찾기</h3>
                <p className="text-sm text-muted-foreground">
                  마커를 클릭하면 병원 정보를 확인할 수 있습니다
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 bg-primary/10 shadow-card hover:shadow-elevated transition-all">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-1 text-black">사전 예약 필수</h3>
                <p className="text-sm text-muted-foreground">
                  방문 전 반드시 병원에 연락하여 예약하세요
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 bg-primary/10 shadow-card hover:shadow-elevated transition-all">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-1 text-black">진료 시간 확인</h3>
                <p className="text-sm text-muted-foreground">
                  각 병원의 진료 시간을 미리 확인하세요
                </p>
              </CardContent>
            </Card>
          </div>

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
                  src="https://www.google.com/maps/d/embed?mid=1jvzm37-simvIE6QS4tQvlcQTfKywjGo&ehbc=2E312F"
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
          <Card className="mt-8 border-amber-500/20 bg-amber-500/5">
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
