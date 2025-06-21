import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNav, SOSButton } from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Smartphone,
  Globe,
  Shield,
  AlertTriangle,
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react";
import { Child } from "@/types/auth";

// API placeholder functions - Replace with actual API calls
const activityAPI = {
  // GET /api/families/{familyId}/activity/overview
  async getActivityOverview(familyId: string, timeframe: string) {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/families/${familyId}/activity/overview?timeframe=${timeframe}`);
    // return response.json();

    // Mock data for now
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockActivityData;
  },

  // GET /api/children/{childId}/activity/detailed
  async getChildDetailedActivity(childId: string, date: string) {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/children/${childId}/activity/detailed?date=${date}`);
    // return response.json();

    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockDetailedActivity;
  },

  // GET /api/families/{familyId}/activity/alerts
  async getActivityAlerts(familyId: string) {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/families/${familyId}/activity/alerts`);
    // return response.json();

    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockActivityAlerts;
  },

  // POST /api/families/{familyId}/activity/export
  async exportActivityReport(familyId: string, options: any) {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/families/${familyId}/activity/export`, {
    //   method: 'POST',
    //   body: JSON.stringify(options)
    // });
    // return response.blob();

    console.log("Exporting activity report...", options);
    return new Blob(["Mock report data"], { type: "text/csv" });
  },
};

// Mock data - Remove when integrating with real API
const mockActivityData = {
  summary: {
    totalScreenTime: 1260, // minutes
    averageDaily: 180,
    weeklyTrend: 12, // percentage increase
    topCategory: "Educational",
    alertsCount: 3,
    devicesCount: 8,
  },
  weeklyBreakdown: [
    { day: "Mon", screenTime: 150, productivity: 65, safety: 92 },
    { day: "Tue", screenTime: 180, productivity: 58, safety: 88 },
    { day: "Wed", screenTime: 200, productivity: 72, safety: 95 },
    { day: "Thu", screenTime: 165, productivity: 60, safety: 90 },
    { day: "Fri", screenTime: 220, productivity: 45, safety: 85 },
    { day: "Sat", screenTime: 180, productivity: 55, safety: 88 },
    { day: "Sun", screenTime: 165, productivity: 70, safety: 94 },
  ],
  categoryBreakdown: [
    { category: "Educational", minutes: 420, percentage: 33, trend: "up" },
    { category: "Entertainment", minutes: 380, percentage: 30, trend: "down" },
    { category: "Social Media", minutes: 252, percentage: 20, trend: "up" },
    { category: "Games", minutes: 140, percentage: 11, trend: "stable" },
    { category: "Other", minutes: 68, percentage: 6, trend: "down" },
  ],
  topApps: [
    {
      name: "Khan Academy",
      usage: 180,
      category: "Educational",
      safety: "safe",
    },
    {
      name: "YouTube Kids",
      usage: 150,
      category: "Entertainment",
      safety: "monitored",
    },
    { name: "Scratch Jr", usage: 90, category: "Educational", safety: "safe" },
    { name: "Minecraft", usage: 75, category: "Games", safety: "safe" },
    {
      name: "Messages",
      usage: 45,
      category: "Communication",
      safety: "monitored",
    },
  ],
  devices: [
    {
      name: "Emma's iPad",
      usage: 480,
      lastActive: "5 min ago",
      status: "active",
    },
    {
      name: "Lucas's iPhone",
      usage: 240,
      lastActive: "2 hours ago",
      status: "inactive",
    },
    {
      name: "Family Computer",
      usage: 300,
      lastActive: "30 min ago",
      status: "active",
    },
    {
      name: "Smart TV",
      usage: 240,
      lastActive: "1 hour ago",
      status: "inactive",
    },
  ],
};

const mockDetailedActivity = {
  timeline: [
    {
      time: "08:00",
      app: "Khan Academy",
      duration: 45,
      category: "Educational",
    },
    {
      time: "09:30",
      app: "YouTube Kids",
      duration: 30,
      category: "Entertainment",
    },
    { time: "11:00", app: "Scratch Jr", duration: 60, category: "Educational" },
    { time: "14:00", app: "Minecraft", duration: 45, category: "Games" },
    { time: "16:30", app: "Messages", duration: 15, category: "Communication" },
  ],
  websiteActivity: [
    { site: "kids.nationalgeographic.com", visits: 5, duration: 25 },
    { site: "scratch.mit.edu", visits: 3, duration: 45 },
    { site: "khanacademy.org", visits: 8, duration: 120 },
  ],
  safetyEvents: [
    {
      time: "10:15",
      event: "Blocked inappropriate content",
      site: "restricted-site.com",
    },
    {
      time: "15:30",
      event: "Screen time warning",
      detail: "15 minutes remaining",
    },
  ],
};

const mockActivityAlerts = [
  {
    id: "1",
    type: "screen_time",
    severity: "medium",
    child: "Lucas",
    message: "Exceeded daily limit by 30 minutes",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "content",
    severity: "high",
    child: "Emma",
    message: "Attempted to access blocked website",
    time: "4 hours ago",
  },
  {
    id: "3",
    type: "app_usage",
    severity: "low",
    child: "Lucas",
    message: "Spent 2+ hours on games today",
    time: "6 hours ago",
  },
];

const ActivityOverview = () => {
  const { state } = useAuth();
  const [timeframe, setTimeframe] = useState("week");
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [activityData, setActivityData] = useState<any>(null);
  const [detailedActivity, setDetailedActivity] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch activity data when component mounts or filters change
  useEffect(() => {
    const fetchActivityData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API calls
        const [overview, alertsData] = await Promise.all([
          activityAPI.getActivityOverview(state.family?.id || "", timeframe),
          activityAPI.getActivityAlerts(state.family?.id || ""),
        ]);

        setActivityData(overview);
        setAlerts(alertsData);
      } catch (error) {
        console.error("Failed to fetch activity data:", error);
        // TODO: Show error toast
      } finally {
        setIsLoading(false);
      }
    };

    if (state.family?.id) {
      fetchActivityData();
    }
  }, [state.family?.id, timeframe]);

  // Fetch detailed activity for selected child
  useEffect(() => {
    const fetchDetailedActivity = async () => {
      if (selectedChild && selectedChild !== "all") {
        try {
          const detailed = await activityAPI.getChildDetailedActivity(
            selectedChild,
            new Date().toISOString().split("T")[0],
          );
          setDetailedActivity(detailed);
        } catch (error) {
          console.error("Failed to fetch detailed activity:", error);
        }
      }
    };

    fetchDetailedActivity();
  }, [selectedChild]);

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      // TODO: Replace with actual API call
      const reportBlob = await activityAPI.exportActivityReport(
        state.family?.id || "",
        {
          timeframe,
          childId: selectedChild,
          includeDetails: true,
        },
      );

      // Download the report
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `activity-report-${timeframe}-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export report:", error);
      // TODO: Show error toast
    } finally {
      setIsExporting(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case "safe":
        return "text-success-600 bg-success-100";
      case "monitored":
        return "text-warning-600 bg-warning-100";
      case "blocked":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-white border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Activity Overview</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading activity data...</p>
            </div>
          </div>
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
            <h1 className="text-lg font-semibold">Activity Overview</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExportReport}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <div className="flex gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All children" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {state.children.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.firstName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {formatTime(activityData?.summary.totalScreenTime || 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Screen Time</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                {activityData?.summary.weeklyTrend > 0 ? (
                  <TrendingUp className="h-3 w-3 text-red-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-green-500" />
                )}
                <span className="text-xs text-muted-foreground">
                  {Math.abs(activityData?.summary.weeklyTrend || 0)}% this week
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 text-success-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {activityData?.summary.alertsCount || 0}
              </p>
              <p className="text-sm text-muted-foreground">Safety Alerts</p>
              <p className="text-xs text-success-600 mt-1">
                {activityData?.summary.alertsCount === 0
                  ? "All clear"
                  : "Needs attention"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apps">Apps</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Weekly Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityData?.weeklyBreakdown.map(
                    (day: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{day.day}</span>
                          <span className="text-muted-foreground">
                            {formatTime(day.screenTime)}
                          </span>
                        </div>
                        <Progress
                          value={(day.screenTime / 300) * 100}
                          className="h-2"
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Safety: {day.safety}%</span>
                          <span>Productivity: {day.productivity}%</span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Content Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityData?.categoryBreakdown.map(
                    (category: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                              }}
                            />
                            <span className="font-medium text-sm">
                              {category.category}
                            </span>
                          </div>
                          {getTrendIcon(category.trend)}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatTime(category.minutes)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {category.percentage}%
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apps Tab */}
          <TabsContent value="apps" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityData?.topApps.map((app: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <Smartphone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{app.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {app.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatTime(app.usage)}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getSafetyColor(app.safety)}`}
                        >
                          {app.safety}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Device Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityData?.devices.map((device: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            device.status === "active"
                              ? "bg-success-500"
                              : "bg-muted"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-sm">{device.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {device.lastActive}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">
                        {formatTime(device.usage)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Detailed trend analysis and predictive insights coming soon.
                </p>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Set Up Reports
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety Tab */}
          <TabsContent value="safety" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Safety Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert: any) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-lg border-l-4 border-l-warning-400 bg-warning-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.child} • {alert.time}
                          </p>
                        </div>
                        <Badge
                          variant={
                            alert.severity === "high"
                              ? "destructive"
                              : alert.severity === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {detailedActivity && selectedChild !== "all" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Today's Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {detailedActivity.timeline.map(
                      (event: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="text-xs text-muted-foreground w-12">
                            {event.time}
                          </div>
                          <div className="flex-1 p-2 rounded border">
                            <p className="text-sm font-medium">{event.app}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.duration}m • {event.category}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <MobileNav />
      <SOSButton />
    </div>
  );
};

export default ActivityOverview;
