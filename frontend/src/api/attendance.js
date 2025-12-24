import api from './auth';

// Attendance API
export const markAttendance = async (token) => {
  const response = await api.post('/attendance/mark', { token });
  return response.data;
};

export const getStudentAttendance = async () => {
  const response = await api.get('/attendance/student');
  return response.data;
};

export const getLectureAttendance = async (lectureId) => {
  const response = await api.get(`/attendance/lecture/${lectureId}`);
  return response.data;
};

export default {
  markAttendance,
  getStudentAttendance,
  getLectureAttendance,
};
