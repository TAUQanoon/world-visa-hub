import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ClientLayout } from "./layouts/ClientLayout";
import { StaffLayout } from "./layouts/StaffLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import ClientDashboard from "./pages/client/Dashboard";
import ClientDocuments from "./pages/client/Documents";
import ClientMessages from "./pages/client/Messages";
import ClientPayments from "./pages/client/Payments";
import ClientProfile from "./pages/client/Profile";
import StaffDashboard from "./pages/staff/Dashboard";
import StaffCases from "./pages/staff/Cases";
import StaffMessages from "./pages/staff/Messages";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Client Portal Routes */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <ClientLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ClientDashboard />} />
              <Route path="documents" element={<ClientDocuments />} />
              <Route path="messages" element={<ClientMessages />} />
              <Route path="payments" element={<ClientPayments />} />
              <Route path="profile" element={<ClientProfile />} />
            </Route>

            {/* Staff Dashboard Routes */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute>
                  <StaffLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StaffDashboard />} />
              <Route path="cases" element={<StaffCases />} />
              <Route path="clients" element={<div className="text-center py-12 text-muted-foreground">Clients Database (Coming Soon)</div>} />
              <Route path="documents" element={<div className="text-center py-12 text-muted-foreground">Document Review (Coming Soon)</div>} />
              <Route path="messages" element={<StaffMessages />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="visa-types" element={<div className="text-center py-12 text-muted-foreground">Visa Types Config (Coming Soon)</div>} />
              <Route path="forms" element={<div className="text-center py-12 text-muted-foreground">Form Templates (Coming Soon)</div>} />
              <Route path="payments" element={<div className="text-center py-12 text-muted-foreground">Payment Management (Coming Soon)</div>} />
              <Route path="builder-webhooks" element={<div className="text-center py-12 text-muted-foreground">Builder.io Webhooks (Coming Soon)</div>} />
              <Route path="settings" element={<div className="text-center py-12 text-muted-foreground">System Settings (Coming Soon)</div>} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
