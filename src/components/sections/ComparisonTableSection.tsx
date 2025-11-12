import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export const ComparisonTableSection = () => {
  const comparisons = [
    {
      category: "교육 기간",
      general: "1-2일",
      jsha: "4개월 (40시간)",
      highlight: true,
    },
    {
      category: "실습 비중",
      general: "20% (이론 위주)",
      jsha: "60% (실전 중심)",
      highlight: true,
    },
    {
      category: "교육 인원",
      general: "50-100명 (대규모)",
      jsha: "최대 10명",
      highlight: false,
    },
    {
      category: "커리큘럼",
      general: "일회성 강의",
      jsha: "4회차 체계적 프로그램",
      highlight: false,
    },
    {
      category: "강사진",
      general: "외부 초빙",
      jsha: "임상경력 30년 + 원장 직강",
      highlight: false,
    },
    {
      category: "사후 지원",
      general: "없음",
      jsha: "평생 회원 + Q&A 지원",
      highlight: true,
      hasIcon: true,
    },
    {
      category: "네트워킹",
      general: "일회성 만남",
      jsha: "246+ 협력 병의원 네트워크",
      highlight: false,
    },
    {
      category: "교육 자료",
      general: "PDF 제공",
      jsha: "JSHA 교과서 + 영상 + 평생 업데이트",
      highlight: true,
    },
    {
      category: "임상 적용",
      general: "스스로 해결",
      jsha: "외래 참관 + 1:1 멘토링",
      highlight: true,
    },
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            다른 교육과 비교하면?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            일반 세미나와 JSHA 마스터 코스의  <br className='md:hidden' />차별점을 확인하세요
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card className="border-2 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2">
                      <th className="p-6 text-left bg-muted/50 font-bold text-lg w-1/3">구분</th>
                      <th className="p-6 text-center bg-muted/50 font-bold text-lg w-1/3">
                        일반 세미나
                      </th>
                      <th className="p-6 text-center bg-primary/10 font-bold text-lg w-1/3">
                        <span className="text-black">JSHA 마스터 코스</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((item, index) => (
                      <tr
                        key={index}
                        className={`border-b ${
                          item.highlight ? "bg-primary/5" : "bg-background"
                        } hover:bg-muted/30 transition-colors`}
                      >
                        <td className="p-6 font-semibold text-black">{item.category}</td>
                        <td className="p-6 text-center text-muted-foreground">
                          <div className="flex items-center justify-center gap-2">
                            {item.hasIcon && <X className="h-5 w-5 text-destructive" />}
                            <span>{item.general}</span>
                          </div>
                        </td>
                        <td className="p-6 text-center font-semibold text-black">
                          <div className="flex items-center justify-center gap-2">
                            {item.hasIcon && <Check className="h-5 w-5 text-primary" />}
                            <span>{item.jsha}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-6">
            {comparisons.map((item, index) => (
              <Card
                key={index}
                className={`border-2 ${item.highlight ? "border-primary/50 bg-primary/5" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="font-bold text-lg mb-4 text-foreground">{item.category}</div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <X className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">일반 세미나</div>
                        <div className="text-foreground">{item.general}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-black mb-1 font-semibold">
                          JSHA 마스터 코스
                        </div>
                        <div className="text-black font-semibold">{item.jsha}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-black mb-4">
                  왜 마스터 코스인가?
                </h3>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  일회성 세미나가 아닌 <strong className="text-black">4개월간의  <br className='md:hidden' />체계적 교육</strong>과{" "}
                  <strong className="text-black">평생 지원 시스템</strong>으로 <br />
                  진정한 전문가로 성장 할 수 있습니다.
                </p>
                <button
                  onClick={() => document.getElementById("application")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  지금 바로 지원하기
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
