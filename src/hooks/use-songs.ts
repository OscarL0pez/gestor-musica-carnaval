'use client';

import { useState, useEffect } from 'react';
import { Song, SongFormData } from '@/types';
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
          audio_file?: string;
          tags: string[];
          added_date: string;
          created_at: string;
        }

        const parsedSongs = data.map((song: SupabaseRow) => ({
          id: song.id,
          title: song.title,
          genre: song.genre as Song['genre'],
          lyrics: song.lyrics,
          audioFile: song.audio_file,
          tags: song.tags || [],
          addedDate: new Date(song.added_date)
        }));

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
      const { data, error } = await supabase
        .from('songs')
        .insert({
          title: songData.title,
          genre: songData.genre,
          lyrics: songData.lyrics,
          audio_file: songData.audioFile,
          tags: songData.tags || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error agregando canción:', error);
        return;
      }

      const newSong: Song = {
        id: data.id,
        title: data.title,
        genre: data.genre,
        lyrics: data.lyrics,
        audioFile: data.audio_file,
        tags: data.tags || [],
        addedDate: new Date(data.added_date)
      };

      setSongs(prev => [newSong, ...prev]);
    } catch (error) {
      console.error('Error agregando canción:', error);
    }
  };

  const updateSong = async (id: string, songData: SongFormData) => {
    try {
      const { error } = await supabase
        .from('songs')
        .update({
          title: songData.title,
          genre: songData.genre,
          lyrics: songData.lyrics,
          audio_file: songData.audioFile,
          tags: songData.tags || []
        })
        .eq('id', id);

      if (error) {
        console.error('Error actualizando canción:', error);
        return;
      }

      setSongs(prev => prev.map(song => 
        song.id === id 
          ? { ...song, ...songData }
          : song
      ));
    } catch (error) {
      console.error('Error actualizando canción:', error);
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

  // Filtrar canciones por género
  const filteredSongs = selectedGenre 
    ? songs.filter(song => song.genre === selectedGenre)
    : songs;

  // Géneros de carnaval disponibles
  const genres = ['Presentación', 'Pasodoble', 'Cuplet', 'Estribillo', 'Popurrí'];

  return {
    songs: filteredSongs,
    allSongs: songs,
    loading,
    selectedGenre,
    setSelectedGenre,
    genres,
    addSong,
    updateSong,
    deleteSong,
  };
}