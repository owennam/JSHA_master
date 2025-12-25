import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { logCustomEvent } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder, OrderInfo } from "@/lib/firestore";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const PaymentSuccessPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [isConfirming, setIsConfirming] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [paymentInfo, setPaymentInfo] = useState<any>(null);
	const [firestoreWarning, setFirestoreWarning] = useState(false);

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

				// Firestore에 주문 정보 저장
				if (user) {
					console.log("🔍 [DEBUG] Attempting to save order to Firestore...");
					console.log("🔍 [DEBUG] User authenticated:", {
						uid: user.uid,
						email: user.email,
						isAuthenticated: !!user
					});

					try {
						const orderData: OrderInfo = {
							orderId: result.data.orderId,
							userId: user.uid,
							paymentKey: paymentKey!,
							productName: result.data.orderName || "주문 상품",
							amount: result.data.totalAmount,
							customerName: customerName || "",
							customerEmail: customerEmail || "",
							customerPhone: customerPhone || "",
							address: address || "",
							addressDetail: addressDetail || "",
							postalCode: postalCode || "",
							status: 'completed',
							createdAt: new Date().toISOString(),
						};

						console.log("🔍 [DEBUG] Order data to save:", orderData);
						await createOrder(orderData);
						console.log("✅ Order saved to Firestore successfully:", result.data.orderId);
					} catch (firestoreError: any) {
						console.error("❌ Firestore 저장 실패 (결제는 성공)");
						console.error("🔍 [DEBUG] Error details:", {
							name: firestoreError?.name,
							code: firestoreError?.code,
							message: firestoreError?.message,
							stack: firestoreError?.stack
						});

						// 에러 타입 분석
						if (firestoreError?.message?.includes('Missing or insufficient permissions')) {
							console.error("🚫 Firestore 권한 문제 - Security Rules 확인 필요");
						} else if (firestoreError?.message?.includes('not initialized')) {
							console.error("🚫 Firestore 초기화 실패");
						} else {
							console.error("🚫 광고 차단기 또는 네트워크 문제일 가능성");
						}

						setFirestoreWarning(true);
					}
				} else {
					console.warn("⚠️ User not authenticated - skipping Firestore save");
				}

				setIsConfirming(false);

				// 다음 주문을 위해 고객 정보 저장 (자동 입력용)
				if (customerName && customerEmail && customerPhone && address) {
					const savedProfile = {
						name: customerName,
						email: customerEmail,
						phone: customerPhone,
						address: address,
						addressDetail: addressDetail || "",
						postalCode: postalCode || "",
					};
					localStorage.setItem("jsha_saved_customer_profile", JSON.stringify(savedProfile));
				}

				// 결제 성공 시 장바구니 및 폼 데이터 초기화
				localStorage.removeItem("jsha_cart");
				localStorage.removeItem("jsha_customer_info");

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
				<main className="flex-1 container mx-auto px-4 pt-40 pb-16">
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
				<main className="flex-1 container mx-auto px-4 pt-40 pb-16">
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

			<main className="flex-1 container mx-auto px-4 pt-40 pb-16">
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

							{firestoreWarning && (
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
									<div className="flex items-start gap-3">
										<AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
										<div className="flex-1">
											<h4 className="font-semibold text-blue-900 mb-1">알림</h4>
											<p className="text-sm text-blue-800">
												결제가 정상적으로 완료되었습니다. 주문 내역은 '내 주문' 페이지에서 확인하실 수 있습니다.
											</p>
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
