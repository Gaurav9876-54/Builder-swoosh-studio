import { Navigate, useLocation } from "react-router-dom";
import { useChildAuth } from "@/contexts/ChildAuthContext";
import { Loader2 } from "lucide-react";

interface ChildProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  redirectTo?: string;
}

export const ChildProtectedRoute = ({
  children,
  requiresAuth = true,
  redirectTo = "/auth/child-login",
}: ChildProtectedRouteProps) => {
  const { state } = useChildAuth();
  const location = useLocation();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="text-center">
          <div className="mb-4 p-4 bg-white rounded-full shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Getting ready for you! 🌟
          </h3>
          <p className="text-gray-500">Just a moment please...</p>
        </div>
      </div>
    );
  }

  if (requiresAuth && !state.isAuthenticated) {
    // Redirect to child login with return path
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requiresAuth && state.isAuthenticated) {
    // If child is already authenticated and trying to access auth pages
    const from = location.state?.from?.pathname || "/child-dashboard";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
