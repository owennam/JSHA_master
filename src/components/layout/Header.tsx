import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: "마스터 코스", isSection: true, scrollToTop: true },
    { label: "Master Care", path: "/mastercare", isSection: false },
    { label: "환자교육", path: "/education", isSection: false },
    { label: "병원 찾기", path: "/hospitals", isSection: false },
    { label: "뉴스레터", path: "/newsletter", isSection: false },
    { label: "인솔 구매", path: "/products", isSection: false },
    { label: "다시보기", path: "/recap", isSection: false },
  ];

  const handleNavClick = (item: any) => {
    if (item.scrollToTop) {
      // 최상단으로 스크롤하는 경우
      if (location.pathname !== "/") {
        // 현재 페이지가 홈이 아니면 홈으로 이동
        navigate("/");
      } else {
        // 이미 홈 페이지면 바로 최상단으로 스크롤
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (item.isSection && item.id) {
      // 섹션으로 이동하는 경우
      if (location.pathname !== "/") {
        // 현재 페이지가 홈이 아니면 홈으로 이동 후 스크롤
        navigate("/");
        setTimeout(() => {
          scrollToSection(item.id!);
        }, 100);
      } else {
        // 이미 홈 페이지면 바로 스크롤
        scrollToSection(item.id);
      }
    } else if (item.path) {
      // 다른 페이지로 이동
      navigate(item.path);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => {
              if (location.pathname !== "/") {
                navigate("/");
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="transition-all hover:scale-110 -ml-2"
          >
            <img
              src="/images/JSHA_logo.png"
              alt="JSHA Academy Logo"
              className="h-14 w-auto"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <button
                key={item.label + index}
                onClick={() => handleNavClick(item)}
                className="text-foreground hover:text-primary transition-all font-semibold px-4 py-2 rounded-xl hover:bg-primary/5"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-all hover:scale-110 rounded-lg hover:bg-primary/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-border">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
            {navItems.map((item, index) => (
              <button
                key={item.label + index}
                onClick={() => handleNavClick(item)}
                className="text-left text-foreground hover:text-primary hover:bg-primary/5 transition-all font-semibold py-3 px-4 rounded-xl"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
