import axiosClient from "./axiosClient";

export const pathsApi = {
  getBuiltInPaths: () => axiosClient.get("/paths/explore/all"),
  getSavedPaths: () => axiosClient.get("/paths/saved"),
  getPaths: () => axiosClient.get("/paths"),
  getPath: (id) => axiosClient.get(`/paths/${id}`),
  savePath: (id) => axiosClient.post(`/paths/save/${id}`),
  deletePath: (id) => axiosClient.delete(`/paths/${id}`),
  toggleStar: (id) => axiosClient.post(`/paths/star/${id}`),
  toggleSave: (id) => axiosClient.post(`/paths/save-action/${id}`),
  completeStep: (pathId, stepId) =>
    axiosClient.patch(`/paths/${pathId}/step/${stepId}`),
  analyzePaths: (answers, quizResponseId = null) =>
    axiosClient.post("/ai/analyze", { answers, quizResponseId }),
  generateRoadmap: (pathId) => axiosClient.post(`/ai/roadmap/${pathId}`),
};
