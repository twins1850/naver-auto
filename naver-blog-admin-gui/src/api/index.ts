import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default api;

export { client } from "./client";
export { API_ENDPOINTS } from "./endpoints";
export * from "./types";
