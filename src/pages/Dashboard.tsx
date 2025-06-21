import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirect to the enhanced activity overview
const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new detailed activity overview
    navigate("/activity-overview", { replace: true });
  }, [navigate]);

  return null; // This component just redirects
};

export default Dashboard;
