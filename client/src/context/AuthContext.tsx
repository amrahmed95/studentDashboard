import React, { createContext, useContext, useState } from 'react';
import { saveToLocalStorage, removeFromLocalStorage, getFromLocalStorage } from '../utility/localStorage';

interface User {
  email: string;
  name: string;
  token?: string;
  role?: string;
  enrolledCourses?: any[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, name: string, token?: string, role?: string, enrolledCourses?: any[]) => void;
  logout: () => void;
  register: (email: string, name: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getFromLocalStorage('user'));
  const isLoggedIn = Boolean(user);

  const login = (email: string, name: string, token?: string, role?: string, enrolledCourses?: any[]) => {
    const userData = { email, name, token, role, enrolledCourses };
    setUser(userData);
    saveToLocalStorage('user', userData);
    if(token){
      saveToLocalStorage('token', token);
    }
  };

  const logout = () => {
    setUser(null);
    removeFromLocalStorage('user');
    removeFromLocalStorage('username');
    removeFromLocalStorage('token');
    removeFromLocalStorage('role');
    removeFromLocalStorage('enrolledCourses');
  };

  const register = (email: string, name: string) => {
    const userData = { email, name };
    setUser(userData);
    saveToLocalStorage('user', userData);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};