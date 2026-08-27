-- =========================================================
-- ESQUEMA DE BASE DE DATOS PARA LOTE (Supabase PostgreSQL)
-- =========================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: ESTABLECIMIENTOS
CREATE TABLE IF NOT EXISTS establecimientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre TEXT NOT NULL,
    titular TEXT NOT NULL,
    ubicacion TEXT NOT NULL,
    superficie_total NUMERIC NOT NULL,
    latitud NUMERIC,
    longitud NUMERIC
);

-- 3. TABLA: CAMPAÑAS
CREATE TABLE IF NOT EXISTS campanas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre TEXT NOT NULL, -- Ej: '2025/26'
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activa BOOLEAN DEFAULT false
);

-- 4. TABLA: LOTES
CREATE TABLE IF NOT EXISTS lotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    campana_id UUID REFERENCES campanas(id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    hectareas NUMERIC NOT NULL,
    cultivo_actual TEXT NOT NULL,
    variedad_hibrido TEXT,
    fecha_siembra DATE,
    rendimiento_estimado NUMERIC,
    rendimiento_historico NUMERIC,
    isl_score INTEGER DEFAULT 85,
    isl_resumen TEXT,
    isl_recomendacion TEXT,
    estado_fenologico TEXT,
    geometria JSONB -- Polígono o GeoJSON
);

-- 5. TABLA: LABORES
CREATE TABLE IF NOT EXISTS labores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    lote_id UUID REFERENCES lotes(id) ON DELETE CASCADE,
    campana_id UUID REFERENCES campanas(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL, -- Siembra, Fertilización, Pulverización, Cosecha, Monitoreo
    fecha DATE NOT NULL,
    estado TEXT DEFAULT 'Pendiente',
    superficie_ha NUMERIC NOT NULL,
    insumo_principal TEXT,
    dosis TEXT,
    maquinaria TEXT,
    operario TEXT,
    costo_estimado NUMERIC,
    observaciones TEXT
);

-- 6. TABLA: LLUVIAS
CREATE TABLE IF NOT EXISTS lluvias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    campana_id UUID REFERENCES campanas(id) ON DELETE CASCADE,
    lote_id UUID REFERENCES lotes(id) ON DELETE SET NULL,
    fecha DATE NOT NULL,
    milimetros NUMERIC NOT NULL,
    observaciones TEXT
);

-- 7. TABLA: ECONOMÍA (TRANSACCIONES / GASTOS / INGRESOS)
CREATE TABLE IF NOT EXISTS finanzas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    campana_id UUID REFERENCES campanas(id) ON DELETE CASCADE,
    lote_id UUID REFERENCES lotes(id) ON DELETE SET NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('Ingreso', 'Gasto')),
    categoria TEXT NOT NULL, -- Insumos, Labores, Semillas, Flete, Comercialización, Otros
    monto NUMERIC NOT NULL,
    moneda TEXT DEFAULT 'USD',
    descripcion TEXT,
    fecha DATE NOT NULL
);

-- 8. TABLA: CHAT & CONSULTAS LÍA IA
CREATE TABLE IF NOT EXISTS lia_conversaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    emisor TEXT NOT NULL CHECK (emisor IN ('usuario', 'lia')),
    mensaje TEXT NOT NULL,
    lote_referenciado_id UUID REFERENCES lotes(id) ON DELETE SET NULL,
    metadatos JSONB
);

-- ÍNDICES PARA RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_lotes_campana ON lotes(campana_id);
CREATE INDEX IF NOT EXISTS idx_labores_lote ON labores(lote_id);
CREATE INDEX IF NOT EXISTS idx_lluvias_campana ON lluvias(campana_id);
CREATE INDEX IF NOT EXISTS idx_finanzas_campana ON finanzas(campana_id);

-- POLÍTICAS RLS (Row Level Security)
ALTER TABLE establecimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE labores ENABLE ROW LEVEL SECURITY;
ALTER TABLE lluvias ENABLE ROW LEVEL SECURITY;
ALTER TABLE finanzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lia_conversaciones ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso para usuarios autenticados
CREATE POLICY "Acceso total a establecimientos para usuarios autenticados"
    ON establecimientos FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Acceso total a lotes para usuarios autenticados"
    ON lotes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Acceso total a labores para usuarios autenticados"
    ON labores FOR ALL TO authenticated USING (true) WITH CHECK (true);
