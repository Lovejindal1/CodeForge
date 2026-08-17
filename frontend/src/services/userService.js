import api from "./api";

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const getUserDashboard = async () => {
  const response = await api.get("/users/dashboard");
  return response.data;
};

export const updateProfile = async ({ name }) => {
  const response = await api.put("/users/update-profile", { name });
  return response.data;
};

export const changePassword = async ({ oldPassword, newPassword }) => {
  const response = await api.put("/users/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
};
