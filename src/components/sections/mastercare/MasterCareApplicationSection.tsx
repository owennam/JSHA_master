import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowRight, MessageCircle, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const masterCareSchema = z.object({
  name: z.string().min(2, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일을 입력해주세요"),
  phone: z.string().min(10, "올바른 전화번호를 입력해주세요"),
  hospital: z.string().min(2, "병원 이름을 입력해주세요"),
  hospitalAddress: z.string().min(5, "병원 주소를 입력해주세요"),
  masterCourseCompleted: z.string().min(1, "수료 기수를 선택해주세요"),
  packageType: z.enum(["basic", "standard", "premium"], {
    required_error: "패키지를 선택해주세요",
  }),
  consultingAreas: z.array(z.string()).min(1, "최소 1개 이상 선택해주세요"),
  preferredStartDate: z.string().min(1, "희망 시작 시기를 선택해주세요"),
  additionalNotes: z.string().optional(),
});

type MasterCareFormData = z.infer<typeof masterCareSchema>;

export const MasterCareApplicationSection = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [consultingAreas, setConsultingAreas] = useState<string[]>([]);

  const form = useForm<MasterCareFormData>({
    resolver: zodResolver(masterCareSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      hospital: "",
      hospitalAddress: "",
      masterCourseCompleted: "",
      packageType: undefined,
      consultingAreas: [],
      preferredStartDate: "",
      additionalNotes: "",
    },
  });

  const consultingAreaOptions = [
    { id: "dtr-str-ptr", label: "DTR/STR/PTR 기법 심화" },
    { id: "xray", label: "X-ray 판독 및 진단" },
    { id: "insole", label: "JS Insole 맞춤 제작" },
    { id: "case-management", label: "환자 케이스 관리" },
    { id: "staff-education", label: "직원 교육 및 표준화" },
    { id: "hospital-system", label: "병원 시스템 구축" },
    { id: "marketing", label: "마케팅 및 환자 관리" },
    { id: "other", label: "기타" },
  ];

  const handleConsultingAreaChange = (areaId: string, checked: boolean) => {
    const newAreas = checked
      ? [...consultingAreas, areaId]
      : consultingAreas.filter((id) => id !== areaId);
    setConsultingAreas(newAreas);
    form.setValue("consultingAreas", newAreas);
  };

  const onSubmit = async (data: MasterCareFormData) => {
    try {
      const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

      const response = await fetch(`${SERVER_URL}/submit-mastercare`, {
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
      setConsultingAreas([]);
      setShowForm(false);
    } catch (error: any) {
      console.error('신청 처리 실패:', error);
      toast({
        title: "신청 처리 실패",
        description: error.message || "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="mastercare-application" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Master Care 신청
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            전문가의 1:1 맞춤형 컨설팅으로 귀하의 임상을 완성하세요
          </p>
        </div>

        {/* 신청 절차 */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            신청 절차
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "신청서 작성", desc: "온라인 폼 제출" },
              { step: "2", title: "초기 상담", desc: "전화/화상 미팅 (30분)" },
              { step: "3", title: "맞춤 플랜 제안", desc: "개인별 컨설팅 계획" },
              { step: "4", title: "서비스 시작", desc: "일정 조율 후 진행" },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-card rounded-xl p-6 border-2 border-border text-center h-full">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                    {item.step}
                  </div>
                  <div className="font-semibold text-foreground mb-1">{item.title}</div>
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
              <FileText className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-foreground mb-4">
                지금 신청하세요
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Master Care를 통해 JSHA 시스템을 완벽히 마스터하고
                <br />
                귀하의 병원을 통증 치료의 중심으로 만드세요
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
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                  Master Care 신청서
                </h3>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* 기본 정보 */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-foreground">기본 정보</h4>

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
                              <Input type="email" placeholder="example@email.com" {...field} />
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
                              <Input type="tel" placeholder="010-1234-5678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* 병원 정보 */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-lg font-semibold text-foreground">병원 정보</h4>

                      <FormField
                        control={form.control}
                        name="hospital"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>병원 이름</FormLabel>
                            <FormControl>
                              <Input placeholder="예: 서울정형외과" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hospitalAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>병원 주소</FormLabel>
                            <FormControl>
                              <Input placeholder="서울시 강남구 ..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* 마스터 코스 정보 */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-lg font-semibold text-foreground">마스터 코스 정보</h4>

                      <FormField
                        control={form.control}
                        name="masterCourseCompleted"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>수료 기수</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="수료 기수를 선택해주세요" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="2024-1">2024년 1기</SelectItem>
                                <SelectItem value="2024-2">2024년 2기</SelectItem>
                                <SelectItem value="2025-1">2025년 1기</SelectItem>
                                <SelectItem value="2025-2">2025년 2기</SelectItem>
                                <SelectItem value="2026-1">2026년 1기</SelectItem>
                                <SelectItem value="other">기타</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* 패키지 선택 */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-lg font-semibold text-foreground">패키지 선택</h4>

                      <FormField
                        control={form.control}
                        name="packageType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>희망 패키지</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="패키지를 선택해주세요" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="basic">Basic Package - 1회 방문 (150만원)</SelectItem>
                                <SelectItem value="standard">Standard Package - 3회 방문 (400만원) [인기]</SelectItem>
                                <SelectItem value="premium">Premium Package - 6회 방문 (700만원) [VIP]</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* 컨설팅 희망 분야 */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-lg font-semibold text-foreground">컨설팅 희망 분야</h4>
                      <FormDescription>최소 1개 이상 선택해주세요 (다중 선택 가능)</FormDescription>

                      <div className="space-y-3">
                        {consultingAreaOptions.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={option.id}
                              checked={consultingAreas.includes(option.id)}
                              onCheckedChange={(checked) =>
                                handleConsultingAreaChange(option.id, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={option.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {form.formState.errors.consultingAreas && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.consultingAreas.message}
                        </p>
                      )}
                    </div>

                    {/* 희망 시작 시기 */}
                    <FormField
                      control={form.control}
                      name="preferredStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>희망 시작 시기</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="희망 시작 시기를 선택해주세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="immediately">즉시 시작</SelectItem>
                              <SelectItem value="1-month">1개월 이내</SelectItem>
                              <SelectItem value="2-3-months">2-3개월 이내</SelectItem>
                              <SelectItem value="flexible">유연하게 조율 가능</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* 추가 문의사항 */}
                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>추가 문의사항 (선택)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="특별히 요청하시거나 문의하실 사항이 있으시면 자유롭게 작성해주세요"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowForm(false);
                          form.reset();
                          setConsultingAreas([]);
                        }}
                      >
                        취소
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        신청하기
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground text-center pt-2">
                      * 신청 후 담당자가 초기 상담을 위해 연락드립니다 (영업일 기준 1-2일 이내)
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 문의 정보 */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4 text-lg">
            궁금한 점이 있으신가요? 언제든지 연락주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:jshaworkshop@gmail.com"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <Mail className="w-5 h-5" />
              jshaworkshop@gmail.com
            </a>
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <a
              href="tel:010-4002-1094"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <Phone className="w-5 h-5" />
              010-4002-1094
            </a>
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <a
              href="https://open.kakao.com/o/slxvcj1h"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              카카오톡 문의
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
