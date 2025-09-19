-- SQL para crear la tabla events en Supabase
-- Ejecutar en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ensayo', 'actuacion', 'reunion', 'otro')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT a todos los usuarios autenticados
CREATE POLICY "Permitir lectura a todos los usuarios" ON events
    FOR SELECT USING (true);

-- Política para permitir INSERT, UPDATE, DELETE solo a administradores
-- (Por ahora permitimos a todos, luego puedes restringir por role)
CREATE POLICY "Permitir escritura a todos los usuarios" ON events
    FOR ALL USING (true);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();