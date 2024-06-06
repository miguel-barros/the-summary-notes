import axios from "axios";
import { getCookie } from "cookies-next";

const api_client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  timeout: 30000,
  headers: {},
});

api_client.interceptors.request.use((config) => {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export default api_client;
