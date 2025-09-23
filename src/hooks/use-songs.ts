'use client';

import { useState, useEffect } from 'react';
import { Song, SongFormData, AudioFile } from '@/types';
import { supabase } from '@/lib/supabase';

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');

  // Cargar canciones de Supabase al iniciar
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error cargando canciones:', error);
          return;
        }

        if (!data) {
          setSongs([]);
          return;
        }

        // Tipo temporal para los datos de Supabase
        interface SupabaseRow {
          id: string;
          title: string;
          genre: string;
          lyrics: string;
          audio_files?: unknown; // JSON array de AudioFile
          tags: string[];
          added_date: string;
          created_at: string;
        }

        const parsedSongs = data.map((song: SupabaseRow) => {
          // Convertir audio_files para manejar tanto formato antiguo (string[]) como nuevo (AudioFile[])
          let audioFiles: AudioFile[] = [];
          if (Array.isArray(song.audio_files)) {
            audioFiles = song.audio_files.map((item: string | AudioFile, index: number) => {
              // Si es string (formato antiguo), convertir a AudioFile
              if (typeof item === 'string') {
                return {
                  id: `legacy-${index}-${Date.now()}`,
                  name: `Audio ${index + 1}`,
                  url: item,
                  genre: 'Tenor' as const // Género por defecto para archivos existentes
                };
              }
              // Si ya es objeto AudioFile (formato nuevo), mantenerlo
              return item;
            });
          }

          return {
            id: song.id,
            title: song.title,
            genre: song.genre as Song['genre'],
            lyrics: song.lyrics,
            audioFiles,
            tags: song.tags || [],
            addedDate: new Date(song.added_date)
          };
        });

        setSongs(parsedSongs);
      } catch (error) {
        console.error('Error conectando con Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  // Ya no necesitamos guardar en localStorage
  // useEffect(() => {
  //   if (!loading) {
  //     localStorage.setItem('carnaval-songs', JSON.stringify(songs));
  //   }
  // }, [songs, loading]);

  const addSong = async (songData: SongFormData) => {
    try {
      console.log('Adding song with data:', songData);
      
      const { data, error } = await supabase
        .from('songs')
        .insert({
          title: songData.title,
          genre: songData.genre,
          lyrics: songData.lyrics,
          audio_files: songData.audioFiles || [],
          tags: songData.tags || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error agregando canción:', error);
        const errorMessage = error?.message || error?.details || JSON.stringify(error) || 'Error desconocido';
        alert(`Error al agregar la canción: ${errorMessage}`);
        return;
      }

      const newSong: Song = {
        id: data.id,
        title: data.title,
        genre: data.genre,
        lyrics: data.lyrics,
        audioFiles: data.audio_files || [], // Usar la estructura completa
        tags: data.tags || [],
        addedDate: new Date(data.added_date)
      };

      setSongs(prev => [newSong, ...prev]);
    } catch (error) {
      console.error('Error agregando canción:', error);
      alert(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const updateSong = async (id: string, songData: SongFormData) => {
    try {
      console.log('Updating song with data:', songData);
      
      // Primero intentemos sin audio_files para diagnosticar
      const { error } = await supabase
        .from('songs')
        .update({
          title: songData.title,
          genre: songData.genre,
          lyrics: songData.lyrics,
          audio_files: songData.audioFiles || [],
          tags: songData.tags || []
        })
        .eq('id', id);

      if (error) {
        console.error('Error actualizando canción:', error);
        const errorMessage = error?.message || error?.details || JSON.stringify(error) || 'Error desconocido';
        alert(`Error al actualizar la canción: ${errorMessage}`);
        return;
      }

      setSongs(prev => prev.map(song => 
        song.id === id 
          ? { ...song, ...songData }
          : song
      ));
      
      console.log('Canción actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando canción:', error);
      alert(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const updateSongAudioFiles = async (id: string, audioFiles: AudioFile[]) => {
    try {
      const { error } = await supabase
        .from('songs')
        .update({
          audio_files: audioFiles
        })
        .eq('id', id);

      if (error) {
        console.error('Error actualizando archivos de audio:', error);
        return;
      }

      setSongs(prev => prev.map(song => 
        song.id === id 
          ? { ...song, audioFiles }
          : song
      ));
    } catch (error) {
      console.error('Error actualizando archivos de audio:', error);
    }
  };

  const deleteSong = async (id: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error eliminando canción:', error);
        return;
      }

      setSongs(prev => prev.filter(song => song.id !== id));
    } catch (error) {
      console.error('Error eliminando canción:', error);
    }
  };

  // Filtrar y ordenar canciones por género
  const filteredSongs = selectedGenre 
    ? songs.filter(song => song.genre === selectedGenre)
    : songs;

  // Ordenar por género cuando se muestran todas las canciones
  const sortedSongs = selectedGenre 
    ? filteredSongs // Si hay filtro por género, mantener orden original
    : filteredSongs.sort((a, b) => {
        // Definir el orden de los géneros
        const genreOrder = ['Presentación', 'Pasodoble', 'Cuplet', 'Estribillo', 'Popurrí'];
        const aIndex = genreOrder.indexOf(a.genre);
        const bIndex = genreOrder.indexOf(b.genre);
        
        // Si ambos géneros están en la lista, ordenar por posición
        if (aIndex !== -1 && bIndex !== -1) {
          if (aIndex !== bIndex) {
            return aIndex - bIndex;
          }
          // Si son del mismo género, ordenar por título
          return a.title.localeCompare(b.title);
        }
        
        // Si solo uno está en la lista, ponerlo primero
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        // Si ninguno está en la lista, ordenar por título
        return a.title.localeCompare(b.title);
      });

  // Géneros de carnaval disponibles
  const genres = ['Presentación', 'Pasodoble', 'Cuplet', 'Estribillo', 'Popurrí'];

  return {
    songs: sortedSongs,
    allSongs: songs,
    loading,
    selectedGenre,
    setSelectedGenre,
    genres,
    addSong,
    updateSong,
    deleteSong,
    updateSongAudioFiles,
  };
}