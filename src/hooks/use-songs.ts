'use client';

import { useState, useEffect } from 'react';
import { Song, SongFormData } from '@/types';

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');

  // Cargar canciones del localStorage al iniciar
  useEffect(() => {
    const savedSongs = localStorage.getItem('carnaval-songs');
    if (savedSongs) {
      const parsedSongs = JSON.parse(savedSongs).map((song: Song) => ({
        ...song,
        addedDate: new Date(song.addedDate)
      }));
      setSongs(parsedSongs);
    }
    setLoading(false);
  }, []);

  // Guardar canciones en localStorage cuando cambien
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('carnaval-songs', JSON.stringify(songs));
    }
  }, [songs, loading]);

  const addSong = (songData: SongFormData) => {
    const newSong: Song = {
      id: Date.now().toString(),
      ...songData,
      addedDate: new Date(),
    };
    setSongs(prev => [newSong, ...prev]);
  };

  const updateSong = (id: string, songData: SongFormData) => {
    setSongs(prev => prev.map(song => 
      song.id === id 
        ? { ...song, ...songData }
        : song
    ));
  };

  const deleteSong = (id: string) => {
    setSongs(prev => prev.filter(song => song.id !== id));
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