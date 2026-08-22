import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);

  return response.data;
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    // If offline or network error, silently proceed
    console.warn("Backend logout notification failed:", error.message);
    return null;
  }
};