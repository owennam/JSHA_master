import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders, OrderInfo, requestCancelOrder } from "@/lib/firestore";
import { Loader2, Package, ShoppingBag, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// 날짜 파싱 헬퍼 함수 (Firestore ISO 형식 & Google Sheets 한글 형식 모두 지원)
const parseOrderDate = (dateString: string): Date => {
  if (!dateString) {
    return new Date();
  }

  // ISO 형식 시도 (Firestore)
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  // 한글 형식 파싱 시도 (Google Sheets: "2025. 12. 25. 오후 9:37:27")
  try {
    // "2025. 12. 25. 오후 9:37:27" -> "2025-12-25 21:37:27" 변환
    const koreanDateRegex = /(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.\s*(오전|오후)\s*(\d{1,2}):(\d{1,2}):(\d{1,2})/;
    const match = dateString.match(koreanDateRegex);

    if (match) {
      const [, year, month, day, ampm, hour, minute, second] = match;
      let hours = parseInt(hour);

      // 오후/오전 처리
      if (ampm === '오후' && hours !== 12) hours += 12;
      if (ampm === '오전' && hours === 12) hours = 0;

      const parsedDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hours,
        parseInt(minute),
        parseInt(second)
      );

      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  } catch (e) {
    console.error('Failed to parse Korean date format:', e);
  }

  // 파싱 실패 시 현재 시각 반환
  console.warn('Failed to parse date:', dateString);
  return new Date();
};

const MyOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'firestore' | 'backend'>('firestore');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderInfo | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    // 비로그인 사용자 리다이렉트
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchOrders = async () => {
      try {
        // 먼저 Firestore에서 주문 내역 가져오기 시도
        const userOrders = await getUserOrders(user.uid);

        if (userOrders && userOrders.length > 0) {
          setOrders(userOrders);
          setDataSource('firestore');
        } else {
          // Firestore가 비어있거나 차단된 경우 백엔드 API 사용 (광고 차단기 우회)
          console.log("Firestore empty or blocked, trying backend API...");
          await fetchOrdersFromBackend();
        }
      } catch (error) {
        console.error("Failed to fetch orders from Firestore:", error);
        // Firestore 실패 시 백엔드 API로 폴백
        await fetchOrdersFromBackend();
      } finally {
        setLoading(false);
      }
    };

    const fetchOrdersFromBackend = async () => {
      try {
        if (!SERVER_URL || !user.email) {
          console.error("Server URL or user email not available");
          return;
        }

        const response = await fetch(`${SERVER_URL}/api/user/orders?email=${encodeURIComponent(user.email)}`);
        const result = await response.json();

        if (result.success && result.data) {
          setOrders(result.data);
          setDataSource('backend');
          console.log(`✅ Loaded ${result.data.length} orders from backend API`);
        }
      } catch (error) {
        console.error("Failed to fetch orders from backend:", error);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleCancelRequest = (order: OrderInfo) => {
    setSelectedOrder(order);
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const submitCancelRequest = async () => {
    if (!user || !selectedOrder) return;

    if (!cancelReason.trim()) {
      toast({
        title: "취소 사유를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    setIsCanceling(true);

    try {
      await requestCancelOrder(user.uid, selectedOrder.orderId, cancelReason);

      toast({
        title: "취소 요청 완료",
        description: "관리자 확인 후 환불 처리됩니다.",
      });

      // 주문 목록 새로고침
      const updatedOrders = orders.map(order =>
        order.orderId === selectedOrder.orderId
          ? { ...order, status: 'cancel_requested' as const, cancelReason, cancelRequestedAt: new Date().toISOString() }
          : order
      );
      setOrders(updatedOrders);

      setCancelDialogOpen(false);
      setSelectedOrder(null);
      setCancelReason("");
    } catch (error: any) {
      console.error("Failed to request cancellation:", error);
      toast({
        title: "취소 요청 실패",
        description: error.message || "다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">결제 완료</Badge>;
      case "cancel_requested":
        return <Badge variant="secondary">취소 요청됨</Badge>;
      case "canceled":
        return <Badge variant="destructive">취소 완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "cancel_requested":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "canceled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 pt-32 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">내 주문 내역</h1>
            <p className="text-muted-foreground">
              과거 주문 내역과 배송 상태를 확인하실 수 있습니다.
            </p>
          </div>

          {!orders || orders.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">주문 내역이 없습니다</h3>
                <p className="text-muted-foreground mb-6">
                  아직 구매하신 상품이 없습니다.
                </p>
                <Button onClick={() => navigate("/products")}>
                  쇼핑하러 가기
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.orderId} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{format(parseOrderDate(order.createdAt), "yyyy. MM. dd (EEE) HH:mm", { locale: ko })}</span>
                          <span>•</span>
                          <span>주문번호 {order.orderId}</span>
                        </div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="w-5 h-5 text-primary" />
                          {order.productName}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                        {order.status === "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelRequest(order)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            취소 요청
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">받는 분 정보</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>{order.customerName}</p>
                            <p>{order.customerPhone}</p>
                            <p>{order.address} {order.addressDetail}</p>
                            <p>({order.postalCode})</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">결제 정보</h4>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">결제 금액</span>
                            <span className="font-bold">{order.amount.toLocaleString()}원</span>
                          </div>
                          {order.cancelReason && (
                            <div className="mt-4 p-3 bg-red-50 text-red-800 rounded text-sm">
                              <span className="font-semibold">취소 사유:</span> {order.cancelReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* 취소 요청 다이얼로그 */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>주문 취소 요청</DialogTitle>
            <DialogDescription>
              취소 사유를 입력해주세요. 관리자 확인 후 환불 처리됩니다.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p><span className="font-semibold">주문번호:</span> {selectedOrder.orderId}</p>
                <p><span className="font-semibold">상품:</span> {selectedOrder.productName}</p>
                <p><span className="font-semibold">결제 금액:</span> {selectedOrder.amount.toLocaleString()}원</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancelReason">취소 사유 *</Label>
                <Textarea
                  id="cancelReason"
                  placeholder="취소 사유를 입력해주세요 (예: 단순 변심, 배송지 변경 등)"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-start gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                <p>취소 요청 후 관리자가 확인하면 자동으로 환불 처리됩니다.</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isCanceling}
            >
              닫기
            </Button>
            <Button
              onClick={submitCancelRequest}
              disabled={isCanceling || !cancelReason.trim()}
            >
              {isCanceling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  처리 중...
                </>
              ) : (
                "취소 요청"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrdersPage;
