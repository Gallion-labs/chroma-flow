import { api } from './api';

export const uploadCapture = async (imageData: string): Promise<void> => {
  const response = await api.post('/capture', { 
    image: imageData 
  });
  return response.data;
};