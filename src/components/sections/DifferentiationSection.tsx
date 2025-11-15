export const DifferentiationSection = () => {
  const features = [
    {
      title: "과학적 근거 기반",
      description: "의학, 카이로프랙틱, 중의학, 신경과학, 정골의학의 통합. 30년 이상의 임상 연구 결과와 X-ray, JSST 등 객관적 진단 도구를 활용합니다.",
    },
    {
      title: "실전 중심 교육",
      description: "이론 40% + 실습 60%. 1박 2일 집중 과정과 소규모 그룹 1:1 피드백. 평생 회원 교육으로 지속적 성장을 보장합니다.",
    },
    {
      title: "안전하고 간결한 치료",
      description: "스테로이드 사용 지양, 침습적 시술 최소화. 인체 본연의 회복력을 활용하여 안전하고 효과적인 치료를 추구합니다.",
    },
    {
      title: "독창적 치료 시스템",
      description: "JSHA만의 진단 프로토콜과 JS Insole, JS 주사 치료 등 독자 개발 기법. 비공개 치료 노하우를 전수받습니다.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            JSHA Master Course만의 차별성
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            단순한 기법 전수를 넘어, 통증 치료의 근본 철학을 익히는 프로그램
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-card rounded-2xl p-8 border-2 border-border hover:border-primary transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated"
            >
              <h3 className="text-xl font-bold text-black mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* 추가 강조 박스 */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary via-primary-light to-primary-dark rounded-2xl p-8 md:p-12 text-center shadow-elevated">
            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              통증 치료의 미래,  <br className='md:hidden' />JSHA와 함께
            </h3>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              <strong>30년의 임상 경험</strong>, <strong>과학적 근거 기반</strong>, <strong>독창적 치료 시스템</strong>, <strong>실전 중심 교육</strong>
              <br />
              JSHA 마스터 코스는 통증 치료의  <br className='md:hidden' />새로운 표준을 제시합니다.
            </p>
            <div className="mt-6 text-xl md:text-2xl font-bold text-primary-foreground tracking-tight">
              당신의 진료실이 행복해지고, <br />
              <span className="block">환자의 삶이 행복해집니다.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
