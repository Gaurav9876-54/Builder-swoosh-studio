// Real-time monitoring service for Safe Guard
// This service handles WebSocket connections, API polling, and real-time updates

export interface RealTimeEvent {
  id: string;
  type:
    | "screen_time"
    | "content_filter"
    | "location"
    | "app_usage"
    | "safety_alert"
    | "device_status";
  childId: string;
  timestamp: string;
  data: any;
  severity?: "low" | "medium" | "high" | "critical";
}

export interface MonitoringConfig {
  familyId: string;
  children: string[];
  enabledFeatures: string[];
  refreshInterval: number;
  websocketUrl?: string;
}

export type EventCallback = (event: RealTimeEvent) => void;

class RealTimeMonitoringService {
  private websocket: WebSocket | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private config: MonitoringConfig | null = null;
  private eventCallbacks: Map<string, EventCallback[]> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseApiUrl = import.meta.env.VITE_API_URL || "/api";

  // Initialize real-time monitoring
  async initialize(config: MonitoringConfig): Promise<void> {
    this.config = config;

    // Try WebSocket connection first
    if (config.websocketUrl) {
      await this.connectWebSocket(config.websocketUrl);
    }

    // Fallback to polling if WebSocket fails
    if (!this.isConnected) {
      this.startPolling();
    }

    console.log(
      "Real-time monitoring initialized for family:",
      config.familyId,
    );
  }

  // WebSocket connection for real-time updates
  private async connectWebSocket(url: string): Promise<void> {
    try {
      // TODO: Replace with actual WebSocket URL from your backend
      // const wsUrl = `${url}/families/${this.config?.familyId}/monitor`;
      // this.websocket = new WebSocket(wsUrl);

      // For now, simulate WebSocket connection
      console.log("WebSocket connection simulated for:", url);

      this.websocket = {
        onopen: () => {},
        onmessage: () => {},
        onclose: () => {},
        onerror: () => {},
        close: () => {},
        send: () => {},
        readyState: WebSocket.OPEN,
      } as any;

      this.setupWebSocketHandlers();
      this.isConnected = true;
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      this.handleConnectionError();
    }
  }

  private setupWebSocketHandlers(): void {
    if (!this.websocket) return;

    this.websocket.onopen = () => {
      console.log("WebSocket connected");
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Send subscription message
      this.websocket?.send(
        JSON.stringify({
          type: "subscribe",
          familyId: this.config?.familyId,
          children: this.config?.children || [],
          features: this.config?.enabledFeatures || [],
        }),
      );
    };

    this.websocket.onmessage = (event) => {
      try {
        const realTimeEvent: RealTimeEvent = JSON.parse(event.data);
        this.handleRealTimeEvent(realTimeEvent);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    this.websocket.onclose = () => {
      console.log("WebSocket disconnected");
      this.isConnected = false;
      this.handleConnectionError();
    };

    this.websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.handleConnectionError();
    };
  }

  // Fallback polling mechanism
  private startPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    const pollInterval = this.config?.refreshInterval || 5000; // 5 seconds default

    this.intervalId = setInterval(async () => {
      await this.pollForUpdates();
    }, pollInterval);

    console.log(`Started polling every ${pollInterval}ms`);
  }

  private async pollForUpdates(): Promise<void> {
    if (!this.config) return;

    try {
      // TODO: Replace with actual API endpoints
      const endpoints = [
        this.getScreenTimeUpdates(),
        this.getLocationUpdates(),
        this.getContentFilterUpdates(),
        this.getSafetyAlerts(),
        this.getDeviceStatusUpdates(),
      ];

      const results = await Promise.allSettled(endpoints);

      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value) {
          result.value.forEach((event: RealTimeEvent) => {
            this.handleRealTimeEvent(event);
          });
        }
      });
    } catch (error) {
      console.error("Polling failed:", error);
    }
  }

  // API methods for different types of updates
  private async getScreenTimeUpdates(): Promise<RealTimeEvent[]> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseApiUrl}/families/${this.config?.familyId}/screen-time/live`);
      // const data = await response.json();

      // Mock screen time events
      return this.generateMockScreenTimeEvents();
    } catch (error) {
      console.error("Failed to fetch screen time updates:", error);
      return [];
    }
  }

  private async getLocationUpdates(): Promise<RealTimeEvent[]> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseApiUrl}/families/${this.config?.familyId}/location/live`);
      // const data = await response.json();

      return this.generateMockLocationEvents();
    } catch (error) {
      console.error("Failed to fetch location updates:", error);
      return [];
    }
  }

  private async getContentFilterUpdates(): Promise<RealTimeEvent[]> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseApiUrl}/families/${this.config?.familyId}/content-filter/live`);
      // const data = await response.json();

      return this.generateMockContentEvents();
    } catch (error) {
      console.error("Failed to fetch content filter updates:", error);
      return [];
    }
  }

  private async getSafetyAlerts(): Promise<RealTimeEvent[]> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseApiUrl}/families/${this.config?.familyId}/alerts/live`);
      // const data = await response.json();

      return this.generateMockSafetyEvents();
    } catch (error) {
      console.error("Failed to fetch safety alerts:", error);
      return [];
    }
  }

  private async getDeviceStatusUpdates(): Promise<RealTimeEvent[]> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseApiUrl}/families/${this.config?.familyId}/devices/status`);
      // const data = await response.json();

      return this.generateMockDeviceEvents();
    } catch (error) {
      console.error("Failed to fetch device status:", error);
      return [];
    }
  }

  // Event handling and subscription
  private handleRealTimeEvent(event: RealTimeEvent): void {
    console.log("Real-time event received:", event);

    // Notify all subscribers for this event type
    const callbacks = this.eventCallbacks.get(event.type) || [];
    callbacks.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error("Error in event callback:", error);
      }
    });

    // Notify global subscribers
    const globalCallbacks = this.eventCallbacks.get("*") || [];
    globalCallbacks.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error("Error in global event callback:", error);
      }
    });
  }

  // Public API for subscribing to events
  subscribe(eventType: string, callback: EventCallback): () => void {
    if (!this.eventCallbacks.has(eventType)) {
      this.eventCallbacks.set(eventType, []);
    }

    const callbacks = this.eventCallbacks.get(eventType)!;
    callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  // Connection management
  private handleConnectionError(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff

      console.log(
        `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`,
      );

      setTimeout(() => {
        if (this.config?.websocketUrl) {
          this.connectWebSocket(this.config.websocketUrl);
        }
      }, delay);
    } else {
      console.log("Max reconnection attempts reached, falling back to polling");
      this.startPolling();
    }
  }

  // Cleanup
  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isConnected = false;
    this.eventCallbacks.clear();

    console.log("Real-time monitoring disconnected");
  }

  // Mock data generators for testing (remove when integrating with real API)
  private generateMockScreenTimeEvents(): RealTimeEvent[] {
    if (!this.config?.children.length) return [];

    // Randomly generate screen time events
    if (Math.random() > 0.7) {
      const childId =
        this.config.children[
          Math.floor(Math.random() * this.config.children.length)
        ];
      return [
        {
          id: `screen-time-${Date.now()}`,
          type: "screen_time",
          childId,
          timestamp: new Date().toISOString(),
          data: {
            currentUsage: Math.floor(Math.random() * 300) + 60,
            dailyLimit: 240,
            timeRemaining: Math.floor(Math.random() * 120),
            currentApp: [
              "YouTube Kids",
              "Khan Academy",
              "Minecraft",
              "Scratch",
            ][Math.floor(Math.random() * 4)],
          },
        },
      ];
    }
    return [];
  }

  private generateMockLocationEvents(): RealTimeEvent[] {
    if (!this.config?.children.length) return [];

    if (Math.random() > 0.9) {
      const childId =
        this.config.children[
          Math.floor(Math.random() * this.config.children.length)
        ];
      return [
        {
          id: `location-${Date.now()}`,
          type: "location",
          childId,
          timestamp: new Date().toISOString(),
          data: {
            latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
            longitude: -74.006 + (Math.random() - 0.5) * 0.01,
            address: "123 Safe Street, New York, NY",
            safeZone: Math.random() > 0.5 ? "Home" : null,
            accuracy: Math.floor(Math.random() * 10) + 5,
          },
          severity: Math.random() > 0.8 ? "medium" : "low",
        },
      ];
    }
    return [];
  }

  private generateMockContentEvents(): RealTimeEvent[] {
    if (!this.config?.children.length) return [];

    if (Math.random() > 0.8) {
      const childId =
        this.config.children[
          Math.floor(Math.random() * this.config.children.length)
        ];
      const blocked = Math.random() > 0.6;

      return [
        {
          id: `content-${Date.now()}`,
          type: "content_filter",
          childId,
          timestamp: new Date().toISOString(),
          data: {
            url: blocked ? "inappropriate-site.com" : "educational-site.com",
            action: blocked ? "blocked" : "allowed",
            category: blocked ? "inappropriate" : "educational",
            reason: blocked ? "Content filter rule" : "Educational whitelist",
          },
          severity: blocked ? "medium" : "low",
        },
      ];
    }
    return [];
  }

  private generateMockSafetyEvents(): RealTimeEvent[] {
    if (!this.config?.children.length) return [];

    if (Math.random() > 0.95) {
      const childId =
        this.config.children[
          Math.floor(Math.random() * this.config.children.length)
        ];
      const eventTypes = [
        { type: "Screen time exceeded", severity: "medium" as const },
        { type: "Inappropriate content blocked", severity: "high" as const },
        { type: "Unknown contact attempted", severity: "high" as const },
        { type: "Left safe zone", severity: "medium" as const },
      ];

      const eventType =
        eventTypes[Math.floor(Math.random() * eventTypes.length)];

      return [
        {
          id: `safety-${Date.now()}`,
          type: "safety_alert",
          childId,
          timestamp: new Date().toISOString(),
          data: {
            alertType: eventType.type,
            description: `Safety alert: ${eventType.type}`,
            actionRequired: eventType.severity === "high",
            autoResolved: false,
          },
          severity: eventType.severity,
        },
      ];
    }
    return [];
  }

  private generateMockDeviceEvents(): RealTimeEvent[] {
    if (!this.config?.children.length) return [];

    if (Math.random() > 0.85) {
      const childId =
        this.config.children[
          Math.floor(Math.random() * this.config.children.length)
        ];
      const devices = ["iPhone", "iPad", "Android Tablet", "Laptop"];
      const device = devices[Math.floor(Math.random() * devices.length)];

      return [
        {
          id: `device-${Date.now()}`,
          type: "device_status",
          childId,
          timestamp: new Date().toISOString(),
          data: {
            deviceName: device,
            status: Math.random() > 0.5 ? "online" : "offline",
            batteryLevel: Math.floor(Math.random() * 100),
            lastSeen: new Date().toISOString(),
            location: Math.random() > 0.5 ? "Home" : "School",
          },
        },
      ];
    }
    return [];
  }

  // Status getters
  isWebSocketConnected(): boolean {
    return this.websocket?.readyState === WebSocket.OPEN;
  }

  isMonitoring(): boolean {
    return this.isConnected || this.intervalId !== null;
  }

  getConnectionStatus(): "connected" | "polling" | "disconnected" {
    if (this.isWebSocketConnected()) return "connected";
    if (this.intervalId) return "polling";
    return "disconnected";
  }
}

// Export singleton instance
export const realTimeMonitoring = new RealTimeMonitoringService();

// React hook for easy integration
export const useRealTimeMonitoring = () => {
  return realTimeMonitoring;
};
