import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
    
    // Check session on load
    const checkUser = async () => {
      try {
        const res = await api.get('/api/auth/check');
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {}
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
