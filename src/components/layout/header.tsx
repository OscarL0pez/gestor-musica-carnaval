'use client';

import React from 'react';
import { Music, LogOut, User } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  user?: {
    username: string;
    role: 'admin' | 'user';
  } | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-orange-500 flex-shrink-0">
              <Image
                src="/images/carnaval-logo.png"
                alt="Logo Comparsa Moreno Polo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
                onError={(e) => {
                  // Fallback al icono si no se encuentra la imagen
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
              <p className="text-xs sm:text-sm text-orange-600 font-medium truncate">Repertorio La Junquillera 2025</p>
            </div>
          </div>
          
          {user && onLogout && (
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
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
              
              {/* Versión móvil más compacta */}
              <div className="sm:hidden flex items-center space-x-1">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                  user.role === 'admin' 
                    ? 'bg-orange-100 text-orange-800 border-orange-200' 
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {user.username}
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  console.log('🔴 LOGOUT BUTTON CLICKED');
                  
                  // Método 1: Usar función onLogout si está disponible
                  if (typeof onLogout === 'function') {
                    console.log('📞 Calling onLogout function');
                    onLogout();
                  }
                  
                  // Método 2: Backup directo
                  console.log('🗑️ Clearing localStorage backup');
                  localStorage.removeItem('carnaval-auth');
                  
                  // Método 3: Forzar recarga completa
                  console.log('🔄 Forcing page reload');
                  setTimeout(() => {
                    window.location.href = '/';
                  }, 200);
                }}
                className="flex items-center space-x-1 border-2 border-red-500 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 hover:border-red-600 transition-all duration-200 p-2 sm:px-4 sm:py-2 rounded-lg cursor-pointer select-none font-semibold shadow-sm hover:shadow-md active:scale-95 transform"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}