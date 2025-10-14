import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

let csrfToken = null;

// Function to fetch fresh CSRF token
const fetchCSRFToken = async () => {
  try {
    const response = await api.get("/api/csrf-token", {
      withCredentials: true,
    });

    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    csrfToken = null;
    throw error;
  }
};

// Request interceptor for CSRF protection
api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase();

    // Only add CSRF token for state-changing operations
    if (["post", "put", "delete", "patch"].includes(method)) {
      try {
        // Always fetch a fresh token for critical operations like login
        if (config.url?.includes("/login") || !csrfToken) {
          await fetchCSRFToken();
        }

        if (csrfToken) {
          config.headers["X-CSRF-Token"] = csrfToken;
        }
      } catch (error) {
        console.error("Failed to add CSRF token:", error);
        // Don't block the request, let it proceed without CSRF token
        // The server will handle the error
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle CSRF errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If we get a CSRF error, try to refresh the token and retry once
    if (
      error.response?.status === 403 &&
      error.response?.data?.code === "CSRF_ERROR" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Clear the stale token and fetch a new one
        csrfToken = null;
        await fetchCSRFToken();

        if (csrfToken) {
          originalRequest.headers["X-CSRF-Token"] = csrfToken;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Failed to refresh CSRF token:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function for login with better error handling
export const loginUser = async (credentials) => {
  try {
    // Ensure we have a fresh CSRF token for login
    await fetchCSRFToken();

    const response = await api.post("/api/login", credentials);
    return response;
  } catch (error) {
    console.error("Login error:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      error: error.message,
    });
    throw error;
  }
};

// Clear tokens on logout
export const clearTokens = () => {
  csrfToken = null;
};

export default api;
