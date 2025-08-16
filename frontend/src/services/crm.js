// Lightweight API client for CRM endpoints (integrations, prospects, pipeline).
import api from "./api";

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

// Integrations
export const listIntegrations = async () => (await api.get("/integrations")).data.items || [];
export const upsertIntegration = async (payload) => (await api.post("/integrations", payload)).data.item;
export const patchIntegration = async (service, payload) => (await api.patch(`/integrations/${encodeURIComponent(service)}`, payload)).data.item;
export const deleteIntegration = async (service) => (await api.delete(`/integrations/${encodeURIComponent(service)}`)).data;

// Prospects
export const listProspects = async (params = {}) => (await api.get("/prospects", { params })).data.items || [];
export const createProspect = async (payload) => (await api.post("/prospects", payload)).data.item;
export const getProspect = async (id) => (await api.get(`/prospects/${id}`)).data.item;
export const updateProspect = async (id, payload) => (await api.patch(`/prospects/${id}`, payload)).data.item;
export const archiveProspect = async (id) => (await api.delete(`/prospects/${id}`)).data;

// Pipeline
export const listStages = async () => (await api.get("/pipeline/stages")).data.items || [];
export const createStage = async (payload) => (await api.post("/pipeline/stages", payload)).data.item;
export const updateStage = async (id, payload) => (await api.patch(`/pipeline/stages/${id}`, payload)).data.item;
export const deleteStage = async (id) => (await api.delete(`/pipeline/stages/${id}`)).data;

export const listDeals = async (params = {}) => (await api.get("/pipeline/deals", { params })).data.items || [];
export const createDeal = async (payload) => (await api.post("/pipeline/deals", payload)).data.item;
export const updateDeal = async (id, payload) => (await api.patch(`/pipeline/deals/${id}`, payload)).data.item;
export const deleteDeal = async (id) => (await api.delete(`/pipeline/deals/${id}`)).data;
