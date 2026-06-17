import api from './axios';

export const loginAPI = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const signupAPI = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const getMeAPI = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
