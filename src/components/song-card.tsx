'use client';

import React, { useState } from 'react';
import { Song } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from '@/components/audio/audio-player';
import { AudioUploader } from '@/components/audio/audio-uploader';
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
  Upload,
  Play,
  Volume2
} from 'lucide-react';

interface SongCardProps {
  song: Song;
  isAdmin?: boolean;
  onEdit?: (song: Song) => void;
  onDelete?: (songId: string) => void;
  onUpdateAudio?: (songId: string, audioUrl: string) => void;
}

export function SongCard({ 
  song, 
  isAdmin = false, 
  onEdit, 
  onDelete, 
  onUpdateAudio 
}: SongCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAudioUploader, setShowAudioUploader] = useState(false);
  const [audioPlayerExpanded, setAudioPlayerExpanded] = useState(false);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setIsExpanded(true);
      // En modo fullscreen, expandir también el audio si existe
      if (song.audioFile) {
        setAudioPlayerExpanded(true);
      }
    }
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAudioUpload = (audioUrl: string) => {
    if (onUpdateAudio) {
      onUpdateAudio(song.id, audioUrl);
    }
    setShowAudioUploader(false);
  };

  const getGenreIcon = (genre: string) => {
    switch (genre) {
      case 'Presentación':
        return <Crown className="h-4 w-4 text-purple-600" />;
      case 'Pasodoble':
        return <Zap className="h-4 w-4 text-red-600" />;
      case 'Cuplet':
        return <Heart className="h-4 w-4 text-pink-600" />;
      case 'Estribillo':
        return <Star className="h-4 w-4 text-yellow-600" />;
      case 'Popurrí':
        return <Sparkles className="h-4 w-4 text-blue-600" />;
      default:
        return <Music className="h-4 w-4 text-gray-600" />;
    }
  };

  const getGenreColor = (genre: string) => {
    switch (genre) {
      case 'Presentación':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pasodoble':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Cuplet':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Estribillo':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Popurrí':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
    }`}>
      <CardContent className={`p-6 ${isFullscreen ? 'h-full overflow-auto' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-gray-900 mb-2 ${
              isFullscreen ? 'text-3xl' : 'text-xl'
            }`}>
              {song.title}
            </h3>
            
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getGenreColor(song.genre)}`}>
                {getGenreIcon(song.genre)}
                {song.genre}
              </span>
              
              {song.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {song.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {song.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{song.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {/* Botón de Audio Minimizado */}
            {song.audioFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAudioPlayerExpanded(!audioPlayerExpanded)}
                className="text-green-600 hover:text-green-800"
                title={audioPlayerExpanded ? "Minimizar reproductor" : "Expandir reproductor"}
              >
                {audioPlayerExpanded ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}

            {isAdmin && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAudioUploader(!showAudioUploader)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Gestionar audio"
                >
                  <Upload className="h-4 w-4" />
                </Button>
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFullscreen}
              className="text-gray-600 hover:text-gray-800"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleExpanded}
              className="text-gray-600 hover:text-gray-800"
              title={isExpanded ? "Ocultar letra" : "Ver letra completa"}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Audio Player - Solo visible cuando está expandido */}
        {song.audioFile && audioPlayerExpanded && (
          <div className="mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-green-800 flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Reproductor de Audio
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAudioPlayerExpanded(false)}
                  className="text-green-600 hover:text-green-800 h-6 w-6 p-0"
                  title="Minimizar reproductor"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
              </div>
              <AudioPlayer
                audioUrl={song.audioFile}
                title={song.title}
                artist="Comparsa Moreno Polo"
                showAdvancedControls={true}
                className="bg-white"
              />
            </div>
          </div>
        )}

        {/* Audio Uploader (Solo Admin) */}
        {isAdmin && showAudioUploader && (
          <div className="mb-4">
            <AudioUploader
              songId={song.id}
              songTitle={song.title}
              existingAudioUrl={song.audioFile}
              onUploadComplete={handleAudioUpload}
            />
          </div>
        )}

        {/* Lyrics Preview - Solo visible cuando está expandido */}
        <div className={`${
          isExpanded ? 'block' : 'hidden'
        } transition-all duration-300`}>
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

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex justify-between items-center">
            <span>
              Añadida: {song.addedDate.toLocaleDateString('es-ES')}
            </span>
            {song.audioFile && (
              <button
                onClick={() => setAudioPlayerExpanded(!audioPlayerExpanded)}
                className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors cursor-pointer"
                title="Hacer clic para reproducir audio"
              >
                <Music className="h-3 w-3" />
                <span className="text-xs">Audio disponible</span>
                {!audioPlayerExpanded && <Play className="h-2 w-2 ml-1" />}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}