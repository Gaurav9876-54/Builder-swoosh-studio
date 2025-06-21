import { Home, Activity, Bell, Clock, Settings, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Activity, label: "Activity", path: "/activity-overview" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: Clock, label: "Screen Time", path: "/screen-time" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200",
                "hover:bg-safe-50 active:scale-95",
                isActive
                  ? "text-primary bg-safe-50"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const SOSButton = () => {
  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button className="bg-destructive hover:bg-destructive/90 active:scale-95 text-destructive-foreground rounded-full p-4 shadow-lg transition-all duration-200 animate-pulse">
        <Shield className="h-6 w-6" />
      </button>
    </div>
  );
};
