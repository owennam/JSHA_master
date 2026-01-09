import { Calendar, BedDouble, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ScheduleSection = () => {
  const schedule = [
    {
      module: 1,
      period: "2026년 3월",
      date: "3월 7일 (토) ~ 8일 (일)",
      title: "JSHA 핵심 철학 및 JSST/DTR 기초",
      color: "bg-primary",
    },
    {
      module: 2,
      period: "2026년 3월",
      date: "3월 28일 (토) ~ 29일 (일)",
      title: "STR 및 호흡 기능 재활",
      color: "bg-primary",
    },
    {
      module: 3,
      period: "2026년 4월",
      date: "4월 18일 (토) ~ 19일 (일)",
      title: "PTR 및 JS Advance Course",
      color: "bg-primary",
    },
    {
      module: 4,
      period: "2026년 5월",
      date: "5월 16일 (토) ~ 17일 (일)",
      title: "최종 테스트, 증례 발표 및 수료식",
      color: "bg-primary",
    },
  ];

  return (
    <section id="schedule" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            교육 일정
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            2026년 3월부터 5월까지  3주에 1회, <br className='md:hidden' />1박 2일 집중 과정
          </p>
        </div>

        {/* 일정 타임라인 */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid gap-6">
            {schedule.map((item, idx) => (
              <Card
                key={item.module}
                className="border-2 hover:border-primary transition-all hover:shadow-elevated"
              >
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <Badge className={`${item.color} text-white text-sm`}>
                        세션 {item.module}
                      </Badge>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="font-semibold">{item.period}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.date}
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* 교육 시간 및 장소 정보 */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {/* 교육 시간 */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div>
                <h3 className="font-bold text-black mb-3">교육 시간</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>
                    <strong className="text-black">토요일 (1일차):</strong> 3시간
                    <div className="text-sm ml-4">18:00 ~ 21:00</div>
                  </div>
                  <div>
                    <strong className="text-black">일요일 (2일차):</strong> 7시간
                    <div className="text-sm ml-4">10:00 ~ 17:00 (점심 포함)</div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <strong className="text-black">총 교육 시간:</strong> 40시간 (10시간 × 4회)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 교육 장소 */}
          <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
            <CardContent className="p-6">
              <div>
                <h3 className="font-bold text-black mb-3">교육 장소</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-black">대전제이에스힐링의원</strong>
                  </div>
                  <div className="text-muted-foreground">
                    대전 서구 계룡로 633 2층
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground pt-2">
                    <BedDouble className="h-4 w-4" />
                    <span className="text-sm">숙박 시설: 추후 안내</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 일정 공지 안내 */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-black mb-2">
                  일정 공지 안내
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  구체적인 교육 날짜 및 시간은 <strong>등록자에게 개별 안내</strong> 예정입니다.
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>등록 후 안내 사항:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>정확한 교육 날짜 (토요일-일요일)</li>
                    <li>세부 교육 시간표</li>
                    <li>교육 장소 및 숙박 정보</li>
                    <li>준비물 및 사전 학습 자료</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
