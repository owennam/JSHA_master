const stats = [
  {
    value: "246+",
    label: "네트워크 구축",
    description: "협력병의원"
  },
  {
    value: "400+",
    label: "워크샵 참가자",
    description: "누적 교육 인원"
  },
  {
    value: "95%",
    label: "수료생 만족도",
    description: "5점 만점 기준"
  },
  {
    value: "550+",
    label: "교육 시간",
    description: "2019년부터"
  }
];

export const StatsSection = () => {
  return (
    <section className="relative py-16 bg-white overflow-hidden">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/jsha_master_course1.jpg"
          alt="JSHA Background"
          className="w-full h-full object-cover opacity-10 blur-sm"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            숫자로 입증된 성과
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            2019년부터 축적된 <strong className="text-black">JSHA의 교육 실적</strong>과
            <strong className="text-black"> 수료생들의 높은 만족도</strong>
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            return (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-black mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-black mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
