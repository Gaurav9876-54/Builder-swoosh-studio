import { useNavigate } from "react-router-dom";
import { SplashScreen } from "@/components/SplashScreen";

const SplashPage = () => {
  const navigate = useNavigate();

  const handleSplashComplete = () => {
    // Mark that user has seen the splash screen
    localStorage.setItem("safeguard_has_seen_splash", "true");
    // Navigate to login page after splash screen completes
    navigate("/auth/login");
  };

  return <SplashScreen onComplete={handleSplashComplete} />;
};

export default SplashPage;
