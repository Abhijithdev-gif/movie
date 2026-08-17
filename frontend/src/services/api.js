import axios from 'axios';

// Create Axios instance with base URL & session credential support
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility to get CSRF token from cookies if available
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

API.interceptors.request.use((config) => {
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    config.headers['X-CSRFToken'] = csrftoken;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication endpoints
export const getCurrentUser = async () => {
  const response = await API.get('/auth/me/');
  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await API.post('/auth/login/', { username, password });
  return response.data;
};

export const registerUser = async (username, password, email = '') => {
  const response = await API.post('/auth/register/', { username, password, email });
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post('/auth/logout/');
  return response.data;
};

// Media endpoints
export const getMedia = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.search) params.append('search', filters.search);

  const response = await API.get(`/media/?${params.toString()}`);
  return response.data;
};

export const getMediaById = async (id) => {
  const response = await API.get(`/media/${id}/`);
  return response.data;
};

export const createMedia = async (mediaData) => {
  const response = await API.post('/media/', mediaData);
  return response.data;
};

export const updateMedia = async (id, mediaData) => {
  const response = await API.put(`/media/${id}/`, mediaData);
  return response.data;
};

export const patchMedia = async (id, mediaData) => {
  const response = await API.patch(`/media/${id}/`, mediaData);
  return response.data;
};

export const deleteMedia = async (id) => {
  const response = await API.delete(`/media/${id}/`);
  return response.data;
};

export const updateRating = async (id, rating) => {
  const response = await API.patch(`/media/${id}/`, { rating });
  return response.data;
};

// Stats endpoint
export const getStats = async () => {
  const response = await API.get('/stats/');
  return response.data;
};

export default API;
