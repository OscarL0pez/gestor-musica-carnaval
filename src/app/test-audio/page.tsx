'use client';

import React, { useState, useEffect } from 'react';
import { SongCard } from '@/components/song-card';
import { setupSupabaseStorage } from '@/scripts/setup-storage';
import { getStorageInfo } from '@/lib/audio-storage';
import { Song } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Music, 
  Database, 
  Upload, 
  Play,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

export default function AudioTestPage() {
  const [storageConfigured, setStorageConfigured] = useState<boolean | null>(null);
  const [storageInfo, setStorageInfo] = useState<{fileCount: number; totalSize: number; totalSizeMB: number} | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Canción de ejemplo para probar
  const testSong: Song = {
    id: 'test-song-1',
    title: 'Mi Cádiz Querido',
    genre: 'Pasodoble',
    lyrics: `Mi Cádiz querido, ciudad de mis sueños,
donde el sol se abraza con la mar salada,
tus calles de historia, tus noches de enero,
son versos de gloria en mi alma grabada.

CORO:
¡Ay, Cádiz del alma!
¡Luz de Andalucía!
En ti se hace palma
toda mi alegría.`,
    audioFile: undefined, // Se establecerá cuando se suba audio
    tags: ['carnaval', 'tradicional', 'gaditano'],
    addedDate: new Date()
  };

  const [currentSong, setCurrentSong] = useState<Song>(testSong);

  useEffect(() => {
    checkStorageStatus();
  }, []);

  const checkStorageStatus = async () => {
    try {
      const info = await getStorageInfo();
      setStorageInfo(info);
      setStorageConfigured(true);
    } catch (error) {
      console.error('Error checking storage:', error);
      setStorageConfigured(false);
    }
  };

  const configureStorage = async () => {
    setIsConfiguring(true);
    try {
      const success = await setupSupabaseStorage();
      setStorageConfigured(success);
      if (success) {
        await checkStorageStatus();
      }
    } catch (error) {
      console.error('Error configuring storage:', error);
      setStorageConfigured(false);
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleAudioUpdate = (songId: string, audioUrl: string) => {
    console.log('Audio actualizado:', { songId, audioUrl });
    setCurrentSong(prev => ({
      ...prev,
      audioFile: audioUrl
    }));
    
    // Actualizar información del storage
    checkStorageStatus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎵 Test del Sistema de Audio
          </h1>
          <p className="text-gray-600">
            Página de pruebas para el sistema de reproducción y gestión de audio
          </p>
        </div>

        {/* Estado del Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Estado de Supabase Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {storageConfigured === null && (
                <>
                  <Info className="h-5 w-5 text-blue-500" />
                  <span>Verificando configuración...</span>
                </>
              )}
              {storageConfigured === true && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-700">Storage configurado correctamente</span>
                </>
              )}
              {storageConfigured === false && (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700">Storage no configurado</span>
                  <Button 
                    onClick={configureStorage}
                    disabled={isConfiguring}
                    size="sm"
                    className="ml-4"
                  >
                    {isConfiguring ? 'Configurando...' : 'Configurar Storage'}
                  </Button>
                </>
              )}
            </div>

            {storageInfo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Información del Storage:</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Archivos:</span>
                    <div className="font-semibold">{storageInfo.fileCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Espacio usado:</span>
                    <div className="font-semibold">{storageInfo.totalSizeMB} MB</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <div className="font-semibold text-green-600">Activo</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Componentes de Audio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Componentes de Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-green-500" />
                <span>AudioPlayer: Reproductor avanzado</span>
              </div>
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-500" />
                <span>AudioUploader: Subida de archivos</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-purple-500" />
                <span>SongCard: Integración completa</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Canción de Prueba */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            🎭 Canción de Prueba
          </h2>
          
          <SongCard
            song={currentSong}
            isAdmin={true}
            onUpdateAudio={handleAudioUpdate}
            onEdit={(song) => console.log('Editar canción:', song)}
            onDelete={(id) => console.log('Eliminar canción:', id)}
          />
        </div>

        {/* Instrucciones */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Instrucciones de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p><strong>1. Configurar Storage:</strong> Asegúrate de que el storage esté configurado (botón verde arriba).</p>
              <p><strong>2. Subir Audio:</strong> Haz clic en el botón de upload (azul) para subir un archivo de audio.</p>
              <p><strong>3. Cartas Limpias:</strong> Las cartas ahora solo muestran título y género, sin vista previa de letra.</p>
              <p><strong>4. Expandir Reproductor:</strong> Haz clic en el botón verde ▶️ o en &quot;Audio disponible&quot; en el footer.</p>
              <p><strong>5. Ver Letra:</strong> Usa el botón ▼ (chevron abajo) para expandir y ver la letra completa.</p>
              <p><strong>6. Controles Avanzados:</strong> Prueba velocidad, repetición y pantalla completa cuando esté expandido.</p>
              <p><strong>7. Minimizar:</strong> Usa los botones ▲ para ocultar reproductor o letra según necesites.</p>
              <p><strong>8. Formatos:</strong> Soporta MP3, WAV y OGG (máximo 10MB).</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}