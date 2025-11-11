import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const MasterCarePackagesSection = () => {
  const packages = [
    {
      id: "basic",
      name: "Basic Package",
      badge: null,
      visits: "1회 방문",
      duration: "5시간",
      price: "100만원",
      originalPrice: "200만원",
      pricePerVisit: null,
      features: [
        "5시간 현장 컨설팅",
        "임상 케이스 리뷰",
        "개선 방향 제시",
        "인솔 20개 제공"
      ],
      color: "border-border",
      bgColor: "bg-card",
      headerColor: "bg-gradient-to-r from-red-500 to-pink-500",
      buttonVariant: "default" as const,
    },
    {
      id: "standard",
      name: "Standard Package",
      badge: null,
      visits: "2회 방문",
      duration: "총 10시간",
      price: "400만원",
      pricePerVisit: "1회당 200만원",
      features: [
        "2회 × 5시간 현장 컨설팅",
        "임상 케이스 심층 리뷰",
        "직원 교육 지원",
        "병원 시스템 최적화 컨설팅",
        "인솔 40개 제공"
      ],
      color: "border-primary",
      bgColor: "bg-primary/5",
      headerColor: "bg-gradient-to-r from-blue-500 to-blue-600",
      buttonVariant: "default" as const,
      isPopular: true,
    },
    {
      id: "premium",
      name: "Premium Package",
      badge: null,
      visits: "3회 방문",
      duration: "총 15시간",
      price: "600만원",
      pricePerVisit: "1회당 200만원",
      features: [
        "3회 × 5시간 현장 컨설팅",
        "임상 케이스 종합 관리",
        "직원 심화 교육 프로그램",
        "병원 시스템 완전 구축",
        "인솔 60개 제공"
      ],
      color: "border-accent",
      bgColor: "bg-gradient-to-br from-accent/10 to-primary/10",
      headerColor: "bg-gradient-to-r from-green-500 to-emerald-500",
      buttonVariant: "default" as const,
      isPremium: true,
    },
  ];

  const scrollToApplication = () => {
    document.getElementById("mastercare-application")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="packages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Master Care 패키지
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            귀하의 필요에 맞는 최적의 컨설팅 패키지를 선택하세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg) => {
            return (
              <Card
                key={pkg.id}
                className="relative border-2 border-border bg-white hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full flex flex-col"
              >
                {/* Color Header */}
                <div className={`${pkg.headerColor} py-6 px-8 text-center relative`}>
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="px-4 py-1 rounded-full font-bold text-xs bg-white text-foreground shadow-md">
                        {pkg.badge}
                      </div>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wide">
                    {pkg.name.replace(" Package", "")}
                  </h3>
                </div>

                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="text-center mb-6">
                    <div className="text-base text-muted-foreground mb-1">{pkg.visits}</div>
                    <div className="text-base text-muted-foreground">{pkg.duration}</div>
                  </div>

                  <div className="text-center mb-6 pb-6 border-b">
                    {pkg.originalPrice && (
                      <div className="text-lg text-muted-foreground line-through mb-1">
                        {pkg.originalPrice}
                      </div>
                    )}
                    <div className="text-4xl font-bold text-foreground mb-2">
                      {pkg.price}
                    </div>
                    {pkg.pricePerVisit && (
                      <div className="text-sm text-muted-foreground">
                        {pkg.pricePerVisit}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className={`flex-shrink-0 mt-0.5 font-bold ${
                            pkg.id === "basic"
                              ? "text-red-500"
                              : pkg.id === "standard"
                              ? "text-blue-500"
                              : "text-green-500"
                          }`}>✓</span>
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={pkg.buttonVariant}
                    className="w-full py-6 text-lg font-semibold mt-auto"
                    onClick={scrollToApplication}
                  >
                    신청하기
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-muted border-2">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                패키지 선택 가이드
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="font-semibold text-foreground mb-2">Basic</div>
                  <div className="text-sm text-muted-foreground">
                    병원 시스템 구축 및 임상 케이스에 대한 전문가 조언이 필요한 경우
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-2">Standard</div>
                  <div className="text-sm text-muted-foreground">
                    체계적인 시스템 구축과 직원 교육이 필요한 경우
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-2">Premium</div>
                  <div className="text-sm text-muted-foreground">
                    병원 전체의 완전한 JSHA 시스템 구축을 원하는 경우
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
