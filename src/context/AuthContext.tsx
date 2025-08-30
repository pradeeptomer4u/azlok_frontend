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
      // Make an API call to authenticate with the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: email, // FastAPI OAuth2 expects username field
          password: password,
        }).toString(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Invalid email or password');
      }
      
      // Get user details with the token
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }
      
      const userDetails = await userResponse.json();
      
      // Transform backend user to frontend user format
      const userData: User = {
        id: userDetails.id,
        name: userDetails.full_name,
        email: userDetails.email,
        role: userDetails.role.toLowerCase(),
        company: userDetails.business_name || '',
        avatar: '/globe.svg' // Default avatar
      };
      
      // Store user data and token
      setUser(userData);
      setToken(data.access_token);
      localStorage.setItem('azlok-user', JSON.stringify(userData));
      localStorage.setItem('azlok-token', data.access_token);
      
      // Redirect based on role
      if (userData.role === 'seller') {
        router.push('/seller/dashboard');
      } else if (userData.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
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
