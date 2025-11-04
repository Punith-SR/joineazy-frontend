import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ 
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Courses endpoints
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  create: (data) => api.post('/courses', data),
  getById: (id) => api.get(`/courses/${id}`),
  addStudentByEmail: (courseId, studentEmail) => 
    api.post(`/courses/${courseId}/add-student-by-email`, { studentEmail }),
  addStudentById: (courseId, studentId) => 
    api.post(`/courses/${courseId}/add-student/${studentId}`),
  getStudents: (courseId) => api.get(`/courses/${courseId}/students`),
};

// Assignments endpoints
export const assignmentsAPI = {
  getByCourse: (courseId) => api.get(`/assignments/course/${courseId}`),
  getDetails: (assignmentId) => api.get(`/assignments/${assignmentId}/details`),
  create: (data) => api.post('/assignments', data),
};

// Submissions endpoints
export const submissionsAPI = {
  submitIndividual: (assignmentId) => api.post(`/submissions/${assignmentId}/submit-individual`),
  acknowledgeGroup: (assignmentId, groupId) => api.post(`/submissions/${assignmentId}/group/${groupId}/acknowledge`),
  getStats: (assignmentId) => api.get(`/submissions/${assignmentId}/stats`),
};

export default api;
