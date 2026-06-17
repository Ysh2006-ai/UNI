import api from './axios';

export const createProjectAPI = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

export const getProjectsAPI = async (filter) => {
  const params = filter ? { filter } : {};
  const response = await api.get('/projects', { params });
  return response.data;
};

export const getProjectAPI = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const updateProjectAPI = async (id, data) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

export const matchEngineersAPI = async (projectId) => {
  const response = await api.post(`/projects/${projectId}/match`);
  return response.data;
};

export const assignEngineersAPI = async (projectId, engineerIds) => {
  const response = await api.post(`/projects/${projectId}/assign`, { engineerIds });
  return response.data;
};
