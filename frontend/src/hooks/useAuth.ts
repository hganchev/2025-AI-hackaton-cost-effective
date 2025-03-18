import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth.service';
import type { User, LoginRequest, RegisterRequest } from '@/types/api.types';

const authService = new AuthService();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginRequest): Promise<User> => {
    try {
      const user = await authService.login(data);
      setUser(user);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to login'));
      throw err;
    }
  };

  const register = async (data: RegisterRequest): Promise<User> => {
    try {
      const user = await authService.register(data);
      setUser(user);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to register'));
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to logout'));
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout
  };
} 