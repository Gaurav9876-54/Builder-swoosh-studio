import { useEffect, useState } from "react";
import { SafeGuardLogo } from "@/components/SafeGuardLogo";
import { Shield, Heart, Users, Lock, CheckCircle } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const features = [
    {
      icon: Shield,
      text: "Advanced Protection",
      color: "text-safe-500",
    },
    {
      icon: Heart,
      text: "Family Safety",
      color: "text-pink-500",
    },
    {
      icon: Users,
      text: "Multi-Child Support",
      color: "text-purple-500",
    },
    {
      icon: Lock,
      text: "Privacy First",
      color: "text-green-500",
    },
  ];

  useEffect(() => {
    // Initial load animation
    const loadTimeout = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Feature showcase animation
    const featureInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= features.length - 1) {
          clearInterval(featureInterval);
          // Complete splash screen after showing all features
          setTimeout(() => {
            onComplete();
          }, 1500);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => {
      clearTimeout(loadTimeout);
      clearInterval(featureInterval);
    };
  }, [onComplete, features.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-safe-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-safe-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-30 animate-bounce delay-300"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse delay-500"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-safe-300 to-blue-300 rounded-full opacity-20 blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-20 blur-xl animate-float-delayed"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 max-w-md mx-auto">
        {/* Logo Animation */}
        <div
          className={`mb-8 transition-all duration-1000 transform ${
            isLoaded
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-10 opacity-0 scale-75"
          }`}
        >
          <div className="relative">
            {/* Glowing Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-safe-400 to-blue-500 rounded-full blur-2xl opacity-30 scale-150 animate-pulse"></div>

            {/* Logo Container */}
            <div className="relative bg-white rounded-full p-6 shadow-2xl border border-safe-100">
              <SafeGuardLogo size="lg" showText={false} />
            </div>

            {/* Rotating Ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-safe-400 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* App Name */}
        <div
          className={`mb-2 transition-all duration-1000 delay-300 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-safe-600 to-blue-600 bg-clip-text text-transparent">
            Safe Guard
          </h1>
        </div>

        {/* Tagline */}
        <div
          className={`mb-12 transition-all duration-1000 delay-500 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <p className="text-lg text-muted-foreground font-medium">
            Protecting Your Family's Digital Life
          </p>
        </div>

        {/* Feature Showcase */}
        <div
          className={`transition-all duration-1000 delay-700 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index <= currentStep;
              const isCompleted = index < currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 transform ${
                    isActive
                      ? "translate-x-0 opacity-100"
                      : "translate-x-4 opacity-30"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full transition-all duration-500 ${
                      isCompleted
                        ? "bg-success-100 text-success-600"
                        : isActive
                          ? `bg-safe-100 ${feature.color}`
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`font-medium transition-colors duration-500 ${
                      isCompleted
                        ? "text-success-700"
                        : isActive
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {feature.text}
                  </span>
                  {isActive && !isCompleted && (
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-100"></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-200"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicator */}
        <div
          className={`mt-8 w-32 h-1 bg-muted rounded-full overflow-hidden transition-all duration-1000 delay-900 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-safe-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep + 1) / features.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent"></div>

      {/* Subtle Sparkles */}
      <div className="absolute top-16 left-16 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-32 right-20 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-1500"></div>
      <div className="absolute bottom-40 left-32 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-2000"></div>
    </div>
  );
};

// Custom animations for CSS
const style = document.createElement("style");
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(1deg); }
    66% { transform: translateY(5px) rotate(-1deg); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(8px) rotate(-1deg); }
    66% { transform: translateY(-12px) rotate(1deg); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float-delayed 8s ease-in-out infinite;
  }
`;
document.head.appendChild(style);
