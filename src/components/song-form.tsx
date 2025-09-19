'use client';

import React, { useState } from 'react';
import { SongFormData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, X, Upload } from 'lucide-react';

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
    audioFile: initialData?.audioFile || '',
    tags: initialData?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof SongFormData, value: string | ('Presentación' | 'Pasodoble' | 'Cuplet' | 'Estribillo' | 'Popurrí') | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, audioFile: file.name }));
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Agregar Nueva Canción</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="text-base"
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
              className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
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
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="audio-file"
                />
                <label
                  htmlFor="audio-file"
                  className="flex items-center justify-center h-12 w-full border-2 border-dashed border-gray-300 rounded-md hover:border-orange-400 transition-colors cursor-pointer"
                >
                  <Upload className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {formData.audioFile || 'Seleccionar archivo de audio'}
                  </span>
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Formatos soportados: MP3, WAV, M4A, etc.
            </p>
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
              rows={8}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-base ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 resize-y min-h-32"
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
                placeholder="Ej: Clásico, Popular, Nuevo..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                +
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-orange-600 hover:text-orange-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              <Save className="h-4 w-4 mr-2" />
              Guardar Canción
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}