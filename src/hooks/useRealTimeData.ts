import { useState, useEffect, useCallback, useRef } from "react";
import {
  realTimeMonitoring,
  RealTimeEvent,
  MonitoringConfig,
} from "@/services/realTimeMonitoring";
import { useAuth } from "@/contexts/AuthContext";

export interface RealTimeData {
  screenTime: Map<string, any>;
  location: Map<string, any>;
  contentFilter: any[];
  safetyAlerts: any[];
  deviceStatus: Map<string, any>;
  lastUpdate: Date | null;
}

export interface UseRealTimeDataOptions {
  autoStart?: boolean;
  refreshInterval?: number;
  enabledFeatures?: string[];
  onEvent?: (event: RealTimeEvent) => void;
  onError?: (error: Error) => void;
}

export const useRealTimeData = (options: UseRealTimeDataOptions = {}) => {
  const { state } = useAuth();
  const {
    autoStart = true,
    refreshInterval = 5000,
    enabledFeatures = [
      "screen_time",
      "location",
      "content_filter",
      "safety_alert",
      "device_status",
    ],
    onEvent,
    onError,
  } = options;

  const [data, setData] = useState<RealTimeData>({
    screenTime: new Map(),
    location: new Map(),
    contentFilter: [],
    safetyAlerts: [],
    deviceStatus: new Map(),
    lastUpdate: null,
  });

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "polling" | "disconnected"
  >("disconnected");
  const [error, setError] = useState<Error | null>(null);
  const [eventCount, setEventCount] = useState(0);

  const unsubscribeRefs = useRef<(() => void)[]>([]);

  // Handle real-time events
  const handleRealTimeEvent = useCallback(
    (event: RealTimeEvent) => {
      setEventCount((prev) => prev + 1);
      setError(null);

      // Update data based on event type
      setData((prevData) => {
        const newData = { ...prevData };

        switch (event.type) {
          case "screen_time":
            newData.screenTime = new Map(prevData.screenTime);
            newData.screenTime.set(event.childId, {
              ...event.data,
              timestamp: event.timestamp,
            });
            break;

          case "location":
            newData.location = new Map(prevData.location);
            newData.location.set(event.childId, {
              ...event.data,
              timestamp: event.timestamp,
            });
            break;

          case "content_filter":
            newData.contentFilter = [
              event,
              ...prevData.contentFilter.slice(0, 49), // Keep last 50 events
            ];
            break;

          case "safety_alert":
            newData.safetyAlerts = [
              event,
              ...prevData.safetyAlerts.slice(0, 99), // Keep last 100 alerts
            ];
            break;

          case "device_status":
            newData.deviceStatus = new Map(prevData.deviceStatus);
            newData.deviceStatus.set(event.childId, {
              ...event.data,
              timestamp: event.timestamp,
            });
            break;
        }

        newData.lastUpdate = new Date();
        return newData;
      });

      // Call external event handler
      if (onEvent) {
        try {
          onEvent(event);
        } catch (err) {
          console.error("Error in onEvent callback:", err);
        }
      }
    },
    [onEvent],
  );

  // Initialize monitoring
  const startMonitoring = useCallback(async () => {
    if (!state.family?.id || !state.children.length) {
      setError(new Error("Family data not available"));
      return;
    }

    try {
      const config: MonitoringConfig = {
        familyId: state.family.id,
        children: state.children.map((child) => child.id),
        enabledFeatures,
        refreshInterval,
        // TODO: Replace with your actual WebSocket URL
        websocketUrl: process.env.REACT_APP_WS_URL,
      };

      await realTimeMonitoring.initialize(config);

      // Subscribe to events
      const unsubscribeFunctions = enabledFeatures.map((feature) =>
        realTimeMonitoring.subscribe(feature, handleRealTimeEvent),
      );

      // Subscribe to all events
      unsubscribeFunctions.push(
        realTimeMonitoring.subscribe("*", handleRealTimeEvent),
      );

      unsubscribeRefs.current = unsubscribeFunctions;

      setIsConnected(true);
      setError(null);

      // Update connection status periodically
      const statusInterval = setInterval(() => {
        setConnectionStatus(realTimeMonitoring.getConnectionStatus());
      }, 1000);

      return () => {
        clearInterval(statusInterval);
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      if (onError) {
        onError(error);
      }
    }
  }, [
    state.family?.id,
    state.children,
    enabledFeatures,
    refreshInterval,
    handleRealTimeEvent,
    onError,
  ]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    realTimeMonitoring.disconnect();
    unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
    unsubscribeRefs.current = [];
    setIsConnected(false);
    setConnectionStatus("disconnected");
  }, []);

  // Auto-start monitoring
  useEffect(() => {
    if (autoStart && state.isAuthenticated && state.family?.id) {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [autoStart, state.isAuthenticated, state.family?.id, startMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  // Manual refresh function
  const refresh = useCallback(() => {
    if (isConnected) {
      stopMonitoring();
      setTimeout(startMonitoring, 100);
    } else {
      startMonitoring();
    }
  }, [isConnected, startMonitoring, stopMonitoring]);

  // Helper functions to get specific data
  const getChildScreenTime = useCallback(
    (childId: string) => {
      return data.screenTime.get(childId) || null;
    },
    [data.screenTime],
  );

  const getChildLocation = useCallback(
    (childId: string) => {
      return data.location.get(childId) || null;
    },
    [data.location],
  );

  const getChildDeviceStatus = useCallback(
    (childId: string) => {
      return data.deviceStatus.get(childId) || null;
    },
    [data.deviceStatus],
  );

  const getRecentAlerts = useCallback(
    (limit: number = 10) => {
      return data.safetyAlerts.slice(0, limit);
    },
    [data.safetyAlerts],
  );

  const getRecentContentEvents = useCallback(
    (limit: number = 10) => {
      return data.contentFilter.slice(0, limit);
    },
    [data.contentFilter],
  );

  // Get alerts by severity
  const getAlertsBySeverity = useCallback(
    (severity: "low" | "medium" | "high" | "critical") => {
      return data.safetyAlerts.filter((alert) => alert.severity === severity);
    },
    [data.safetyAlerts],
  );

  // Get unread alerts count
  const getUnreadAlertsCount = useCallback(() => {
    return data.safetyAlerts.filter(
      (alert) => !alert.data?.isRead && alert.severity !== "low",
    ).length;
  }, [data.safetyAlerts]);

  return {
    // Data
    data,
    lastUpdate: data.lastUpdate,
    eventCount,

    // Connection status
    isConnected,
    connectionStatus,
    isWebSocketConnected: realTimeMonitoring.isWebSocketConnected(),
    error,

    // Control functions
    startMonitoring,
    stopMonitoring,
    refresh,

    // Helper functions
    getChildScreenTime,
    getChildLocation,
    getChildDeviceStatus,
    getRecentAlerts,
    getRecentContentEvents,
    getAlertsBySeverity,
    getUnreadAlertsCount,

    // Raw service access for advanced usage
    service: realTimeMonitoring,
  };
};

// Additional hook for specific child monitoring
export const useChildRealTimeData = (childId: string) => {
  const {
    data,
    getChildScreenTime,
    getChildLocation,
    getChildDeviceStatus,
    ...rest
  } = useRealTimeData();

  const childData = {
    screenTime: getChildScreenTime(childId),
    location: getChildLocation(childId),
    deviceStatus: getChildDeviceStatus(childId),
    alerts: data.safetyAlerts.filter((alert) => alert.childId === childId),
    contentEvents: data.contentFilter.filter(
      (event) => event.childId === childId,
    ),
  };

  return {
    childData,
    ...rest,
  };
};

// Hook for monitoring connection health
export const useMonitoringHealth = () => {
  const [metrics, setMetrics] = useState({
    uptime: 0,
    eventsReceived: 0,
    lastEventTime: null as Date | null,
    averageLatency: 0,
    errorCount: 0,
  });

  const { eventCount, isConnected, connectionStatus, lastUpdate, error } =
    useRealTimeData({ autoStart: false });

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        uptime: isConnected ? Date.now() - startTime : 0,
        eventsReceived: eventCount,
        lastEventTime: lastUpdate,
        errorCount: error ? prev.errorCount + 1 : prev.errorCount,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, eventCount, lastUpdate, error]);

  return {
    metrics,
    connectionStatus,
    isHealthy: isConnected && metrics.errorCount < 5,
  };
};
