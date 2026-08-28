/**
 * @file types.ts
 * @description Core TypeScript type definitions for the LOTE agronomic management platform.
 */

/** Supported agricultural crop types */
export type CropType = "Maíz" | "Soja" | "Trigo" | "Girasol" | "Barbecho" | "Otros";

/** Status lifecycle of a field activity/task */
export type ActivityStatus = "Pendiente" | "En progreso" | "Completada" | "Cancelada";

/** Categorization of agricultural field operations */
export type ActivityType =
  | "Siembra"
  | "Fertilización"
  | "Pulverización"
  | "Cosecha"
  | "Monitoreo"
  | "Riego";

/**
 * Farm or agricultural property entity.
 */
export interface Farm {
  id: string;
  user_id?: string;
  nombre: string;
  titular: string;
  ubicacion: string;
  superficie_total: number;
  latitud?: number;
  longitud?: number;
  created_at?: string;
}

/**
 * Agricultural season / campaign cycle (e.g. 2025/26).
 */
export interface Season {
  id: string;
  user_id?: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin?: string;
  activa: boolean;
  created_at?: string;
}

/** 2D point coordinate for SVG polygon parcel rendering */
export interface PolygonPoint {
  x: number;
  y: number;
}

/** Heatmap telemetry point for variable-rate applications */
export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}

/**
 * Field / Agricultural parcel entity.
 */
export interface Field {
  id: string;
  user_id?: string;
  establecimiento_id?: string;
  campana_id?: string;
  numero: number;
  nombre: string;
  hectareas: number;
  cultivo_actual: CropType;
  variedad_hibrido?: string;
  fecha_siembra?: string;
  rendimiento_estimado?: number;
  rendimiento_historico?: number;
  isl_score: number;
  isl_resumen?: string;
  isl_recomendacion?: string;
  estado_fenologico?: string;
  map_coords?: {
    polygon: PolygonPoint[];
    center: { x: number; y: number };
    rotation?: number;
  };
  dose_data?: {
    promedio_aplicado: number;
    precision_porcentaje: number;
    unidad: string;
    points: HeatmapPoint[];
  };
  created_at?: string;
}

/**
 * Historical timeline event recorded for a field parcel.
 */
export interface TimelineEvent {
  id: string;
  user_id?: string;
  lote_id: string;
  fecha: string;
  tipo:
    | "siembra"
    | "fertilizacion"
    | "lluvia"
    | "pulverizacion"
    | "helada"
    | "fungicida"
    | "cosecha"
    | "informe_ia"
    | "otro";
  titulo: string;
  descripcion: string;
  icono?: string;
  datos_clave?: {
    etiqueta: string;
    valor: string;
  }[];
  autor?: string;
  created_at?: string;
}

/**
 * Agricultural field work / task order.
 */
export interface FieldActivity {
  id: string;
  user_id?: string;
  lote_id?: string;
  lote_nombre: string;
  campana_id?: string;
  tipo: ActivityType;
  cultivo?: CropType;
  fecha: string;
  estado: ActivityStatus;
  superficie_ha: number;
  insumo_principal?: string;
  dosis?: string;
  maquinaria?: string;
  operario?: string;
  costo_estimado?: number;
  observaciones?: string;
  created_at?: string;
}

/**
 * Pluviometer rainfall record.
 */
export interface RainfallRecord {
  id: string;
  user_id?: string;
  campana_id?: string;
  lote_id?: string;
  lote_nombre?: string;
  fecha: string;
  milimetros: number;
  observaciones?: string;
  created_at?: string;
}

/**
 * Financial transaction entry (Income or Expense).
 */
export interface FinancialTransaction {
  id: string;
  user_id?: string;
  campana_id?: string;
  lote_id?: string;
  tipo: "Ingreso" | "Gasto";
  categoria: "Insumos" | "Labores" | "Semillas" | "Flete" | "Comercialización" | "Otros";
  monto: number;
  moneda: string;
  descripcion?: string;
  fecha: string;
  created_at?: string;
}

/** Categorized expense item for breakdown charts */
export interface ExpenseCategory {
  categoria: "Insumos" | "Labores" | "Semillas" | "Flete" | "Comercialización" | "Otros";
  monto: number;
  porcentaje: number;
  color: string;
}

/** High-level economic balance and margins */
export interface FinancialSummary {
  campana_id: string;
  ingresos_totales: number;
  gastos_totales: number;
  margen_bruto: number;
  margen_por_ha: number;
  distribucion_gastos: ExpenseCategory[];
}

/**
 * Agricultural vehicle or implement in the machinery fleet.
 */
export interface Machinery {
  id: string;
  user_id?: string;
  establecimiento_id?: string;
  nombre: string;
  tipo: "Tractor" | "Sembradora" | "Pulverizadora" | "Cosechadora" | "Tolva" | "Camión" | string;
  modelo: string;
  estado: "Operativa" | "En mantenimiento" | "En labor" | "Detenida" | string;
  horas_uso: number;
  ubicacion_actual: string;
  created_at?: string;
}

/**
 * Conversational message within the Lía AI assistant chat.
 */
export interface ChatMessage {
  id: string;
  user_id?: string;
  emisor: "usuario" | "lia";
  mensaje: string;
  timestamp: string;
  sugerencias?: string[];
  datos_adjuntos?: {
    tipo: "lote_resumen" | "grafico" | "comparacion" | "alerta";
    payload: any;
  };
  created_at?: string;
}

// Backward compatibility type aliases
export type Establecimiento = Farm;
export type Campana = Season;
export type Lote = Field;
export type Labor = FieldActivity;
export type Cultivo = CropType;
export type EstadoLabor = ActivityStatus;
export type TipoLabor = ActivityType;
export type RegistroLluvia = RainfallRecord;
export type TransaccionFinanciera = FinancialTransaction;
export type ResumenEconomico = FinancialSummary;
export type GastoCategoria = ExpenseCategory;
export type MensajeChat = ChatMessage;
export type Maquinaria = Machinery;
