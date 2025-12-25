import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  RefreshCw,
  ShoppingBag,
  Calendar,
  DollarSign,
  User,
  Ban,
  CheckCircle,
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
import { OrderInfo, updateOrderStatus } from "@/lib/firestore";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const AdminOrdersPage = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // 취소 다이얼로그 상태
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderInfo | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('admin_token');

      const response = await fetch(`${API_URL}/api/admin/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders from backend');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to load orders');
      }

      setOrders(result.data || []);
    } catch (error: any) {
      console.error("Failed to load orders:", error);
      toast({
        title: "주문 목록 로드 실패",
        description: error.message || "주문 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelClick = (order: OrderInfo) => {
    setSelectedOrder(order);
    setCancelReason("");
    setIsCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedOrder || !cancelReason.trim()) {
      toast({
        title: "취소 사유 입력 필요",
        description: "취소 사유를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setCancelingOrderId(selectedOrder.orderId);
    try {
      // 1. Toss Payments 취소 (서버 경유 - 보안상 필요)
      // Toss 취소 API는 Secret Key가 필요하므로 백엔드 호출 유지
      const API_URL = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('admin_token');

      const response = await fetch(`${API_URL}/api/admin/cancel-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentKey: selectedOrder.paymentKey,
          cancelReason: cancelReason,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || '토스 결제 취소 실패');
      }

      // 2. Firestore 상태 업데이트 (관리자가 직접 취소 완료 처리)
      if (selectedOrder.userId) {
        try {
          await updateOrderStatus(selectedOrder.userId, selectedOrder.orderId, 'canceled', {
            cancelReason: cancelReason,
            canceledAt: new Date().toISOString(),
          });
          console.log('✅ Firestore order status updated to canceled');
        } catch (firestoreError) {
          console.error('⚠️ Firestore 업데이트 실패 (취소는 성공):', firestoreError);
        }
      }

      toast({
        title: "결제 취소 완료",
        description: `주문번호 ${selectedOrder.orderId}이(가) 취소되었습니다.`,
      });

      setIsCancelDialogOpen(false);
      setSelectedOrder(null);
      setCancelReason("");

      // 주문 목록 새로고침
      await loadOrders();
    } catch (error: any) {
      console.error("Failed to cancel payment:", error);
      toast({
        title: "결제 취소 실패",
        description: error.message || "결제를 취소하는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setCancelingOrderId(null);
    }
  };

  // 상태별 필터링
  const getFilteredOrders = () => {
    if (statusFilter === "all") return orders;
    return orders.filter(order => order.status === statusFilter);
  };

  const filteredOrders = getFilteredOrders();

  // 상태별 카운트
  const statusCounts = {
    all: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancel_requested: orders.filter(o => o.status === 'cancel_requested').length,
    canceled: orders.filter(o => o.status === 'canceled').length,
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />결제 완료</Badge>;
      case 'cancel_requested':
        return <Badge className="bg-orange-500 hover:bg-orange-600"><Ban className="w-3 h-3 mr-1" />취소 요청됨</Badge>;
      case 'canceled':
        return <Badge variant="destructive"><Ban className="w-3 h-3 mr-1" />환불 완료</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">주문 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">주문 관리</h1>
          <p className="text-muted-foreground">
            결제된 주문을 관리하고 환불 처리할 수 있습니다
          </p>
        </div>
        <Button onClick={loadOrders} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 주문</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              전체 주문 건수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.reduce((sum, order) => {
                // completed 상태인 주문만 집계
                if (order.status === 'completed') {
                  return sum + (order.amount || 0);
                }
                return sum;
              }, 0).toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground">
              총 결제 금액
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">취소 주문</CardTitle>
            <Ban className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'cancel_requested' || o.status === 'canceled').length}
            </div>
            <p className="text-xs text-muted-foreground">
              취소된 주문 건수
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 주문 목록 - Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            전체 ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="completed">
            결제 완료 ({statusCounts.completed})
          </TabsTrigger>
          <TabsTrigger value="cancel_requested">
            취소 요청 ({statusCounts.cancel_requested})
          </TabsTrigger>
          <TabsTrigger value="canceled">
            환불 완료 ({statusCounts.canceled})
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-0">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">주문 내역이 없습니다</p>
                <p className="text-xs text-muted-foreground text-center">
                  {statusFilter === "all"
                    ? "Firestore로 마이그레이션된 이후의 주문만 표시됩니다."
                    : "해당 상태의 주문이 없습니다."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">상태</TableHead>
                    <TableHead>주문번호</TableHead>
                    <TableHead>상품명</TableHead>
                    <TableHead>고객명</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>주문일시</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {order.orderId.replace('ORDER_', '')}
                      </TableCell>
                      <TableCell className="font-medium">{order.productName}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell className="text-xs">{order.customerPhone}</TableCell>
                      <TableCell className="font-semibold">{order.amount.toLocaleString()}원</TableCell>
                      <TableCell className="text-xs">
                        {order.createdAt && !isNaN(new Date(order.createdAt).getTime())
                          ? format(new Date(order.createdAt), "yyyy.MM.dd HH:mm", { locale: ko })
                          : order.createdAt || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === 'cancel_requested' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelClick(order)}
                            disabled={cancelingOrderId === order.orderId}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            {cancelingOrderId === order.orderId ? '처리중...' : '환불 처리'}
                          </Button>
                        )}
                        {order.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelClick(order)}
                            disabled={cancelingOrderId === order.orderId}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            {cancelingOrderId === order.orderId ? '처리중...' : '환불'}
                          </Button>
                        )}
                        {order.status === 'canceled' && (
                          <Badge variant="secondary">완료</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* 취소 확인 다이얼로그 */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>결제 취소 확인</DialogTitle>
            <DialogDescription>
              이 주문을 취소하시겠습니까? 취소 후에는 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                <p><strong>주문번호:</strong> {selectedOrder.orderId}</p>
                <p><strong>상품명:</strong> {selectedOrder.productName}</p>
                <p><strong>금액:</strong> {selectedOrder.amount}</p>
                <p><strong>고객명:</strong> {selectedOrder.customerName}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancelReason">취소 사유 *</Label>
                <Input
                  id="cancelReason"
                  placeholder="예: 고객 변심, 상품 불량 등"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={!cancelReason.trim() || cancelingOrderId !== null}
            >
              환불 처리
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrdersPage;
