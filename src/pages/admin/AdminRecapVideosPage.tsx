import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
// Firestore SDK 대신 API 사용
import type { AccessLevel } from "@/lib/firestore";
import {
  Video,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// RecapVideo 타입 정의 (API 응답용)
interface RecapVideo {
  id: string;
  title: string;
  description: string;
  vimeoUrl: string;
  duration: string;
  module: string;
  thumbnail: string;
  order: number;
  isPublished: boolean;
  accessLevel: AccessLevel;
  createdAt: string;
  updatedAt: string;
}

// API Helper 함수들
const getApiUrl = () => import.meta.env.VITE_API_URL || import.meta.env.VITE_SERVER_URL || '';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
});

const apiGetAllVideos = async (publishedOnly: boolean = false): Promise<RecapVideo[]> => {
  const response = await fetch(`${getApiUrl()}/api/admin/recap-videos${publishedOnly ? '?publishedOnly=true' : ''}`, {
    headers: getAuthHeaders()
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch videos');
  return result.data;
};

const apiCreateVideo = async (videoData: Omit<RecapVideo, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const response = await fetch(`${getApiUrl()}/api/admin/recap-videos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(videoData)
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to create video');
  return result.data.id;
};

const apiUpdateVideo = async (videoId: string, updates: Partial<RecapVideo>): Promise<void> => {
  const response = await fetch(`${getApiUrl()}/api/admin/recap-videos/${videoId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to update video');
};

const apiDeleteVideo = async (videoId: string): Promise<void> => {
  const response = await fetch(`${getApiUrl()}/api/admin/recap-videos/${videoId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to delete video');
};

const AdminRecapVideosPage = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<RecapVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<RecapVideo | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    vimeoUrl: "",
    duration: "",
    module: "",
    thumbnail: "",
    order: 1,
    isPublished: true,
    accessLevel: 'preview' as AccessLevel,
  });

  const loadVideos = async () => {
    setLoading(true);
    try {
      const videoList = await apiGetAllVideos(false); // 모든 비디오 (미공개 포함)
      setVideos(videoList);
    } catch (error) {
      console.error("Failed to load videos:", error);
      toast({
        title: "로드 실패",
        description: "비디오 목록을 불러오지 못했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadVideos();
  }, []);

  const handleOpenDialog = (video?: RecapVideo) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title,
        description: video.description,
        vimeoUrl: video.vimeoUrl,
        duration: video.duration,
        module: video.module,
        thumbnail: video.thumbnail,
        order: video.order,
        isPublished: video.isPublished,
        accessLevel: video.accessLevel,
      });
    } else {
      setEditingVideo(null);
      setFormData({
        title: "",
        description: "",
        vimeoUrl: "",
        duration: "",
        module: "",
        thumbnail: "",
        order: videos.length + 1,
        isPublished: true,
        accessLevel: 'preview',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingVideo(null);
    setFormData({
      title: "",
      description: "",
      vimeoUrl: "",
      duration: "",
      module: "",
      thumbnail: "",
      order: 1,
      isPublished: true,
      accessLevel: 'preview',
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.vimeoUrl) {
      toast({
        title: "입력 오류",
        description: "제목과 Vimeo URL은 필수입니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingVideo) {
        await apiUpdateVideo(editingVideo.id, formData);
        toast({
          title: "수정 완료",
          description: "비디오가 수정되었습니다.",
        });
      } else {
        await apiCreateVideo(formData);
        toast({
          title: "추가 완료",
          description: "새 비디오가 추가되었습니다.",
        });
      }
      handleCloseDialog();
      await loadVideos();
    } catch (error: any) {
      console.error("Failed to save video:", error);
      toast({
        title: "저장 실패",
        description: error.message || "비디오 저장에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (video: RecapVideo) => {
    try {
      await apiUpdateVideo(video.id, { isPublished: !video.isPublished });
      toast({
        title: video.isPublished ? "비공개 처리" : "공개 처리",
        description: `비디오가 ${!video.isPublished ? "공개" : "비공개"}되었습니다.`,
      });
      await loadVideos();
    } catch (error: any) {
      toast({
        title: "처리 실패",
        description: error.message || "상태 변경에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (video: RecapVideo) => {
    if (!confirm(`"${video.title}" 비디오를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await apiDeleteVideo(video.id);
      toast({
        title: "삭제 완료",
        description: "비디오가 삭제되었습니다.",
      });
      await loadVideos();
    } catch (error: any) {
      toast({
        title: "삭제 실패",
        description: error.message || "비디오 삭제에 실패했습니다.",
        variant: "destructive",
      });
    }
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">다시보기 비디오 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            마스터 코스 다시보기 비디오를 추가하고 관리합니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadVideos} variant="outline" size="sm" className="h-9">
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            새로고침
          </Button>
          <Button onClick={() => handleOpenDialog()} size="sm" className="h-9">
            <Plus className="w-3.5 h-3.5 mr-2" />
            비디오 추가
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">전체 비디오</CardTitle>
            <Video className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-800">{videos.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">공개됨</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-800">
              {videos.filter((v) => v.isPublished).length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">비공개</CardTitle>
            <EyeOff className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-800">
              {videos.filter((v) => !v.isPublished).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 비디오 목록 */}
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[50px]">순서</TableHead>
              <TableHead className="w-[180px]">제목</TableHead>
              <TableHead className="w-[90px]">모듈</TableHead>
              <TableHead className="w-[110px]">접근 등급</TableHead>
              <TableHead className="w-[70px]">길이</TableHead>
              <TableHead className="w-[250px]">Vimeo URL</TableHead>
              <TableHead className="w-[90px]">상태</TableHead>
              <TableHead className="text-right w-[130px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  등록된 비디오가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              videos.map((video) => {
                const getAccessLevelLabel = (level: AccessLevel): string => {
                  const labels: Record<AccessLevel, string> = {
                    'preview': '맛보기',
                    'session1': '세션 1',
                    'graduate': '수료자',
                  };
                  return labels[level];
                };

                const getAccessLevelColor = (level: AccessLevel): string => {
                  const colors: Record<AccessLevel, string> = {
                    'preview': 'bg-gray-100 text-gray-700',
                    'session1': 'bg-blue-100 text-blue-700',
                    'graduate': 'bg-green-100 text-green-700',
                  };
                  return colors[level];
                };

                return (
                  <TableRow key={video.id} className="group hover:bg-muted/5">
                    <TableCell className="font-medium text-center">{video.order}</TableCell>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal text-xs">
                        {video.module}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-normal text-xs ${getAccessLevelColor(video.accessLevel)}`}>
                        {getAccessLevelLabel(video.accessLevel)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{video.duration}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[250px]">
                      {video.vimeoUrl}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={video.isPublished}
                          onCheckedChange={() => handleTogglePublish(video)}
                          className="h-5 w-9"
                        />
                        <Badge
                          variant={video.isPublished ? "default" : "secondary"}
                          className={
                            video.isPublished
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          }
                        >
                          {video.isPublished ? "공개" : "비공개"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={() => handleOpenDialog(video)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(video)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 비디오 추가/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingVideo ? "비디오 수정" : "새 비디오 추가"}</DialogTitle>
            <DialogDescription>
              마스터 코스 다시보기 비디오 정보를 입력하세요
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                제목 *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
                placeholder="세션 1-1: 통증의 이해"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                설명
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
                placeholder="통증의 기본 원리와 JSHA 접근법"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vimeoUrl" className="text-right">
                Vimeo URL *
              </Label>
              <Input
                id="vimeoUrl"
                value={formData.vimeoUrl}
                onChange={(e) => setFormData({ ...formData, vimeoUrl: e.target.value })}
                className="col-span-3"
                placeholder="https://vimeo.com/123456789"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="module" className="text-right">
                모듈
              </Label>
              <Input
                id="module"
                value={formData.module}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                className="col-span-3"
                placeholder="세션 1"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                길이
              </Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="col-span-3"
                placeholder="45분"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="thumbnail" className="text-right">
                썸네일 URL
              </Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="col-span-3"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order" className="text-right">
                순서
              </Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="col-span-3"
                min={1}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accessLevel" className="text-right flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                접근 등급
              </Label>
              <Select
                value={formData.accessLevel}
                onValueChange={(value) => setFormData({ ...formData, accessLevel: value as AccessLevel })}
              >
                <SelectTrigger id="accessLevel" className="col-span-3">
                  <SelectValue placeholder="접근 등급 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preview">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">맛보기</span>
                      <span className="text-xs text-muted-foreground">누구나 시청 가능</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="session1">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">세션 1</span>
                      <span className="text-xs text-muted-foreground">세션 1 참가자 이상</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="graduate">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">수료자</span>
                      <span className="text-xs text-muted-foreground">수료자만 시청 가능</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPublished" className="text-right">
                공개 여부
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                />
                <span className="text-sm text-muted-foreground">
                  {formData.isPublished ? "공개" : "비공개"}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              {editingVideo ? "수정" : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRecapVideosPage;
