import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface OldSong {
  id: string;
  title: string;
  genre: string;
  lyrics: string;
  audioFile?: string;
  addedDate: string;
  tags: string[];
}

interface NewSong {
  id: string;
  title: string;
  genre: string;
  lyrics: string;
  audioFiles: Array<{
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
    type: 'original';
  }>;
  addedDate: string;
  tags: string[];
}

async function migrateSongs() {
  console.log('🚀 Iniciando migración de canciones...');

  try {
    // 1. Obtener todas las canciones existentes
    const { data: songs, error: fetchError } = await supabase
      .from('songs')
      .select('*');

    if (fetchError) {
      throw new Error(`Error al obtener canciones: ${fetchError.message}`);
    }

    if (!songs || songs.length === 0) {
      console.log('📭 No hay canciones para migrar');
      return;
    }

    console.log(`📊 Encontradas ${songs.length} canciones para migrar`);

    // 2. Procesar cada canción
    const migratedSongs: NewSong[] = [];
    
    for (const song of songs as OldSong[]) {
      console.log(`🔄 Migrando: ${song.title}`);
      
      const newSong: NewSong = {
        ...song,
        audioFiles: []
      };

      // Si tiene audioFile, convertirlo a audioFiles
      if (song.audioFile && song.audioFile.trim() !== '') {
        newSong.audioFiles = [{
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: song.title,
          url: song.audioFile,
          uploadedAt: song.addedDate || new Date().toISOString(),
          type: 'original' as const
        }];
      }

      migratedSongs.push(newSong);
    }

    // 3. Crear tabla temporal para testear
    console.log('🔧 Creando tabla temporal...');
    
    const { error: createTableError } = await supabase.rpc('create_temp_songs_table');
    
    if (createTableError) {
      console.log('⚠️ Tabla temporal ya existe o error:', createTableError.message);
    }

    // 4. Insertar canciones migradas en tabla temporal
    console.log('💾 Insertando canciones migradas...');
    
    const { error: insertError } = await supabase
      .from('songs_migrated')
      .insert(migratedSongs);

    if (insertError) {
      throw new Error(`Error al insertar canciones migradas: ${insertError.message}`);
    }

    console.log('✅ Migración completada exitosamente');
    console.log(`📈 ${migratedSongs.length} canciones migradas a songs_migrated`);
    
    // 5. Mostrar resumen
    const withAudio = migratedSongs.filter(s => s.audioFiles.length > 0).length;
    const withoutAudio = migratedSongs.length - withAudio;
    
    console.log(`🎵 Canciones con audio: ${withAudio}`);
    console.log(`📄 Canciones solo con letra: ${withoutAudio}`);
    
    console.log('\n🔍 Para aplicar la migración:');
    console.log('1. Revisa los datos en la tabla songs_migrated');
    console.log('2. Si todo está correcto, ejecuta: BACKUP + REPLACE songs table');
    console.log('3. Actualiza el esquema de la base de datos');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  }
}

// Función para crear tabla temporal
async function createTempTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS songs_migrated (
      id text PRIMARY KEY,
      title text NOT NULL,
      genre text NOT NULL,
      lyrics text NOT NULL,
      "audioFiles" jsonb DEFAULT '[]'::jsonb,
      "addedDate" timestamp with time zone NOT NULL,
      tags jsonb DEFAULT '[]'::jsonb
    );
  `;

  const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
  
  if (error) {
    console.error('Error creando tabla temporal:', error);
  } else {
    console.log('✅ Tabla temporal creada');
  }
}

// Ejecutar migración
if (require.main === module) {
  migrateSongs()
    .then(() => {
      console.log('🎉 Migración finalizada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migración fallida:', error);
      process.exit(1);
    });
}

export { migrateSongs, createTempTable };