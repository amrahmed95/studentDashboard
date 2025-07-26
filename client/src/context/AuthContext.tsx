import React, { createContext, useContext, useState, useCallback } from 'react';
import { saveToLocalStorage, removeFromLocalStorage, getFromLocalStorage } from '../utility/localStorage';


interface Course {
  _id: string;
  name: string;
  code: string;
}


interface User {
  email: string;
  username: string;
  role: string;
  enrolledCourses?: Course[];
  assignedCourses?: Course[];
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
  register: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = getFromLocalStorage('user');
      if (!storedUser) return null;

      // Handle case where it's already an object
      if (typeof storedUser === 'object') {
        return storedUser as User;
      }

      // Handle stringified JSON
      return JSON.parse(storedUser) as User;
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
      return null;
    }
  });

  const isLoggedIn = Boolean(user?.token);

  const login = useCallback((userData: User) => {
    const fullUserData = {
      ...userData,
      token: userData.token || user?.token
    };
    setUser(fullUserData);
    saveToLocalStorage('user', JSON.stringify(fullUserData));
    if (userData.token) {
      saveToLocalStorage('token', userData.token);
    }
  }, [user?.token]);

  const logout = useCallback(() => {
    setUser(null);
    removeFromLocalStorage('user');
    removeFromLocalStorage('token');
  }, []);


  const register = useCallback((userData: User) => {
    login({
      ...userData,
      enrolledCourses: userData.enrolledCourses || [],
      assignedCourses: userData.assignedCourses || []
    });
  }, [login]);

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