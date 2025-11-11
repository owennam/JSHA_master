import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Lightbulb } from "lucide-react";

const NewsletterDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // For now, we'll show the October week 0 content
  // In the future, this could be fetched from a CMS or API
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20 px-4">
        <article className="container mx-auto max-w-3xl">
          {/* Back Button */}
          <Link to="/newsletter">
            <Button variant="ghost" className="mb-6 hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
          </Link>

          {/* Header */}
          <header className="mb-12 text-center py-12 px-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border border-border/50">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">JSHA Newsletter</h1>
            <p className="text-xl text-muted-foreground mb-6">통증 치료의 새로운 패러다임을 제시합니다.</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <time>2025년 9월 28일</time>
            </div>
          </header>

          {/* Greeting */}
          <div className="mb-8">
            <p className="text-lg text-muted-foreground">존경하는 원장님들께,</p>
          </div>

          {/* Main Content */}
          <section className="prose prose-lg max-w-none mb-12 p-8 bg-muted/30 rounded-2xl border border-border/50">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              통증(Pain)에 대한 재해석: 인체의 Fail-Safe 시스템
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                JSHA 철학을 이해하기에 앞서, 우리는 먼저 통증(Pain)의 본질적인 역할을 재정의해야 합니다. 
                대부분의 현대 통증 치료는 통증을 제거해야 할 대상으로 간주하지만, JSHA는 통증을 
                <strong className="text-foreground"> 더 큰 손상을 막기 위해 작동하는 인체의 핵심적인 페일 세이프(Fail-Safe) 시스템</strong>으로 바라봅니다.
              </p>

              <p>위의 내용을 잘 보여주는 사례가 있어 공유합니다.</p>

              <p>
                JSHA 2기 강사방 단톡방에 이용기 원장님이 이런 카톡을 올리셨습니다.
              </p>
            </div>
          </section>

          {/* Case Study */}
          <section className="mb-12 p-8 bg-background rounded-2xl border-2 border-primary/20">
            <div className="mb-6">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
                <span className="text-sm font-semibold text-primary">임상 사례</span>
              </div>
              <h3 className="text-xl font-bold mb-4">통증이 없다고 무조건 좋은 것은 아니다</h3>
            </div>
            
            <div className="bg-muted/50 rounded-xl p-6 mb-6 border border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">이용기 원장님:</strong><br />
                "무릎이 안 아파서 왔어요"<br /><br />
                
                내원하신 이유가 조금 독특했습니다. 무릎이 안 아픈데 병원에 오신 것입니다.<br /><br />
                
                몇 년 전 무릎을 다쳤는데, 그 후로 무릎에 통증이 없었다고 합니다. 
                처음에는 다행이라고 생각했는데, 시간이 지나면서 무릎 기능이 점점 떨어지는 것을 느꼈고, 
                최근에는 계단을 내려가는 것조차 불안정해졌다고 합니다.
              </p>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">JSHA 관점에서의 해석:</strong>
              </p>
              <p>
                이 환자의 경우, 무릎 손상 후 통증 신호가 제대로 작동하지 않아 
                추가적인 손상을 방지하는 신체의 보호 메커니즘이 실패했습니다. 
                통증이 없다는 것이 오히려 더 위험한 상황이었던 것입니다.
              </p>
              <p>
                이는 통증이 단순히 '불편한 증상'이 아니라, 
                <strong className="text-foreground"> 우리 몸이 더 큰 손상을 막기 위해 보내는 중요한 경고 신호</strong>임을 보여줍니다.
              </p>
            </div>
          </section>

          {/* Key Takeaway */}
          <section className="mb-12 p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              핵심 인사이트
            </h3>
            <p className="text-lg leading-relaxed">
              통증 치료의 목표는 단순히 통증을 없애는 것이 아니라, 
              <strong> 통증이 발생한 근본 원인(구조적 불균형)을 해결</strong>하여 
              신체가 정상적인 보호 메커니즘을 회복하도록 돕는 것입니다.
            </p>
          </section>

          {/* Research Reference */}
          <section className="mb-12 p-6 bg-foreground text-background rounded-2xl font-mono text-sm">
            <p className="font-semibold mb-2">📚 관련 연구</p>
            <p className="opacity-90">
              "Pain as a protective mechanism"<br />
              - Moseley GL, Butler DS. (2015)<br />
              - Journal of Physiotherapy
            </p>
          </section>

          {/* Next Steps */}
          <section className="mb-12 p-8 bg-muted/30 rounded-2xl border border-border/50">
            <h3 className="text-xl font-bold mb-4">다음 주 예고</h3>
            <p className="text-muted-foreground leading-relaxed">
              다음 뉴스레터에서는 "불균형-보상-통증"의 메커니즘을 
              구체적인 임상 사례와 함께 더욱 깊이 있게 다루겠습니다.
            </p>
          </section>

          {/* Footer */}
          <footer className="mt-16 pt-12 border-t border-border text-center">
            <div className="mb-6">
              <p className="font-bold text-lg mb-2">발행</p>
              <p className="text-muted-foreground">대전제이에스힐링의원</p>
              <p className="text-muted-foreground">JSHA Academy</p>
            </div>
            
            <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">
                <strong className="text-foreground">기여자</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                남승균 원장 (기획 및 작성)<br />
                이용기 원장 (임상 사례 제공)<br />
                JSHA 2기 강사진 (검토 및 피드백)
              </p>
            </div>
          </footer>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewsletterDetailPage;
