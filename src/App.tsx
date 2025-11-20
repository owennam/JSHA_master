import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { logPageView } from "@/lib/firebase";
import Index from "./pages/Index";
import EducationPage from "./pages/EducationPage";
import VideoDetailPage from "./pages/VideoDetailPage";
import WorkshopVideoDetailPage from "./pages/WorkshopVideoDetailPage";
import HospitalsPage from "./pages/HospitalsPage";
import NewsletterListPage from "./pages/NewsletterListPage";
import NewsletterDetailPage from "./pages/NewsletterDetailPage";
import AuthPage from "./pages/AuthPage";
import ProductPage from "./pages/ProductPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailPage from "./pages/PaymentFailPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import RecapPage from "./pages/RecapPage";
import MasterCarePage from "./pages/MasterCarePage";
import NotFound from "./pages/NotFound";

// Admin Components
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminApplicationsPage from "@/pages/admin/AdminApplicationsPage";
import AdminMasterCarePage from "@/pages/admin/AdminMasterCarePage";

const queryClient = new QueryClient();

// Analytics 페이지뷰 추적 컴포넌트
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // 페이지 변경 시 자동으로 페이지뷰 로깅
    logPageView(location.pathname, document.title);
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnalyticsTracker />
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/education/:id" element={<VideoDetailPage />} />
          <Route path="/workshop/:id" element={<WorkshopVideoDetailPage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/newsletter" element={<NewsletterListPage />} />
          <Route path="/newsletter/:id" element={<NewsletterDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/fail" element={<PaymentFailPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/recap" element={<RecapPage />} />
          <Route path="/mastercare" element={<MasterCarePage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="applications" element={<AdminApplicationsPage />} />
            <Route path="mastercare" element={<AdminMasterCarePage />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
