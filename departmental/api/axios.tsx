import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/",
  // baseURL: "http://localhost:5000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Log token for debugging (remove in production)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        console.log("Token present but could not decode");
      }
    } else {
      console.warn("No token found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired — clear all auth data and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("uniedu_session");
      localStorage.removeItem("userRole");
      localStorage.removeItem("tenantId");
      localStorage.removeItem("universityId");
      localStorage.removeItem("facultyId");
      localStorage.removeItem("departmentId");
      localStorage.removeItem("userEmail");
      window.location.href = "/departmental-admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;
