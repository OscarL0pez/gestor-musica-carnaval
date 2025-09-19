'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Song } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronDown, ChevronUp, Play, Pause, Maximize2, Crown, Zap, Heart, Star, Sparkles } from 'lucide-react';

interface SongCardProps {
  song: Song;
  isAdmin?: boolean;
  onEdit?: (song: Song) => void;
  onDelete?: (songId: string) => void;
}

export function SongCard({ song, isAdmin = false, onEdit, onDelete }: SongCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const genreColors = {
    'Presentación': 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
    'Pasodoble': 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300',
    'Cuplet': 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300',
    'Estribillo': 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300',
    'Popurrí': 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-300'
  };

  const genreIcons = {
    'Presentación': Crown,
    'Pasodoble': Zap,
    'Cuplet': Heart,
    'Estribillo': Star,
    'Popurrí': Sparkles
  };

  const genreBackgrounds = {
    'Presentación': 'bg-gradient-to-br from-blue-50 via-white to-blue-100',
    'Pasodoble': 'bg-gradient-to-br from-green-50 via-white to-green-100',
    'Cuplet': 'bg-gradient-to-br from-purple-50 via-white to-purple-100',
    'Estribillo': 'bg-gradient-to-br from-orange-50 via-white to-orange-100',
    'Popurrí': 'bg-gradient-to-br from-pink-50 via-white to-pink-100'
  };

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error reproduciendo audio:', error);
      // Si hay error, mostrar mensaje al usuario
      alert('No se pudo reproducir el audio. Verifica que el archivo sea válido.');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(song);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${song.title}"?`)) {
      onDelete?.(song.id);
    }
  };

  const handleFullscreenClose = () => {
    setIsFullscreen(false);
  };

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden ${genreBackgrounds[song.genre]}`}>
      <CardContent className="p-0 relative">
        {/* Tarjeta principal - clickeable */}
        <div onClick={handleCardClick} className="p-3 sm:p-4 transition-colors duration-200 hover:bg-white/50 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 transition-colors duration-200">{song.title}</h3>
              <div className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full font-medium transition-all duration-200 hover:scale-105 border ${genreColors[song.genre]}`}>
                {React.createElement(genreIcons[song.genre], { className: "w-3 h-3 sm:w-4 sm:h-4" })}
                <span>{song.genre}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Botones de admin */}
              {isAdmin && onEdit && onDelete && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-blue-100 hover:scale-110 transition-all duration-200 touch-manipulation"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-red-100 hover:scale-110 transition-all duration-200 touch-manipulation"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  </Button>
                </>
              )}
              
              {/* Indicador de expansión */}
              <div className="transition-transform duration-300">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido expandido */}
        {isExpanded && (
          <div className="border-t bg-gray-50 animate-in slide-in-from-top-2 duration-300">
            {/* Reproductor de audio */}
            {song.audioFile && (
              <div className="p-3 sm:p-4 border-b bg-white">
                {/* Elemento audio HTML5 oculto */}
                <audio
                  ref={audioRef}
                  src={song.audioFile}
                  preload="metadata"
                />
                
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Button
                    onClick={handlePlayPause}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-600 hover:bg-orange-700 hover:scale-110 transition-all duration-200 text-white p-0 touch-manipulation flex-shrink-0 shadow-lg hover:shadow-xl"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />
                    )}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{song.title}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {song.audioFile.length > 30 
                        ? `...${song.audioFile.slice(-30)}` 
                        : song.audioFile
                      }
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">
                    {isPlaying ? 'Reproduciendo...' : 'Listo'}
                  </div>
                </div>
                
                {/* Barra de progreso real */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-1 touch-manipulation">
                    <div 
                      className="bg-orange-600 h-2 sm:h-1 rounded-full transition-all duration-200"
                      style={{ 
                        width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
                  </div>
                </div>

                {/* Mensaje de ayuda si no hay archivo */}
                {!song.audioFile.startsWith('http') && !song.audioFile.startsWith('/') && (
                  <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    ⚠️ Para reproducir audio, necesitas una URL válida (http://) o subir el archivo al servidor.
                  </div>
                )}
              </div>
            )}

            {/* Letra de la canción */}
            {song.lyrics && (
              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 text-base sm:text-lg">Letra:</h4>
                  <Button
                    onClick={() => setIsFullscreen(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
                  >
                    <Maximize2 className="w-3 h-3 mr-1" />
                    Pantalla completa
                  </Button>
                </div>
                <div className="bg-white rounded-lg p-4 sm:p-5 border">
                  <pre className="text-base sm:text-sm md:text-base text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {song.lyrics}
                  </pre>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-gray-500">
                <span>Agregado: {new Date(song.addedDate).toLocaleDateString()}</span>
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
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                        +{song.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Modal de pantalla completa para letras */}
      {isFullscreen && song.lyrics && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-orange-600 text-white">
              <h2 className="text-xl font-bold">{song.title}</h2>
              <Button
                onClick={handleFullscreenClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-orange-700"
              >
                ✕
              </Button>
            </div>
            <div className="p-6 overflow-auto h-full">
              <pre className="text-lg leading-relaxed whitespace-pre-wrap font-sans text-gray-800">
                {song.lyrics}
              </pre>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}