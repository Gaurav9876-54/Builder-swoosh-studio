import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SplashScreen } from "@/components/SplashScreen";

const SplashPage = () => {
  const navigate = useNavigate();
  const { state } = useAuth();

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  // If auth is still loading, show splash screen anyway (it looks like loading)
  // This prevents the ugly loading spinner from ProtectedRoute

  const handleSplashComplete = () => {
    // Mark that user has seen the splash screen
    localStorage.setItem("safeguard_has_seen_splash", "true");
    // Navigate to login page after splash screen completes
    navigate("/auth/login");
  };

  // Always show splash screen - it serves as a beautiful loading state
  return <SplashScreen onComplete={handleSplashComplete} />;
};

export default SplashPage;
