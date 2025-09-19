'use client';

import React from 'react';
import { Music, LogOut, User } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  user?: {
    username: string;
    role: 'admin' | 'user';
  } | null;
}

export function Header({ user }: HeaderProps) {
  // Función de logout ultra simple
  const handleLogout = () => {
    console.log('🚀 LOGOUT INICIADO');
    
    // Limpiar todo
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.log('Error limpiando storage:', e);
    }
    
    // Redirigir
    window.location.replace('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 relative z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-orange-500 flex-shrink-0">
              <Image
                src="/images/carnaval-logo.png"
                alt="Logo Comparsa Moreno Polo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
                onError={(e) => {
                  console.log('Error loading image:', e);
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-full bg-orange-500 flex items-center justify-center">
                <Music className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                Comparsa Moreno Polo
              </h1>
              <p className="text-xs sm:text-sm text-orange-600 font-medium truncate">
                Repertorio La Junquillera 2025
              </p>
            </div>
          </div>
          
          {/* Área de usuario y logout */}
          {user && (
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Info del usuario - solo desktop */}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-700">
                <User className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-gray-900">{user.username}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  user.role === 'admin' 
                    ? 'bg-orange-100 text-orange-800 border-orange-200' 
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
              
              {/* Info del usuario - móvil */}
              <div className="sm:hidden flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                  user.role === 'admin' 
                    ? 'bg-orange-100 text-orange-800 border-orange-200' 
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {user.username}
                </span>
              </div>
              
              {/* BOTÓN DE LOGOUT MEGA-SIMPLE */}
              <div
                onClick={handleLogout}
                onTouchStart={handleLogout}
                className="
                  flex items-center justify-center
                  bg-red-600 hover:bg-red-700 active:bg-red-800
                  text-white font-bold
                  px-4 py-3 sm:px-6 sm:py-3
                  rounded-lg
                  cursor-pointer select-none
                  transition-all duration-150
                  shadow-lg hover:shadow-xl
                  border-2 border-red-700
                  min-w-[60px] min-h-[48px]
                  transform hover:scale-105 active:scale-95
                "
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline text-sm uppercase tracking-wide">
                  SALIR
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}