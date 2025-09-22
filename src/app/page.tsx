'use client';

import React, { useState } from 'react';
import { Song } from '@/types';
import { useSongs } from '@/hooks/use-songs';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { SongCard } from '@/components/song-card';
import { SongForm } from '@/components/song-form';
import { LoginForm } from '@/components/auth/login-form';
import { EventsCalendar } from '@/components/calendar/events-calendar';
import { Button } from '@/components/ui/button';
import { Plus, Music, Calendar } from 'lucide-react';

export default function Home() {
  const { 
    songs, 
    loading, 
    genres, 
    selectedGenre, 
    setSelectedGenre,
    addSong,
    updateSong,
    deleteSong
  } = useSongs();
  
  const { 
    isAuthenticated, 
    isLoading: authLoading, 
    login, 
    isAdmin, 
    user 
  } = useAuth();
  
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [currentView, setCurrentView] = useState<'biblioteca' | 'calendario'>('biblioteca');

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowForm(true);
  };

  const handleDeleteSong = (id: string) => {
    deleteSong(id);
  };

  // Mostrar loading mientras se cargan auth y canciones
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Mostrar formulario de login si no está autenticado
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 relative overflow-hidden">
      {/* Patrones decorativos de carnaval */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-red-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-pink-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-purple-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/3 right-1/4 w-14 h-14 bg-green-400 rounded-full animate-bounce delay-1200"></div>
      </div>
      
      <Header user={user} />
      
      <main className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-8 relative z-10 min-h-screen">
        {/* Navegación entre vistas - Mejorada para móvil */}
        <div className="flex justify-center mb-4 sm:mb-6 px-2">
          <div className="flex bg-white rounded-lg p-1 shadow-md w-full sm:w-auto max-w-sm sm:max-w-none">
            <Button
              onClick={() => setCurrentView('biblioteca')}
              variant={currentView === 'biblioteca' ? 'default' : 'ghost'}
              className={`flex items-center gap-1 sm:gap-2 transition-all duration-300 flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2 ${
                currentView === 'biblioteca' 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Music className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Biblioteca</span>
              <span className="xs:hidden">🎵</span>
            </Button>
            <Button
              onClick={() => setCurrentView('calendario')}
              variant={currentView === 'calendario' ? 'default' : 'ghost'}
              className={`flex items-center gap-1 sm:gap-2 transition-all duration-300 flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2 ${
                currentView === 'calendario' 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Calendario</span>
              <span className="xs:hidden">📅</span>
            </Button>
          </div>
        </div>

        {/* Contenido según la vista */}
        {currentView === 'biblioteca' ? (
          <>
            {showForm && isAdmin() ? (
              <SongForm
                onSubmit={(data) => {
                  if (editingSong) {
                    updateSong(editingSong.id, data);
                  } else {
                    addSong(data);
                  }
                  setShowForm(false);
                  setEditingSong(null);
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingSong(null);
                }}
                initialData={editingSong || undefined}
              />
            ) : (
              <>
                {/* Controles superiores */}
                <div className="flex flex-col gap-4 mb-6 sm:mb-8">
              {/* Solo mostrar botón de agregar si es admin */}
              {isAdmin() && (
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white flex items-center gap-2 h-12 px-4 sm:px-6 touch-manipulation shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Agregar Canción de Carnaval</span>
                    <span className="sm:hidden">Agregar Canción</span>
                  </Button>
                </div>
              )}
              
              {/* Filtros por género como botones */}
              <div className="flex flex-col gap-3">
                <h3 className="text-base sm:text-lg font-semibold text-orange-800 text-center">Filtrar por Género</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant={selectedGenre === '' ? 'default' : 'outline'}
                    onClick={() => setSelectedGenre('')}
                    className={`text-xs sm:text-sm h-10 px-3 sm:px-4 touch-manipulation transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md ${selectedGenre === '' 
                      ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white' 
                      : 'border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300'
                    }`}
                  >
                    <span className="hidden sm:inline">Todos los géneros</span>
                    <span className="sm:hidden">Todos</span>
                  </Button>
                  {genres.map(genre => {
                    const genreColors: Record<string, { active: string; inactive: string }> = {
                      'Presentación': {
                        active: 'bg-blue-600 hover:bg-blue-700 text-white',
                        inactive: 'border-blue-200 text-blue-700 hover:bg-blue-50'
                      },
                      'Pasodoble': {
                        active: 'bg-green-600 hover:bg-green-700 text-white',
                        inactive: 'border-green-200 text-green-700 hover:bg-green-50'
                      },
                      'Cuplet': {
                        active: 'bg-purple-600 hover:bg-purple-700 text-white',
                        inactive: 'border-purple-200 text-purple-700 hover:bg-purple-50'
                      },
                      'Estribillo': {
                        active: 'bg-orange-600 hover:bg-orange-700 text-white',
                        inactive: 'border-orange-200 text-orange-700 hover:bg-orange-50'
                      },
                      'Popurrí': {
                        active: 'bg-pink-600 hover:bg-pink-700 text-white',
                        inactive: 'border-pink-200 text-pink-700 hover:bg-pink-50'
                      }
                    };
                    
                    const isSelected = selectedGenre === genre;
                    const colorClass = isSelected 
                      ? genreColors[genre]?.active || 'bg-gray-600 hover:bg-gray-700 text-white'
                      : genreColors[genre]?.inactive || 'border-gray-200 text-gray-700 hover:bg-gray-50';
                    
                    return (
                      <Button
                        key={genre}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => setSelectedGenre(genre)}
                        className={`text-xs sm:text-sm h-10 px-3 sm:px-4 touch-manipulation transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md ${colorClass}`}
                      >
                        {genre}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Estadísticas simples */}
            <div className="mb-4 sm:mb-6">
              <p className="text-orange-700 font-medium text-sm sm:text-base">
                {songs.length} cancion{songs.length !== 1 ? 'es' : ''} de carnaval
                {selectedGenre && ` • Género: ${selectedGenre}`}
                {!isAdmin() && (
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">
                    (Solo lectura)
                  </span>
                )}
              </p>
            </div>

            {/* Lista de canciones ordenadas por género */}
            {songs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <Music className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {isAdmin() 
                    ? 'Aún no tienes canciones de carnaval' 
                    : 'No hay canciones disponibles'
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {isAdmin() 
                    ? 'Comienza agregando tu primera canción con letra y audio'
                    : 'El administrador aún no ha agregado canciones'
                  }
                </p>
                {isAdmin() && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white h-12 touch-manipulation"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Agregar Primera Canción</span>
                    <span className="sm:hidden">Agregar Canción</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {songs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    isAdmin={isAdmin()}
                    onEdit={handleEditSong}
                    onDelete={handleDeleteSong}
                  />
                ))}
              </div>
            )}
              </>
            )}
          </>
        ) : (
          <EventsCalendar isAdmin={isAdmin()} />
        )}
      </main>
    </div>
  );
}
