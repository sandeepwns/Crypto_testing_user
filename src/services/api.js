import axios from "axios";
import config from "../config";
console.log("Hello  :", config);

const api = axios.create({
  baseURL: config.API_URL,
});

// Example: Get users
export const getUsers = () => api.get("/users");

// Example: Login
export const login = async (credentials) => {
  return await api.post("/users/login", credentials);
};
export const signup = async (credentials) => {
  return await api.post("/users/register", credentials);
};
export const adminLogin = async (credentials) => {
  return await api.post("/admin/login ", credentials);
};
export default api;
