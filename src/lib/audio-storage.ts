import { supabase } from './supabase';

export const AUDIO_BUCKET = 'audio-files';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Crea el bucket de audio si no existe
 */
export async function createAudioBucket(): Promise<boolean> {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listando buckets:', listError);
      return false;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === AUDIO_BUCKET);
    
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(AUDIO_BUCKET, {
        public: true,
        allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
        fileSizeLimit: 10485760 // 10MB
      });

      if (createError) {
        console.error('Error creando bucket:', createError);
        return false;
      }

      console.log('Bucket de audio creado exitosamente');
    }

    return true;
  } catch (error) {
    console.error('Error configurando bucket:', error);
    return false;
  }
}

/**
 * Sube un archivo de audio a Supabase Storage
 */
export async function uploadAudioFile(
  file: File, 
  songId: string
): Promise<UploadResult> {
  try {
    // Verificar que el bucket existe
    await createAudioBucket();

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${songId}_${timestamp}.${fileExtension}`;
    const filePath = `songs/${fileName}`;

    // Subir archivo
    const { error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error subiendo archivo:', error);
      return {
        success: false,
        error: `Error subiendo archivo: ${error.message}`
      };
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(AUDIO_BUCKET)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return {
        success: false,
        error: 'No se pudo obtener la URL pública del archivo'
      };
    }

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('Error durante la subida:', error);
    return {
      success: false,
      error: 'Error inesperado durante la subida'
    };
  }
}

/**
 * Elimina un archivo de audio de Supabase Storage
 */
export async function deleteAudioFile(audioUrl: string): Promise<boolean> {
  try {
    // Extraer el path del archivo de la URL
    const url = new URL(audioUrl);
    const pathSegments = url.pathname.split('/');
    const bucketIndex = pathSegments.findIndex(segment => segment === AUDIO_BUCKET);
    
    if (bucketIndex === -1) {
      console.error('URL no válida para archivo de audio');
      return false;
    }

    const filePath = pathSegments.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Error eliminando archivo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error durante la eliminación:', error);
    return false;
  }
}

/**
 * Lista todos los archivos de audio en el bucket
 */
export async function listAudioFiles() {
  try {
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .list('songs', {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('Error listando archivos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error durante el listado:', error);
    return [];
  }
}

/**
 * Obtiene información sobre el uso del storage
 */
export async function getStorageInfo() {
  try {
    const files = await listAudioFiles();
    
    let totalSize = 0;
    files.forEach(file => {
      if (file.metadata?.size) {
        totalSize += file.metadata.size;
      }
    });

    return {
      fileCount: files.length,
      totalSize,
      totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100
    };
  } catch (error) {
    console.error('Error obteniendo información del storage:', error);
    return {
      fileCount: 0,
      totalSize: 0,
      totalSizeMB: 0
    };
  }
}