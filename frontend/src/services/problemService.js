import api from "./api";

export const getProblems = async (params) => {
  const response = await api.get("/problems", { params });
  return response.data;
};

export const getProblemById = async (id) => {
  const response = await api.get(`/problems/${id}`);
  return response.data;
};
