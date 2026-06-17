import api from './axios';

export const getTasksAPI = async (projectId) => {
  const params = projectId ? { project: projectId } : {};
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const createTaskAPI = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTaskAPI = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTaskAPI = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
