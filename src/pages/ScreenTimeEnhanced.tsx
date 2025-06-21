import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import {
  LiveIndicator,
  ConnectionIndicator,
} from "@/components/RealTimeMonitor";
import { MobileNav, SOSButton } from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Clock,
  Smartphone,
  Tv,
  Tablet,
  Laptop,
  Settings,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Calendar,
  BarChart3,
  Edit,
} from "lucide-react";
import { Child } from "@/types/auth";

const ScreenTimeEnhanced = () => {
  const { state, updateChild } = useAuth();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time data integration
  const { getChildScreenTime, isConnected: isRealTimeConnected } =
    useRealTimeData();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Set first child as selected by default
  useEffect(() => {
    if (state.children.length > 0 && !selectedChild) {
      setSelectedChild(state.children[0]);
    }
  }, [state.children, selectedChild]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "phone":
        return Smartphone;
      case "tablet":
        return Tablet;
      case "tv":
        return Tv;
      case "computer":
        return Laptop;
      default:
        return Smartphone;
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTimeRemaining = (child: Child) => {
    // Use real-time data if available
    const realTimeData = getChildScreenTime(child.id);
    const used = realTimeData?.currentUsage || child.screenTime.today;
    const limit = child.settings.screenTime.dailyLimit;
    return Math.max(0, limit - used);
  };

  const getCurrentUsage = (child: Child) => {
    // Use real-time data if available
    const realTimeData = getChildScreenTime(child.id);
    return realTimeData?.currentUsage || child.screenTime.today;
  };

  const isWithinAllowedHours = (child: Child) => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    const bedtime = child.settings.screenTime.bedtime;
    const wakeupTime = child.settings.screenTime.wakeupTime;

    // Simple time comparison (doesn't handle overnight periods)
    return currentTimeString >= wakeupTime && currentTimeString <= bedtime;
  };

  const handlePauseScreenTime = async (child: Child) => {
    // In a real app, this would pause screen time on all devices
    console.log(`Pausing screen time for ${child.firstName}`);
    // Could update a "paused" state in the child's settings
  };

  const handleResetDailyTime = async (child: Child) => {
    // Reset today's screen time
    await updateChild(child.id, {
      screenTime: {
        ...child.screenTime,
        today: 0,
      },
    });
  };

  const handleUpdateSettings = async () => {
    if (!selectedChild || !tempSettings) return;

    await updateChild(selectedChild.id, {
      settings: {
        ...selectedChild.settings,
        screenTime: tempSettings,
      },
    });

    setIsEditing(false);
    setTempSettings(null);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-white border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Screen Time</h1>
          </div>
          <ConnectionIndicator />
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Children Found</h3>
              <p className="text-muted-foreground mb-4">
                Add children to your family to manage their screen time.
              </p>
              <Link to="/family">
                <Button>Add Child</Button>
              </Link>
            </CardContent>
          </Card>
        </main>

        <MobileNav />
        <SOSButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Screen Time</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTempSettings(selectedChild.settings.screenTime);
                  setIsEditing(true);
                }}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Screen Time Settings</DialogTitle>
              </DialogHeader>
              {tempSettings && (
                <div className="space-y-4">
                  <div>
                    <Label>Daily Limit</Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[tempSettings.dailyLimit]}
                        onValueChange={([value]) =>
                          setTempSettings({
                            ...tempSettings,
                            dailyLimit: value,
                          })
                        }
                        max={720} // 12 hours
                        min={30}
                        step={15}
                        className="w-full"
                      />
                      <div className="text-center text-sm font-medium">
                        {formatTime(tempSettings.dailyLimit)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Bedtime</Label>
                      <Input
                        type="time"
                        value={tempSettings.bedtime}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            bedtime: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Wake Up</Label>
                      <Input
                        type="time"
                        value={tempSettings.wakeupTime}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            wakeupTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setTempSettings(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateSettings} className="flex-1">
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Child Selector */}
        {state.children.length > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2 overflow-x-auto">
                {state.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all whitespace-nowrap ${
                      selectedChild.id === child.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={child.avatar} alt={child.firstName} />
                      <AvatarFallback className="bg-safe-100 text-safe-700 text-sm">
                        {getInitials(child.firstName, child.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {child.firstName}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={selectedChild.avatar}
                  alt={selectedChild.firstName}
                />
                <AvatarFallback className="bg-safe-100 text-safe-700">
                  {getInitials(selectedChild.firstName, selectedChild.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedChild.firstName}
                </h2>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectedChild.isOnline ? "bg-success-500" : "bg-muted"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {selectedChild.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Daily Usage Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Today's Usage</span>
                <span className="text-sm text-muted-foreground">
                  {formatTime(getCurrentUsage(selectedChild))} /{" "}
                  {formatTime(selectedChild.settings.screenTime.dailyLimit)}
                </span>
              </div>
              <Progress
                value={
                  (getCurrentUsage(selectedChild) /
                    selectedChild.settings.screenTime.dailyLimit) *
                  100
                }
                className="h-3"
              />
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-muted-foreground">
                  {formatTime(getTimeRemaining(selectedChild))} remaining
                  {isRealTimeConnected && (
                    <span className="ml-1 text-green-600">● Live</span>
                  )}
                </span>
                {!isWithinAllowedHours(selectedChild) && (
                  <Badge variant="secondary">Outside allowed hours</Badge>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePauseScreenTime(selectedChild)}
                className="gap-2"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResetDailyTime(selectedChild)}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Device Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedChild.devices.length > 0 ? (
              <div className="space-y-3">
                {selectedChild.devices.map((device, index) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  // Mock usage data for each device
                  const deviceUsage = Math.floor(
                    selectedChild.screenTime.today /
                      selectedChild.devices.length,
                  );

                  return (
                    <div
                      key={device.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <DeviceIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {device.platform} • {device.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatTime(deviceUsage)}</p>
                        <div
                          className={`w-2 h-2 rounded-full mx-auto ${
                            device.isActive ? "bg-success-500" : "bg-muted"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <Smartphone className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No devices connected yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="week" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>

              <TabsContent value="week" className="mt-4">
                <div className="space-y-3">
                  {/* Mock weekly data */}
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day, index) => {
                    const isToday = index === new Date().getDay();
                    const usage = Math.floor(Math.random() * 300) + 60; // Random usage between 1-5 hours
                    const percentage =
                      (usage / selectedChild.settings.screenTime.dailyLimit) *
                      100;

                    return (
                      <div key={day} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span
                            className={
                              isToday ? "font-medium" : "text-muted-foreground"
                            }
                          >
                            {day}
                            {isToday && " (Today)"}
                          </span>
                          <span className="font-medium">
                            {formatTime(usage)}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(percentage, 100)}
                          className="h-1.5"
                        />
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="month" className="mt-4">
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Monthly analytics coming soon
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Blocked Apps */}
        {selectedChild.settings.screenTime.blockedApps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Blocked Apps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedChild.settings.screenTime.blockedApps.map(
                  (app, index) => (
                    <Badge key={index} variant="destructive">
                      {app}
                    </Badge>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNav />
      <SOSButton />
      <LiveIndicator />
    </div>
  );
};

export default ScreenTimeEnhanced;
