'use client';

import React, { useState } from 'react';
import { SongFormData, AudioFile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, X, Upload, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SongFormProps {
  onSubmit: (data: SongFormData) => void;
  onCancel: () => void;
  initialData?: Partial<SongFormData>;
}

export function SongForm({ onSubmit, onCancel, initialData }: SongFormProps) {
  const [formData, setFormData] = useState<SongFormData>({
    title: initialData?.title || '',
    genre: initialData?.genre || 'Presentación',
    lyrics: initialData?.lyrics || '',
    audioFiles: initialData?.audioFiles || [],
    tags: initialData?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingAudioId, setEditingAudioId] = useState<string | null>(null);
  const [editingAudioName, setEditingAudioName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data being submitted:', formData);
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof SongFormData, value: string | ('Presentación' | 'Pasodoble' | 'Cuplet' | 'Estribillo' | 'Popurrí') | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validar archivos
    for (const file of files) {
      if (!file.type.startsWith('audio/')) {
        alert(`${file.name} no es un archivo de audio válido`);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert(`${file.name} es demasiado grande. Máximo 50MB`);
        return;
      }
    }

    setIsUploading(true);
    const newAudioFiles: AudioFile[] = [];
    
    try {
      for (const file of files) {
        // Generar nombre único para el archivo
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Subir archivo a Supabase Storage
        const { error } = await supabase.storage
          .from('audio-files')
          .upload(fileName, file);

        if (error) {
          console.error('Error subiendo archivo:', error);
          alert(`Error al subir ${file.name}. Inténtalo de nuevo.`);
          continue;
        }

        // Obtener URL pública del archivo
        const { data: { publicUrl } } = supabase.storage
          .from('audio-files')
          .getPublicUrl(fileName);

        // Crear objeto AudioFile
        const audioFile: AudioFile = {
          id: fileName,
          name: file.name.replace(/\.[^/.]+$/, ""), // Nombre sin extensión
          url: publicUrl,
          genre: 'Tenor' // Género por defecto
        };

        newAudioFiles.push(audioFile);
      }

      // Actualizar el formulario con los archivos nuevos
      setFormData(prev => ({ 
        ...prev, 
        audioFiles: [...prev.audioFiles, ...newAudioFiles] 
      }));
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error inesperado al subir los archivos');
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const removeAudioFile = async (indexToRemove: number) => {
    const fileToRemove = formData.audioFiles[indexToRemove];
    
    try {
      // Eliminar archivo de Supabase Storage
      const fileName = fileToRemove.id; // El ID es el nombre del archivo en storage
      const { error } = await supabase.storage
        .from('audio-files')
        .remove([fileName]);

      if (error) {
        console.error('Error eliminando archivo:', error);
        alert('Error al eliminar el archivo del almacenamiento');
        return;
      }

      // Actualizar la lista de archivos
      setFormData(prev => ({
        ...prev,
        audioFiles: prev.audioFiles.filter((_, index) => index !== indexToRemove)
      }));
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error inesperado al eliminar el archivo');
    }
  };

  const updateAudioFileName = (index: number, newName: string) => {
    setFormData(prev => ({
      ...prev,
      audioFiles: prev.audioFiles.map((file, i) => 
        i === index ? { ...file, name: newName } : file
      )
    }));
  };

  const updateAudioFileGenre = (index: number, newGenre: 'Tenor' | 'Octavilla' | 'Segunda') => {
    setFormData(prev => ({
      ...prev,
      audioFiles: prev.audioFiles.map((file, i) => 
        i === index ? { ...file, genre: newGenre } : file
      )
    }));
  };

  const startEditingAudioName = (index: number) => {
    setEditingAudioId(formData.audioFiles[index].id);
    setEditingAudioName(formData.audioFiles[index].name);
  };

  const saveAudioNameEdit = (index: number) => {
    updateAudioFileName(index, editingAudioName);
    setEditingAudioId(null);
    setEditingAudioName('');
  };

  const cancelAudioNameEdit = () => {
    setEditingAudioId(null);
    setEditingAudioName('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">Agregar Nueva Canción</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCancel}
            className="h-8 w-8 sm:h-10 sm:w-10 touch-manipulation"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Nombre de la canción"
              required
              className="text-base h-12 touch-manipulation"
            />
          </div>

          {/* Género */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Género *
            </label>
            <select
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value as 'Presentación' | 'Pasodoble' | 'Cuplet' | 'Estribillo' | 'Popurrí')}
              className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 touch-manipulation"
              required
            >
              <option value="Presentación">Presentación</option>
              <option value="Pasodoble">Pasodoble</option>
              <option value="Cuplet">Cuplet</option>
              <option value="Estribillo">Estribillo</option>
              <option value="Popurrí">Popurrí</option>
            </select>
          </div>

          {/* Archivo de Audio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo de Audio
            </label>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex-1">
                <input
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="audio-file"
                  disabled={isUploading}
                />
                <label
                  htmlFor="audio-file"
                  className={`flex items-center justify-center h-12 sm:h-14 w-full border-2 border-dashed rounded-md transition-colors cursor-pointer touch-manipulation ${
                    isUploading 
                      ? 'border-orange-400 bg-orange-50 cursor-not-allowed' 
                      : formData.audioFiles.length > 0
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-orange-400'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600 mr-2"></div>
                      <span className="text-orange-600 text-sm sm:text-base">Subiendo archivos...</span>
                    </>
                  ) : formData.audioFiles.length > 0 ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-green-700 text-sm sm:text-base">
                        {formData.audioFiles.length} archivo{formData.audioFiles.length > 1 ? 's' : ''} subido{formData.audioFiles.length > 1 ? 's' : ''}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 text-sm sm:text-base">Seleccionar archivos de audio</span>
                    </>
                  )}
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Formatos: MP3, WAV, M4A, etc. (máximo 50MB por archivo). Puedes seleccionar múltiples archivos.
            </p>
            
            {/* Lista de archivos subidos */}
            {formData.audioFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Archivos subidos:</h4>
                {formData.audioFiles.map((audioFile, index) => (
                  <div key={audioFile.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <div className="flex-1 mr-2 space-y-2">
                      {editingAudioId === audioFile.id ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Input
                              value={editingAudioName}
                              onChange={(e) => setEditingAudioName(e.target.value)}
                              className="text-sm flex-1"
                              placeholder="Nombre del archivo"
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => saveAudioNameEdit(index)}
                              className="h-7 px-2"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={cancelAudioNameEdit}
                              className="h-7 px-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <select
                            value={audioFile.genre}
                            onChange={(e) => updateAudioFileGenre(index, e.target.value as 'Tenor' | 'Octavilla' | 'Segunda')}
                            className="w-full text-sm p-1 border border-gray-300 rounded"
                          >
                            <option value="Tenor">Tenor</option>
                            <option value="Octavilla">Octavilla</option>
                            <option value="Segunda">Segunda</option>
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 font-medium">
                              {audioFile.name}
                            </span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditingAudioName(index)}
                              className="h-7 px-2 ml-2"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Género:</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {audioFile.genre}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAudioFile(index)}
                      className="text-red-500 hover:text-red-700 h-7 px-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Letra */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Letra de la Canción
            </label>
            <textarea
              value={formData.lyrics}
              onChange={(e) => handleInputChange('lyrics', e.target.value)}
              placeholder="Escribe aquí la letra completa de la canción..."
              rows={6}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-base ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 resize-y min-h-32 touch-manipulation"
            />
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas (opcional)
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Ej: Clásico, Popular..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="h-12 touch-manipulation"
              />
              <Button 
                type="button" 
                onClick={addTag} 
                variant="outline" 
                size="sm"
                className="h-12 px-4 touch-manipulation"
              >
                +
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 text-sm bg-orange-100 text-orange-800 rounded-full flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-orange-600 hover:text-orange-800 font-bold touch-manipulation ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              disabled={isUploading}
              className="h-12 touch-manipulation"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 h-12 touch-manipulation"
              disabled={isUploading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isUploading ? 'Subiendo...' : 'Guardar Canción'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}