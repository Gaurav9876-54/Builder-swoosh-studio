import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SafeGuardLogo } from "@/components/SafeGuardLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Heart,
  Star,
  Shield,
} from "lucide-react";

// Mock child profiles for demo
const mockChildren = [
  {
    id: "child-1",
    firstName: "Emma",
    lastName: "Johnson",
    age: 12,
    avatar: "",
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "child-2",
    firstName: "Lucas",
    lastName: "Johnson",
    age: 8,
    avatar: "",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "child-3",
    firstName: "Sophie",
    lastName: "Johnson",
    age: 10,
    avatar: "",
    color: "bg-purple-100 text-purple-700",
  },
];

const ChildLogin = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChildSelect = (childId: string) => {
    setSelectedChild(childId);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) {
      setError("Please select your profile");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate child authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would authenticate the child and set their session
      console.log(`Child ${selectedChild} authenticated`);
      navigate("/child-dashboard");
    } catch (err) {
      setError("Incorrect password. Please try again or ask your parent.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedChildData = mockChildren.find(
    (child) => child.id === selectedChild,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Link to="/auth/login">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <SafeGuardLogo size="md" showText={false} />
        </div>

        {/* Child Selection */}
        <Card className="border-2 border-dashed border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 p-3 bg-primary/10 rounded-full w-fit">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold text-primary">
              Hi There! 👋
            </CardTitle>
            <p className="text-muted-foreground">
              Select your profile to continue
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {mockChildren.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleChildSelect(child.id)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedChild === child.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={child.avatar} alt={child.firstName} />
                    <AvatarFallback className={child.color}>
                      {child.firstName[0]}
                      {child.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">
                      {child.firstName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Age {child.age}
                    </p>
                  </div>
                  {selectedChild === child.id && (
                    <div className="p-2 bg-primary rounded-full">
                      <Star className="h-4 w-4 text-primary-foreground fill-current" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Password Entry */}
        {selectedChild && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedChildData?.avatar}
                    alt={selectedChildData?.firstName}
                  />
                  <AvatarFallback className={selectedChildData?.color}>
                    {selectedChildData?.firstName[0]}
                    {selectedChildData?.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-lg">
                Welcome back, {selectedChildData?.firstName}! 🌟
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Enter your secret code to continue
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Secret Code</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your secret code"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      className="pl-10 pr-10 text-center text-lg tracking-widest"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Checking..." : "Let's Go! 🚀"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Forgot your secret code?
                </p>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-3 w-3" />
                  Ask a Parent
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safety Message */}
        <Card className="bg-accent border-accent-foreground/10">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-accent-foreground mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-accent-foreground mb-1">
                  Stay Safe Online! 🛡️
                </h3>
                <p className="text-sm text-accent-foreground/80">
                  Remember: Never share your secret code with anyone except your
                  parents!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent Login Link */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Are you a parent?{" "}
            <Link
              to="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChildLogin;
