import { Shield } from "lucide-react";

interface SafeGuardLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const SafeGuardLogo = ({
  size = "md",
  showText = true,
  className = "",
}: SafeGuardLogoProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Shield className={`${sizeClasses[size]} text-primary`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
        </div>
      </div>
      {showText && (
        <span className={`font-bold text-safe-700 ${textSizeClasses[size]}`}>
          Safe Guard
        </span>
      )}
    </div>
  );
};
