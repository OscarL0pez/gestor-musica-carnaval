import { createAudioBucket, getStorageInfo } from '@/lib/audio-storage';

/**
 * Script para configurar Supabase Storage
 * Ejecuta este script para crear el bucket de audio y configurar las políticas
 */
export async function setupSupabaseStorage() {
  console.log('🚀 Configurando Supabase Storage...');

  try {
    // Crear bucket de audio
    const bucketCreated = await createAudioBucket();
    
    if (bucketCreated) {
      console.log('✅ Bucket de audio configurado correctamente');
    } else {
      console.log('❌ Error al configurar el bucket de audio');
      return false;
    }

    // Obtener información del storage
    const storageInfo = await getStorageInfo();
    console.log('📊 Información del storage:');
    console.log(`   - Archivos: ${storageInfo.fileCount}`);
    console.log(`   - Espacio usado: ${storageInfo.totalSizeMB} MB`);

    console.log('🎉 Configuración de Supabase Storage completada');
    return true;

  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (typeof window !== 'undefined') {
  // Solo ejecutar en el cliente si es necesario
  console.log('Para configurar el storage, llama a setupSupabaseStorage() desde tu aplicación');
}