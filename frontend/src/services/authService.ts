import api from './api';

export const login = async (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const logout = async () => {
  return api.post('/auth/logout');
};

export default { login, logout };
