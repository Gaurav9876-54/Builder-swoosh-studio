import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SafeGuardLogo } from "@/components/SafeGuardLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Clock,
  MapPin,
  Bell,
  Users,
  Heart,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Content Protection",
    description:
      "Advanced filters to block inappropriate content automatically",
    color: "text-safe-500 bg-safe-50",
  },
  {
    icon: Clock,
    title: "Screen Time Management",
    description: "Set healthy limits and track usage across all devices",
    color: "text-blue-500 bg-blue-50",
  },
  {
    icon: MapPin,
    title: "Location Safety",
    description: "Real-time location tracking with safe zone alerts",
    color: "text-green-500 bg-green-50",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Instant notifications for important safety events",
    color: "text-orange-500 bg-orange-50",
  },
  {
    icon: Users,
    title: "Family Management",
    description: "Manage multiple children with personalized settings",
    color: "text-purple-500 bg-purple-50",
  },
  {
    icon: Heart,
    title: "Privacy First",
    description: "Your family's data is encrypted and never shared",
    color: "text-pink-500 bg-pink-50",
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/onboarding/family-setup");
    }
  };

  const handleSkip = () => {
    navigate("/onboarding/family-setup");
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-safe-500 to-safe-600 rounded-full flex items-center justify-center">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Welcome to Safe Guard! 🎉
              </h1>
              <p className="text-lg text-muted-foreground">
                Thank you for choosing Safe Guard to protect your family's
                digital life. Let's get you started with a quick tour.
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Powerful Protection Features
              </h2>
              <p className="text-muted-foreground mb-6">
                Safe Guard provides comprehensive protection for your children's
                online activities
              </p>
            </div>
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                You're All Set! 🚀
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Now let's set up your family profile and add your children to
                get started with Safe Guard.
              </p>
              <div className="bg-accent rounded-lg p-4">
                <p className="text-sm text-accent-foreground">
                  <strong>Next step:</strong> We'll help you create profiles for
                  your children and configure their safety settings.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-safe-50 to-safe-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress */}
        <div className="text-center space-y-2">
          <SafeGuardLogo size="md" className="justify-center" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of 3
            </p>
            <Progress value={((currentStep + 1) / 3) * 100} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-8">{getStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Tour
          </Button>
          <Button onClick={handleNext} className="gap-2">
            {currentStep < 2 ? "Next" : "Get Started"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Help */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help getting started?{" "}
            <button className="text-primary hover:underline font-medium">
              Watch our setup video
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
