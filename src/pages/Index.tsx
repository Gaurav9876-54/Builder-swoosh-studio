import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SafeGuardLogo } from "@/components/SafeGuardLogo";
import { ChildProfileCard } from "@/components/ChildProfileCard";
import { StatsCard } from "@/components/StatsCard";
import { MobileNav, SOSButton } from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  Shield,
  AlertTriangle,
  MapPin,
  Users,
  Settings,
  Plus,
  Info,
} from "lucide-react";

const Index = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time for greeting
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Calculate stats from real data
  const childrenOnline = state.children.filter(
    (child) => child.isOnline,
  ).length;
  const totalScreenTime = state.children.reduce(
    (total, child) => total + child.screenTime.today,
    0,
  );

  // Mock alerts count - in real app this would come from alerts context
  const activeAlerts = state.children.reduce((total, child) => {
    // Simulate some alerts based on screen time limits
    const limitExceeded =
      child.screenTime.today >= child.settings.screenTime.dailyLimit;
    return total + (limitExceeded ? 1 : 0);
  }, 0);

  const allChildrenInSafeLocations = state.children.every(
    (child) => child.settings.location.trackingEnabled,
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <SafeGuardLogo size="md" />
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {getGreeting()}, {state.user?.firstName}
          </h1>
          <p className="text-muted-foreground">
            Your family's digital safety at a glance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatsCard
            title="Children Online"
            value={childrenOnline.toString()}
            subtitle={`of ${state.children.length} active`}
            icon={Users}
            variant={childrenOnline > 0 ? "success" : "default"}
          />
          <StatsCard
            title="Active Alerts"
            value={activeAlerts.toString()}
            subtitle={activeAlerts > 0 ? "Need attention" : "All clear"}
            icon={AlertTriangle}
            variant={activeAlerts > 0 ? "warning" : "success"}
          />
          <StatsCard
            title="Total Screen Time"
            value={formatTime(totalScreenTime)}
            subtitle="Today"
            icon={Clock}
            variant="default"
          />
          <StatsCard
            title="Safe Locations"
            value={allChildrenInSafeLocations ? "All Clear" : "Check Status"}
            subtitle="GPS tracking"
            icon={MapPin}
            variant={allChildrenInSafeLocations ? "success" : "warning"}
          />
        </div>

        {/* Children Profiles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Your Children
              </CardTitle>
              <Link to="/family">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Child
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.children.length === 0 ? (
              <div className="text-center py-6">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  No Children Added
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Add your first child to start protecting their digital life
                </p>
                <Link to="/family">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Child
                  </Button>
                </Link>
              </div>
            ) : (
              state.children.map((child) => {
                const limitExceeded =
                  child.screenTime.today >=
                  child.settings.screenTime.dailyLimit;
                return (
                  <ChildProfileCard
                    key={child.id}
                    child={{
                      id: child.id,
                      name: `${child.firstName} ${child.lastName}`,
                      age: child.age,
                      isOnline: child.isOnline,
                      screenTimeToday: formatTime(child.screenTime.today),
                      alertsCount: limitExceeded ? 1 : 0,
                      avatar: child.avatar,
                    }}
                    onClick={() => navigate("/family")}
                  />
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link to="/family">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 w-full"
              >
                <Shield className="h-6 w-6 text-safe-500" />
                <span className="text-sm">Content Filters</span>
              </Button>
            </Link>
            <Link to="/screen-time">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 w-full"
              >
                <Clock className="h-6 w-6 text-safe-500" />
                <span className="text-sm">Screen Time</span>
              </Button>
            </Link>
            <Link to="/family">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 w-full"
              >
                <MapPin className="h-6 w-6 text-safe-500" />
                <span className="text-sm">Location</span>
              </Button>
            </Link>
            <Link to="/alerts">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 w-full"
              >
                <AlertTriangle className="h-6 w-6 text-safe-500" />
                <span className="text-sm">View Alerts</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Family Status Alert */}
        {state.children.length > 0 && activeAlerts > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {activeAlerts} child{activeAlerts > 1 ? "ren have" : " has"}{" "}
              exceeded screen time limits.{" "}
              <Link to="/alerts" className="underline font-medium">
                View alerts
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Safety Tip */}
        <Card className="bg-accent border-accent-foreground/10">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-accent-foreground mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-accent-foreground mb-1">
                  Safety Tip
                </h3>
                <p className="text-sm text-accent-foreground/80">
                  Regular conversations about online safety are more effective
                  than just using parental controls. Talk to your children about
                  their digital experiences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
      <SOSButton />
    </div>
  );
};

export default Index;
