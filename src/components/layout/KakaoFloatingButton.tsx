import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const KakaoFloatingButton = () => {
  const handleKakaoClick = () => {
    const kakaoChannelUrl = "https://open.kakao.com/o/slxvcj1h";
    window.open(kakaoChannelUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleKakaoClick}
        size="lg"
        className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 bg-yellow-400 hover:bg-yellow-500 text-gray-900 group"
        aria-label="카카오톡 채널 문의"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
      </Button>

      {/* 툴팁 텍스트 */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
          마스터 코스 문의하기
        </div>
      </div>
    </div>
  );
};
