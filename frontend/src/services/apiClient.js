import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = import.meta.env.VITE_REACT_BASE_URL || 'http://localhost:8000/api/';
let accessToken = localStorage.getItem('access_token') || null;

export const axiosLog = axios.create({
  baseURL,
  headers: {
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (req) => {
  if (!accessToken) {
    accessToken = localStorage.getItem('access_token') || null;
    req.headers.Authorization = accessToken ? `Bearer ${accessToken}` : undefined;
    return req;
  }

  try {
    const user = jwtDecode(accessToken);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1000; // 1-second buffer

    if (!isExpired) return req;

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${baseURL}token/refresh/`, {
      refresh: refreshToken,
    });

    accessToken = response.data.access;
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    req.headers.Authorization = `Bearer ${response.data.access}`;
    axiosLog.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    accessToken = null;
    window.location.href = '/login'; // Redirect to login
  }

  return req;
});

export default axiosInstance;