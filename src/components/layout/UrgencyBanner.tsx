import { useState } from "react";
import { CheckCircle, Calendar } from "lucide-react";

export const UrgencyBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-white shadow-lg animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-center flex-1 gap-3 sm:gap-4 flex-wrap text-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-bold text-sm sm:text-base">
                ✅ 2026년 1기 모집 완료!
              </span>
            </div>

            <div className="hidden sm:block text-white/60">|</div>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm sm:text-base">
                🎉 <span className="font-bold text-yellow-300">하반기 2기</span> 모집 중
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white transition-colors text-xl leading-none p-1 hover:bg-white/10 rounded flex-shrink-0"
            aria-label="배너 닫기"
          >
            ×
          </button>
        </div>
      </div>

      {/* 펄스 효과 애니메이션 */}
      <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />
    </div>
  );
};
