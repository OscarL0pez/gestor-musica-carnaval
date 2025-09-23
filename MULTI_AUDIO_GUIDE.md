# Sistema Multi-Audio - Guía de Implementación

## 🎵 ¡Sistema Multi-Audio Implementado!

El sistema ahora soporta **múltiples archivos de audio por canción** con metadatos completos y funciones avanzadas de reproducción.

## ✅ ¿Qué se ha implementado?

### 1. **Nuevas Interfaces TypeScript**
- `AudioFile`: Interface completa con metadatos (nombre, tipo, tamaño, duración, etc.)
- `Song.audioFiles`: Array de archivos de audio en lugar de string único

### 2. **Componentes Multi-Audio**
- **`MultiAudioUploader`**: Subida de múltiples archivos con tipos (original, instrumental, demo, remix, cover)
- **`MultiAudioPlayer`**: Reproductor avanzado con lista de reproducción, controles de repetición y navegación entre pistas

### 3. **Actualización de Datos**
- Hook `useSongs` actualizado para manejar arrays de audio
- Función `updateSongAudioFiles` para gestión de archivos de audio
- Migración automática de datos legacy

## 🚀 Para usar el sistema:

### Paso 1: Migración de Base de Datos
Ejecuta este comando para migrar los datos existentes:

```bash
npm run migrate:audio
```

### Paso 2: Actualizar Schema de Supabase
Añade la columna `audio_files` a tu tabla `songs`:

```sql
ALTER TABLE songs ADD COLUMN audio_files JSONB DEFAULT '[]';
```

### Paso 3: ¡Listo para usar!
- Los usuarios admin pueden subir múltiples archivos por canción
- Cada archivo puede tener un tipo (original, instrumental, demo, remix, cover)
- El reproductor muestra una lista de todas las versiones disponibles
- Navegación entre pistas con controles avanzados

## 🎯 Funciones disponibles:

### MultiAudioUploader
- ✅ Arrastrar y soltar múltiples archivos
- ✅ Selección de tipo de audio
- ✅ Nombres personalizados para cada archivo
- ✅ Validación de formato (MP3, WAV, OGG)
- ✅ Progreso de subida individual
- ✅ Gestión de archivos existentes

### MultiAudioPlayer
- ✅ Lista de reproducción completa
- ✅ Navegación entre pistas (Anterior/Siguiente)
- ✅ Modos de repetición (Ninguno/Una/Todas)
- ✅ Control de volumen y velocidad
- ✅ Indicadores de tipo de audio
- ✅ Tiempo de reproducción y duración
- ✅ Interfaz expandible/colapsable

## 📊 Estructura de datos:

```typescript
interface AudioFile {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  size?: number;
  duration?: number;
  type: 'original' | 'instrumental' | 'demo' | 'remix' | 'cover';
}

interface Song {
  // ... otros campos
  audioFiles: AudioFile[];
}
```

## 🔧 Archivos modificados:

- `src/types/index.ts` - Nuevas interfaces
- `src/components/audio/multi-audio-uploader.tsx` - Nuevo componente
- `src/components/audio/multi-audio-player.tsx` - Nuevo componente  
- `src/components/song-card.tsx` - Actualizado para multi-audio
- `src/hooks/use-songs.ts` - Actualizado para arrays de audio
- `scripts/migrate-to-multi-audio.ts` - Script de migración
- `package.json` - Nuevas dependencias y scripts

## 📦 Nuevas dependencias:
- `@radix-ui/react-select` - Componentes de selección avanzados
- `tsx` - Ejecución de scripts TypeScript

## 🎉 ¡Tu sistema ahora soporta múltiples audios por canción!

Cada canción puede tener:
- 🎵 Versión original
- 🎼 Versión instrumental  
- 🎤 Demo
- 🎧 Remix
- 🎶 Cover

Con reproductor avanzado y gestión completa de archivos.