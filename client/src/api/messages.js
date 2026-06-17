import api from './axios';

export const getMessagesAPI = async (projectId) => {
  const response = await api.get('/messages', { params: { project: projectId } });
  return response.data;
};

export const sendMessageAPI = async (projectId, content) => {
  const response = await api.post('/messages', { project: projectId, content });
  return response.data;
};

export const submitContactAPI = async (contactData) => {
  const response = await api.post('/contact', contactData);
  return response.data;
};
