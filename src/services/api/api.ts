import axios from 'axios';
import * as authHelper from './../../auth/core/auth-helpers';
// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

// Add a request interceptor if you need to attach token dynamically
api.interceptors.request.use(
  (config) => {
    const token = authHelper.getAuth()?.api_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors with "unauthorized" message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      (
        (typeof error.response.data?.message === "string" && error.response.data.message.toLowerCase().includes("unauthorized")) ||
        (error.response.statusText && error.response.statusText.toLowerCase().includes("unauthorized"))
      )
    ) {
      if (!window.location.pathname.includes("/auth/")) {
        window.location.href = "/logout";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
