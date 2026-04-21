import axiosClient from "./axiosClient";

export const authApi = {
  register: (data) => axiosClient.post("/auth/register", data),
  login: (data) => axiosClient.post("/auth/login", data),
  getMe: () => axiosClient.get("/auth/me"),
  updateMe: (data) => axiosClient.put("/auth/me", data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return axiosClient.post("/auth/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteAccount: () => axiosClient.delete("/auth/me"),
  logout: () => axiosClient.post("/auth/logout"),
};
