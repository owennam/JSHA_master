import { useState, useEffect } from "react";
import { Clock, Users, AlertCircle } from "lucide-react";

interface UrgencyBannerProps {
  deadline?: Date;
  remainingSeats?: number;
  totalSeats?: number;
  cohortName?: string;
}

export const UrgencyBanner = ({
  deadline = new Date("2026-03-01"), // 기본값: 2026년 3월 1일
  remainingSeats = 2,
  totalSeats = 10,
  cohortName = "2026년 1기"
}: UrgencyBannerProps) => {
  const [daysLeft, setDaysLeft] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const appliedSeats = totalSeats - remainingSeats;

  useEffect(() => {
    const calculateDaysLeft = () => {
      const now = new Date();
      const timeDiff = deadline.getTime() - now.getTime();
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);
    };

    calculateDaysLeft();
    const interval = setInterval(calculateDaysLeft, 1000 * 60 * 60); // 1시간마다 업데이트

    return () => clearInterval(interval);
  }, [deadline]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-lg animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-center flex-1 gap-3 sm:gap-4 flex-wrap text-center">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 animate-pulse" />
              <span className="font-bold text-sm sm:text-base">
                ⚠️ {totalSeats}명 중 {appliedSeats}명 신청완료!
              </span>
            </div>

            <div className="hidden sm:block text-white/60">|</div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm sm:text-base">
                남은 자리 <span className="font-bold text-yellow-300 text-lg">{remainingSeats}석</span>만 남았습니다
              </span>
            </div>

            <div className="hidden sm:block text-white/60">|</div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm sm:text-base">
                모집 마감까지 <span className="font-bold">{daysLeft}일</span>
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
