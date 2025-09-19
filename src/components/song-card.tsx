'use client';

import React, { useState } from 'react';
import { Song } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronDown, ChevronUp, Play, Pause } from 'lucide-react';

interface SongCardProps {
  song: Song;
  isAdmin?: boolean;
  onEdit?: (song: Song) => void;
  onDelete?: (songId: string) => void;
}

export function SongCard({ song, isAdmin = false, onEdit, onDelete }: SongCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const genreColors = {
    'Presentación': 'bg-blue-100 text-blue-800',
    'Pasodoble': 'bg-green-100 text-green-800',
    'Cuplet': 'bg-purple-100 text-purple-800',
    'Estribillo': 'bg-orange-100 text-orange-800',
    'Popurrí': 'bg-pink-100 text-pink-800'
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Aquí podrías implementar la lógica real de reproducción
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

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardContent className="p-0">
        {/* Tarjeta principal - clickeable */}
        <div onClick={handleCardClick} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{song.title}</h3>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${genreColors[song.genre]}`}>
                {song.genre}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {/* Botones de admin */}
              {isAdmin && onEdit && onDelete && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 w-8 p-0 hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </>
              )}
              
              {/* Indicador de expansión */}
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Contenido expandido */}
        {isExpanded && (
          <div className="border-t bg-gray-50">
            {/* Reproductor de audio */}
            {song.audioFile && (
              <div className="p-4 border-b bg-white">
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handlePlayPause}
                    className="h-10 w-10 rounded-full bg-orange-600 hover:bg-orange-700 text-white p-0"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{song.title}</div>
                    <div className="text-xs text-gray-500">{song.audioFile}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {isPlaying ? 'Reproduciendo...' : 'Listo para reproducir'}
                  </div>
                </div>
                
                {/* Barra de progreso simulada */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className={`bg-orange-600 h-1 rounded-full transition-all duration-1000 ${
                      isPlaying ? 'w-1/3' : 'w-0'
                    }`}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0:00</span>
                    <span>3:45</span>
                  </div>
                </div>
              </div>
            )}

            {/* Letra de la canción */}
            {song.lyrics && (
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Letra:</h4>
                <div className="bg-white rounded-lg p-4 border">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {song.lyrics}
                  </pre>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="px-4 pb-4">
              <div className="flex justify-between items-center text-xs text-gray-500">
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
    </Card>
  );
}