'use client';

import React, { useState, useRef } from 'react';
import { Upload, Music, X, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadAudioFile, deleteAudioFile } from '@/lib/audio-storage';

interface AudioUploaderProps {
  songId: string;
  songTitle: string;
  onUploadComplete: (audioUrl: string) => void;
  existingAudioUrl?: string;
}

export function AudioUploader({ 
  songId, 
  songTitle, 
  onUploadComplete, 
  existingAudioUrl 
}: AudioUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAudioFile = (file: File): string | null => {
    // Verificar tipo de archivo
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    if (!validTypes.includes(file.type)) {
      return 'Solo se permiten archivos de audio (MP3, WAV, OGG)';
    }

    // Verificar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'El archivo es demasiado grande. Máximo 10MB';
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Validar archivo
      const validationError = validateAudioFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Simular progreso de subida
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Usar la función del storage
      const result = await uploadAudioFile(file, songId);
      
      clearInterval(progressInterval);

      if (!result.success || !result.url) {
        throw new Error(result.error || 'Error desconocido en la subida');
      }

      setUploadProgress(100);
      
      // Llamar callback con la URL del archivo
      onUploadComplete(result.url);

      // Limpiar estado después de un breve delay
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);

    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err instanceof Error ? err.message : 'Error al subir el archivo');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeExistingAudio = async () => {
    if (!existingAudioUrl) return;

    try {
      // Usar la función del storage
      const success = await deleteAudioFile(existingAudioUrl);

      if (!success) {
        console.error('Error removing file');
      }

      // Notificar que se removió el archivo
      onUploadComplete('');
      
    } catch (err) {
      console.error('Error removing audio:', err);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Audio - {songTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {existingAudioUrl ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800">Audio cargado correctamente</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeExistingAudio}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Para cambiar el audio, elimina el actual y sube uno nuevo.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Zona de Drag & Drop */}
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragOver 
                  ? 'border-red-400 bg-red-50' 
                  : uploading 
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                }
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />

              {uploading ? (
                <div className="space-y-4">
                  <Loader2 className="h-12 w-12 mx-auto text-blue-600 animate-spin" />
                  <div>
                    <p className="text-lg font-semibold text-blue-800">
                      Subiendo audio...
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {uploadProgress}% completado
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Arrastra tu archivo de audio aquí
                    </p>
                    <p className="text-sm text-gray-500">
                      o haz clic para seleccionar
                    </p>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="mt-4"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar archivo
                  </Button>
                </div>
              )}
            </div>

            {/* Información de formatos */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Formatos soportados: MP3, WAV, OGG</p>
              <p>• Tamaño máximo: 10MB</p>
              <p>• Recomendado: MP3 a 128-192 kbps para mejor rendimiento</p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}