import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_BASE_URL } from './constants';

/**
 * Central axios instance. `withCredentials: true` is required because
 * the backend authenticates purely via HTTP-only cookies (accessToken /
 * refreshToken) — there is no Authorization header to attach.
 *
 * Used directly for one-off calls outside RTK Query (e.g. inside
 * middleware-adjacent server code); RTK Query's baseApi wraps this same
 * pattern via fetchBaseQuery for component-level data fetching.
 */
export const axiosProxy: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// If a request fails with 401 (expired access token), silently attempt
// one refresh via the refresh-token cookie, then retry the original
// request once. Prevents the user from being logged out on every 15-min
// access-token expiry.
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

axiosProxy.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !isRefreshing) {
      isRefreshing = true;
      try {
        await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        isRefreshing = false;
        pendingQueue.forEach((cb) => cb());
        pendingQueue = [];
        return axiosProxy(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        pendingQueue = [];
        // Refresh failed too -> redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
