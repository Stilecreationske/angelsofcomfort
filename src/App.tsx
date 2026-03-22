import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Superadmin from './pages/Superadmin';
import SuperadminDashboard from './pages/SuperadminDashboard';
import FamilyDashboard from './pages/FamilyDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
import Daughter from './pages/Daughter';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/daughter" element={<Daughter />} />
            <Route path="/superadmin" element={<Superadmin />} />
            <Route
              path="/superadmin/dashboard"
              element={
                <ProtectedRoute redirectTo="/superadmin" allowedRoles={['superadmin']}>
                  <SuperadminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/family"
              element={
                <ProtectedRoute redirectTo="/" allowedRoles={['family']}>
                  <FamilyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/caregiver"
              element={
                <ProtectedRoute redirectTo="/" allowedRoles={['caregiver']}>
                  <CaregiverDashboard />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
