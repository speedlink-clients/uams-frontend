import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Service Methods
export const subOrganizationService = {
  getSubOrganizations: () => adminApi.get("/university-admin/sub-organizations"),

  createFaculty: (data: { name: string; code: string; type: "FACULTY" }) => 
    adminApi.post("/university-admin/sub-organizations", data),

  createDepartment: (data: { name: string; code: string; type: "DEPARTMENT"; parentId: string }) => 
    adminApi.post("/university-admin/sub-organizations", data),
};

export const adminUserService = {
  createDepartmentAdmin: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    departmentId: string;
  }) => adminApi.post("/university-admin/department-admins", data),
};

export default adminApi;
