import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { KakaoFloatingButton } from "@/components/layout/KakaoFloatingButton";
import { UrgencyBanner } from "@/components/layout/UrgencyBanner";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { SelfAssessmentSection } from "@/components/sections/SelfAssessmentSection";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { AcademyIntroSection } from "@/components/sections/AcademyIntroSection";
import { InstructorSection } from "@/components/sections/InstructorSection";
import { WorkshopVideoSection } from "@/components/sections/WorkshopVideoSection";
import { CurriculumSection } from "@/components/sections/CurriculumSection";
import { DifferentiationSection } from "@/components/sections/DifferentiationSection";
import { ComparisonTableSection } from "@/components/sections/ComparisonTableSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { InstructorBlogSection } from "@/components/sections/InstructorBlogSection";
import { ClinicalCasesSection } from "@/components/sections/ClinicalCasesSection";
import { TargetAudienceSection } from "@/components/sections/TargetAudienceSection";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ApplicationSection } from "@/components/sections/ApplicationSection";
import { GatheringSection } from "@/components/sections/GatheringSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <UrgencyBanner
        deadline={new Date("2026-03-01")}
        remainingSeats={5}
        totalSeats={10}
        cohortName="2026년 1기"
      />
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <GatheringSection />
        <SelfAssessmentSection />
        <PhilosophySection />
        <ClinicalCasesSection />
        <AcademyIntroSection />
        <InstructorSection />
        <WorkshopVideoSection />
        <CurriculumSection />
        <DifferentiationSection />
        <ComparisonTableSection />
        <BeforeAfterSection />
        <BenefitsSection />
        <InstructorBlogSection />
        <TargetAudienceSection />
        <ScheduleSection />
        <FAQSection />
        <ApplicationSection />
      </main>
      <Footer />
      <KakaoFloatingButton />
    </div>
  );
};

export default Index;
