import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { newsletters } from "@/data/newsletters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Mail, TrendingUp } from "lucide-react";

const NewsletterListPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">JSHA Newsletter</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-dark to-secondary bg-clip-text text-transparent">
                통증 치료의<br /> 새로운 패러다임을 제시합니다.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                JSHA의 철학과 임상 경험을 바탕으로 한<br />
                통증 치료에 대한 새로운 관점을 공유합니다.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-card hover:shadow-elevated transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">최신 연구</h3>
                <p className="text-sm text-muted-foreground">논문과 임상 데이터 기반의 통찰</p>
              </div>
              <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-card hover:shadow-elevated transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">정기 발행</h3>
                <p className="text-sm text-muted-foreground">매주 새로운 주제로 찾아옵니다</p>
              </div>
              <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-card hover:shadow-elevated transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">실용 정보</h3>
                <p className="text-sm text-muted-foreground">임상에 바로 적용 가능한 내용</p>
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
              매주 최신 뉴스레터를 이메일로 받아보세요.
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
