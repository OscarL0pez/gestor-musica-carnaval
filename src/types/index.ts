export interface Song {
  id: string;
  title: string;
  genre: 'Presentación' | 'Pasodoble' | 'Cuplet' | 'Estribillo' | 'Popurrí';
  lyrics: string;
  audioFile?: string; // ruta o nombre del archivo de audio
  addedDate: Date;
  tags: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  createdDate: Date;
  updatedDate: Date;
}

export interface CarnavalEvent {
  id: string;
  name: string;
  date: Date;
  location: string;
  playlist?: Playlist;
  notes?: string;
}

export type SongFormData = Omit<Song, 'id' | 'addedDate'>;
export type PlaylistFormData = Omit<Playlist, 'id' | 'createdDate' | 'updatedDate'>;

// Authentication types
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}