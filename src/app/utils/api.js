// src/api.js
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const api = axios.create({
  baseURL: BASE_URL, // change this to your backend URL in prod
  withCredentials: true, // send cookies automatically
});

let csrfToken = null;

// Interceptor for CSRF protection
api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();

  if (["post", "put", "delete", "patch"].includes(method)) {
    if (!csrfToken) {
      const res = await axios.get(`${BASE_URL}/api/csrf-token`, {
        withCredentials: true,
      });
      csrfToken = res.data.csrfToken;
    }
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

export default api;
