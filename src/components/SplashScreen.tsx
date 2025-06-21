import { useEffect, useState } from "react";
import { SafeGuardLogo } from "@/components/SafeGuardLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Heart,
  Users,
  Lock,
  CheckCircle,
  Play,
  ArrowRight,
  Clock,
  MapPin,
  MessageSquare,
  Smartphone,
  BookOpen,
  Zap,
} from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const coreFeatures = [
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

  const quickStartOptions = [
    {
      id: "demo",
      icon: Play,
      title: "Try Demo",
      description: "Explore Safe Guard with sample data",
      color: "bg-blue-500",
      badge: "Interactive",
    },
    {
      id: "guide",
      icon: BookOpen,
      title: "Quick Guide",
      description: "5-minute setup walkthrough",
      color: "bg-green-500",
      badge: "5 min",
    },
    {
      id: "setup",
      icon: Zap,
      title: "Fast Setup",
      description: "Get protection in 3 steps",
      color: "bg-purple-500",
      badge: "3 steps",
    },
  ];

  const demoFeatures = [
    {
      id: "screentime",
      icon: Clock,
      title: "Screen Time Controls",
      description: "Set daily limits and bedtime schedules",
      preview: "2h 30m today • 30m remaining",
    },
    {
      id: "location",
      icon: MapPin,
      title: "Location Safety",
      description: "Track location with safe zone alerts",
      preview: "Home • School • 2 safe zones",
    },
    {
      id: "content",
      icon: Shield,
      title: "Content Filtering",
      description: "Block inappropriate content automatically",
      preview: "Moderate filter • 15 sites blocked",
    },
    {
      id: "communication",
      icon: MessageSquare,
      title: "Communication Monitoring",
      description: "Review messages for safety",
      preview: "3 contacts approved • Monitoring active",
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
        if (prev >= coreFeatures.length - 1) {
          clearInterval(featureInterval);
          // Show interactive features after core features
          setTimeout(() => {
            setShowFeatures(true);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => {
      clearTimeout(loadTimeout);
      clearInterval(featureInterval);
    };
  }, [onComplete, coreFeatures.length]);

  const handleGetStarted = (option: string) => {
    if (option === "demo") {
      // Set demo mode in localStorage
      localStorage.setItem("safeguard_demo_mode", "true");
    }
    onComplete();
  };

  const handleDemoFeature = (featureId: string) => {
    setSelectedDemo(featureId);
    // Auto-close demo after 3 seconds
    setTimeout(() => {
      setSelectedDemo(null);
    }, 3000);
  };

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
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 max-w-lg mx-auto">
        {!showFeatures ? (
          <>
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
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }`}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-safe-600 to-blue-600 bg-clip-text text-transparent">
                Safe Guard
              </h1>
            </div>

            {/* Tagline */}
            <div
              className={`mb-12 transition-all duration-1000 delay-500 transform ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }`}
            >
              <p className="text-lg text-muted-foreground font-medium">
                Protecting Your Family's Digital Life
              </p>
            </div>

            {/* Core Feature Showcase */}
            <div
              className={`transition-all duration-1000 delay-700 transform ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }`}
            >
              <div className="space-y-4">
                {coreFeatures.map((feature, index) => {
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
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-safe-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentStep + 1) / coreFeatures.length) * 100}%`,
                }}
              ></div>
            </div>
          </>
        ) : (
          <>
            {/* Get Started Section */}
            <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Header */}
              <div className="text-center">
                <div className="mb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-safe-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Ready to Get Started?
                </h2>
                <p className="text-muted-foreground">
                  Choose how you'd like to begin your Safe Guard journey
                </p>
              </div>

              {/* Quick Start Options */}
              <div className="space-y-3">
                {quickStartOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <Card
                      key={option.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => handleGetStarted(option.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 ${option.color} rounded-full text-white`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">
                                {option.title}
                              </h3>
                              <Badge variant="secondary" className="text-xs">
                                {option.badge}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Feature Preview */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-center mb-4">
                  Preview Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {demoFeatures.map((feature) => {
                    const Icon = feature.icon;
                    const isSelected = selectedDemo === feature.id;

                    return (
                      <Card
                        key={feature.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95 ${
                          isSelected ? "ring-2 ring-primary border-primary" : ""
                        }`}
                        onClick={() => handleDemoFeature(feature.id)}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="mb-2">
                            <div className="mx-auto w-8 h-8 bg-safe-100 rounded-full flex items-center justify-center">
                              <Icon className="h-4 w-4 text-safe-600" />
                            </div>
                          </div>
                          <h4 className="font-medium text-sm mb-1">
                            {feature.title}
                          </h4>
                          {isSelected && (
                            <div className="text-xs text-muted-foreground bg-muted rounded p-2 animate-in fade-in duration-300">
                              {feature.preview}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Skip Option */}
              <div className="text-center pt-4">
                <button
                  onClick={onComplete}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip and sign in →
                </button>
              </div>
            </div>
          </>
        )}
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
