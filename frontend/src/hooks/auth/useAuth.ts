import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserCredentials, UserRegistration } from '@/types';
import { authService } from '@/services/api/auth';
import { setCookie, getCookie, removeCookie } from '@/utils/cookies';

const AUTH_COOKIE_NAME = 'auth_token';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getCookie(AUTH_COOKIE_NAME);
      if (token) {
        const isValid = await authService.verifyToken(token);
        if (!isValid) {
          removeCookie(AUTH_COOKIE_NAME);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (data: UserRegistration) => {
    try {
      const result = await authService.register(data);
      
      if (result.success && result.data) {
        const { user, token } = result.data;
        setCookie(AUTH_COOKIE_NAME, token);
        setUser(user);
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const login = async (credentials: UserCredentials) => {
    try {
      const result = await authService.login(credentials);
      
      if (result.success && result.data) {
        const { user, token } = result.data;
        setCookie(AUTH_COOKIE_NAME, token);
        setUser(user);
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      removeCookie(AUTH_COOKIE_NAME);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout
  };
}; 