export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "parent" | "child";
  avatar?: string;
  familyId: string;
  preferences: UserPreferences;
  createdAt: string;
  lastLoginAt?: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  avatar?: string;
  parentId: string;
  familyId: string;
  settings: ChildSettings;
  isOnline: boolean;
  lastActivity?: string;
  devices: Device[];
  screenTime: ScreenTimeData;
  createdAt: string;
}

export interface Family {
  id: string;
  name: string;
  parentIds: string[];
  childIds: string[];
  settings: FamilySettings;
  subscription: SubscriptionPlan;
  createdAt: string;
}

export interface UserPreferences {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    emergency: boolean;
  };
  privacy: {
    shareLocation: boolean;
    allowAnalytics: boolean;
  };
  theme: "light" | "dark" | "auto";
  language: string;
}

export interface ChildSettings {
  screenTime: {
    dailyLimit: number; // minutes
    bedtime: string;
    wakeupTime: string;
    blockedApps: string[];
    allowedWebsites: string[];
    blockedWebsites: string[];
  };
  location: {
    trackingEnabled: boolean;
    safeZones: SafeZone[];
    alertOnLeave: boolean;
  };
  contentFilter: {
    level: "strict" | "moderate" | "light";
    customBlocked: string[];
    allowEducational: boolean;
  };
  communication: {
    allowedContacts: string[];
    monitorMessages: boolean;
    allowUnknownContacts: boolean;
  };
}

export interface FamilySettings {
  emergencyContacts: EmergencyContact[];
  defaultChildSettings: Partial<ChildSettings>;
  parentalControls: {
    requireApproval: boolean;
    blockInappropriate: boolean;
    monitorActivity: boolean;
  };
}

export interface Device {
  id: string;
  name: string;
  type: "phone" | "tablet" | "computer" | "tv";
  platform: "ios" | "android" | "windows" | "macos" | "web";
  lastSeen: string;
  isActive: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface ScreenTimeData {
  today: number; // minutes
  thisWeek: number;
  dailyAverage: number;
  appUsage: AppUsage[];
  trends: ScreenTimeTrend[];
}

export interface AppUsage {
  appName: string;
  appId: string;
  timeSpent: number; // minutes
  category: string;
  lastUsed: string;
}

export interface ScreenTimeTrend {
  date: string;
  totalTime: number;
}

export interface SafeZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // meters
  type: "home" | "school" | "friend" | "activity" | "custom";
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
}

export interface SubscriptionPlan {
  tier: "free" | "premium" | "family";
  status: "active" | "expired" | "trial";
  expiresAt?: string;
  features: string[];
}

export interface AuthState {
  user: User | null;
  family: Family | null;
  children: Child[];
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  familyName: string;
  agreeToTerms: boolean;
}

export interface ChildRegistrationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  avatar?: File;
  initialSettings?: Partial<ChildSettings>;
}

export interface Alert {
  id: string;
  type: "content" | "screentime" | "location" | "communication" | "emergency";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  childId?: string;
  childName?: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  metadata?: Record<string, any>;
}
