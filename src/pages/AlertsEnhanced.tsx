import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNav, SOSButton } from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  Clock,
  MapPin,
  MessageSquare,
  Shield,
  Smartphone,
  Eye,
  CheckCircle,
  X,
  Filter,
  Settings,
  BellRing,
  BellOff,
} from "lucide-react";
import { Alert as AlertType } from "@/types/auth";

// Mock alerts data
const generateMockAlerts = (): AlertType[] => [
  {
    id: "1",
    type: "content",
    severity: "medium",
    title: "Inappropriate Content Blocked",
    description: "Blocked access to social media during study hours",
    childId: "child-1",
    childName: "Emma Johnson",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    isRead: false,
    actionRequired: false,
    metadata: {
      website: "instagram.com",
      category: "social_media",
    },
  },
  {
    id: "2",
    type: "screentime",
    severity: "low",
    title: "Daily Screen Time Limit Reached",
    description: "Lucas has reached his daily screen time limit of 2 hours",
    childId: "child-2",
    childName: "Lucas Johnson",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    isRead: false,
    actionRequired: true,
    metadata: {
      timeUsed: 120,
      timeLimit: 120,
    },
  },
  {
    id: "3",
    type: "location",
    severity: "high",
    title: "Left Safe Zone",
    description: "Emma has left the school safe zone",
    childId: "child-1",
    childName: "Emma Johnson",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    isRead: true,
    actionRequired: false,
    metadata: {
      safeZone: "Roosevelt Elementary School",
      currentLocation: "Main Street Park",
    },
  },
  {
    id: "4",
    type: "communication",
    severity: "medium",
    title: "New Contact Attempted",
    description: "Unknown contact tried to message Lucas",
    childId: "child-2",
    childName: "Lucas Johnson",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    isRead: true,
    actionRequired: true,
    metadata: {
      contactName: "Unknown User",
      platform: "WhatsApp",
      message: "Hey, want to play a game?",
    },
  },
  {
    id: "5",
    type: "content",
    severity: "high",
    title: "Suspicious Website Access",
    description: "Attempt to access potentially harmful website",
    childId: "child-1",
    childName: "Emma Johnson",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: true,
    actionRequired: false,
    metadata: {
      website: "suspicious-site.com",
      category: "potentially_harmful",
    },
  },
];

const AlertsEnhanced = () => {
  const { state } = useAuth();
  const [alerts, setAlerts] = useState<AlertType[]>(generateMockAlerts());
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [filterBy, setFilterBy] = useState<"all" | "unread" | "priority">(
    "all",
  );
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailAlerts: true,
    criticalOnly: false,
    soundEnabled: true,
  });

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new alerts (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        const newAlert: AlertType = {
          id: Date.now().toString(),
          type: ["content", "screentime", "location", "communication"][
            Math.floor(Math.random() * 4)
          ] as any,
          severity: ["low", "medium", "high"][
            Math.floor(Math.random() * 3)
          ] as any,
          title: "New Alert",
          description: "A new alert has been generated",
          childId: state.children[0]?.id || "child-1",
          childName: state.children[0]?.firstName || "Emma",
          timestamp: new Date().toISOString(),
          isRead: false,
          actionRequired: Math.random() > 0.5,
        };

        setAlerts((prev) => [newAlert, ...prev]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [state.children]);

  const markAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert,
      ),
    );
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    if (selectedAlert?.id === alertId) {
      setSelectedAlert(null);
    }
  };

  const getFilteredAlerts = () => {
    switch (filterBy) {
      case "unread":
        return alerts.filter((alert) => !alert.isRead);
      case "priority":
        return alerts.filter(
          (alert) => alert.severity === "high" || alert.actionRequired,
        );
      default:
        return alerts;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "content":
        return Shield;
      case "screentime":
        return Clock;
      case "location":
        return MapPin;
      case "communication":
        return MessageSquare;
      case "emergency":
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - alertTime.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;
  const priorityCount = alerts.filter(
    (alert) => alert.severity === "high" || alert.actionRequired,
  ).length;

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
            <h1 className="text-lg font-semibold">Alerts</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFilterBy(filterBy === "all" ? "unread" : "all")}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Dialog>
              <Button variant="ghost" size="icon" asChild>
                <Settings className="h-4 w-4" />
              </Button>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">
                    {unreadCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Unread</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning-600">
                    {priorityCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Priority</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-muted-foreground">
                    {alerts.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark All Read
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <Tabs
          value={filterBy}
          onValueChange={(value: any) => setFilterBy(value)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="priority">
              Priority ({priorityCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filterBy} className="mt-4 space-y-3">
            {getFilteredAlerts().length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {filterBy === "unread"
                      ? "No Unread Alerts"
                      : filterBy === "priority"
                        ? "No Priority Alerts"
                        : "No Alerts"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {filterBy === "unread"
                      ? "All alerts have been read"
                      : filterBy === "priority"
                        ? "No high-priority alerts at this time"
                        : "Your family's activity is looking safe"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              getFilteredAlerts().map((alert) => {
                const AlertIcon = getAlertIcon(alert.type);
                const child = state.children.find(
                  (c) => c.id === alert.childId,
                );

                return (
                  <Card
                    key={alert.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      !alert.isRead ? "border-l-4 border-l-primary" : ""
                    }`}
                    onClick={() => {
                      setSelectedAlert(alert);
                      if (!alert.isRead) markAsRead(alert.id);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Alert Icon */}
                        <div
                          className={`p-2 rounded-lg ${
                            alert.severity === "high"
                              ? "bg-destructive/10 text-destructive"
                              : alert.severity === "medium"
                                ? "bg-warning-100 text-warning-700"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <AlertIcon className="h-4 w-4" />
                        </div>

                        {/* Alert Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-semibold text-sm ${
                                !alert.isRead
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {alert.title}
                            </h3>
                            <Badge variant={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            {alert.actionRequired && (
                              <Badge variant="outline" className="text-xs">
                                Action Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {alert.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {child && (
                                <Avatar className="h-4 w-4">
                                  <AvatarImage
                                    src={child.avatar}
                                    alt={child.firstName}
                                  />
                                  <AvatarFallback className="bg-safe-100 text-safe-700 text-xs">
                                    {getInitials(
                                      `${child.firstName} ${child.lastName}`,
                                    )}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <span>{alert.childName}</span>
                            </div>
                            <span>•</span>
                            <span>{formatTimeAgo(alert.timestamp)}</span>
                          </div>
                        </div>

                        {/* Unread indicator */}
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Alert Detail Dialog */}
      <Dialog
        open={!!selectedAlert}
        onOpenChange={() => setSelectedAlert(null)}
      >
        <DialogContent className="max-w-sm">
          {selectedAlert && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const AlertIcon = getAlertIcon(selectedAlert.type);
                    return <AlertIcon className="h-5 w-5" />;
                  })()}
                  {selectedAlert.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.severity}
                  </Badge>
                  {selectedAlert.actionRequired && (
                    <Badge variant="outline">Action Required</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {selectedAlert.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Child:</span>
                    <span>{selectedAlert.childName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>
                      {new Date(selectedAlert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{selectedAlert.type}</span>
                  </div>
                </div>

                {selectedAlert.metadata && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Details:</h4>
                    <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
                      {Object.entries(selectedAlert.metadata).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">
                              {key.replace("_", " ")}:
                            </span>
                            <span>{String(value)}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAlert(selectedAlert.id)}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                  {selectedAlert.actionRequired && (
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <MobileNav />
      <SOSButton />
    </div>
  );
};

export default AlertsEnhanced;
