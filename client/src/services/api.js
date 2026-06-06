import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitComplaint = async (rawText) => {
  const response = await api.post('/api/complaints', { rawText });
  return response.data;
};

export const getComplaints = async () => {
  const response = await api.get('/api/complaints');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

export const updateComplaintStatus = async (id, status) => {
  const response = await api.patch(`/api/complaints/${id}/status`, { status });
  return response.data;
};

export default api;
