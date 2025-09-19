'use client';

import React from 'react';
import { Music, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500">
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
                <Music className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Comparsa Moreno Polo
              </h1>
              <p className="text-sm text-orange-600 font-medium">Repertorio La Junquillera 2025</p>
            </div>
          </div>
          
          {user && onLogout && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
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
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}