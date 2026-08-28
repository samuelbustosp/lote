-- =========================================================
-- ESQUEMA DE BASE DE DATOS PARA LOTE (Producción Multi-Usuario)
-- Supabase PostgreSQL con Autenticación y RLS
-- =========================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: ESTABLECIMIENTOS
CREATE TABLE IF NOT EXISTS establecimientos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    titular TEXT NOT NULL,
    ubicacion TEXT NOT NULL,
    superficie_total NUMERIC NOT NULL DEFAULT 0,
    latitud NUMERIC,
    longitud NUMERIC
);

-- 3. TABLA: CAMPAÑAS
CREATE TABLE IF NOT EXISTS campanas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL, -- Ej: 'Campaña 2025/26'
    fecha_inicio TEXT NOT NULL,
    fecha_fin TEXT,
    activa BOOLEAN DEFAULT true
);

-- 4. TABLA: LOTES
CREATE TABLE IF NOT EXISTS lotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    campana_id UUID REFERENCES campanas(id) ON DELETE SET NULL,
    numero INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    hectareas NUMERIC NOT NULL,
    cultivo_actual TEXT NOT NULL,
    variedad_hibrido TEXT,
    fecha_siembra TEXT,
    rendimiento_estimado NUMERIC,
    rendimiento_historico NUMERIC,
    isl_score INTEGER DEFAULT 85,
    isl_resumen TEXT,
    isl_recomendacion TEXT,
    estado_fenologico TEXT,
    map_coords JSONB, -- Polígono, centro y rotación
    dose_data JSONB -- Prescripción y dosis de siembra/fertilización
);

-- 5. TABLA: LABORES
CREATE TABLE IF NOT EXISTS labores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lote_id UUID REFERENCES lotes(id) ON DELETE CASCADE,
    lote_nombre TEXT,
    campana_id UUID REFERENCES campanas(id) ON DELETE SET NULL,
    tipo TEXT NOT NULL, -- Siembra, Fertilización, Pulverización, Cosecha, Monitoreo, Riego
    cultivo TEXT,
    fecha TEXT NOT NULL,
    estado TEXT DEFAULT 'Pendiente', -- Pendiente, En progreso, Completada, Cancelada
    superficie_ha NUMERIC NOT NULL,
    insumo_principal TEXT,
    dosis TEXT,
    maquinaria TEXT,
    operario TEXT,
    costo_estimado NUMERIC,
    observaciones TEXT
);

-- 6. TABLA: TIMELINE / EVENTOS HISTÓRICOS DE LOTES
CREATE TABLE IF NOT EXISTS timeline_eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lote_id UUID REFERENCES lotes(id) ON DELETE CASCADE,
    fecha TEXT NOT NULL,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    icono TEXT,
    datos_clave JSONB,
    autor TEXT
);

-- 7. TABLA: MAQUINARIAS
CREATE TABLE IF NOT EXISTS maquinarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL, -- Tractor, Sembradora, Pulverizadora, Cosechadora, Tolva, Camión
    modelo TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'Operativa', -- Operativa, En labor, En mantenimiento, Detenida
    horas_uso NUMERIC NOT NULL DEFAULT 0,
    ubicacion_actual TEXT
);

-- 8. TABLA: LLUVIAS / PRECIPITACIONES
CREATE TABLE IF NOT EXISTS lluvias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    campana_id UUID REFERENCES campanas(id) ON DELETE SET NULL,
    lote_id UUID REFERENCES lotes(id) ON DELETE SET NULL,
    lote_nombre TEXT,
    fecha TEXT NOT NULL,
    milimetros NUMERIC NOT NULL,
    observaciones TEXT
);

-- 9. TABLA: FINANZAS / MOVIMIENTOS ECONÓMICOS
CREATE TABLE IF NOT EXISTS finanzas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    campana_id UUID REFERENCES campanas(id) ON DELETE SET NULL,
    lote_id UUID REFERENCES lotes(id) ON DELETE SET NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('Ingreso', 'Gasto')),
    categoria TEXT NOT NULL, -- Insumos, Labores, Semillas, Flete, Comercialización, Otros
    monto NUMERIC NOT NULL,
    moneda TEXT DEFAULT 'USD',
    descripcion TEXT,
    fecha TEXT NOT NULL
);

-- 10. TABLA: CHAT & CONSULTAS LÍA IA
CREATE TABLE IF NOT EXISTS lia_conversaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    emisor TEXT NOT NULL CHECK (emisor IN ('usuario', 'lia')),
    mensaje TEXT NOT NULL,
    timestamp TEXT,
    sugerencias JSONB,
    datos_adjuntos JSONB,
    lote_referenciado_id UUID REFERENCES lotes(id) ON DELETE SET NULL,
    metadatos JSONB
);

-- ÍNDICES PARA ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_establecimientos_user ON establecimientos(user_id);
CREATE INDEX IF NOT EXISTS idx_campanas_user ON campanas(user_id);
CREATE INDEX IF NOT EXISTS idx_lotes_user ON lotes(user_id);
CREATE INDEX IF NOT EXISTS idx_lotes_campana ON lotes(campana_id);
CREATE INDEX IF NOT EXISTS idx_labores_user ON labores(user_id);
CREATE INDEX IF NOT EXISTS idx_labores_lote ON labores(lote_id);
CREATE INDEX IF NOT EXISTS idx_timeline_user ON timeline_eventos(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_lote ON timeline_eventos(lote_id);
CREATE INDEX IF NOT EXISTS idx_maquinarias_user ON maquinarias(user_id);
CREATE INDEX IF NOT EXISTS idx_lluvias_user ON lluvias(user_id);
CREATE INDEX IF NOT EXISTS idx_lluvias_campana ON lluvias(campana_id);
CREATE INDEX IF NOT EXISTS idx_finanzas_user ON finanzas(user_id);
CREATE INDEX IF NOT EXISTS idx_finanzas_campana ON finanzas(campana_id);
CREATE INDEX IF NOT EXISTS idx_lia_user ON lia_conversaciones(user_id);

-- =========================================================
-- POLÍTICAS DE SEGURIDAD RLS (Row Level Security) POR USUARIO
-- =========================================================
ALTER TABLE establecimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE labores ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE maquinarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE lluvias ENABLE ROW LEVEL SECURITY;
ALTER TABLE finanzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lia_conversaciones ENABLE ROW LEVEL SECURITY;

-- 1. Establecimientos
DROP POLICY IF EXISTS "Users can manage own establecimientos" ON establecimientos;
CREATE POLICY "Users can manage own establecimientos" ON establecimientos
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. Campañas
DROP POLICY IF EXISTS "Users can manage own campanas" ON campanas;
CREATE POLICY "Users can manage own campanas" ON campanas
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. Lotes
DROP POLICY IF EXISTS "Users can manage own lotes" ON lotes;
CREATE POLICY "Users can manage own lotes" ON lotes
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Labores
DROP POLICY IF EXISTS "Users can manage own labores" ON labores;
CREATE POLICY "Users can manage own labores" ON labores
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Timeline
DROP POLICY IF EXISTS "Users can manage own timeline" ON timeline_eventos;
CREATE POLICY "Users can manage own timeline" ON timeline_eventos
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Maquinarias
DROP POLICY IF EXISTS "Users can manage own maquinarias" ON maquinarias;
CREATE POLICY "Users can manage own maquinarias" ON maquinarias
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 7. Lluvias
DROP POLICY IF EXISTS "Users can manage own lluvias" ON lluvias;
CREATE POLICY "Users can manage own lluvias" ON lluvias
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8. Finanzas
DROP POLICY IF EXISTS "Users can manage own finanzas" ON finanzas;
CREATE POLICY "Users can manage own finanzas" ON finanzas
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 9. Conversaciones Lía
DROP POLICY IF EXISTS "Users can manage own lia_conversaciones" ON lia_conversaciones;
CREATE POLICY "Users can manage own lia_conversaciones" ON lia_conversaciones
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
