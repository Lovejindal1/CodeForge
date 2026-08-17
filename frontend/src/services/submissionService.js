import api from "./api";

export const createSubmission = async ({ problem, language, code }) => {
  const response = await api.post("/submissions", { problem, language, code });
  return response.data;
};
