import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const classifyProblem = (description) =>
  api.post("/classify", { description }).then((res) => res.data);

export const saveRequests = (requests) =>
  api.post("/requests", { requests }).then((res) => res.data);

export const getRequests = () => api.get("/requests").then((res) => res.data);

export default api;
