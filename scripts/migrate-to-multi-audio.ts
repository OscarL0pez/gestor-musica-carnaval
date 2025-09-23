/**
 * Script de migración para convertir audio_file individual a audioFiles array
 * Ejecutar con: npx tsx scripts/migrate-to-multi-audio.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables de entorno faltantes:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AudioFile {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  size?: number;
  duration?: number;
  type: 'original' | 'instrumental' | 'demo' | 'remix' | 'cover';
}

interface LegacySong {
  id: string;
  title: string;
  audio_file?: string;
  audio_files?: AudioFile[];
}

async function migrateToMultiAudio() {
  console.log('🚀 Iniciando migración a sistema multi-audio...\n');

  try {
    // 1. Obtener todas las canciones
    console.log('📋 Obteniendo canciones existentes...');
    const { data: songs, error: fetchError } = await supabase
      .from('songs')
      .select('id, title, audio_file, audio_files');

    if (fetchError) {
      throw new Error(`Error al obtener canciones: ${fetchError.message}`);
    }

    if (!songs || songs.length === 0) {
      console.log('ℹ️  No se encontraron canciones para migrar.');
      return;
    }

    console.log(`✅ Encontradas ${songs.length} canciones\n`);

    // 2. Verificar si ya existe la columna audio_files
    console.log('🔍 Verificando estructura de base de datos...');
    
    // 3. Procesar cada canción
    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const song of songs as LegacySong[]) {
      try {
        console.log(`\n📝 Procesando: "${song.title}" (ID: ${song.id})`);

        // Verificar si ya tiene audio_files
        if (song.audio_files && Array.isArray(song.audio_files) && song.audio_files.length > 0) {
          console.log(`   ⏭️  Ya tiene audio_files, saltando...`);
          skipped++;
          continue;
        }

        // Verificar si tiene audio_file legacy
        if (!song.audio_file) {
          console.log(`   ⚠️  No tiene audio_file, saltando...`);
          skipped++;
          continue;
        }

        // Crear nuevo AudioFile object
        const audioFile: AudioFile = {
          id: crypto.randomUUID(),
          name: `${song.title} - Original`,
          url: song.audio_file,
          uploadedAt: new Date().toISOString(),
          type: 'original'
        };

        const audioFiles = [audioFile];

        // Actualizar la canción
        const { error: updateError } = await supabase
          .from('songs')
          .update({ 
            audio_files: audioFiles
          })
          .eq('id', song.id);

        if (updateError) {
          throw new Error(`Error al actualizar: ${updateError.message}`);
        }

        console.log(`   ✅ Migrada exitosamente`);
        migrated++;

      } catch (error) {
        console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        errors++;
      }
    }

    // 4. Resumen final
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(50));
    console.log(`📈 Total de canciones: ${songs.length}`);
    console.log(`✅ Migradas exitosamente: ${migrated}`);
    console.log(`⏭️  Saltadas (ya migradas): ${skipped}`);
    console.log(`❌ Errores: ${errors}`);

    if (errors === 0) {
      console.log('\n🎉 ¡Migración completada exitosamente!');
    } else {
      console.log('\n⚠️  Migración completada con algunos errores.');
    }

  } catch (error) {
    console.error('\n❌ Error crítico durante la migración:');
    console.error(error instanceof Error ? error.message : 'Error desconocido');
    process.exit(1);
  }
}

// Función para verificar/crear columna audio_files
async function ensureAudioFilesColumn() {
  console.log('🔧 Verificando columna audio_files...');
  
  try {
    // Intentar hacer una consulta simple para ver si la columna existe
    const { error } = await supabase
      .from('songs')
      .select('audio_files')
      .limit(1);

    if (error && error.message.includes('column "audio_files" does not exist')) {
      console.log('📝 Creando columna audio_files...');
      
      // En un entorno real, necesitarías ejecutar esta SQL manualmente
      console.log('⚠️  Por favor, ejecuta esta SQL en tu base de datos Supabase:');
      console.log('   ALTER TABLE songs ADD COLUMN audio_files JSONB DEFAULT \'[]\';');
      console.log('');
      console.log('📋 Después, vuelve a ejecutar este script.');
      process.exit(1);
    }

    if (error) {
      throw error;
    }

    console.log('✅ Columna audio_files verificada');
    
  } catch (error) {
    console.error('❌ Error verificando columna:', error);
    process.exit(1);
  }
}

async function main() {
  await ensureAudioFilesColumn();
  await migrateToMultiAudio();
}

// Ejecutar migración
if (require.main === module) {
  main().catch(console.error);
}

export { migrateToMultiAudio };