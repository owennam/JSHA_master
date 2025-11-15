import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AcademyIntroSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            JSHA Master Course란?
          </h2>
          <div className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed space-y-4">
            <p>
              JSHA Master Course는 <strong className="text-black"> <br className='md:hidden' />단순히 통증을 없애는 것이 아니라,<br />
              통증의 근본 원인을 해결하는 의사를  <br className='md:hidden' />양성</strong>하는 전문 교육 과정입니다.
            </p>
            <p>
            본 과정은 30년 이상의 임상경험과 연구를 통해 탄생한 <strong className="text-black">치료시스템</strong>을 제공하며,<br /> 실제 임상에 바로 적용할 수 있는
              <strong className="text-black"> 통증 치료의 새로운 패러다임</strong>을 제시합니다.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* 프로그램 특징 */}
          <Card className="border-2 hover:border-primary transition-colors shadow-card hover:shadow-elevated">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">프로그램 특징</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-muted-foreground">
                <strong className="text-black">5개월 집중 과정:</strong> <br className='md:hidden' />1박 2일 × 4회 = 총 40시간 + 참관
              </p>
              <p className="text-lg text-muted-foreground">
                <strong className="text-black">실전 중심:</strong>  <br className='md:hidden' /> 이론 40% + 실습 60% + 참관관
              </p>
              <p className="text-lg text-muted-foreground">
                <strong className="text-black">4개 세션 + 참관:</strong>  <br className='md:hidden' />기초 → 중급 → 심화 → 통합 → 참관
              </p>
              <p className="text-lg text-muted-foreground">
                <strong className="text-black">과학적 근거:</strong>  <br className='md:hidden' />30년 이상의 임상 연구 기반
              </p>
            </CardContent>
          </Card>

          {/* 모집 대상 */}
          <Card className="border-2 hover:border-primary transition-colors shadow-card hover:shadow-elevated">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">모집 대상</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-muted-foreground">
                <strong className="text-black">지원 자격:</strong>  <br className='md:hidden' />통증 치료에 관심 있는 모든 의사
              </p>
              <p className="text-lg text-muted-foreground">
                <strong className="text-black">근본 치료 추구:</strong>  <br className='md:hidden' />증상이 아닌 원인을 해결하고자 하는 분
              </p>
              <p className="text-lg text-muted-foreground">
                <strong className="text-black">실습 중심 학습:</strong>  <br className='md:hidden' />4개월간 집중적으로 학습할 수 있는 분
              </p>
              <p className="text-lg text-muted-foreground">
                <strong className="text-black">임상 적용 의지:</strong>  <br className='md:hidden' />배운 내용을 즉시 진료에 활용하고 싶은 분
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 하이라이트 박스 */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-muted/50 rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-xl font-bold text-black mb-3">깊이 있는 학습</h3>
            <p className="text-lg text-muted-foreground">
              단순 기법 전수가 아닌, JSHA 철학의 본질을 이해하고 임상에 적용하는 방법을 배웁니다.
            </p>
          </div>

          <div className="bg-muted/50 rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-xl font-bold text-black mb-3">공인 라이센스</h3>
            <p className="text-lg text-muted-foreground">
              전체 과정 수료 시 JSHA 공인 라이센스를 획득합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
