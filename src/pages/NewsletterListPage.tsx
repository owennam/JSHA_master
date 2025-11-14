import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { newsletters } from "@/data/newsletters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const NewsletterListPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20 px-4">
          {/* Background with image and gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/newsletter_hero.png"
              alt="Newsletter"
              className="w-full h-full object-cover blur-sm scale-105 transition-transform duration-[10s]"
            />
            {/* Blue to white gradient (bottom to top) */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-white" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto max-w-6xl text-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight" style={{ textShadow: '0 2px 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)' }}>
                통증 치료의 새로운 패러다임을<br />제시합니다.
              </h1>
              <p className="text-xl md:text-2xl text-gray-900 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 8px rgba(255, 255, 255, 0.7), 0 0 15px rgba(255, 255, 255, 0.4)' }}>
                JSHA의 철학과 임상 경험을 바탕으로 한<br />
                통증 치료에 대한 새로운 관점을 <br className='md:hidden' />공유합니다.
              </p>

              <div className="pt-12 flex flex-wrap justify-center gap-12 text-gray-900" style={{ textShadow: '0 2px 8px rgba(255, 255, 255, 0.7), 0 0 15px rgba(255, 255, 255, 0.4)' }}>
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-primary">최신 연구</div>
                  <div className="text-base md:text-lg text-gray-700 transition-all duration-[250ms] group-hover:text-gray-900">임상 데이터 기반</div>
                </div>
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-primary">정기 발행</div>
                  <div className="text-base md:text-lg text-gray-700 transition-all duration-[250ms] group-hover:text-gray-900">매주 새로운 주제</div>
                </div>
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-[250ms] group-hover:scale-110 group-hover:text-primary">실용 정보</div>
                  <div className="text-base md:text-lg text-gray-700 transition-all duration-[250ms] group-hover:text-gray-900">즉시 적용 가능</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter List */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">뉴스레터 아카이브</h2>
              <p className="text-muted-foreground">
                지난 뉴스레터를 다시 확인하실 수 있습니다.
              </p>
            </div>
            
            <div className="space-y-6">
              {newsletters.map((newsletter) => (
                <Link key={newsletter.id} to={`/newsletter/${newsletter.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            {newsletter.featured && (
                              <Badge className="bg-accent text-accent-foreground">최신</Badge>
                            )}
                            <Badge variant="outline" className="text-sm">
                              {newsletter.week}
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl group-hover:text-primary transition-colors mb-2">
                            {newsletter.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {newsletter.subtitle}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {newsletter.summary}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={newsletter.date}>
                          {new Date(newsletter.date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Subscription CTA */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">뉴스레터 구독하기</h2>
            <p className="text-lg text-muted-foreground mb-8">
              매주 최신 뉴스레터를 <br className='md:hidden' />이메일로 받아보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="이메일 주소"
                className="flex-1 px-6 py-3 rounded-full border-2 border-border focus:border-primary focus:outline-none transition-colors"
              />
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary-dark transition-colors whitespace-nowrap">
                구독하기
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewsletterListPage;
