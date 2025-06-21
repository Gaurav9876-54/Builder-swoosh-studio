import { useNavigate } from "react-router-dom";
import { SplashScreen } from "@/components/SplashScreen";

const SplashPage = () => {
  const navigate = useNavigate();

  const handleSplashComplete = () => {
    // Navigate to login page after splash screen completes
    navigate("/auth/login");
  };

  return <SplashScreen onComplete={handleSplashComplete} />;
};

export default SplashPage;
