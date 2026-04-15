import { useAuthStore } from "@/store/auth-store";
import axios from "axios";

/**
 * NEXT_PUBLIC_ prefix makes this available in the browser bundle.
 * Falls back to localhost for local development.
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5090/api/v1";

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
  validateStatus: (status) => status < 500,
});

/**
 * Request interceptor — reads the access token from the Zustand store
 * and attaches it as a Bearer token to every outgoing request automatically.
 * No need to pass the token manually to each service function.
 */
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
