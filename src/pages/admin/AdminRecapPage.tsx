import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
// Firestore SDK 대신 API 사용 - 타입만 import
import { getAllBookRegistrations, type UserStatus, type AccessLevel, type BookRegistration, deleteRecapRegistrant } from "@/lib/firestore";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Shield,
  RotateCcw,
  Plus,
  BookOpen,
  Trash2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// RecapRegistrant 타입 정의 (API 응답용)
interface RecapRegistrant {
  uid: string;
  email: string;
  name: string;
  clinic?: string;
  batch?: string;
  status: UserStatus;
  accessLevel: AccessLevel;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
  agreedAt: string;
  createdAt: string;
  updatedAt: string;
}

// API Helper 함수들
const getApiUrl = () => import.meta.env.VITE_API_URL || import.meta.env.VITE_SERVER_URL || '';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
});

const apiGetRegistrantsByStatus = async (status: UserStatus): Promise<RecapRegistrant[]> => {
  const response = await fetch(`${getApiUrl()}/api/admin/recap-registrants?status=${status}`, {
    headers: getAuthHeaders()
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch registrants');
  return result.data;
};

const apiUpdateRegistrantStatus = async (uid: string, status: UserStatus, accessLevel?: AccessLevel): Promise<void> => {
  const response = await fetch(`${getApiUrl()}/api/admin/recap-registrants/${uid}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, accessLevel })
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to update status');
};

const AdminRecapPage = () => {
  const { toast } = useToast();
  const [pendingRegistrants, setPendingRegistrants] = useState<RecapRegistrant[]>([]);
  const [approvedRegistrants, setApprovedRegistrants] = useState<RecapRegistrant[]>([]);
  const [rejectedRegistrants, setRejectedRegistrants] = useState<RecapRegistrant[]>([]);
  const [bookRegistrants, setBookRegistrants] = useState<BookRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);

  // 승인 다이얼로그 상태
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedRegistrant, setSelectedRegistrant] = useState<RecapRegistrant | null>(null);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<AccessLevel>('preview');

  // 수동 등록 상태
  const [manualRegisterOpen, setManualRegisterOpen] = useState(false);
  const [manualUid, setManualUid] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualLoading, setManualLoading] = useState(false);

  const handleManualRegister = async () => {
    if (!manualUid || !manualEmail || !manualName) {
      toast({ title: "입력 오류", description: "모든 필드를 입력해주세요.", variant: "destructive" });
      return;
    }
    setManualLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/admin/manual-register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ uid: manualUid, email: manualEmail, name: manualName })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      toast({ title: "등록 완료", description: "사용자가 수동으로 등록되었습니다." });
      setManualRegisterOpen(false);
      setManualUid(""); setManualEmail(""); setManualName("");
      loadRegistrants();
    } catch (error: any) {
      toast({ title: "등록 실패", description: error.message, variant: "destructive" });
    } finally {
      setManualLoading(false);
    }
  };

  const loadRegistrants = async () => {
    setLoading(true);
    try {
      // API를 통해 조회
      const [pending, approved, rejected] = await Promise.all([
        apiGetRegistrantsByStatus('pending'),
        apiGetRegistrantsByStatus('approved'),
        apiGetRegistrantsByStatus('rejected'),
      ]);

      setPendingRegistrants(pending);
      setApprovedRegistrants(approved);
      setRejectedRegistrants(rejected);

      // 교과서 등록 정보 조회 (Firestore SDK 직접 사용)
      try {
        const books = await getAllBookRegistrations();
        setBookRegistrants(books);
      } catch (bookError) {
        console.error("Failed to load book registrations:", bookError);
      }

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
    loadRegistrants();
  }, []);


  // 승인 다이얼로그 열기
  const openApprovalDialog = (registrant: RecapRegistrant) => {
    setSelectedRegistrant(registrant);
    setSelectedAccessLevel(registrant.accessLevel || 'preview');
    setApprovalDialogOpen(true);
  };

  // 승인 처리 (접근 등급 포함)
  const handleApprove = async () => {
    if (!selectedRegistrant) return;

    setUpdatingUid(selectedRegistrant.uid);
    try {
      // 상태와 접근 등급을 동시에 업데이트 (API에서 한 번에 처리)
      await apiUpdateRegistrantStatus(selectedRegistrant.uid, 'approved', selectedAccessLevel);

      toast({
        title: "승인 완료",
        description: `${selectedRegistrant.name}님이 ${getAccessLevelLabel(selectedAccessLevel)} 등급으로 승인되었습니다.`,
      });

      setApprovalDialogOpen(false);
      setSelectedRegistrant(null);
      await loadRegistrants();

    } catch (error: any) {
      console.error("Failed to approve:", error);
      toast({
        title: "승인 실패",
        description: error.message || "승인 처리에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUid(null);
    }
  };

  // 거부 처리
  const handleReject = async (uid: string) => {
    setUpdatingUid(uid);
    try {
      await apiUpdateRegistrantStatus(uid, 'rejected');

      toast({
        title: "거부 완료",
        description: "등록자가 거부되었습니다.",
      });

      await loadRegistrants();
    } catch (error: any) {
      console.error("Failed to reject:", error);
      toast({
        title: "거부 실패",
        description: error.message || "거부 처리에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUid(null);
    }
  };

  // 승인 취소 (approved -> pending)
  const handleRevokeApproval = async (uid: string) => {
    setUpdatingUid(uid);
    try {
      await apiUpdateRegistrantStatus(uid, 'pending');

      toast({
        title: "승인 취소",
        description: "승인이 취소되어 대기 상태로 변경되었습니다.",
      });

      await loadRegistrants();
    } catch (error: any) {
      console.error("Failed to revoke approval:", error);
      toast({
        title: "취소 실패",
        description: error.message || "승인 취소에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUid(null);
    }
  };

  // 영구 삭제
  const handleDelete = async (uid: string) => {
    if (!window.confirm("정말로 이 사용자의 등록 정보를 영구 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setUpdatingUid(uid);
    try {
      // 서버 API를 호출하여 Auth 계정과 Firestore 데이터 모두 삭제
      const response = await fetch(`${getApiUrl()}/api/admin/users/${uid}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Failed to delete user');

      toast({
        title: "영구 삭제 완료",
        description: "사용자 계정과 등록 정보가 모두 삭제되었습니다.",
      });

      await loadRegistrants();
    } catch (error: any) {
      console.error('Failed to delete registrant:', error);
      toast({
        title: "삭제 실패",
        description: error.message || "삭제 처리에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUid(null);
    }
  };

  // 접근 등급 업데이트 (approved 상태인 사용자)
  const handleUpdateAccessLevel = async (uid: string, newAccessLevel: AccessLevel) => {
    setUpdatingUid(uid);
    try {
      await apiUpdateRegistrantStatus(uid, 'approved', newAccessLevel);

      toast({
        title: "등급 변경 완료",
        description: `접근 등급이 ${getAccessLevelLabel(newAccessLevel)}(으)로 변경되었습니다.`,
      });

      await loadRegistrants();
    } catch (error: any) {
      console.error("Failed to update access level:", error);
      toast({
        title: "등급 변경 실패",
        description: error.message || "등급 변경에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUid(null);
    }
  };

  // 접근 등급 라벨 가져오기
  const getAccessLevelLabel = (level: AccessLevel): string => {
    const labels: Record<AccessLevel, string> = {
      'free': '무료 가입',
      'book': '교과서 구매자',
      'preview': '맛보기',
      'session1': '세션 1',
      'graduate': '수료자',
    };
    return labels[level];
  };

  // 접근 등급 뱃지 색상
  const getAccessLevelColor = (level: AccessLevel): string => {
    const colors: Record<AccessLevel, string> = {
      'free': 'bg-slate-100 text-slate-700',
      'book': 'bg-purple-100 text-purple-700',
      'preview': 'bg-gray-100 text-gray-700',
      'session1': 'bg-blue-100 text-blue-700',
      'graduate': 'bg-green-100 text-green-700',
    };
    return colors[level];
  };

  // 등록자 테이블 컴포넌트
  const RegistrantTable = ({ registrants, isPending, isApproved, bookRegistrations = [] }: {
    registrants: RecapRegistrant[],
    isPending: boolean,
    isApproved?: boolean,
    bookRegistrations?: BookRegistration[]
  }) => {
    // 교과서 구매자 uid Set 생성
    const bookPurchaserUids = new Set(bookRegistrations.map(b => b.uid));

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
              <TableHead className="w-[120px]">이름</TableHead>
              <TableHead>의료기관</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="w-[70px]">기수</TableHead>
              {isApproved && <TableHead className="w-[100px]">접근 등급</TableHead>}
              <TableHead className="w-[90px]">신청일</TableHead>
              <TableHead className="text-right w-[180px]">{isPending ? '관리' : isApproved ? '관리' : '상태'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrants.map((registrant) => {
              const isBookPurchaser = bookPurchaserUids.has(registrant.uid);

              return (
                <TableRow key={registrant.uid} className="group hover:bg-muted/5">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-slate-800">{registrant.name}</span>
                      {isBookPurchaser && (
                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs px-1 py-0">
                          📚
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{registrant.clinic || '-'}</TableCell>
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
                  {isApproved && (
                    <TableCell>
                      <Select
                        value={registrant.accessLevel}
                        onValueChange={(value) => handleUpdateAccessLevel(registrant.uid, value as AccessLevel)}
                        disabled={updatingUid === registrant.uid}
                      >
                        <SelectTrigger className="h-8 w-[110px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preview" className="text-xs">맛보기</SelectItem>
                          <SelectItem value="book" className="text-xs">교과서</SelectItem>
                          <SelectItem value="session1" className="text-xs">세션 1</SelectItem>
                          <SelectItem value="graduate" className="text-xs">수료자</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  )}
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(registrant.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell className="text-right">
                    {isPending ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700"
                          onClick={() => openApprovalDialog(registrant)}
                          disabled={updatingUid === registrant.uid}
                        >
                          {updatingUid === registrant.uid ? '처리중...' : '승인'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(registrant.uid)}
                          disabled={updatingUid === registrant.uid}
                        >
                          거부
                        </Button>
                      </div>
                    ) : isApproved ? (
                      <div className="flex justify-end gap-2">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 shadow-none">
                          승인완료
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          onClick={() => handleRevokeApproval(registrant.uid)}
                          disabled={updatingUid === registrant.uid}
                          title="승인 취소"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 shadow-none">
                        거부됨
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 ml-1"
                      onClick={() => handleDelete(registrant.uid)}
                      disabled={updatingUid === registrant.uid}
                      title="영구 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
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
        <div className="flex gap-2">
          <Button onClick={() => setManualRegisterOpen(true)} variant="outline" size="sm" className="h-9">
            <Plus className="w-3.5 h-3.5 mr-2" />
            수동 등록
          </Button>
          <Button onClick={loadRegistrants} variant="outline" size="sm" className="h-9">
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            새로고침
          </Button>
        </div>
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
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">교과서 등록</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-800">{bookRegistrants.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-6 bg-slate-100 p-1">
          <TabsTrigger value="pending" className="text-xs">승인 대기 ({pendingRegistrants.length})</TabsTrigger>
          <TabsTrigger value="approved" className="text-xs">승인됨 ({approvedRegistrants.length})</TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs">거부됨 ({rejectedRegistrants.length})</TabsTrigger>
          <TabsTrigger value="books" className="text-xs">교과서 등록 ({bookRegistrants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <RegistrantTable registrants={pendingRegistrants} isPending={true} isApproved={false} bookRegistrations={bookRegistrants} />
        </TabsContent>

        <TabsContent value="approved" className="mt-0">
          <RegistrantTable registrants={approvedRegistrants} isPending={false} isApproved={true} bookRegistrations={bookRegistrants} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <RegistrantTable registrants={rejectedRegistrants} isPending={false} isApproved={false} bookRegistrations={bookRegistrants} />
        </TabsContent>

        <TabsContent value="books" className="mt-0">
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[120px]">이름</TableHead>
                  <TableHead>의료기관</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead className="w-[180px]">교과서 코드</TableHead>
                  <TableHead className="w-[120px]">휴대폰 번호</TableHead>
                  <TableHead className="w-[140px]">등록일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookRegistrants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      등록된 교과서 내역이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookRegistrants.map((book) => (
                    <TableRow key={book.id} className="hover:bg-muted/5">
                      <TableCell className="font-bold text-slate-800">{book.name || '-'}</TableCell>
                      <TableCell className="text-sm text-slate-600">{book.clinic || '-'}</TableCell>
                      <TableCell className="text-sm font-mono">{book.email}</TableCell>
                      <TableCell className="font-mono font-bold text-purple-700">{book.code}</TableCell>
                      <TableCell className="font-mono text-sm">{book.phoneNumber}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(book.registeredAt).toLocaleDateString('ko-KR')} {new Date(book.registeredAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* 승인 다이얼로그 */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>등록자 승인</DialogTitle>
            <DialogDescription>
              승인 시 사용자가 접근할 수 있는 영상 범위를 설정하세요.
            </DialogDescription>
          </DialogHeader>

          {selectedRegistrant && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">등록자 정보</Label>
                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                  <p className="text-sm font-bold">{selectedRegistrant.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedRegistrant.email}</p>
                  {selectedRegistrant.batch && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {selectedRegistrant.batch}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessLevel" className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  접근 등급
                </Label>
                <Select value={selectedAccessLevel} onValueChange={(value) => setSelectedAccessLevel(value as AccessLevel)}>
                  <SelectTrigger id="accessLevel" className="w-full">
                    <SelectValue placeholder="접근 등급 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preview">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">맛보기</span>
                        <span className="text-xs text-muted-foreground">맛보기 영상만 시청 가능</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="session1">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">세션 1</span>
                        <span className="text-xs text-muted-foreground">맛보기 + 세션 1 영상 시청 가능</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="book">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">교과서 구매자</span>
                        <span className="text-xs text-muted-foreground">맛보기 + 교과서 영상 시청 가능</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="graduate">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">수료자</span>
                        <span className="text-xs text-muted-foreground">모든 영상 시청 가능</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setApprovalDialogOpen(false)}
              disabled={updatingUid !== null}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleApprove}
              disabled={updatingUid !== null}
              className="bg-green-600 hover:bg-green-700"
            >
              {updatingUid !== null ? '처리중...' : '승인'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수동 등록 다이얼로그 */}
      <Dialog open={manualRegisterOpen} onOpenChange={setManualRegisterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>수동 사용자 등록</DialogTitle>
            <DialogDescription>
              Firebase Auth에 가입되어 있으나 목록에 없는 사용자를 등록합니다.<br />
              UID는 Firebase Console에서 확인하여 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="manualUid">UID (필수)</Label>
              <Input id="manualUid" value={manualUid} onChange={(e) => setManualUid(e.target.value)} placeholder="Firebase Auth UID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manualEmail">이메일 (필수)</Label>
              <Input id="manualEmail" value={manualEmail} onChange={(e) => setManualEmail(e.target.value)} placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manualName">이름 (필수)</Label>
              <Input id="manualName" value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="홍길동" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManualRegisterOpen(false)}>취소</Button>
            <Button onClick={handleManualRegister} disabled={manualLoading}>
              {manualLoading ? '등록 중...' : '등록'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRecapPage;
