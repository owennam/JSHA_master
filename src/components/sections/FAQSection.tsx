import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "워크숍 참석자와 비참석자의 가격 차이가 있나요?",
      answer:
        "네, 있습니다. 이전 워크숍 참석자는 50% 할인된 가격으로 등록할 수 있습니다. 예를 들어, 1회차는 정가 198만 원이지만 이전 워크숍 참석자는 99만 원입니다. 전체 과정(1-4회차)의 경우 정가 1,100만 원에서 이전 워크숍 참석자는 550만 원입니다.",
    },
    {
      question: "개별 세션만 신청할 수 있나요?",
      answer:
        "1회차는 개별 신청이 가능합니다. 1회차 이외 2,3,4 회차는 개별 등록 불가합니다. 전체 과정의 체계적인 학습을 위해 순차적으로 수강하시는 것을 권장합니다.",
    },
    {
      question: "비밀 유지 서약이 무엇인가요?",
      answer:
        "JSHA 마스터 코스에서는 아직 공개되지 않은 독자적인 치료법과 제품 개발 과정을 공유합니다. 이러한 지적 재산을 보호하기 위해 2회차부터 비밀 유지 서약서 작성이 필수입니다. 강의 자료, 제품 아이디어, 치료법 및 노하우, 임상 데이터 등이 포함됩니다.",
    },
    {
      question: "아카데미 수료 후 혜택은 무엇인가요?",
      answer:
        "수료 후에는 다음과 같은 혜택이 제공됩니다:\n• 평생 회원 등록 (향후 워크숍 90%, 도수 워크숍 50% 할인)\n• 제이에스힐링의원 외래 참관 기회\n• 지속적인 교육 자료 업데이트\n• 전문가 네트워크 참여\n• JSHA 공인 라이센스 (3회차 수료 시)",
    },
    {
      question: "교재나 자료는 제공되나요?",
      answer:
        "네, JSHA 교과서 및 강의 자료가 제공됩니다. 모든 자료는 디지털 형태로도 제공되어 언제든지 복습하실 수 있습니다. 평생 회원으로 등록되면 최신 자료 업데이트에도 지속적으로 접근할 수 있습니다.",
    },
    {
      question: "실습은 어떻게 진행되나요?",
      answer:
        "소규모 그룹으로 진행되며, 1:1 피드백이 제공됩니다. 이론 40%, 실습 60%의 비율로 구성되어 있으며, 참가자 상호 간 실습과 강사의 직접 시연을 통해 실전 능력을 향상시킵니다. 토요일에는 주로 복습 및 심화 실습이, 일요일에는 신규 기법에 대한 집중 실습이 진행됩니다.",
    },
    {
      question: "의사만 참여 가능한가요?",
      answer:
        "JSHA 마스터 코스는 주로 의사를 대상으로 설계된 프로그램입니다. 통증 치료에 관심 있는 다른 의료 전문가의 경우, 개별적으로 문의해 주시기 바랍니다.",
    },
    {
      question: "환불 정책은 어떻게 되나요?",
      answer:
        "구체적인 환불 정책은 등록 시 안내됩니다. 일반적으로 교육 시작 전 충분한 시간을 두고 취소하실 경우 환불이 가능하나, 교육 시작 후에는 환불이 어려울 수 있습니다. 자세한 사항은 등록 문의 시 확인해 주시기 바랍니다.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-background via-muted to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            자주 묻는 질문
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            JSHA 마스터 코스에 대해 궁금하신 점을 확인하세요
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-2xl px-6 hover:border-primary/40 hover:shadow-[0_8px_16px_0_rgba(0,27,55,0.08)] transition-all duration-[250ms] animate-[fadeInUp_0.6s_ease-out_both]"
                style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
              >
                <AccordionTrigger className="text-left hover:no-underline py-6 group">
                  <span className="font-bold text-black pr-4 transition-colors duration-[250ms] group-hover:text-primary">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed whitespace-pre-line text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-16 text-center animate-[fadeInUp_0.6s_ease-out_0.8s_both]">
            <div className="inline-block bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-2 border-primary/30 rounded-2xl p-8 shadow-[0_8px_16px_0_rgba(0,27,55,0.08)] hover:shadow-[0_12px_24px_0_rgba(0,27,55,0.12)] transition-all duration-[250ms] backdrop-blur-sm">
              <p className="text-muted-foreground mb-2 text-lg">
                더 궁금하신 점이 있으신가요?
              </p>
              <p className="text-foreground font-bold text-xl">
                아래 문의하기 섹션을 통해 연락 주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
