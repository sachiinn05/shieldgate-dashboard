import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8001",
  withCredentials: true, // 🔥 REQUIRED FOR COOKIES
});

// keep apiKey logic SAME
API.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem("apiKey");
  if (apiKey) {
    config.headers["x-api-key"] = apiKey;
  }
  return config;
});

export default API;