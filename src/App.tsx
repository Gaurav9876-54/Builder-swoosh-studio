import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Protected Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import ScreenTime from "./pages/ScreenTime";
import Settings from "./pages/Settings";

// Authentication Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChildLogin from "./pages/auth/ChildLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Onboarding Pages
import Welcome from "./pages/onboarding/Welcome";
import FamilySetup from "./pages/onboarding/FamilySetup";
import AddChild from "./pages/onboarding/AddChild";

// Profile Pages
import ParentProfile from "./pages/profile/ParentProfile";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication Routes */}
            <Route
              path="/auth/login"
              element={
                <ProtectedRoute requiresAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/register"
              element={
                <ProtectedRoute requiresAuth={false}>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/child-login"
              element={
                <ProtectedRoute requiresAuth={false}>
                  <ChildLogin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/forgot-password"
              element={
                <ProtectedRoute requiresAuth={false}>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />

            {/* Onboarding Routes */}
            <Route
              path="/onboarding/welcome"
              element={
                <ProtectedRoute>
                  <Welcome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/family-setup"
              element={
                <ProtectedRoute>
                  <FamilySetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/add-child"
              element={
                <ProtectedRoute>
                  <AddChild />
                </ProtectedRoute>
              }
            />

            {/* Protected App Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/screen-time"
              element={
                <ProtectedRoute>
                  <ScreenTime />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ParentProfile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
