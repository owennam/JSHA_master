import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { curriculum } from "@/data/curriculum";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const CurriculumSection = () => {
  const moduleColors = [
    { bg: "bg-primary/10", border: "border-primary/30", badge: "bg-primary" },
    { bg: "bg-primary/10", border: "border-primary/30", badge: "bg-primary" },
    { bg: "bg-primary/10", border: "border-primary/30", badge: "bg-primary" },
    { bg: "bg-primary/10", border: "border-primary/30", badge: "bg-primary" },
  ];

  return (
    <section id="curriculum" className="py-20 bg-gradient-to-b from-background via-muted to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            JSHA 마스터 코스  <br className='md:hidden' />커리큘럼
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">
            1박 2일 집중 과정으로 구성된 체계적인 교육 프로그램
          </p>
          <p className="text-lg text-black font-semibold bg-primary/10 px-4 py-2 rounded-xl inline-block">
            총 40시간의 실전 중심 교육  <br className='md:hidden' />(각 회차 10시간)
          </p>
        </div>

        <Accordion type="multiple" className="max-w-7xl mx-auto space-y-6">
          {curriculum.map((module, idx) => {
            const colors = moduleColors[idx];
            return (
              <AccordionItem
                key={module.module}
                value={`module-${module.module}`}
                className={`border-2 ${colors.border} ${colors.bg} rounded-2xl overflow-hidden shadow-[0_4px_16px_0_rgba(2,32,71,0.05)] hover:shadow-[0_8px_24px_0_rgba(0,27,55,0.1)] transition-all duration-[250ms] backdrop-blur-sm animate-[fadeInUp_0.6s_ease-out_both]`}
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-background/50 transition-all duration-[250ms] group">
                  <div className="flex items-start justify-between w-full pr-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Badge className={`${colors.badge} text-white text-sm shadow-[0_2px_8px_0_rgba(2,32,71,0.15)] transition-all duration-[250ms] group-hover:scale-105`}>
                        세션 {module.module}
                      </Badge>
                      <div className="text-left">
                        <h3 className="text-xl md:text-2xl font-bold mb-2 transition-colors duration-[250ms] group-hover:text-primary">
                          {module.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2 transition-colors duration-[250ms] group-hover:text-primary">
                        <Clock className="h-4 w-4" />
                        <span>{module.totalDuration / 60}시간</span>
                      </div>
                      <div className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg transition-all duration-[250ms] group-hover:bg-primary/20">
                        {module.price}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {/* Days */}
                  <div className="space-y-4 mb-4">
                    {module.days.map((day) => (
                      <div
                        key={day.day}
                        className="bg-card/80 backdrop-blur-sm rounded-xl p-5 border-2 border-border/50 shadow-[0_2px_8px_0_rgba(2,32,71,0.05)] hover:shadow-[0_4px_12px_0_rgba(0,27,55,0.08)] hover:border-primary/30 transition-all duration-[250ms]"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-sm border-primary/30 bg-primary/5 transition-all duration-[250ms] hover:bg-primary/10">
                            {day.dayName}
                          </Badge>
                          <span className="text-sm text-muted-foreground font-medium">
                            {day.duration / 60}시간
                          </span>
                        </div>
                        <h4 className="font-bold text-black mb-3 text-lg">
                          {day.title}
                        </h4>
                        <ul className="space-y-2">
                          {day.topics.map((topic, topicIdx) => (
                            <li
                              key={topicIdx}
                              className="text-sm text-muted-foreground flex items-start gap-2 leading-relaxed"
                            >
                              <span className="text-primary mt-1 flex-shrink-0">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  {module.highlights && module.highlights.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {module.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/15 transition-all duration-[250ms]"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="font-medium">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Note */}
                  {module.specialNote && (
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4 shadow-[0_2px_8px_0_rgba(245,158,11,0.1)] backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                          {module.specialNote}
                        </p>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
};
