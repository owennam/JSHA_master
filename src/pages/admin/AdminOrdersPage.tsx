import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Order {
    timestamp: string;
    orderId: string;
    productName: string;
    amount: string;
    customerName: string;
    status: string;
}

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/admin/orders');
                const result = await response.json();
                if (result.success) {
                    setOrders(result.data);
                    setFilteredOrders(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        const filtered = orders.filter(order =>
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.productName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(filtered);
    }, [searchTerm, orders]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">주문 관리</h2>
                    <p className="text-muted-foreground">
                        전체 주문 내역을 확인하고 검색할 수 있습니다.
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="주문번호, 이름, 상품명 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>주문일시</TableHead>
                            <TableHead>주문번호</TableHead>
                            <TableHead>상품명</TableHead>
                            <TableHead>주문자</TableHead>
                            <TableHead className="text-right">결제금액</TableHead>
                            <TableHead>상태</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    로딩 중...
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    주문 내역이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell>{order.timestamp}</TableCell>
                                    <TableCell className="font-mono text-xs">{order.orderId}</TableCell>
                                    <TableCell>{order.productName}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell className="text-right">{order.amount}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                            {order.status || '결제완료'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
