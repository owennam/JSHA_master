import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const applicationSchema = z.object({
  name: z.string().min(2, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일을 입력해주세요"),
  phone: z.string().min(10, "올바른 전화번호를 입력해주세요"),
  hospital: z.string().min(2, "근무 병원 이름을 입력해주세요"),
  workType: z.string().min(1, "근무 형태를 선택해주세요"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export const ApplicationSection = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      hospital: "",
      workType: "",
    },
  });
  const applicationInfo = [
    {
      label: "모집 인원",
      value: "최대 10명",
      description: "정예 그룹 교육",
    },
    {
      label: "개강일",
      value: "2026년 3월",
      description: "구체적 일정 추후 공지",
    },
    {
      label: "교육 시간",
      value: "1박 2일",
      description: "총 40시간 (8회)",
    },
    {
      label: "수강료",
      value: "세션별 상이",
      description: "1회차 198만원\n전회차 등록 1100만원\n(이전 워크숍 참석자 50% 할인)",
    },
  ];

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

      const response = await fetch(`${SERVER_URL}/submit-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || '신청 처리 중 오류가 발생했습니다.');
      }

      toast({
        title: "신청이 접수되었습니다",
        description: "담당자가 곧 연락드리겠습니다. 이메일을 확인해주세요.",
      });

      form.reset();
      setShowForm(false);
    } catch (error: any) {
      console.error('신청 처리 실패:', error);
      toast({
        title: "신청 처리 실패",
        description: error.message || "다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const academyPrice = 300000; // 아카데미 수강료 (예시)

  return (
    <section id="application" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            등록 및 문의
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            JSHA 마스터 코스 2026년 1기 모집
          </p>
        </div>

        {/* 가격 인상 알림 배너 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 border-2 border-orange-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0" />
              <p className="text-lg font-bold text-black">
                <span className="text-orange-600">조기 등록 혜택!</span> <br className='md:hidden' />다음 기수에는 가격이 더 인상됩니다
              </p>
            </div>
          </div>
        </div>

        {/* 모집 정보 그리드 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {applicationInfo.map((info, idx) => (
            <Card key={idx} className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-sm text-muted-foreground mb-1">{info.label}</div>
                <div className="text-2xl font-bold text-black mb-2">{info.value}</div>
                <div className="text-sm text-muted-foreground whitespace-pre-line">{info.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 신청 절차 */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-black mb-8 text-center">
            신청 절차
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "지원서 작성", desc: "온라인 또는 이메일" },
              { step: "2", title: "서류 검토", desc: "3-5일 소요" },
              { step: "3", title: "합격 통보", desc: "이메일 발송" },
              { step: "4", title: "등록 완료", desc: "수강료 납부" },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-card rounded-xl p-6 border-2 border-border text-center h-full">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                    {item.step}
                  </div>
                  <div className="font-semibold text-black mb-1">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.desc}</div>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 신청 폼 또는 CTA */}
        <div className="max-w-3xl mx-auto">
          {!showForm ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-elevated border-2 border-border">
              <h3 className="text-3xl font-bold text-black mb-4">
                지금 문의하세요
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                통증 치료의 새로운 기준, <br className='md:hidden' />JSHA 마스터 코스가
                <br />
                당신의 진료에 확신을 더해드립니다.
              </p>
              <Button
                size="lg"
                onClick={() => setShowForm(true)}
                className="bg-primary hover:bg-primary-dark text-white text-lg px-10 py-6 rounded-2xl shadow-blue hover:shadow-elevated transition-all hover:scale-105"
              >
                신청서 작성하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-black mb-6 text-center">
                  JSHA 마스터 코스 문의
                </h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이름</FormLabel>
                          <FormControl>
                            <Input placeholder="홍길동" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>전화번호</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="01012345678"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hospital"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>근무 병원 이름</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="예: 서울대학교병원"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="workType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>근무 형태</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="근무 형태를 선택해주세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="개원의">개원의</SelectItem>
                              <SelectItem value="봉직의">봉직의</SelectItem>
                              <SelectItem value="전공의">전공의</SelectItem>
                              <SelectItem value="공보의">공보의</SelectItem>
                              <SelectItem value="군의관">군의관</SelectItem>
                              <SelectItem value="의과대학학생">의과대학학생</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">
                        <strong className="text-black">수강료 (세션별)</strong>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• 세션 1: 198만 원 (이전 워크숍 참석자 50% 할인)</li>
                        <li>• 세션 2-4: 1,100만 원 (이전 워크숍 참석자 50% 할인)</li>
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowForm(false)}
                        disabled={isSubmitting}
                      >
                        취소
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            처리 중...
                          </>
                        ) : (
                          "신청하기"
                        )}
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground text-center">
                      * 현재는 신청 접수만 가능하며, 담당자가 연락드립니다.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};
