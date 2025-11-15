import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* 아카데미 정보 */}
          <div>
            <div className="mb-4">
              <img
                src="/images/JSHA_logo.webp"
                alt="JSHA Academy Logo"
                className="h-20 w-auto"
              />
            </div>
            <p className="text-primary-foreground/80 leading-relaxed text-sm">
              통증 치료의 새로운 기준,
              <br />
              1년의 체계적 교육으로
              <br />
              전문가로 성장하세요.
            </p>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">문의</h4>
            <div className="space-y-3 text-sm">
              <a href="mailto:jshaworkshop@gmail.com" className="flex items-center gap-3 group hover:bg-secondary hover:text-white transition-all -mx-2 px-2 py-1 rounded">
                <Mail className="h-4 w-4 flex-shrink-0 group-hover:text-white transition-colors" />
                <span>jshaworkshop@gmail.com</span>
              </a>
              <a href="tel:010-4002-1094" className="flex items-center gap-3 group hover:bg-secondary hover:text-white transition-all -mx-2 px-2 py-1 rounded">
                <Phone className="h-4 w-4 flex-shrink-0 group-hover:text-white transition-colors" />
                <span>010-4002-1094</span>
              </a>
              <a href="https://open.kakao.com/o/slxvcj1h" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group hover:bg-secondary hover:text-white transition-all -mx-2 px-2 py-1 rounded">
                <MessageCircle className="h-4 w-4 flex-shrink-0 group-hover:text-white transition-colors" />
                <span>카카오톡 문의</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80">
                  대전광역시 서구 계룡로 633 2층
                  <br />
                  대전제이에스힐링의원
                </span>
              </div>
            </div>
          </div>

          {/* 주최 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">주최</h4>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              <strong className="text-primary-foreground">대전제이에스힐링의원</strong>
              <br />
              <br />
              JSHA Master Course는 대전제이에스힐링의원이 <br />주관하는 공식 교육 프로그램입니다.
            </p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
            <p>© 2025 JSHA Master Coures. All Rights Reserved.</p>
            <div className="flex gap-4">
              <Link to="/privacy-policy" className="hover:bg-secondary hover:text-white transition-all px-3 py-1 rounded">
                개인정보처리방침
              </Link>
              <Link to="/terms-of-service" className="hover:bg-secondary hover:text-white transition-all px-3 py-1 rounded">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
