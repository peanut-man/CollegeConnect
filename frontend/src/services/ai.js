import api from "./api";

export async function askQuery(query) {
  const response = await api.post("/ai/query", { query });
  return response.data.data;
}
