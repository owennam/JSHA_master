import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export const MasterCareFAQSection = () => {
  const faqs = [
    {
      question: "마스터 코스 수료생만 신청 가능한가요?",
      answer:
        "네, Master Care는 JSHA 마스터 코스를 수료한 분들만 이용하실 수 있는 프리미엄 사후 관리 프로그램입니다. 마스터 코스에서 배운 내용을 실제 임상에 완벽히 적용하실 수 있도록 지원합니다.",
    },
    {
      question: "방문 지역에 제한이 있나요?",
      answer:
        "전국 어디든 방문 가능합니다. 수도권 외 지방의 경우 교통비가 별도로 발생할 수 있으며, 상담 시 구체적인 비용을 안내해 드립니다. 거리와 무관하게 동일한 품질의 서비스를 제공합니다.",
    },
    {
      question: "방문 일정은 어떻게 조율하나요?",
      answer:
        "초기 상담 후 귀하의 병원 일정과 전문가의 일정을 고려하여 유연하게 조율합니다. 일반적으로 신청 후 2-4주 이내에 첫 방문이 이루어지며, 이후 방문 일정은 패키지에 따라 월 1회 또는 격월 1회로 진행됩니다.",
    },
    {
      question: "환불 정책은 어떻게 되나요?",
      answer:
        "서비스 시작 전(첫 방문 전) 100% 환불이 가능합니다. 서비스 시작 후에는 미사용 회차에 대해서만 부분 환불이 가능하며, 이미 진행된 회차는 환불 대상에서 제외됩니다. 자세한 환불 규정은 계약 시 안내됩니다.",
    },
    {
      question: "패키지 업그레이드가 가능한가요?",
      answer:
        "네, 언제든지 상위 패키지로 업그레이드 가능합니다. Basic에서 Standard로, 또는 Standard에서 Premium으로 업그레이드 시 차액만 납부하시면 됩니다. 업그레이드 시점부터 상위 패키지의 모든 혜택이 적용됩니다.",
    },
    {
      question: "온라인 Q&A는 어떻게 진행되나요?",
      answer:
        "카카오톡 1:1 채널을 통해 언제든지 질문하실 수 있습니다. 일반적으로 24시간 이내에 답변드리며, 긴급한 경우 더 빠른 응답이 가능합니다. 영상이나 사진을 첨부하여 구체적인 케이스에 대한 조언도 받으실 수 있습니다.",
    },
    {
      question: "직원 교육도 포함되나요?",
      answer:
        "Standard 이상 패키지에서는 직원 교육이 포함됩니다. 방문 시 귀 병원의 직원들을 대상으로 JSHA 기본 원리, 환자 응대, JS Insole 착용 가이드 등을 교육하며, 표준 프로토콜 문서도 제공됩니다.",
    },
    {
      question: "한 번에 여러 케이스를 상담받을 수 있나요?",
      answer:
        "네, 1회 방문 시 여러 케이스를 함께 검토할 수 있습니다. 사전에 준비하실 케이스 목록을 공유해 주시면, 효율적으로 모든 케이스를 다룰 수 있도록 시간을 배분합니다. 온라인 Q&A를 통해서도 지속적으로 케이스 상담이 가능합니다.",
    },
    {
      question: "계약 기간은 얼마나 되나요?",
      answer:
        "패키지별로 다릅니다. Basic은 1개월, Standard는 3개월, Premium은 6개월이 기본 계약 기간입니다. 계약 기간 내에 모든 방문 컨설팅과 온라인 Q&A 서비스를 이용하실 수 있으며, 필요시 기간 연장도 가능합니다.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="h-10 w-10 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              자주 묻는 질문
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master Care에 대해 궁금하신 점을 확인하세요
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-card border-2 border-border rounded-xl px-6 hover:border-primary transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <div className="inline-block bg-primary/5 border-2 border-primary/20 rounded-xl p-6">
              <p className="text-muted-foreground mb-2">
                더 궁금하신 점이 있으신가요?
              </p>
              <p className="text-foreground font-semibold">
                아래 신청 폼을 통해 문의하시거나 직접 연락 주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
