// App composition: routing, providers, and protected/public route guards
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { useAppSelector } from './hooks/redux';
import { AuthPage } from './pages/AuthPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { Layout } from './components/layout/Layout';
import NotFound from "./pages/NotFound";

// Single shared React Query client instance
const queryClient = new QueryClient();

// Wrapper that redirects unauthenticated users to sign-in
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
};

// Wrapper that keeps authenticated users out of public pages
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

// Main app content: providers + routes
const AppContent = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/auth" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          } />
          {/* Protected application area */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          {/* Default and 404 */}
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Redux provider and persisted store gate
const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppContent />
    </PersistGate>
  </Provider>
);

export default App;
