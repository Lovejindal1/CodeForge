import api from "./api";

export const getProblems = async (params) => {
  const response = await api.get("/problems", { params });
  return response.data;
};
