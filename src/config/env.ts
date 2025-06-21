// Environment configuration utility for Safe Guard
// This handles environment variables in a browser-safe way

interface AppConfig {
  apiUrl: string;
  wsUrl?: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

// Get environment variable with fallback
const getEnvVar = (key: string, fallback: string = ""): string => {
  // Try Vite environment variables first (for Vite-based apps)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key] || fallback;
  }

  // Fallback for other build systems
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || fallback;
  }

  // Browser environment fallback
  return fallback;
};

// App configuration
export const config: AppConfig = {
  apiUrl: getEnvVar("VITE_API_URL", "/api"),
  wsUrl: getEnvVar("VITE_WS_URL", undefined),
  isDevelopment: getEnvVar("NODE_ENV", "development") === "development",
  isProduction: getEnvVar("NODE_ENV", "development") === "production",
};

// Export individual config values for convenience
export const API_URL = config.apiUrl;
export const WS_URL = config.wsUrl;
export const IS_DEV = config.isDevelopment;
export const IS_PROD = config.isProduction;

// Debug configuration in development
if (config.isDevelopment) {
  console.log("Safe Guard Configuration:", config);
}

export default config;
