import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserOrders,
  requestCancelOrder,
  OrderInfo,
} from "@/lib/firestore";
import {
  RefreshCw,
  ShoppingBag,
  Calendar,
  DollarSign,
  MapPin,
  Ban,
  CheckCircle,
  Clock,
  Package,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingCancelOrderId, setRequestingCancelOrderId] = useState<string | null>(null);

  // 취소 요청 다이얼로그 상태
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderInfo | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const loadOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userOrders = await getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast({
        title: "주문 목록 로드 실패",
        description: "주문 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    loadOrders();
  }, [user]);

  const handleCancelRequestClick = (order: OrderInfo) => {
    setSelectedOrder(order);
    setCancelReason("");
    setIsCancelDialogOpen(true);
  };

  const handleCancelRequestConfirm = async () => {
    if (!selectedOrder || !cancelReason.trim() || !user) {
      toast({
        title: "취소 사유 입력 필요",
        description: "취소 사유를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setRequestingCancelOrderId(selectedOrder.orderId);
    try {
      await requestCancelOrder(user.uid, selectedOrder.orderId, cancelReason);

      toast({
        title: "취소 요청 완료",
        description: "관리자가 확인 후 환불 처리됩니다.",
      });

      setIsCancelDialogOpen(false);
      setSelectedOrder(null);
      setCancelReason("");

      // 주문 목록 새로고침
      await loadOrders();
    } catch (error: any) {
      console.error("Failed to request cancel:", error);
      toast({
        title: "취소 요청 실패",
        description: error.message || "취소 요청 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setRequestingCancelOrderId(null);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'canceled':
        return <Badge variant="destructive"><Ban className="w-3 h-3 mr-1" />취소됨</Badge>;
      case 'cancel_requested':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />취소 요청됨</Badge>;
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-40 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">주문 목록을 불러오는 중...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer showBusinessInfo={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-40 pb-20">
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">주문 내역</h1>
                <p className="text-muted-foreground mt-2">
                  구매하신 상품을 확인하고 취소 요청할 수 있습니다
                </p>
              </div>
              <Button onClick={loadOrders} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </Button>
            </div>

            {/* 주문 목록 */}
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-xl font-semibold mb-2">주문 내역이 없습니다</p>
                    <p className="text-muted-foreground mb-6">
                      아직 구매하신 상품이 없어요
                    </p>
                    <Button onClick={() => navigate("/products")}>
                      <Package className="w-4 h-4 mr-2" />
                      상품 둘러보기
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.orderId} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{order.productName}</CardTitle>
                          <CardDescription className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </CardDescription>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">결제 금액</p>
                          <p className="text-2xl font-bold flex items-center gap-1">
                            <DollarSign className="w-5 h-5" />
                            {order.amount.toLocaleString()}원
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">배송지</p>
                          <p className="text-sm flex items-start gap-1">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              ({order.postalCode}) {order.address} {order.addressDetail}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground pt-3 border-t">
                        <p>주문번호: {order.orderId}</p>
                        {order.cancelRequestedAt && (
                          <p className="text-amber-600 font-medium mt-1">
                            취소 요청일: {new Date(order.cancelRequestedAt).toLocaleDateString('ko-KR')}
                          </p>
                        )}
                        {order.canceledAt && (
                          <p className="text-red-600 font-medium mt-1">
                            취소 완료일: {new Date(order.canceledAt).toLocaleDateString('ko-KR')}
                          </p>
                        )}
                      </div>

                      {order.status === 'completed' && (
                        <div className="flex gap-2 pt-3 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelRequestClick(order)}
                            disabled={requestingCancelOrderId === order.orderId}
                            className="flex-1"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            {requestingCancelOrderId === order.orderId ? '요청 중...' : '취소 요청'}
                          </Button>
                        </div>
                      )}

                      {order.status === 'cancel_requested' && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-900">
                            <strong>취소 요청 사유:</strong> {order.cancelReason}
                          </p>
                          <p className="text-sm text-amber-700 mt-2">
                            관리자가 확인 중입니다. 승인 후 환불이 진행됩니다.
                          </p>
                        </div>
                      )}

                      {order.status === 'canceled' && order.cancelReason && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-900">
                            <strong>취소 사유:</strong> {order.cancelReason}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer showBusinessInfo={true} />

      {/* 취소 요청 다이얼로그 */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>주문 취소 요청</DialogTitle>
            <DialogDescription>
              관리자가 확인 후 환불 처리됩니다. 취소 사유를 입력해주세요.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                <p><strong>상품명:</strong> {selectedOrder.productName}</p>
                <p><strong>금액:</strong> {selectedOrder.amount.toLocaleString()}원</p>
                <p><strong>주문번호:</strong> {selectedOrder.orderId}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancelReason">취소 사유 *</Label>
                <Input
                  id="cancelReason"
                  placeholder="예: 단순 변심, 상품 불만족 등"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  관리자가 확인 후 1-3 영업일 내에 환불 처리됩니다.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              닫기
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelRequestConfirm}
              disabled={!cancelReason.trim() || requestingCancelOrderId !== null}
            >
              취소 요청하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrdersPage;
