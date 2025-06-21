import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  AuthState,
  User,
  Child,
  Family,
  LoginCredentials,
  RegisterData,
  ChildRegistrationData,
} from "@/types/auth";

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  addChild: (childData: ChildRegistrationData) => Promise<void>;
  updateChild: (childId: string, updates: Partial<Child>) => Promise<void>;
  removeChild: (childId: string) => Promise<void>;
  switchToChildView: (childId: string) => void;
  switchToParentView: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  refreshAuth: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "LOGIN_SUCCESS";
      payload: {
        user: User;
        family: Family;
        children: Child[];
        tokens: { access: string; refresh: string };
      };
    }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "ADD_CHILD"; payload: Child }
  | {
      type: "UPDATE_CHILD";
      payload: { childId: string; updates: Partial<Child> };
    }
  | { type: "REMOVE_CHILD"; payload: string }
  | { type: "SET_FAMILY"; payload: Family }
  | { type: "SET_CHILDREN"; payload: Child[] };

const initialState: AuthState = {
  user: null,
  family: null,
  children: [],
  isLoading: false,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        family: action.payload.family,
        children: action.payload.children,
        accessToken: action.payload.tokens.access,
        refreshToken: action.payload.tokens.refresh,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...initialState,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "ADD_CHILD":
      return {
        ...state,
        children: [...state.children, action.payload],
      };
    case "UPDATE_CHILD":
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.payload.childId
            ? { ...child, ...action.payload.updates }
            : child,
        ),
      };
    case "REMOVE_CHILD":
      return {
        ...state,
        children: state.children.filter((child) => child.id !== action.payload),
      };
    case "SET_FAMILY":
      return { ...state, family: action.payload };
    case "SET_CHILDREN":
      return { ...state, children: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API functions - in real app these would make HTTP requests
const mockAuth = {
  async login(credentials: LoginCredentials) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: "user-1",
      email: credentials.email,
      firstName: "Sarah",
      lastName: "Johnson",
      role: "parent",
      familyId: "family-1",
      preferences: {
        notifications: { push: true, email: true, sms: false, emergency: true },
        privacy: { shareLocation: true, allowAnalytics: true },
        theme: "light",
        language: "en",
      },
      createdAt: new Date().toISOString(),
      isEmailVerified: true,
      twoFactorEnabled: false,
    };

    const mockFamily: Family = {
      id: "family-1",
      name: "Johnson Family",
      parentIds: ["user-1"],
      childIds: ["child-1", "child-2"],
      settings: {
        emergencyContacts: [],
        defaultChildSettings: {},
        parentalControls: {
          requireApproval: true,
          blockInappropriate: true,
          monitorActivity: true,
        },
      },
      subscription: {
        tier: "premium",
        status: "active",
        features: [
          "unlimited_children",
          "advanced_monitoring",
          "location_tracking",
        ],
      },
      createdAt: new Date().toISOString(),
    };

    const mockChildren: Child[] = [
      {
        id: "child-1",
        firstName: "Emma",
        lastName: "Johnson",
        age: 12,
        dateOfBirth: "2011-05-15",
        parentId: "user-1",
        familyId: "family-1",
        settings: {
          screenTime: {
            dailyLimit: 240, // 4 hours
            bedtime: "21:00",
            wakeupTime: "07:00",
            blockedApps: [],
            allowedWebsites: [],
            blockedWebsites: [],
          },
          location: {
            trackingEnabled: true,
            safeZones: [],
            alertOnLeave: true,
          },
          contentFilter: {
            level: "moderate",
            customBlocked: [],
            allowEducational: true,
          },
          communication: {
            allowedContacts: [],
            monitorMessages: true,
            allowUnknownContacts: false,
          },
        },
        isOnline: true,
        devices: [],
        screenTime: {
          today: 225, // 3h 45m
          thisWeek: 1680,
          dailyAverage: 240,
          appUsage: [],
          trends: [],
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: "child-2",
        firstName: "Lucas",
        lastName: "Johnson",
        age: 8,
        dateOfBirth: "2015-08-22",
        parentId: "user-1",
        familyId: "family-1",
        settings: {
          screenTime: {
            dailyLimit: 120, // 2 hours
            bedtime: "20:00",
            wakeupTime: "07:30",
            blockedApps: [],
            allowedWebsites: [],
            blockedWebsites: [],
          },
          location: {
            trackingEnabled: true,
            safeZones: [],
            alertOnLeave: true,
          },
          contentFilter: {
            level: "strict",
            customBlocked: [],
            allowEducational: true,
          },
          communication: {
            allowedContacts: [],
            monitorMessages: true,
            allowUnknownContacts: false,
          },
        },
        isOnline: false,
        devices: [],
        screenTime: {
          today: 80, // 1h 20m
          thisWeek: 560,
          dailyAverage: 80,
          appUsage: [],
          trends: [],
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      user: mockUser,
      family: mockFamily,
      children: mockChildren,
      tokens: {
        access: "mock-access-token",
        refresh: "mock-refresh-token",
      },
    };
  },

  async register(data: RegisterData) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return this.login({ email: data.email, password: data.password });
  },

  async addChild(childData: ChildRegistrationData) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newChild: Child = {
      id: `child-${Date.now()}`,
      firstName: childData.firstName,
      lastName: childData.lastName,
      age:
        new Date().getFullYear() -
        new Date(childData.dateOfBirth).getFullYear(),
      dateOfBirth: childData.dateOfBirth,
      parentId: "user-1",
      familyId: "family-1",
      settings: {
        screenTime: {
          dailyLimit: 180,
          bedtime: "21:00",
          wakeupTime: "07:00",
          blockedApps: [],
          allowedWebsites: [],
          blockedWebsites: [],
        },
        location: {
          trackingEnabled: true,
          safeZones: [],
          alertOnLeave: true,
        },
        contentFilter: {
          level: "moderate",
          customBlocked: [],
          allowEducational: true,
        },
        communication: {
          allowedContacts: [],
          monitorMessages: true,
          allowUnknownContacts: false,
        },
      },
      isOnline: false,
      devices: [],
      screenTime: {
        today: 0,
        thisWeek: 0,
        dailyAverage: 0,
        appUsage: [],
        trends: [],
      },
      createdAt: new Date().toISOString(),
    };

    return newChild;
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem("safeguard_token");
    if (token) {
      // In real app, validate token with backend
      dispatch({ type: "SET_LOADING", payload: true });
      // Simulate token validation
      setTimeout(() => {
        // For demo purposes, validate the token and restore session
        mockAuth
          .login({ email: "demo@safeguard.com", password: "demo123" })
          .then((result) => {
            dispatch({ type: "LOGIN_SUCCESS", payload: result });
          })
          .catch(() => {
            dispatch({ type: "SET_LOADING", payload: false });
          });
      }, 1000);
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await mockAuth.login(credentials);

      // Store tokens
      localStorage.setItem("safeguard_token", result.tokens.access);
      localStorage.setItem("safeguard_refresh", result.tokens.refresh);
      localStorage.setItem("safeguard_has_seen_app", "true");

      if (credentials.rememberMe) {
        localStorage.setItem("safeguard_remember", "true");
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: result });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await mockAuth.register(data);

      localStorage.setItem("safeguard_token", result.tokens.access);
      localStorage.setItem("safeguard_refresh", result.tokens.refresh);
      localStorage.setItem("safeguard_has_seen_app", "true");

      dispatch({ type: "LOGIN_SUCCESS", payload: result });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("safeguard_token");
    localStorage.removeItem("safeguard_refresh");
    localStorage.removeItem("safeguard_remember");
    // Keep the has_seen_app flag so returning users go to login, not splash
    dispatch({ type: "LOGOUT" });

    // Redirect to login page after logout
    window.location.href = "/auth/login";
  };

  const addChild = async (childData: ChildRegistrationData) => {
    try {
      const newChild = await mockAuth.addChild(childData);
      dispatch({ type: "ADD_CHILD", payload: newChild });
    } catch (error) {
      throw error;
    }
  };

  const updateChild = async (childId: string, updates: Partial<Child>) => {
    dispatch({ type: "UPDATE_CHILD", payload: { childId, updates } });
  };

  const removeChild = async (childId: string) => {
    dispatch({ type: "REMOVE_CHILD", payload: childId });
  };

  const switchToChildView = (childId: string) => {
    // Switch to child-specific view
    console.log(`Switching to child view: ${childId}`);
  };

  const switchToParentView = () => {
    // Switch back to parent view
    console.log("Switching to parent view");
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    dispatch({ type: "UPDATE_USER", payload: updates });
  };

  const refreshAuth = async () => {
    // Refresh authentication tokens
    console.log("Refreshing auth");
  };

  const resetPassword = async (email: string) => {
    // Send password reset email
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Password reset email sent to: ${email}`);
  };

  const verifyEmail = async (token: string) => {
    // Verify email with token
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(`Email verified with token: ${token}`);
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        addChild,
        updateChild,
        removeChild,
        switchToChildView,
        switchToParentView,
        updateUserProfile,
        refreshAuth,
        resetPassword,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
