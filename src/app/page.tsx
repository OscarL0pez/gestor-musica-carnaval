'use client';

import React, { useState } from 'react';
import { Song } from '@/types';
import { useSongs } from '@/hooks/use-songs';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { SongCard } from '@/components/song-card';
import { SongForm } from '@/components/song-form';
import { LoginForm } from '@/components/auth/login-form';
import { Button } from '@/components/ui/button';
import { Plus, Music } from 'lucide-react';

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
    logout, 
    isAdmin, 
    user 
  } = useAuth();
  
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowForm(true);
  };

  const handleDeleteSong = (songId: string) => {
    deleteSong(songId);
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <Header user={user} onLogout={logout} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
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
            <div className="flex flex-col gap-4 mb-8">
              {/* Solo mostrar botón de agregar si es admin */}
              {isAdmin() && (
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar Canción de Carnaval
                  </Button>
                </div>
              )}
              
              {/* Filtros por género como botones */}
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-orange-800 text-center">Filtrar por Género</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant={selectedGenre === '' ? 'default' : 'outline'}
                    onClick={() => setSelectedGenre('')}
                    className={`text-sm ${selectedGenre === '' 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                    }`}
                  >
                    Todos los géneros
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
                        className={`text-sm ${colorClass}`}
                      >
                        {genre}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Estadísticas simples */}
            <div className="mb-6">
              <p className="text-orange-700 font-medium">
                {songs.length} cancion{songs.length !== 1 ? 'es' : ''} de carnaval
                {selectedGenre && ` • Género: ${selectedGenre}`}
                {!isAdmin() && (
                  <span className="ml-2 text-sm text-gray-600">
                    (Solo lectura)
                  </span>
                )}
              </p>
            </div>

            {/* Lista de canciones */}
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
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primera Canción
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </main>
    </div>
  );
}
