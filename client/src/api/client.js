import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // send the httpOnly auth cookie
});

// Pull a readable message and per-field errors out of any failed request.
export const parseError = (err) => ({
  message:
    err.response?.data?.message ||
    (err.request ? 'Cannot reach the server. Check your connection.' : 'Something went wrong.'),
  fields: err.response?.data?.errors || {},
  status: err.response?.status,
});

export default api;
