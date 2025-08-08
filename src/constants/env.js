import {
  API_BASE_URL,
  API_TIMEOUT,
  NODE_ENV,
  APP_NAME,
  APP_VERSION,
} from "@env";

export const config = {
  api: {
    baseURL: API_BASE_URL,
    timeout: parseInt(API_TIMEOUT) || 30000,
  },
  app: {
    name: APP_NAME || "EKE Frontend",
    version: APP_VERSION || "1.0.0",
  },
  env: NODE_ENV || "development",
  isDevelopment: NODE_ENV === "development",
  isProduction: NODE_ENV === "production",
};

export default config;
