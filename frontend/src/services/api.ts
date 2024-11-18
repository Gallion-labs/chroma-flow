import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const fetchImages = async () => {
  const response = await api.get('/queue');
  return response.data;
};

export const clearQueue = async () => {
  const response = await api.post('/queue/clear');
  return response.data;
};