import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders, OrderInfo } from "@/lib/firestore";
import { Loader2, Package, ShoppingBag, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const MyOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 비로그인 사용자 리다이렉트
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

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
                          <span>{format(new Date(order.createdAt), "yyyy. MM. dd (EEE) HH:mm", { locale: ko })}</span>
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
                        <Button variant="outline" size="sm">
                          상세보기
                        </Button>
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
    </div>
  );
};

export default MyOrdersPage;
