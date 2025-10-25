import { useCallback, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Track if refresh is in progress to prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// Function to retry all queued requests with new token
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.config) return Promise.reject(error);

    const originalRequest = error.config;

    // Only try to refresh if it's a 401 and not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await api.post("/auth/refresh");
        const newToken = refreshResponse.data.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        // Retry all queued requests
        onTokenRefreshed(newToken);
        isRefreshing = false;

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];

        // Only clear token and redirect if refresh truly failed
        if (refreshError.response?.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.href = "/auth";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const useFetch = () => {
  const controllersRef = useRef([]);

  // Cleanup all controllers on unmount
  useEffect(() => {
    return () => {
      controllersRef.current.forEach((controller) => {
        controller.abort();
      });

      controllersRef.current = [];
    };
  }, []);

  const request = useCallback(
    async ({ url, method = "GET", data = null, config = {} }) => {
      // Create new AbortController for this request
      const controller = new AbortController();
      controllersRef.current.push(controller);

      const requestConfig = {
        url,
        method,
        data,
        ...config,
        signal: controller.signal,
      };

      try {
        const response = await api(requestConfig);

        // Remove controller from array after successful request
        controllersRef.current = controllersRef.current.filter(
          (c) => c !== controller
        );

        return {
          success: true,
          data: response.data,
          status: response.status,
        };
      } catch (error) {
        // Remove controller from array
        controllersRef.current = controllersRef.current.filter(
          (c) => c !== controller
        );

        if (axios.isCancel(error) || error.name === "CanceledError") {
          throw error; // Re-throw cancel errors
        }

        // Handle different error types
        let errorMessage = "An unexpected error occurred";
        let errorData = null;

        if (error.response) {
          // Server responded with error status
          errorMessage =
            error.response?.data?.message ||
            `Request failed with status ${error.response.status}`;
          errorData = error.response.data;
        } else if (error.request) {
          // Request made but no response received
          errorMessage = "No response from server. Please try again.";
        } else {
          // Something else happened
          errorMessage = error.message;
        }

        return {
          success: false,
          error: errorMessage,
          data: errorData,
          status: error.response?.status,
        };
      }
    },
    []
  );

  // Function to cancel all ongoing requests
  const cancelAll = useCallback(() => {
    controllersRef.current.forEach((controller) => {
      controller.abort();
    });
    controllersRef.current = [];
  }, []);

  return { request, cancelAll };
};
