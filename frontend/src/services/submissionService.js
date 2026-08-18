import api from "./api";

export const createSubmission = async ({ problem, language, code }) => {
  const response = await api.post("/submissions", { problem, language, code });
  return response.data;
};

export const runCode = async ({ problem, language, code }) => {
  const response = await api.post("/submissions/run", { problem, language, code });
  return response.data;
};

export const getMySubmissions = async (params) => {
  const response = await api.get("/submissions/my", { params });
  return response.data;
};

export const getMyStats = async () => {
  const response = await api.get("/submissions/my/stats");
  return response.data;
};

export const getSubmissionById = async (id) => {
  const response = await api.get(`/submissions/${id}`);
  return response.data;
};