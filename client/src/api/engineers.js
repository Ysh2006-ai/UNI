import api from './axios';

export const getEngineersAPI = async (params = {}) => {
  const response = await api.get('/engineers', { params });
  return response.data;
};

export const getEngineerAPI = async (id) => {
  const response = await api.get(`/engineers/${id}`);
  return response.data;
};

export const updateEngineerProfileAPI = async (id, data) => {
  const response = await api.put(`/engineers/${id}`, data);
  return response.data;
};
