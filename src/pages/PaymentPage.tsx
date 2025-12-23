import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;

const PaymentPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const paymentWidgetRef = useRef<any>(null);
	const [mounted, setMounted] = useState(false);

	// 로그인한 사용자의 uid를 customerKey로 사용, 없으면 ANONYMOUS
	const customerKey = user?.uid || "ANONYMOUS";

	// URL 파라미터에서 주문 정보 가져오기
	const orderInfo = {
		productName: searchParams.get("productName") || "JSHA 인솔",
		amount: parseInt(searchParams.get("amount") || "0"),
		orderId: searchParams.get("orderId") || `ORDER_${Date.now()}`,
		customerName: searchParams.get("customerName") || "구매자",
		customerEmail: searchParams.get("customerEmail") || "",
		customerPhone: searchParams.get("customerPhone") || "",
		postalCode: searchParams.get("postalCode") || "",
		address: searchParams.get("address") || "",
		addressDetail: searchParams.get("addressDetail") || "",
		cartItems: searchParams.get("cartItems") || "[]",
	};

	// 컴포넌트가 마운트되었음을 표시
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const initPaymentWidget = async () => {
			try {
				console.log("결제 위젯 초기화 시작:", { clientKey, customerKey, amount: orderInfo.amount });

				// 필수 환경 변수 확인
				if (!clientKey) {
					throw new Error("Toss Payments 클라이언트 키가 설정되지 않았습니다.");
				}

				if (!customerKey) {
					throw new Error("고객 키가 설정되지 않았습니다.");
				}

				// DOM이 완전히 렌더링될 때까지 대기
				await new Promise(resolve => setTimeout(resolve, 300));

				// DOM 요소 확인
				const paymentMethodElement = document.querySelector("#payment-method");
				const agreementElement = document.querySelector("#agreement");

				console.log("DOM 요소 찾기:", { paymentMethodElement, agreementElement });

				if (!paymentMethodElement || !agreementElement) {
					throw new Error("결제 UI를 렌더링할 요소를 찾을 수 없습니다.");
				}

				console.log("DOM 요소 확인 완료");

				// TossPayments SDK 로드
				const tossPayments = await loadTossPayments(clientKey);
				console.log("TossPayments 로드 완료");

				// 결제위젯 초기화
				const paymentWidget = tossPayments.widgets({
					customerKey,
				});
				console.log("Payment Widget 생성 완료");

				paymentWidgetRef.current = paymentWidget;

				// 결제 금액 설정 (반드시 렌더링 전에 호출)
				await paymentWidget.setAmount({
					currency: "KRW",
					value: orderInfo.amount,
				});
				console.log("결제 금액 설정 완료");

				// 결제 UI 렌더링
				await paymentWidget.renderPaymentMethods({
					selector: "#payment-method",
					variantKey: "DEFAULT",
				});
				console.log("결제 UI 렌더링 완료");

				// 이용약관 UI 렌더링
				await paymentWidget.renderAgreement({
					selector: "#agreement",
					variantKey: "AGREEMENT",
				});
				console.log("약관 UI 렌더링 완료");

				setIsReady(true);
			} catch (err: any) {
				console.error("결제 위젯 초기화 실패:", err);
				setError(err.message || "결제 위젯을 불러오는데 실패했습니다.");
			}
		};

		if (orderInfo.amount > 0) {
			initPaymentWidget();
		} else {
			console.error("결제 금액 오류:", orderInfo.amount);
			setError("결제 금액이 올바르지 않습니다.");
		}
	}, [mounted, orderInfo.amount]);

	const handlePayment = async () => {
		try {
			if (!paymentWidgetRef.current) {
				throw new Error("결제 위젯이 초기화되지 않았습니다.");
			}

			// 전화번호에서 숫자만 추출
			const phoneNumber = orderInfo.customerPhone.replace(/[^0-9]/g, "");

			// 결제 요청 (successUrl에 사용자 정보 포함)
			const successUrl = new URL(`${window.location.origin}/payment/success`);
			successUrl.searchParams.set('customerName', orderInfo.customerName);
			successUrl.searchParams.set('customerEmail', orderInfo.customerEmail);
			successUrl.searchParams.set('customerPhone', orderInfo.customerPhone);
			successUrl.searchParams.set('postalCode', orderInfo.postalCode);
			successUrl.searchParams.set('address', orderInfo.address);
			successUrl.searchParams.set('addressDetail', orderInfo.addressDetail);
			successUrl.searchParams.set('cartItems', orderInfo.cartItems);

			await paymentWidgetRef.current.requestPayment({
				orderId: orderInfo.orderId,
				orderName: orderInfo.productName,
				successUrl: successUrl.toString(),
				failUrl: `${window.location.origin}/payment/fail`,
				customerEmail: orderInfo.customerEmail,
				customerName: orderInfo.customerName,
				customerMobilePhone: phoneNumber,
			});
		} catch (err: any) {
			console.error("결제 요청 실패:", err);
			if (err.code === "USER_CANCEL") {
				// 사용자가 결제를 취소한 경우
				navigate("/products");
			}
		}
	};

	if (error) {
		return (
			<div className="min-h-screen flex flex-col bg-background">
				<Header />
				<main className="flex-1 container mx-auto px-4 py-16">
					<Card className="max-w-2xl mx-auto">
						<CardHeader>
							<CardTitle className="text-red-500">오류가 발생했습니다</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">{error}</p>
							<Button onClick={() => navigate("/products")}>
								제품 페이지로 돌아가기
							</Button>
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
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-foreground mb-2">결제하기</h1>
						<p className="text-muted-foreground">안전한 결제를 진행합니다</p>
					</div>

					{/* 주문 정보 */}
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>주문 정보</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex justify-between">
								<span className="text-muted-foreground">상품명</span>
								<span className="font-medium">{orderInfo.productName}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">주문번호</span>
								<span className="font-mono text-sm">{orderInfo.orderId}</span>
							</div>
							<div className="flex justify-between items-center pt-4 border-t">
								<span className="text-lg font-semibold">결제 금액</span>
								<span className="text-2xl font-bold text-primary">
									{orderInfo.amount.toLocaleString()}원
								</span>
							</div>
						</CardContent>
					</Card>

					{/* 결제 수단 선택 - 항상 렌더링 */}
					<Card className="mb-4">
						<CardHeader>
							<CardTitle>결제 수단 선택</CardTitle>
						</CardHeader>
						<CardContent>
							{!isReady ? (
								<div className="py-20 flex flex-col items-center justify-center">
									<Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
									<p className="text-muted-foreground">결제 정보를 불러오는 중...</p>
								</div>
							) : null}
							<div id="payment-method" />
						</CardContent>
					</Card>

					{/* 약관 동의 */}
					<Card className="mb-6">
						<CardContent className="pt-6">
							<div id="agreement" />
						</CardContent>
					</Card>

					{/* 결제 버튼 */}
					<Button
						onClick={handlePayment}
						className="w-full bg-primary hover:bg-primary/90"
						size="lg"
						disabled={!isReady}
					>
						{orderInfo.amount.toLocaleString()}원 결제하기
					</Button>

					<p className="text-sm text-muted-foreground text-center mt-4">
						* 안전한 결제를 위해 토스페이먼츠를 이용합니다
					</p>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default PaymentPage;
