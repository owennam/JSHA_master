import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentFailPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const errorCode = searchParams.get("code");
	const errorMessage = searchParams.get("message");

	const getErrorMessage = (code: string | null) => {
		const errorMessages: Record<string, string> = {
			PAY_PROCESS_CANCELED: "사용자가 결제를 취소했습니다.",
			PAY_PROCESS_ABORTED: "결제 프로세스가 중단되었습니다.",
			REJECT_CARD_COMPANY: "카드사에서 승인을 거절했습니다.",
			EXCEED_MAX_CARD_INSTALL_PLAN: "할부 개월 수가 초과되었습니다.",
			INVALID_CARD_EXPIRATION: "카드 유효기간이 만료되었습니다.",
			INVALID_STOPPED_CARD: "정지된 카드입니다.",
			INVALID_ACCOUNT_INFO_RE_REGISTER: "계좌 정보가 올바르지 않습니다.",
			NOT_AVAILABLE_PAYMENT: "사용할 수 없는 결제 수단입니다.",
		};

		return code ? errorMessages[code] || errorMessage || "알 수 없는 오류가 발생했습니다." : errorMessage || "결제에 실패했습니다.";
	};

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<Header />

			<main className="flex-1 container mx-auto px-4 py-16">
				<div className="max-w-2xl mx-auto">
					<Card className="text-center">
						<CardHeader>
							<div className="flex justify-center mb-4">
								<XCircle className="w-20 h-20 text-red-500" />
							</div>
							<CardTitle className="text-3xl font-bold text-foreground">
								결제 실패
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-8 text-lg">
								{getErrorMessage(errorCode)}
							</p>

							{errorCode && (
								<div className="bg-accent/20 rounded-lg p-4 mb-8 text-left">
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-muted-foreground text-sm">오류 코드</span>
											<span className="font-mono text-sm">{errorCode}</span>
										</div>
										{errorMessage && (
											<div className="flex justify-between">
												<span className="text-muted-foreground text-sm">상세 메시지</span>
												<span className="text-sm">{errorMessage}</span>
											</div>
										)}
									</div>
								</div>
							)}

							<div className="space-y-3">
								<Button
									onClick={() => navigate("/products")}
									className="w-full"
									size="lg"
								>
									다시 시도하기
								</Button>
								<Button
									onClick={() => navigate("/")}
									variant="outline"
									className="w-full"
									size="lg"
								>
									홈으로 돌아가기
								</Button>
							</div>

							<div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
								<p className="text-sm text-blue-800 dark:text-blue-200">
									<strong>결제가 계속 실패하시나요?</strong>
								</p>
								<ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 text-left">
									<li>• 카드 한도를 확인해주세요</li>
									<li>• 카드 정보가 정확한지 확인해주세요</li>
									<li>• 다른 결제 수단을 이용해보세요</li>
									<li>• 문제가 지속되면 고객센터로 문의해주세요</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default PaymentFailPage;
