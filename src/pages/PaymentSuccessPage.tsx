import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { logCustomEvent } from "@/lib/firebase";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const PaymentSuccessPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [isConfirming, setIsConfirming] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [paymentInfo, setPaymentInfo] = useState<any>(null);

	// URL 파라미터에서 결제 정보 가져오기
	const paymentKey = searchParams.get("paymentKey");
	const orderId = searchParams.get("orderId");
	const amount = searchParams.get("amount");
	const customerName = searchParams.get("customerName");
	const customerEmail = searchParams.get("customerEmail");
	const customerPhone = searchParams.get("customerPhone");
	const postalCode = searchParams.get("postalCode");
	const address = searchParams.get("address");
	const addressDetail = searchParams.get("addressDetail");
	const cartItems = searchParams.get("cartItems");

	useEffect(() => {
		const confirmPayment = async () => {
			if (!paymentKey || !orderId || !amount) {
				setError("결제 정보가 올바르지 않습니다.");
				setIsConfirming(false);
				return;
			}

			if (!SERVER_URL) {
				setError("서버 URL이 설정되지 않았습니다.");
				setIsConfirming(false);
				return;
			}

			try {
				console.log("결제 승인 요청 중:", { paymentKey, orderId, amount });

				// 백엔드 서버에 결제 승인 요청 (사용자 정보 포함)
				const response = await fetch(`${SERVER_URL}/confirm-payment`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						paymentKey,
						orderId,
						amount: parseInt(amount),
						customerName,
						customerEmail,
						customerPhone,
						postalCode,
						address,
						addressDetail,
						cartItems,
					}),
				});

				const result = await response.json();

				if (!response.ok || !result.success) {
					throw new Error(result.message || "결제 승인에 실패했습니다.");
				}

				console.log("결제 승인 성공:", result.data);
				setPaymentInfo(result.data);
				setIsConfirming(false);

				// Google Analytics 구매 이벤트 로깅
				try {
					let items = [];
					if (cartItems) {
						const parsedItems = JSON.parse(cartItems);
						items = parsedItems.map((item: any) => ({
							item_id: item.id,
							item_name: item.name,
							price: item.price,
							quantity: item.quantity,
						}));
					}

					logCustomEvent.purchaseComplete(
						result.data.orderId,
						result.data.totalAmount,
						items
					);
				} catch (analyticsError) {
					console.warn("Analytics 이벤트 로깅 실패:", analyticsError);
				}
			} catch (err: any) {
				console.error("결제 승인 오류:", err);
				setError(err.message || "결제 승인 중 오류가 발생했습니다.");
				setIsConfirming(false);
			}
		};

		confirmPayment();
	}, [paymentKey, orderId, amount, cartItems]);

	if (isConfirming) {
		return (
			<div className="min-h-screen flex flex-col bg-background">
				<Header />
				<main className="flex-1 container mx-auto px-4 py-16">
					<Card className="max-w-2xl mx-auto">
						<CardContent className="py-20 flex flex-col items-center justify-center">
							<Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
							<p className="text-lg font-medium mb-2">결제를 확인하고 있습니다</p>
							<p className="text-sm text-muted-foreground">잠시만 기다려주세요...</p>
						</CardContent>
					</Card>
				</main>
				<Footer />
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex flex-col bg-background">
				<Header />
				<main className="flex-1 container mx-auto px-4 py-16">
					<Card className="max-w-2xl mx-auto">
						<CardHeader>
							<CardTitle className="text-red-500 text-center">
								결제 승인 실패
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center">
							<p className="mb-6 text-muted-foreground">{error}</p>
							<div className="space-x-4">
								<Button onClick={() => navigate("/products")}>
									제품 페이지로
								</Button>
								<Button variant="outline" onClick={() => navigate("/")}>
									홈으로
								</Button>
							</div>
						</CardContent>
					</Card>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<Header />

			<main className="flex-1 container mx-auto px-4 py-16">
				<div className="max-w-2xl mx-auto">
					<Card className="text-center">
						<CardContent className="pt-12 pb-8">
							<div className="flex justify-center mb-6">
								<CheckCircle2 className="w-20 h-20 text-green-500" />
							</div>

							<h1 className="text-3xl font-bold text-foreground mb-2">
								결제가 완료되었습니다!
							</h1>
							<p className="text-muted-foreground mb-8">
								주문해 주셔서 감사합니다.
							</p>

							{paymentInfo && (
								<div className="bg-accent/20 rounded-lg p-6 mb-8 text-left">
									<h3 className="font-semibold text-lg mb-4">결제 정보</h3>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-muted-foreground">주문번호</span>
											<span className="font-mono text-sm">{paymentInfo.orderId}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">상품명</span>
											<span>{paymentInfo.orderName}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">결제수단</span>
											<span>{paymentInfo.method === "카드" ? "신용카드" : paymentInfo.method}</span>
										</div>
										<div className="flex justify-between items-center pt-3 border-t">
											<span className="text-lg font-semibold">결제 금액</span>
											<span className="text-2xl font-bold text-primary">
												{paymentInfo.totalAmount?.toLocaleString()}원
											</span>
										</div>
									</div>
								</div>
							)}

							<div className="space-y-3">
								<Button
									onClick={() => navigate("/products")}
									className="w-full"
									size="lg"
								>
									계속 쇼핑하기
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

							<p className="text-sm text-muted-foreground mt-6">
								결제 내역은 이메일로 전송되었습니다.
							</p>
						</CardContent>
					</Card>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default PaymentSuccessPage;
