import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyPolicyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PrivacyPolicyModal = ({ open, onOpenChange }: PrivacyPolicyModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>개인정보 수집 및 이용 동의</DialogTitle>
                    <DialogDescription>
                        JSHA 마스터코스 서비스 이용을 위한 개인정보 처리방침입니다.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 text-sm text-muted-foreground">
                        <section>
                            <h3 className="font-semibold text-foreground mb-2">1. 수집하는 개인정보 항목</h3>
                            <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><strong>필수항목:</strong> 이름, 이메일 주소</li>
                                <li><strong>선택항목:</strong> 수료 기수, 의료기관명</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-semibold text-foreground mb-2">2. 개인정보의 수집 및 이용 목적</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>회원 가입 및 관리</li>
                                <li>서비스 제공 및 콘텐츠 접근 권한 관리</li>
                                <li>고객 문의 및 상담 응대</li>
                                <li>서비스 이용 기록 분석 및 통계</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-semibold text-foreground mb-2">3. 개인정보의 보유 및 이용 기간</h3>
                            <p>
                                회원 탈퇴 시까지 보유하며, 관계 법령에 따라 보존할 필요가 있는 경우
                                해당 법령에서 정한 기간 동안 보관합니다.
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>전자상거래법에 따른 계약 관련 기록: 5년</li>
                                <li>소비자 불만 또는 분쟁처리 기록: 3년</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-semibold text-foreground mb-2">4. 개인정보의 제3자 제공</h3>
                            <p>
                                회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
                                다만, 아래의 경우에는 예외로 합니다:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>이용자가 사전에 동의한 경우</li>
                                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-semibold text-foreground mb-2">5. 개인정보 처리의 위탁</h3>
                            <p>회사는 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><strong>Firebase (Google):</strong> 회원 인증 및 데이터 저장</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-semibold text-foreground mb-2">6. 이용자의 권리</h3>
                            <p>이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>개인정보 열람 요청</li>
                                <li>오류 정정 요청</li>
                                <li>삭제 요청</li>
                                <li>처리정지 요청</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-semibold text-foreground mb-2">7. 개인정보 보호책임자</h3>
                            <p>
                                개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
                                불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                            </p>
                            <div className="mt-2 p-3 bg-muted rounded-lg">
                                <p><strong>개인정보 보호책임자:</strong> JSHA 마스터코스</p>
                                <p><strong>이메일:</strong> jshaworkshop@gmail.com</p>
                            </div>
                        </section>

                        <section>
                            <h3 className="font-semibold text-foreground mb-2">8. 개인정보 처리방침 변경</h3>
                            <p>
                                본 개인정보 처리방침은 2026년 1월 13일부터 적용됩니다.
                                이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.
                            </p>
                        </section>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>
                        확인
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PrivacyPolicyModal;
