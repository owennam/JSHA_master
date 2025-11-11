import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { KakaoFloatingButton } from "@/components/layout/KakaoFloatingButton";
import { MasterCareHeroSection } from "@/components/sections/mastercare/MasterCareHeroSection";
import { MasterCarePackagesSection } from "@/components/sections/mastercare/MasterCarePackagesSection";
import { MasterCareServicesSection } from "@/components/sections/mastercare/MasterCareServicesSection";
import { MasterCareFAQSection } from "@/components/sections/mastercare/MasterCareFAQSection";
import { MasterCareApplicationSection } from "@/components/sections/mastercare/MasterCareApplicationSection";

const MasterCarePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <MasterCareHeroSection />
        <MasterCarePackagesSection />
        <MasterCareServicesSection />
        <MasterCareFAQSection />
        <MasterCareApplicationSection />
      </main>
      <Footer />
      <KakaoFloatingButton />
    </div>
  );
};

export default MasterCarePage;
