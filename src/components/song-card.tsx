'use client';

import React, { useState } from 'react';
import { Song } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Crown, 
  Zap, 
  Heart, 
  Star, 
  Sparkles,
  Music,
  X
} from 'lucide-react';

interface SongCardProps {
  song: Song;
  isAdmin?: boolean;
  onEdit?: (song: Song) => void;
  onDelete?: (songId: string) => void;
}

export function SongCard({ 
  song, 
  isAdmin = false, 
  onEdit, 
  onDelete
}: SongCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'audio'>('lyrics');

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setIsExpanded(true);
      setActiveTab('lyrics'); // Asegurar que esté en la pestaña de letra
    }
  };

  const handleToggleExpanded = () => {
    if (!isFullscreen) { // No permitir contraer en pantalla completa
      setIsExpanded(!isExpanded);
    }
  };

  const getGenreIcon = (genre: string) => {
    switch (genre) {
      case 'Presentación':
        return <Crown className="h-4 w-4 text-blue-600" />;
      case 'Pasodoble':
        return <Zap className="h-4 w-4 text-green-600" />;
      case 'Cuplet':
        return <Heart className="h-4 w-4 text-purple-600" />;
      case 'Estribillo':
        return <Star className="h-4 w-4 text-orange-600" />;
      case 'Popurrí':
        return <Sparkles className="h-4 w-4 text-pink-600" />;
      default:
        return <Music className="h-4 w-4 text-gray-600" />;
    }
  };

  const getGenreColor = (genre: string) => {
    switch (genre) {
      case 'Presentación':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pasodoble':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cuplet':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Estribillo':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Popurrí':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-white' : 'h-auto cursor-pointer'
    }`}>
      <CardContent 
        className={`${isFullscreen ? 'h-full overflow-auto p-8' : 'p-4 sm:p-6'}`}
        onClick={isFullscreen ? undefined : handleToggleExpanded}
      >
        {isFullscreen ? (
          /* Vista de pantalla completa - Solo letra */
          <div className="h-full flex flex-col">
            {/* Header en pantalla completa */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {song.title}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreen}
                className="text-gray-500 hover:text-gray-700"
                title="Cerrar pantalla completa"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Letra en pantalla completa */}
            <div className="flex-1 flex items-center justify-center">
              <div className="max-w-4xl w-full">
                <div className="whitespace-pre-wrap font-mono leading-relaxed text-gray-800 text-lg text-center bg-gray-50 p-8 rounded-lg">
                  {song.lyrics}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Vista normal */
          <>
            {/* Header */}
            <div className="mb-4">
              {/* Título completo */}
              <h3 className="font-bold text-gray-900 mb-3 leading-tight break-words text-base sm:text-lg md:text-xl">
                {song.title}
              </h3>
              
              {/* Controles y género */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getGenreColor(song.genre)}`}>
                    {getGenreIcon(song.genre)}
                    {song.genre}
                  </span>
                  
                  {song.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {song.tags.slice(0, 2).map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {song.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{song.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {isAdmin && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(song)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(song.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Indicador visual de expansión */}
                <div className="text-gray-400">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
              </div>
            </div>

        {/* Contenido expandido con pestañas */}
        {isExpanded && (
          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
            {/* Pestañas */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('lyrics')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'lyrics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Letra
              </button>
              {song.audioFiles && song.audioFiles.length > 0 && (
                <button
                  onClick={() => setActiveTab('audio')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'audio'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Audio ({song.audioFiles.length})
                </button>
              )}
            </div>

            {/* Contenido de las pestañas */}
            {activeTab === 'lyrics' && (
              <div className="relative">
                {/* Botón de pantalla completa para letra */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreen}
                  className="absolute top-2 right-2 z-10 text-gray-500 hover:text-gray-700 bg-white/80 hover:bg-white"
                  title="Pantalla completa"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                
                <div className={`${
                  isFullscreen 
                    ? 'prose prose-lg max-w-none text-center' 
                    : 'prose prose-sm max-w-none'
                }`}>
                  <div className="whitespace-pre-wrap font-mono leading-relaxed text-gray-800 bg-gray-50 p-4 rounded-lg">
                    {song.lyrics}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audio' && song.audioFiles && song.audioFiles.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 flex items-center gap-2 mb-3">
                  <Music className="h-4 w-4" />
                  Archivos de Audio
                </h4>
                
                {/* Selector de archivo */}
                {song.audioFiles.length > 1 && (
                  <div className="mb-3">
                    <select 
                      value={currentAudioIndex} 
                      onChange={(e) => setCurrentAudioIndex(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      {song.audioFiles.map((audioFile, index) => {
                        const displayName = typeof audioFile === 'string' 
                          ? `Audio ${index + 1}` 
                          : `${audioFile.name} (${audioFile.genre})`;
                        return (
                          <option key={typeof audioFile === 'string' ? index : audioFile.id} value={index}>
                            {displayName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
                
                {/* Información del archivo actual */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700 font-medium">
                      {typeof song.audioFiles[currentAudioIndex] === 'string' 
                        ? 'Audio' 
                        : song.audioFiles[currentAudioIndex]?.name
                      }
                    </span>
                    {typeof song.audioFiles[currentAudioIndex] !== 'string' && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {song.audioFiles[currentAudioIndex]?.genre}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Reproductor HTML5 */}
                <audio 
                  controls 
                  className="w-full"
                  key={currentAudioIndex}
                  src={typeof song.audioFiles[currentAudioIndex] === 'string' 
                    ? song.audioFiles[currentAudioIndex] 
                    : song.audioFiles[currentAudioIndex]?.url
                  }
                  preload="metadata"
                >
                  Tu navegador no soporta la reproducción de audio.
                </audio>
              </div>
            )}
          </div>
        )}

        {/* Footer - Solo en vista normal */}
        {!isFullscreen && (
          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
            <div className="flex justify-between items-center">
              <span>
                Añadida: {song.addedDate.toLocaleDateString('es-ES')}
              </span>
              {song.audioFiles && song.audioFiles.length > 0 && (
                <span className="flex items-center gap-1 text-green-600">
                  <Music className="h-3 w-3" />
                  <span className="text-xs">{song.audioFiles.length} audio{song.audioFiles.length !== 1 ? 's' : ''}</span>
                </span>
              )}
            </div>
          </div>
        )}
        </>
        )}
      </CardContent>
    </Card>
  );
}