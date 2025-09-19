-- SQL para crear la tabla songs en Supabase
CREATE TABLE songs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    lyrics TEXT NOT NULL,
    audio_file TEXT,
    tags TEXT[] DEFAULT '{}',
    added_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Allow public read access" ON songs
    FOR SELECT
    TO public
    USING (true);

-- Política para permitir escritura pública (por ahora)
CREATE POLICY "Allow public write access" ON songs
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);