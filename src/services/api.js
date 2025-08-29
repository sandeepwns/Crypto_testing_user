import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_URL,
});

// ✅ Interceptor: Har request ke sath token automatically bhejo
api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ---------------- APIs ----------------

// Example: Get users (Admin only)
export const getUsers = (page = 1, limit = 10) =>
  api.get(`/admin/get-users?page=${page}&limit=${limit}`);

// Example: User Login
export const login = async (credentials) => {
  ``;
  return await api.post("/users/login", credentials);
};

// Example: Change user status (Admin only)
export const changeUserStatus = (id, status) => api.patch(`/admin/user-status/${id}`, { status }); // status = "Active" or "Inactive"

// Example: User Signup
export const signup = async (credentials) => {
  return await api.post("/users/register", credentials);
};

// Example: Admin Login
export const adminLogin = async (credentials) => {
  return await api.post("/admin/login", credentials);
};

export const updateReferralCode = async (code) => {
  return await api.put("/admin/referellcode_update", { code });
};

// Example: Get single user by ID
export const getUserById = async (id) => {
  return await api.get(`/users/${id}`);
};

// ✅ Update User API Keys
export const updateApiKeys = async ({ publicKey, secretKey, id }) => {
  return await api.put(`/users/update-keys/${id}`, { publicKey, secretKey });
};

export const updateAutoTrading = (id, autoTrading) =>
  api.patch(`/users/user-autotrading/${id}`, { autoTrading }); // autoTrading = true or false

export default api;
