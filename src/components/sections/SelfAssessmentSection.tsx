import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export const SelfAssessmentSection = () => {
  const [checkedItems, setCheckedItems] = useState<(boolean | null)[]>(Array(6).fill(null));
  const [showResult, setShowResult] = useState(false);

  const questions = [
    "환자가 3개월 내 재발하여 다시 내원합니까?",
    "진통제나 스테로이드 주사 처방이 주된 치료법입니까?",
    "환자가 \"왜 아픈지\" 물어보면 명확히 설명하기 어렵습니까?",
    "X-ray를 봐도 구조적 불균형을 파악하기 어렵습니까?",
    "환자 만족도나 추천율이 기대만큼 높지 않습니까?",
    "더 효과적인 통증 치료법을 찾고 있습니까?",
  ];

  const handleAnswer = (index: number, answer: boolean) => {
    const newChecked = [...checkedItems];
    newChecked[index] = answer;
    setCheckedItems(newChecked);
    setShowResult(false);
  };

  const calculateScore = () => {
    return checkedItems.filter(Boolean).length;
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const getResult = () => {
    const score = calculateScore();

    if (score === 0) {
      return {
        icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
        title: "훌륭합니다!",
        message: "현재 진료에 만족하고 계시군요. JSHA 마스터 코스로 더욱 전문성을 강화할 수 있습니다.",
        color: "green",
      };
    } else if (score <= 3) {
      return {
        icon: <AlertCircle className="h-16 w-16 text-yellow-500" />,
        title: "개선이 필요합니다",
        message: "몇 가지 문제점이 보입니다. JSHA 마스터 코스가 도움이 될 것입니다.",
        color: "yellow",
      };
    } else {
      return {
        icon: <XCircle className="h-16 w-16 text-red-500" />,
        title: "JSHA가 꼭 필요합니다!",
        message: "많은 문제점이 확인되었습니다. JSHA 마스터 코스로 근본적인 변화를 만들어보세요.",
        color: "red",
      };
    }
  };

  return (
    <section id="self-assessment" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            당신의 진료실은  <br className='md:hidden' /> 몇 점인가요?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            6가지 질문으로 현재 진료의 문제점을 진단해보세요
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle className="text-2xl text-center">자가 진단 체크리스트</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border-2 border-muted hover:border-primary/30 transition-colors"
                  >
                    <div className="mb-4">
                      <span className="font-semibold text-primary mr-2">Q{index + 1}.</span>
                      <span className="text-base leading-relaxed">{question}</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAnswer(index, true)}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                          checkedItems[index] === true
                            ? "bg-primary text-primary-foreground shadow-md scale-105"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer(index, false)}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                          checkedItems[index] === false
                            ? "bg-muted-foreground text-background shadow-md scale-105"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  내 점수 확인하기
                </Button>
              </div>

              {/* Result */}
              {showResult && (
                <div className="mt-8 p-8 bg-gradient-to-br from-muted to-background rounded-2xl border-2 animate-fade-in">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {getResult().icon}
                    <h3 className="text-2xl font-bold text-black">{getResult().title}</h3>
                    <p className="text-lg text-muted-foreground max-w-xl">{getResult().message}</p>

                    <div className="mt-6 p-6 bg-primary/10 rounded-xl w-full">
                      <div className="text-sm text-muted-foreground mb-2">체크한 항목</div>
                      <div className="text-5xl font-bold text-black mb-2">
                        {calculateScore()} / 6
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {calculateScore() > 0 ? (
                          <>
                            <strong className="text-black">
                              {calculateScore()}개의 문제점
                            </strong>
                            이 발견되었습니다
                          </>
                        ) : (
                          "문제점이 발견되지 않았습니다"
                        )}
                      </div>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => document.getElementById("application")?.scrollIntoView({ behavior: "smooth" })}
                      className="mt-6 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold shadow-blue"
                    >
                      JSHA 마스터 코스 지원하기
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            <strong className="text-black">95% 이상의 수료생</strong>이 이러한 문제점들을
            <br className='md:hidden' />JSHA 마스터 코스로 해결했습니다
          </p>
        </div>
      </div>
    </section>
  );
};
