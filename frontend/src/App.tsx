import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminRegister from "./pages/AdminRegister";
import ProjectDetails from "./pages/ProjectDetails";
import CertificateDetails from "./pages/CertificateDetails";
import HackathonDetails from "./pages/HackathonDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/certificates/:certificateId" element={<CertificateDetails />} />
          <Route path="/hackathons/:hackathonId" element={<HackathonDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
