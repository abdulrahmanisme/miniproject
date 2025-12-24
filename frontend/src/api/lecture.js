import api from './auth';

// Lecture API
export const createLecture = async (subject, durationMinutes = 10) => {
  const response = await api.post('/lecture/create', { subject, durationMinutes });
  return response.data;
};

export const getLecture = async (id) => {
  const response = await api.get(`/lecture/${id}`);
  return response.data;
};

export default {
  createLecture,
  getLecture,
};
