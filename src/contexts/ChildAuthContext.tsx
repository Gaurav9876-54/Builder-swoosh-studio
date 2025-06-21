import React, { createContext, useContext, useReducer, useEffect } from "react";

interface ChildUser {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  parentId: string;
  familyId: string;
  avatar?: string;
  permissions: {
    canChangeProfile: boolean;
    canAccessSettings: boolean;
    canUseEmergency: boolean;
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    language: string;
  };
}

interface ChildAuthState {
  user: ChildUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sessionStartTime: Date | null;
  screenTimeToday: number;
}

interface ChildAuthContextType {
  state: ChildAuthState;
  login: (childId: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<ChildUser>) => Promise<void>;
  requestHelp: (message?: string) => Promise<void>;
  updateScreenTime: (minutes: number) => void;
}

type ChildAuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGIN_SUCCESS"; payload: ChildUser }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<ChildUser> }
  | { type: "UPDATE_SCREEN_TIME"; payload: number };

const initialState: ChildAuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  sessionStartTime: null,
  screenTimeToday: 0,
};

const childAuthReducer = (
  state: ChildAuthState,
  action: ChildAuthAction,
): ChildAuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        sessionStartTime: new Date(),
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
    case "UPDATE_SCREEN_TIME":
      return {
        ...state,
        screenTimeToday: action.payload,
      };
    default:
      return state;
  }
};

const ChildAuthContext = createContext<ChildAuthContextType | undefined>(
  undefined,
);

// Mock child authentication - Replace with actual API calls
const mockChildAuth = {
  async login(childId: string, password: string): Promise<ChildUser> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock child data based on the provided childId
    const mockChildren = [
      {
        id: "child-1",
        firstName: "Emma",
        lastName: "Johnson",
        age: 12,
        parentId: "user-1",
        familyId: "family-1",
        avatar: "",
      },
      {
        id: "child-2",
        firstName: "Lucas",
        lastName: "Johnson",
        age: 8,
        parentId: "user-1",
        familyId: "family-1",
        avatar: "",
      },
      {
        id: "child-demo",
        firstName: "Alex",
        lastName: "Student",
        age: 10,
        parentId: "user-demo",
        familyId: "family-demo",
        avatar: "",
      },
    ];

    const child = mockChildren.find((c) => c.id === childId) || mockChildren[0];

    return {
      ...child,
      permissions: {
        canChangeProfile: child.age >= 10,
        canAccessSettings: child.age >= 12,
        canUseEmergency: true,
      },
      preferences: {
        theme: "light",
        language: "en",
      },
    };
  },

  async updateProfile(
    userId: string,
    updates: Partial<ChildUser>,
  ): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Profile updated:", updates);
  },

  async requestHelp(userId: string, message?: string): Promise<void> {
    // Simulate emergency help request
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log("Help requested:", { userId, message });

    // In real app, this would:
    // 1. Send immediate notification to parents
    // 2. Log the help request
    // 3. Potentially contact emergency services if configured
    // 4. Show confirmation to child

    alert("Help request sent to your parents! 🆘");
  },
};

export const ChildAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(childAuthReducer, initialState);

  // Check for existing child session
  useEffect(() => {
    const childToken = localStorage.getItem("safeguard_child_token");
    const childId = localStorage.getItem("safeguard_child_id");

    if (childToken && childId) {
      dispatch({ type: "SET_LOADING", payload: true });

      // Validate child session
      mockChildAuth
        .login(childId, "demo123")
        .then((child) => {
          dispatch({ type: "LOGIN_SUCCESS", payload: child });
        })
        .catch(() => {
          // Clear invalid session
          localStorage.removeItem("safeguard_child_token");
          localStorage.removeItem("safeguard_child_id");
          dispatch({ type: "SET_LOADING", payload: false });
        });
    }
  }, []);

  // Track screen time during session
  useEffect(() => {
    if (state.isAuthenticated && state.sessionStartTime) {
      const interval = setInterval(() => {
        const sessionDuration = Math.floor(
          (new Date().getTime() - state.sessionStartTime!.getTime()) /
            (1000 * 60),
        );
        dispatch({ type: "UPDATE_SCREEN_TIME", payload: sessionDuration });
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated, state.sessionStartTime]);

  const login = async (childId: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const user = await mockChildAuth.login(childId, password);

      // Store child session
      localStorage.setItem("safeguard_child_token", "child-token-demo");
      localStorage.setItem("safeguard_child_id", childId);

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("safeguard_child_token");
    localStorage.removeItem("safeguard_child_id");
    dispatch({ type: "LOGOUT" });
  };

  const updateProfile = async (updates: Partial<ChildUser>) => {
    if (!state.user) return;

    try {
      await mockChildAuth.updateProfile(state.user.id, updates);
      dispatch({ type: "UPDATE_USER", payload: updates });
    } catch (error) {
      throw error;
    }
  };

  const requestHelp = async (message?: string) => {
    if (!state.user) return;

    try {
      await mockChildAuth.requestHelp(state.user.id, message);
    } catch (error) {
      throw error;
    }
  };

  const updateScreenTime = (minutes: number) => {
    dispatch({ type: "UPDATE_SCREEN_TIME", payload: minutes });
  };

  return (
    <ChildAuthContext.Provider
      value={{
        state,
        login,
        logout,
        updateProfile,
        requestHelp,
        updateScreenTime,
      }}
    >
      {children}
    </ChildAuthContext.Provider>
  );
};

export const useChildAuth = () => {
  const context = useContext(ChildAuthContext);
  if (context === undefined) {
    throw new Error("useChildAuth must be used within a ChildAuthProvider");
  }
  return context;
};
