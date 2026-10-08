export const ENV_CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  CODE_ACTIVATION_LENGTH: import.meta.env.VITE_CODE_ACTIVATION_LENGTH || 6,
};
