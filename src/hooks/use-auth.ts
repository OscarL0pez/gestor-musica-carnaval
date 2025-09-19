'use client';

import { useState, useEffect } from 'react';
import { User, AuthState } from '@/types';

// Credenciales hardcodeadas (en producción esto debería estar en un backend seguro)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'carnaval2025'
};

const USER_CREDENTIALS = {
  username: 'usuario',
  password: 'carnaval'
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Cargar estado de autenticación al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('carnaval-auth');
    if (savedUser) {
      try {
        const user: User = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Error loading auth state:', error);
        localStorage.removeItem('carnaval-auth');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Función de login
  const login = (username: string, password: string): boolean => {
    let user: User | null = null;

    // Verificar credenciales de administrador
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      user = {
        id: 'admin-1',
        username: 'admin',
        role: 'admin'
      };
    }
    // Verificar credenciales de usuario
    else if (username === USER_CREDENTIALS.username && password === USER_CREDENTIALS.password) {
      user = {
        id: 'user-1',
        username: 'usuario',
        role: 'user'
      };
    }

    if (user) {
      localStorage.setItem('carnaval-auth', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    }

    return false;
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('carnaval-auth');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  // Verificar si el usuario es administrador
  const isAdmin = (): boolean => {
    return authState.user?.role === 'admin';
  };

  // Verificar si el usuario es usuario básico
  const isUser = (): boolean => {
    return authState.user?.role === 'user';
  };

  return {
    ...authState,
    login,
    logout,
    isAdmin,
    isUser
  };
}