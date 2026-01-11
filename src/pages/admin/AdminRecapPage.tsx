import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  RecapRegistrant,
  UserStatus,
  getRecapRegistrantsByStatus,
  updateRecapRegistrantStatus,
} from "@/lib/firestore";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
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

const AdminRecapPage = () => {
  const { toast } = useToast();
  const [pendingRegistrants, setPendingRegistrants] = useState<RecapRegistrant[]>([]);
  const [approvedRegistrants, setApprovedRegistrants] = useState<RecapRegistrant[]>([]);
  const [rejectedRegistrants, setRejectedRegistrants] = useState<RecapRegistrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Firebase Auth 상태 확인 및 자동 로그인
  useEffect(() => {
    if (!auth) {
      setAuthChecked(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // 로그인되어 있지 않으면 익명 로그인
        try {
          console.log("Admin not authenticated, signing in anonymously...");
          await signInAnonymously(auth);
          console.log("✅ Anonymous sign-in successful");
        } catch (error) {
          console.error("Anonymous sign-in failed:", error);
          toast({
            title: "인증 오류",
            description: "Firebase 인증에 실패했습니다.",
            variant: "destructive",
          });
        }
      } else {
        console.log("✅ Admin authenticated:", user.uid);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [toast]);

  const loadRegistrants = async () => {
    setLoading(true);
    try {
      // Firestore에서 직접 조회
      const [pending, approved, rejected] = await Promise.all([
        getRecapRegistrantsByStatus('pending'),
        getRecapRegistrantsByStatus('approved'),
        getRecapRegistrantsByStatus('rejected'),
      ]);

      setPendingRegistrants(pending);
      setApprovedRegistrants(approved);
      setRejectedRegistrants(rejected);

    } catch (error) {
      console.error("Failed to load registrants:", error);
      toast({
        title: "로드 실패",
        description: "등록자 목록을 불러오지 못했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked) {
      loadRegistrants();
    }
  }, [authChecked]);

  const handleUpdateStatus = async (uid: string, newStatus: UserStatus) => {
    setUpdatingUid(uid);
    try {
      // Firestore에서 직접 상태 업데이트
      await updateRecapRegistrantStatus(uid, newStatus);

      toast({
        title: "처리 완료",
        description: `등록자 상태가 ${newStatus === 'approved' ? '승인' : '거부'}되었습니다.`,
      });

      await loadRegistrants();
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast({
        title: "처리 실패",
        description: error.message || "상태 업데이트에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUid(null);
    }
  };

  // 등록자 테이블 컴포넌트
  const RegistrantTable = ({ registrants, isPending }: { registrants: RecapRegistrant[], isPending: boolean }) => {
    if (registrants.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 border rounded-md bg-white">
          <Users className="w-10 h-10 text-muted-foreground mb-3 opacity-20" />
          <p className="text-muted-foreground text-sm">해당되는 등록자가 없습니다</p>
        </div>
      );
    }

    return (
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[200px]">이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="w-[100px]">기수</TableHead>
              <TableHead className="w-[120px]">신청일</TableHead>
              <TableHead className="text-right w-[180px]">{isPending ? '관리' : '상태'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrants.map((registrant) => (
              <TableRow key={registrant.uid} className="group hover:bg-muted/5">
                <TableCell className="font-medium">
                  <span className="text-sm font-bold text-slate-800">{registrant.name}</span>
                </TableCell>
                <TableCell className="text-sm text-slate-600 font-mono">{registrant.email}</TableCell>
                <TableCell>
                  {registrant.batch ? (
                    <Badge variant="outline" className="font-normal text-xs text-slate-600">
                      {registrant.batch}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(registrant.createdAt).toLocaleDateString('ko-KR')}
                </TableCell>
                <TableCell className="text-right">
                  {isPending ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdateStatus(registrant.uid, 'approved')}
                        disabled={updatingUid === registrant.uid}
                      >
                        {updatingUid === registrant.uid ? '처리중...' : '승인'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleUpdateStatus(registrant.uid, 'rejected')}
                        disabled={updatingUid === registrant.uid}
                      >
                        거부
                      </Button>
                    </div>
                  ) : (
                    <Badge
                      variant={registrant.status === 'approved' ? 'default' : 'destructive'}
                      className={registrant.status === 'approved' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 shadow-none' : 'bg-red-100 text-red-700 hover:bg-red-100 shadow-none'}
                    >
                      {registrant.status === 'approved' ? '승인완료' : '거부됨'}
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">다시보기 등록자 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            다시보기 서비스 등록자 승인 및 현황 관리
          </p>
        </div>
        <Button onClick={loadRegistrants} variant="outline" size="sm" className="h-9">
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
            <div className="text-2xl font-bold text-slate-800">{pendingRegistrants.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">승인됨</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-800">{approvedRegistrants.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">거부됨</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-800">{rejectedRegistrants.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-slate-100 p-1">
          <TabsTrigger value="pending" className="text-xs">승인 대기 ({pendingRegistrants.length})</TabsTrigger>
          <TabsTrigger value="approved" className="text-xs">승인됨 ({approvedRegistrants.length})</TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs">거부됨 ({rejectedRegistrants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <RegistrantTable registrants={pendingRegistrants} isPending={true} />
        </TabsContent>

        <TabsContent value="approved" className="mt-0">
          <RegistrantTable registrants={approvedRegistrants} isPending={false} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <RegistrantTable registrants={rejectedRegistrants} isPending={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRecapPage;
