'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Repeat, 
  Repeat1,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  artist?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  autoPlay?: boolean;
  showAdvancedControls?: boolean;
  className?: string;
}

export function AudioPlayer({
  audioUrl,
  title,
  artist,
  onTimeUpdate,
  autoPlay = false,
  showAdvancedControls = true,
  className = ''
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime, audio.duration);
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    if (autoPlay) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, autoPlay, repeatMode, onTimeUpdate]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newVolume = parseFloat(e.target.value) / 100;
    
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    setPlaybackRate(rate);
    audio.playbackRate = rate;
    setShowSettings(false);
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const restartSong = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const cycleRepeatMode = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''} ${className}`}>
      <CardContent className={`p-4 ${isFullscreen ? 'h-full flex flex-col justify-center' : ''}`}>
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate ${isFullscreen ? 'text-2xl' : 'text-lg'}`}>
              {title}
            </h3>
            {artist && (
              <p className={`text-gray-600 truncate ${isFullscreen ? 'text-xl' : 'text-sm'}`}>
                {artist}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {showAdvancedControls && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className={isFullscreen ? 'w-12 h-12' : 'w-8 h-8'}
                >
                  <Settings className={isFullscreen ? 'h-6 w-6' : 'h-4 w-4'} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className={isFullscreen ? 'w-12 h-12' : 'w-8 h-8'}
                >
                  {isFullscreen ? (
                    <Minimize className={isFullscreen ? 'h-6 w-6' : 'h-4 w-4'} />
                  ) : (
                    <Maximize className={isFullscreen ? 'h-6 w-6' : 'h-4 w-4'} />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progressPercentage}
            onChange={handleSeek}
            className={`w-full accent-red-600 ${isFullscreen ? 'h-3' : 'h-2'}`}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {showAdvancedControls && (
            <>
              <Button
                variant="ghost"
                size={isFullscreen ? 'lg' : 'sm'}
                onClick={restartSong}
                className={isFullscreen ? 'w-12 h-12' : ''}
              >
                <RotateCcw className={isFullscreen ? 'h-6 w-6' : 'h-4 w-4'} />
              </Button>
              
              <Button
                variant="ghost"
                size={isFullscreen ? 'lg' : 'sm'}
                onClick={() => skipTime(-10)}
                className={isFullscreen ? 'w-12 h-12' : ''}
              >
                <SkipBack className={isFullscreen ? 'h-6 w-6' : 'h-4 w-4'} />
              </Button>
            </>
          )}

          <Button
            onClick={togglePlayPause}
            size={isFullscreen ? 'lg' : 'default'}
            className={`${isFullscreen ? 'w-16 h-16' : 'w-12 h-12'} rounded-full bg-red-600 hover:bg-red-700`}
          >
            {isPlaying ? (
              <Pause className={isFullscreen ? 'h-8 w-8' : 'h-6 w-6'} />
            ) : (
              <Play className={isFullscreen ? 'h-8 w-8' : 'h-6 w-6'} />
            )}
          </Button>

          {showAdvancedControls && (
            <>
              <Button
                variant="ghost"
                size={isFullscreen ? 'lg' : 'sm'}
                onClick={() => skipTime(10)}
                className={isFullscreen ? 'w-12 h-12' : ''}
              >
                <SkipForward className={isFullscreen ? 'h-6 w-6' : 'h-4 w-4'} />
              </Button>

              <Button
                variant="ghost"
                size={isFullscreen ? 'lg' : 'sm'}
                onClick={cycleRepeatMode}
                className={`${isFullscreen ? 'w-12 h-12' : ''} ${
                  repeatMode !== 'none' ? 'text-red-600' : ''
                }`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className={isFullscreen ? 'h-6 w-6' : 'h-4 w-4'} />
                ) : (
                  <Repeat className={isFullscreen ? 'h-6 w-6' : 'h-4 w-4'} />
                )}
              </Button>
            </>
          )}
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className={isFullscreen ? 'w-10 h-10' : 'w-8 h-8'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className={isFullscreen ? 'h-5 w-5' : 'h-4 w-4'} />
            ) : (
              <Volume2 className={isFullscreen ? 'h-5 w-5' : 'h-4 w-4'} />
            )}
          </Button>
          
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            className={`flex-1 accent-red-600 ${isFullscreen ? 'h-2' : 'h-1'}`}
          />
        </div>

        {/* Settings Panel */}
        {showSettings && showAdvancedControls && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Velocidad de reproducción</h4>
            <div className="grid grid-cols-5 gap-2">
              {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
                <Button
                  key={rate}
                  variant={playbackRate === rate ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlaybackRateChange(rate)}
                  className="text-xs"
                >
                  {rate}x
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Ensayo Mode Info */}
        {isFullscreen && (
          <div className="mt-6 text-center text-gray-600">
            <p className="text-lg">🎭 Modo Ensayo Activo</p>
            <p className="text-sm mt-1">
              {repeatMode === 'one' ? '🔂 Repetición activada' : '▶️ Reproducción normal'}
            </p>
            <p className="text-sm">Velocidad: {playbackRate}x</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}