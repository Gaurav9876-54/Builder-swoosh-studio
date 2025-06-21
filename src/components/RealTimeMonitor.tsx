import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRealTimeData, useMonitoringHealth } from "@/hooks/useRealTimeData";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wifi,
  WifiOff,
  Activity,
  Clock,
  MapPin,
  Shield,
  Smartphone,
  AlertTriangle,
  RefreshCw,
  Zap,
  Eye,
  Signal,
} from "lucide-react";

interface RealTimeMonitorProps {
  className?: string;
  showConnectionStatus?: boolean;
  showHealth?: boolean;
  compact?: boolean;
}

export const RealTimeMonitor = ({
  className = "",
  showConnectionStatus = true,
  showHealth = false,
  compact = false,
}: RealTimeMonitorProps) => {
  const { state } = useAuth();
  const {
    data,
    isConnected,
    connectionStatus,
    isWebSocketConnected,
    error,
    eventCount,
    lastUpdate,
    refresh,
    getUnreadAlertsCount,
    getRecentAlerts,
  } = useRealTimeData();

  const { metrics, isHealthy } = useMonitoringHealth();

  const [showLiveIndicator, setShowLiveIndicator] = useState(false);

  // Show live indicator when events are received
  useEffect(() => {
    if (eventCount > 0) {
      setShowLiveIndicator(true);
      const timer = setTimeout(() => setShowLiveIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [eventCount]);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-4 w-4 text-success-600" />;
      case "polling":
        return <RefreshCw className="h-4 w-4 text-warning-600 animate-spin" />;
      default:
        return <WifiOff className="h-4 w-4 text-destructive" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case "connected":
        return isWebSocketConnected ? "Live (WebSocket)" : "Live (Polling)";
      case "polling":
        return "Polling";
      default:
        return "Disconnected";
    }
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-success-100 text-success-700";
      case "polling":
        return "bg-warning-100 text-warning-700";
      default:
        return "bg-destructive/10 text-destructive";
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {getConnectionIcon()}
          <span className="text-sm text-muted-foreground">
            {getConnectionText()}
          </span>
        </div>

        {/* Live Indicator */}
        {showLiveIndicator && (
          <div className="flex items-center gap-1 animate-pulse">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 font-medium">LIVE</span>
          </div>
        )}

        {/* Alert Count */}
        {getUnreadAlertsCount() > 0 && (
          <Badge variant="destructive" className="text-xs">
            {getUnreadAlertsCount()}
          </Badge>
        )}

        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={refresh}
          className="h-6 w-6"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Connection Status Card */}
      {showConnectionStatus && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-Time Monitoring
              {showLiveIndicator && (
                <div className="flex items-center gap-1 animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">
                    LIVE
                  </span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getConnectionColor()}`}>
                  {getConnectionIcon()}
                </div>
                <div>
                  <p className="font-medium text-sm">{getConnectionText()}</p>
                  <p className="text-xs text-muted-foreground">
                    {eventCount} events received
                    {lastUpdate &&
                      ` • Last: ${lastUpdate.toLocaleTimeString()}`}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={refresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error.message || "Connection error occurred"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Health Metrics */}
      {showHealth && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Signal className="h-5 w-5" />
              System Health
              <Badge variant={isHealthy ? "default" : "destructive"}>
                {isHealthy ? "Healthy" : "Issues"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Uptime</p>
                <p className="font-medium">
                  {Math.floor(metrics.uptime / 1000)}s
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Events</p>
                <p className="font-medium">{metrics.eventsReceived}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Errors</p>
                <p className="font-medium">{metrics.errorCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Event</p>
                <p className="font-medium">
                  {metrics.lastEventTime
                    ? metrics.lastEventTime.toLocaleTimeString()
                    : "None"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-Time Data Display */}
      {isConnected && (
        <div className="space-y-3">
          {/* Screen Time Status */}
          {state.children.map((child) => {
            const screenTimeData = data.screenTime.get(child.id);
            const locationData = data.location.get(child.id);
            const deviceData = data.deviceStatus.get(child.id);

            return (
              <Card key={child.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={child.avatar} alt={child.firstName} />
                      <AvatarFallback className="bg-safe-100 text-safe-700 text-sm">
                        {getInitials(child.firstName, child.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{child.firstName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {child.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        child.isOnline ? "bg-success-500" : "bg-muted"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    {/* Screen Time */}
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {screenTimeData
                            ? formatTime(screenTimeData.currentUsage)
                            : formatTime(child.screenTime.today)}
                        </p>
                        <p className="text-muted-foreground">Screen time</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {locationData?.safeZone || "Unknown"}
                        </p>
                        <p className="text-muted-foreground">Location</p>
                      </div>
                    </div>

                    {/* Device */}
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {deviceData?.deviceName || "No device"}
                        </p>
                        <p className="text-muted-foreground">Device</p>
                      </div>
                    </div>
                  </div>

                  {/* Current App */}
                  {screenTimeData?.currentApp && (
                    <div className="mt-3 p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">
                          Currently using: {screenTimeData.currentApp}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Recent Alerts */}
          {getUnreadAlertsCount() > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Live Alerts
                  <Badge variant="destructive">{getUnreadAlertsCount()}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {getRecentAlerts(3).map((alert, index) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-lg border-l-4 border-l-warning-400 bg-warning-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {alert.data.alertType}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {state.children.find((c) => c.id === alert.childId)
                              ?.firstName || "Unknown"}{" "}
                            • {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            alert.severity === "high"
                              ? "destructive"
                              : "default"
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
          )}
        </div>
      )}
    </div>
  );
};

// Export additional monitoring components
export const ConnectionIndicator = () => {
  const { connectionStatus } = useRealTimeData();

  return (
    <RealTimeMonitor compact showConnectionStatus={false} className="ml-auto" />
  );
};

export const LiveIndicator = () => {
  const { eventCount } = useRealTimeData();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (eventCount > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [eventCount]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-full shadow-lg animate-in slide-in-from-top-2">
      <Zap className="h-4 w-4" />
      <span className="text-sm font-medium">Live Update</span>
    </div>
  );
};
