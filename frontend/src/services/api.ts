import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchImages = async () => {
  const response = await api.get('/queue');
  return response.data;
};

export const clearQueue = async () => {
  const response = await api.post('/queue/clear');
  return response.data;
};