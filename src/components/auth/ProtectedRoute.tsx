import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  requiresAuth = true,
  redirectTo,
}: ProtectedRouteProps) => {
  const { state } = useAuth();
  const location = useLocation();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (requiresAuth && !state.isAuthenticated) {
    // Check if user has tokens (just logged out) vs never logged in
    const hasToken = localStorage.getItem("safeguard_token");
    const hasSeenApp = localStorage.getItem("safeguard_has_seen_app");

    // If no token and never seen app, show splash screen
    // Otherwise go to login
    const defaultRedirect =
      !hasToken && !hasSeenApp ? "/splash" : "/auth/login";

    // Redirect with return path
    return (
      <Navigate
        to={redirectTo || defaultRedirect}
        state={{ from: location }}
        replace
      />
    );
  }

  if (!requiresAuth && state.isAuthenticated) {
    // If user is already authenticated and trying to access auth pages
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
