import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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

    // 이미 취소 요청된 경우, 요청 사유를 기본값으로 채워주면 좋음
    if (order.status === 'cancel_requested' && order.cancelReason) {
      setCancelReason(order.cancelReason);
    } else {
      setCancelReason("");
    }

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
        } catch (firestoreError) {
          console.error('⚠️ Firestore 업데이트 실패 (취소는 성공):', firestoreError);
        }
      }

      toast({
        title: "환불 처리 완료",
        description: `주문번호 ${selectedOrder.orderId}의 환불이 완료되었습니다.`,
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
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 font-normal">결제 완료</Badge>;
      case 'cancel_requested':
        return <Badge className="bg-orange-500 hover:bg-orange-600 font-normal animate-pulse">취소 접수</Badge>;
      case 'canceled':
        return <Badge variant="secondary" className="bg-slate-200 text-slate-600 hover:bg-slate-300 font-normal">환불 완료</Badge>;
      default:
        return <Badge variant="outline" className="font-normal">{status}</Badge>;
    }
  };

  // 유틸리티: 전화번호 포맷팅
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '-';
    // 숫자만 추출
    const cleaned = phone.replace(/[^0-9]/g, '');

    // 01012345678 -> 010-1234-5678
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 0101234567 -> 010-123-4567 (옛날 번호)
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    // 0212345678 -> 02-1234-5678
    if (cleaned.length < 10 && cleaned.startsWith('02')) {
      if (cleaned.length === 9) return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
      if (cleaned.length === 10) return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }

    return phone;
  };

  // 유틸리티: 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';

    // 이미 깔끔한 포맷이면 그대로 (단, 줄바꿈은 제거)
    // 하지만 통일성을 위해 재파싱 시도
    let timestamp = 0;
    const time = new Date(dateStr).getTime();
    if (!isNaN(time)) {
      timestamp = time;
    } else {
      // 비표준 포맷 파싱 (YYYY.MM.DD...)
      try {
        const refined = dateStr.replace(/[\.\-\n]/g, ' ').replace(/오전|오후/g, '').trim();
        const matches = refined.match(/(\d{4})\s*(\d{1,2})\s*(\d{1,2})(?:\s*(\d{1,2}))?(?:\s*(\d{1,2}))?/);
        if (matches) {
          const y = parseInt(matches[1]);
          const m = parseInt(matches[2]) - 1;
          const d = parseInt(matches[3]);
          let h = matches[4] ? parseInt(matches[4]) : 0;
          const min = matches[5] ? parseInt(matches[5]) : 0;

          if (dateStr.includes('오후') && h < 12) h += 12;
          if (dateStr.includes('오전') && h === 12) h = 0;

          timestamp = new Date(y, m, d, h, min).getTime();
        }
      } catch (e) {
        // ignore
      }
    }

    if (timestamp > 0) {
      const date = new Date(timestamp);
      // 포맷: 2025. 12. 25. 14:30
      return `${date.getFullYear()}. ${(date.getMonth() + 1).toString().padStart(2, '0')}. ${date.getDate().toString().padStart(2, '0')}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    return dateStr; // 파싱 실패 시 원본
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">주문 관리</h1>
          <p className="text-muted-foreground text-sm mt-1">
            전체 주문 내역을 확인하고 관리합니다.
          </p>
        </div>
        <Button onClick={loadOrders} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 통계 카드 (간소화) */}
      <div className="grid grid-cols-4 gap-4">
        <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">총 주문</div>
          <div className="text-2xl font-bold text-slate-900">{orders.length}</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">총 매출</div>
          <div className="text-2xl font-bold text-blue-600">
            {orders.reduce((sum, order) => {
              if (order.status === 'completed') return sum + (order.amount || 0);
              return sum;
            }, 0).toLocaleString()}원
          </div>
        </div>
        <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">취소 접수</div>
          <div className="text-2xl font-bold text-orange-500">
            {statusCounts.cancel_requested}
          </div>
        </div>
        <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">환불 완료</div>
          <div className="text-2xl font-bold text-slate-600">
            {statusCounts.canceled}
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg shadow-sm bg-white overflow-hidden">
        {/* 탭 헤더 */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 p-1 gap-1">
          {[
            { key: 'all', label: '전체 목록', count: statusCounts.all },
            { key: 'completed', label: '결제 완료', count: statusCounts.completed },
            { key: 'cancel_requested', label: '취소 접수', count: statusCounts.cancel_requested },
            { key: 'canceled', label: '환불 완료', count: statusCounts.canceled }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${statusFilter === tab.key
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              {tab.label}
              <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${statusFilter === tab.key ? 'bg-slate-100 text-slate-900 border border-slate-200' : 'bg-slate-200/50 text-slate-500'
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white">
              <ShoppingBag className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">조회된 주문이 없습니다</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-100/80 sticky top-0">
                <TableRow className="hover:bg-slate-100/80 border-b border-slate-200">
                  <TableHead className="w-[100px] text-center font-bold text-slate-700 border-r border-slate-200 h-10">상태</TableHead>
                  <TableHead className="text-center font-bold text-slate-700 border-r border-slate-200 h-10">주문번호</TableHead>
                  <TableHead className="text-center font-bold text-slate-700 border-r border-slate-200 h-10">상품명</TableHead>
                  <TableHead className="text-center font-bold text-slate-700 border-r border-slate-200 h-10">구매자</TableHead>
                  <TableHead className="text-center font-bold text-slate-700 border-r border-slate-200 h-10">연락처</TableHead>
                  <TableHead className="text-center font-bold text-slate-700 border-r border-slate-200 h-10">결제금액</TableHead>
                  <TableHead className="text-center font-bold text-slate-700 border-r border-slate-200 h-10">주문일시</TableHead>
                  <TableHead className="text-center font-bold text-slate-700 h-10">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.orderId} className="hover:bg-slate-50/80 border-b border-slate-100 last:border-0 transition-colors">
                    <TableCell className="text-center border-r border-slate-100 p-2">
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-center border-r border-slate-100 p-2 font-mono text-xs text-slate-500">
                      {order.orderId.replace('ORDER_', '')}
                    </TableCell>
                    <TableCell className="border-r border-slate-100 p-2">
                      <div className="font-medium text-slate-900 text-sm truncate max-w-[200px] mx-auto text-center" title={order.productName}>
                        {order.productName}
                      </div>
                    </TableCell>
                    <TableCell className="text-center border-r border-slate-100 p-2">
                      <div className="font-medium text-sm text-slate-900">{order.customerName}</div>
                    </TableCell>
                    <TableCell className="text-center border-r border-slate-100 p-2 text-xs text-slate-500">
                      {formatPhoneNumber(order.customerPhone)}
                    </TableCell>
                    <TableCell className="text-center border-r border-slate-100 p-2 font-bold text-slate-900 text-sm">
                      {order.amount.toLocaleString()}원
                    </TableCell>
                    <TableCell className="text-center border-r border-slate-100 p-2 text-xs text-slate-500">
                      <div className="flex flex-col items-center">
                        <span>{order.createdAt && !isNaN(new Date(order.createdAt).getTime())
                          ? format(new Date(order.createdAt), "yyyy.MM.dd", { locale: ko })
                          : order.createdAt || '-'}</span>
                        <span className="text-slate-400">{order.createdAt && !isNaN(new Date(order.createdAt).getTime())
                          ? format(new Date(order.createdAt), "HH:mm", { locale: ko })
                          : ''}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center p-2">
                      {order.status === 'cancel_requested' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelClick(order)}
                          disabled={cancelingOrderId === order.orderId}
                          className="h-7 text-xs px-3 shadow-sm bg-red-500 hover:bg-red-600"
                        >
                          {cancelingOrderId === order.orderId ? '처리중' : '환불 승인'}
                        </Button>
                      )}
                      {order.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelClick(order)}
                          disabled={cancelingOrderId === order.orderId}
                          className="h-7 text-xs px-3 text-slate-500 hover:text-red-600 hover:bg-red-50 border-slate-200"
                        >
                          환불
                        </Button>
                      )}
                      {order.status === 'canceled' && (
                        <span className="text-xs text-slate-400 flex items-center justify-center font-medium">
                          <CheckCircle className="w-3 h-3 mr-1" /> 완료됨
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* 취소 확인 다이얼로그 */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>환불 처리 {selectedOrder?.status === 'cancel_requested' ? '(취소 승인)' : ''}</DialogTitle>
            <DialogDescription>
              결제를 취소하고 환불을 진행합니다.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="py-2 space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span>주문번호</span>
                  <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border">{selectedOrder.orderId}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>고객명</span>
                  <span className="font-medium text-slate-900">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-200 mt-2">
                  <span>환불 예정 금액</span>
                  <span className="font-bold text-red-600 text-lg">{selectedOrder.amount.toLocaleString()}원</span>
                </div>

                {/* 취소 사유 표시 */}
                {selectedOrder.status === 'cancel_requested' && (
                  <div className="pt-2 mt-2 border-t border-slate-200">
                    <span className="text-orange-600 font-bold text-xs flex items-center mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1"></div>
                      고객 취소 사유
                    </span>
                    <p className="bg-white p-2.5 rounded border border-orange-100 text-slate-700 leading-relaxed text-sm">
                      "{selectedOrder.cancelReason || '사유 없음'}"
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancelReason" className="text-xs font-medium text-slate-500 uppercase">환불 사유 (관리자 기록)</Label>
                <Input
                  id="cancelReason"
                  placeholder="예: 고객 요청 승인"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              className="h-9"
            >
              닫기
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={!cancelReason.trim() || cancelingOrderId !== null}
              className="h-9 bg-red-600 hover:bg-red-700"
            >
              환불 실행하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrdersPage;
