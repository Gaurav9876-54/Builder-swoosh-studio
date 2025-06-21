import { SafeGuardLogo } from "@/components/SafeGuardLogo";
import { ChildProfileCard } from "@/components/ChildProfileCard";
import { StatsCard } from "@/components/StatsCard";
import { MobileNav, SOSButton } from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Shield,
  AlertTriangle,
  MapPin,
  Users,
  Settings,
  Plus,
} from "lucide-react";

// Mock data for demonstration
const children = [
  {
    id: "1",
    name: "Emma Johnson",
    age: 12,
    isOnline: true,
    screenTimeToday: "3h 45m",
    alertsCount: 0,
    avatar: "",
  },
  {
    id: "2",
    name: "Lucas Johnson",
    age: 8,
    isOnline: false,
    screenTimeToday: "1h 20m",
    alertsCount: 2,
    avatar: "",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <SafeGuardLogo size="md" />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Good morning, Sarah
          </h1>
          <p className="text-muted-foreground">
            Your family's digital safety at a glance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatsCard
            title="Children Online"
            value="1"
            subtitle="of 2 active"
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Active Alerts"
            value="2"
            subtitle="Need attention"
            icon={AlertTriangle}
            variant="warning"
          />
          <StatsCard
            title="Total Screen Time"
            value="5h 5m"
            subtitle="Today"
            icon={Clock}
            variant="default"
          />
          <StatsCard
            title="Safe Locations"
            value="All Clear"
            subtitle="GPS tracking"
            icon={MapPin}
            variant="success"
          />
        </div>

        {/* Children Profiles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Your Children
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Child
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {children.map((child) => (
              <ChildProfileCard
                key={child.id}
                child={child}
                onClick={() => console.log(`Selected child: ${child.name}`)}
              />
            ))}
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
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Shield className="h-6 w-6 text-safe-500" />
              <span className="text-sm">Content Filters</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Clock className="h-6 w-6 text-safe-500" />
              <span className="text-sm">Screen Time</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <MapPin className="h-6 w-6 text-safe-500" />
              <span className="text-sm">Location</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <AlertTriangle className="h-6 w-6 text-safe-500" />
              <span className="text-sm">View Alerts</span>
            </Button>
          </CardContent>
        </Card>

        {/* Safety Tip */}
        <Card className="bg-accent border-accent-foreground/10">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-accent-foreground mt-0.5 flex-shrink-0" />
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
