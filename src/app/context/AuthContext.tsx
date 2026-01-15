'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  company?: string;
  avatar?: string;
  permissions?: string[];
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
  hasPermission: () => false,
  refreshPermissions: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load auth state from localStorage on component mount
    const storedToken = localStorage.getItem('azlok-token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Fetch permissions if user is authenticated
        if (storedToken) {
          fetchUserPermissions(storedToken, parsedUser);
        }
      } catch (e: unknown) {
        console.error('Failed to parse stored user data');
      }
    }
    
    setIsLoading(false);
  }, []);
  
  const fetchUserPermissions = async (authToken: string, userData: User) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/permissions/my-permissions`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      if (response.ok) {
        const permissions = await response.json();
        const updatedUser = { ...userData, permissions };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to fetch user permissions:', error);
    }
  };
  
  const refreshPermissions = async () => {
    if (token && user) {
      await fetchUserPermissions(token, user);
    }
  };
  
  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    
    // Store in localStorage
    localStorage.setItem('azlok-token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Fetch permissions
    fetchUserPermissions(newToken, userData);
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Remove from localStorage
    localStorage.removeItem('azlok-token');
    localStorage.removeItem('user');
  };
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admins and company users have all permissions
    if (user.role === 'admin' || user.role === 'company') {
      return true;
    }
    
    // Check if user has the specific permission
    return user.permissions?.includes(permission) || false;
  };
  
  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      login, 
      logout,
      isAuthenticated: !!token,
      isLoading,
      hasPermission,
      refreshPermissions
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
