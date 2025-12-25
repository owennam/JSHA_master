import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  UserProfile,
  UserStatus
} from "@/lib/firestore";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminUsersPage = () => {
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<UserProfile[]>([]);
  const [rejectedUsers, setRejectedUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('admin_token');

      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/users?status=pending`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/admin/users?status=approved`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/admin/users?status=rejected`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const [pendingData, approvedData, rejectedData] = await Promise.all([
        pendingRes.json(),
        approvedRes.json(),
        rejectedRes.json(),
      ]);

      if (pendingData.success) setPendingUsers(pendingData.data || []);
      if (approvedData.success) setApprovedUsers(approvedData.data || []);
      if (rejectedData.success) setRejectedUsers(rejectedData.data || []);

    } catch (error) {
      console.error("Failed to load users:", error);
      toast({
        title: "로드 실패",
        description: "사용자 목록을 불러오지 못했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUpdateStatus = async (uid: string, newStatus: UserStatus) => {
    setUpdatingUserId(uid);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('admin_token');

      const response = await fetch(`${API_URL}/api/admin/users/${uid}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update user status');
      }

      toast({
        title: "처리 완료",
        description: `사용자 상태가 ${newStatus === 'approved' ? '승인' : '거부'}되었습니다.`,
      });

      await loadUsers();
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast({
        title: "처리 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  // 사용자 테이블 컴포넌트
  const UserTable = ({ users, isPending }: { users: UserProfile[], isPending: boolean }) => {
    if (users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 border rounded-md bg-white">
          <Users className="w-10 h-10 text-muted-foreground mb-3 opacity-20" />
          <p className="text-muted-foreground text-sm">해당되는 사용자가 없습니다</p>
        </div>
      );
    }

    return (
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[200px]">이름 / 병원명</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="w-[100px]">지역</TableHead>
              <TableHead className="w-[120px]">신청일</TableHead>
              <TableHead className="text-right w-[180px]">{isPending ? '관리' : '상태'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid} className="group hover:bg-muted/5">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{user.directorName} 원장님</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {user.clinicName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-600 font-mono">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-xs text-slate-600">
                    {user.location}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </TableCell>
                <TableCell className="text-right">
                  {isPending ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdateStatus(user.uid, 'approved')}
                        disabled={updatingUserId === user.uid}
                      >
                        {updatingUserId === user.uid ? '처리중...' : '승인'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleUpdateStatus(user.uid, 'rejected')}
                        disabled={updatingUserId === user.uid}
                      >
                        거부
                      </Button>
                    </div>
                  ) : (
                    <Badge
                      variant={user.status === 'approved' ? 'default' : 'destructive'}
                      className={user.status === 'approved' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 shadow-none' : 'bg-red-100 text-red-700 hover:bg-red-100 shadow-none'}
                    >
                      {user.status === 'approved' ? '승인완료' : '거부됨'}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">사용자 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            회원 승인 및 현황을 한눈에 관리하세요
          </p>
        </div>
        <Button onClick={loadUsers} variant="outline" size="sm" className="h-9">
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">승인 대기</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-800">{pendingUsers.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">활동중인 회원</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-800">{approvedUsers.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">거부됨</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-800">{rejectedUsers.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-slate-100 p-1">
          <TabsTrigger value="pending" className="text-xs">승인 대기 ({pendingUsers.length})</TabsTrigger>
          <TabsTrigger value="approved" className="text-xs">승인됨 ({approvedUsers.length})</TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs">거부됨 ({rejectedUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <UserTable users={pendingUsers} isPending={true} />
        </TabsContent>

        <TabsContent value="approved" className="mt-0">
          <UserTable users={approvedUsers} isPending={false} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <UserTable users={rejectedUsers} isPending={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsersPage;
