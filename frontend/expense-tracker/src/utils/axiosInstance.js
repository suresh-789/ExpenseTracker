import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Wake up backend on first request (fix for Render.com cold start)
let isBackendAwake = false;

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!isBackendAwake && BASE_URL.includes("render")) {
      try {
        await axios.get(`${BASE_URL}/api/health`, { timeout: 5000 });
        isBackendAwake = true;
      } catch (e) {
        // Ignore errors, proceed with request
      }
    }
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //Handle commom errors globally
    if (error.response) {
      if (error.response.status === 401) {
        //Redirect to login page
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Server Error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out. Please try again.");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
