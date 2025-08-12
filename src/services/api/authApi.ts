// authApi.ts
import axios from 'axios';

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": "true"
  },
});

export default authApi;
