import { jwtDecode } from 'jwt-decode';
import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { axiosLog } from '../services/apiClient';
import { useSnackbar } from 'notistack';

export const AuthContext = createContext();

export const AuthWrapper = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('access_token') && localStorage.getItem('refresh_token')
      ? { access: localStorage.getItem('access_token'), refresh: localStorage.getItem('refresh_token') }
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem('access_token') ? jwtDecode(localStorage.getItem('access_token')) : null
  );

  const loginUser = async ({ username, password }) => {
    if (!username || !password) {
      enqueueSnackbar('Please enter username and password!', {
        variant: 'error',
        autoHideDuration: 4000,
      });
      return;
    }

    try {
      console.log('Login request URL:', axiosLog.defaults.baseURL + 'token/');
      const res = await axiosLog.post('token/', { username, password });

      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      axiosLog.defaults.headers['Authorization'] = `Bearer ${res.data.access}`;
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${res.data.access}`;

      setUser(jwtDecode(res.data.access));
      setAuthTokens({ access: res.data.access, refresh: res.data.refresh });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      if (error.response?.status === 401) {
        enqueueSnackbar('Incorrect username or password!', {
          variant: 'error',
          autoHideDuration: 4000,
        });
      } else {
        enqueueSnackbar('Something went wrong during login.', {
          variant: 'error',
          autoHideDuration: 4000,
        });
      }
    }
  };

  const logoutUser = async () => {
    try {
      await axiosInstance.post('inventory/logout/blacklist/', {
        refresh_token: localStorage.getItem('refresh_token'),
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      axiosLog.defaults.headers['Authorization'] = undefined;
      axiosInstance.defaults.headers['Authorization'] = undefined;
      setUser(null);
      setAuthTokens(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      enqueueSnackbar('Failed to log out. Please try again.', {
        variant: 'error',
        autoHideDuration: 4000,
      });
    }
  };

  const contextData = {
    user,
    authTokens,
    setAuthTokens,
    setUser,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};