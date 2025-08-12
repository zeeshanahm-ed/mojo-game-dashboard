import axios from 'axios';
import * as authHelper from './../../auth/core/auth-helpers';
// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": "true"
  },
});

// Add a request interceptor if you need to attach token dynamically
api.interceptors.request.use(
  (config) => {

    const token = authHelper.getAuth()?.api_token; //localStorage.getItem('token');
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
