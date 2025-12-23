import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  getUsersByStatus,
  getAllUsers,
  updateUserStatus,
  UserProfile,
  UserStatus
} from "@/lib/firestore";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Mail,
  Building2,
  MapPin
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
      const [pending, approved, rejected] = await Promise.all([
        getUsersByStatus('pending'),
        getUsersByStatus('approved'),
        getUsersByStatus('rejected'),
      ]);

      setPendingUsers(pending);
      setApprovedUsers(approved);
      setRejectedUsers(rejected);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast({
        title: "사용자 목록 로드 실패",
        description: "사용자 목록을 불러오는데 실패했습니다.",
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
      await updateUserStatus(uid, newStatus);

      toast({
        title: "상태 업데이트 완료",
        description: `사용자 상태가 ${newStatus === 'approved' ? '승인' : '거부'}되었습니다.`,
      });

      // 목록 새로고침
      await loadUsers();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        title: "상태 업데이트 실패",
        description: "사용자 상태를 변경하는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const StatusBadge = ({ status }: { status: UserStatus }) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />승인됨</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />대기 중</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />거부됨</Badge>;
    }
  };

  const UserCard = ({ user, showActions }: { user: UserProfile; showActions: boolean }) => (
    <Card key={user.uid} className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{user.directorName} 원장님</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {user.clinicName}
            </CardDescription>
          </div>
          <StatusBadge status={user.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{user.location}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}</p>
          {user.updatedAt !== user.createdAt && (
            <p>수정일: {new Date(user.updatedAt).toLocaleDateString('ko-KR')}</p>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 pt-3 border-t">
            <Button
              size="sm"
              onClick={() => handleUpdateStatus(user.uid, 'approved')}
              disabled={updatingUserId === user.uid}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              승인
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleUpdateStatus(user.uid, 'rejected')}
              disabled={updatingUserId === user.uid}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              거부
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">사용자 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">사용자 관리</h1>
          <p className="text-muted-foreground">
            회원 가입 신청을 승인하거나 거부할 수 있습니다
          </p>
        </div>
        <Button onClick={loadUsers} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">승인 대기</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              검토가 필요한 신청
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">승인됨</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              활성 사용자
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">거부됨</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              접근 거부
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 사용자 목록 탭 */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            승인 대기 ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            승인됨 ({approvedUsers.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            거부됨 ({rejectedUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingUsers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">승인 대기 중인 사용자가 없습니다</p>
              </CardContent>
            </Card>
          ) : (
            pendingUsers.map((user) => (
              <UserCard key={user.uid} user={user} showActions={true} />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedUsers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">승인된 사용자가 없습니다</p>
              </CardContent>
            </Card>
          ) : (
            approvedUsers.map((user) => (
              <UserCard key={user.uid} user={user} showActions={false} />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {rejectedUsers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">거부된 사용자가 없습니다</p>
              </CardContent>
            </Card>
          ) : (
            rejectedUsers.map((user) => (
              <UserCard key={user.uid} user={user} showActions={true} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsersPage;
