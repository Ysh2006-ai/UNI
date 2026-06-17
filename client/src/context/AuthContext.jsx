import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAPI, signupAPI, getMeAPI } from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('uni_token'));
  const [loading, setLoading] = useState(true);

  // On mount, validate the existing token
  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const data = await getMeAPI();
          setUser(data.user);
        } catch (error) {
          // Token invalid — clear it
          console.error('Token validation failed:', error);
          localStorage.removeItem('uni_token');
          localStorage.removeItem('uni_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    const data = await loginAPI(email, password);
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('uni_token', data.token);
      localStorage.setItem('uni_user', JSON.stringify(data.user));
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await signupAPI(userData);
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('uni_token', data.token);
      localStorage.setItem('uni_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('uni_token');
    localStorage.removeItem('uni_user');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('rememberedUsername');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
