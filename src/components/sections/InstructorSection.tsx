import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const InstructorSection = () => {
  const credentials = [
    {
      title: "마취통증의학 전문의",
      description: "대한마취통증의학회 정회원",
    },
    {
      title: "다학제적 전문성",
      description: "카이로프랙틱, 중의학, 신경과학, 정골의학 통합",
    },
    {
      title: "JSHA 시스템 창시자",
      description: "30년 이상의 임상 경험과 독창적 치료 철학",
    },
    {
      title: "국제적 표준화 선도",
      description: "통증 치료의 새로운 패러다임 제시",
    },
  ];

  const expertise = [
    "JS Insole 개발 및 임상 적용",
    "JS 주사 및 운동 치료 등의 독창적 치료 기법 체계화",
    "불균형-보상-통증 철학 개발",
    "국제적 통증 치료 표준화 선도",
  ];

  return (
    <section id="instructor" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            강사 소개
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            JSHA 통증 치료 철학의 창시자
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* 메인 프로필 */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 md:p-12 mb-12 border-2 border-primary/20">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* 프로필 이미지 영역 */}
              <div className="w-48 h-48 bg-primary/10 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0">
                <img
                  src="/images/instructor-lee.png"
                  alt="이종성 원장님"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* 프로필 정보 */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-bold text-black mb-2">
                  이종성 원장
                </h3>
                <p className="text-xl text-primary font-semibold mb-4">
                  제이에스힐링의원 대표원장
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  의학, 카이로프랙틱, 중의학,  <br className='md:hidden' />신경과학, 정골의학을 통합한
                  <br />
                  <strong className="text-black">독보적인 통증 치료 전문가</strong>
                </p>
                <div className="inline-block bg-primary/10 border border-primary/30 rounded-lg px-6 py-3">
                  <p className="text-sm text-foreground italic">
                    "통증의 근본 원인을 찾아 본질적인 해결책을 제시하는 것,
                    <br />
                    그것이 JSHA의 시작이자 끝입니다."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 전문 자격 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {credentials.map((credential, idx) => (
              <Card key={idx} className="border-2 hover:border-primary transition-all">
                <CardContent className="p-6 text-center">
                  <h4 className="font-bold text-black mb-2 text-lg">
                    {credential.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {credential.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 전문 분야 */}
          <div className="bg-card rounded-2xl p-8 border-2 border-border">
            <h4 className="text-2xl font-bold text-black mb-6 text-center">
              주요 업적 및 전문성
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {expertise.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
