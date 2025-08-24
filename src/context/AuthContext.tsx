'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  company?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
  userRole: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
  company?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('azlok-user');
        if (storedUser) {
          // In a real app, we would validate the token with the server
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Set mock token for API calls
          setToken(`mock-jwt-token-${parsedUser.id}-${parsedUser.role}`);
        }
      } catch (err: unknown) {
        console.error('Authentication error:', err);
        localStorage.removeItem('azlok-user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, we would make an API call to authenticate
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Login failed');
      
      // Mock authentication for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials (mock)
      if (email === 'buyer@example.com' && password === 'password') {
        const userData: User = {
          id: 1,
          name: 'John Buyer',
          email: 'buyer@example.com',
          role: 'buyer',
          company: 'ABC Corp',
          avatar: '/globe.svg'
        };
        setUser(userData);
        localStorage.setItem('azlok-user', JSON.stringify(userData));
        router.push('/dashboard');
      } else if (email === 'seller@example.com' && password === 'password') {
        const userData: User = {
          id: 2,
          name: 'Jane Seller',
          email: 'seller@example.com',
          role: 'seller',
          company: 'XYZ Manufacturing',
          avatar: '/globe.svg'
        };
        setUser(userData);
        localStorage.setItem('azlok-user', JSON.stringify(userData));
        router.push('/dashboard');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, we would make an API call to register
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Registration failed');
      
      // Mock registration for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: Math.floor(Math.random() * 1000),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        company: userData.company,
        avatar: '/globe.svg'
      };
      
      setUser(newUser);
      setToken(`mock-jwt-token-${newUser.id}-${newUser.role}`);
      localStorage.setItem('azlok-user', JSON.stringify(newUser));
      router.push('/dashboard');
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('azlok-user');
    router.push('/');
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    token,
    userRole: user?.role || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
