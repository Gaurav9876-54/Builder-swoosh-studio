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
  redirectTo = "/splash",
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
    // Redirect to login with return path
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requiresAuth && state.isAuthenticated) {
    // If user is already authenticated and trying to access auth pages
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
