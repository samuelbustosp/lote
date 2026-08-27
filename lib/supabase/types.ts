export type Cultivo = "Maíz" | "Soja" | "Trigo" | "Girasol" | "Barbecho" | "Otros";

export type EstadoLabor = "Pendiente" | "En progreso" | "Completada" | "Cancelada";

export type TipoLabor =
  | "Siembra"
  | "Fertilización"
  | "Pulverización"
  | "Cosecha"
  | "Monitoreo"
  | "Riego";

export interface Establecimiento {
  id: string;
  nombre: string;
  titular: string;
  ubicacion: string;
  superficie_total: number;
  latitud: number;
  longitud: number;
}

export interface Campana {
  id: string;
  nombre: string; // e.g. "2025/26"
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
}

export interface PolygonPoint {
  x: number; // percentage or SVG coord
  y: number;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number; // e.g. semillas/ha or quintales/ha
}

export interface Lote {
  id: string;
  numero: number;
  nombre: string; // e.g. "Lote 1"
  hectareas: number;
  cultivo_actual: Cultivo;
  variedad_hibrido?: string;
  fecha_siembra?: string;
  rendimiento_estimado?: number; // qq/ha
  rendimiento_historico?: number; // qq/ha
  isl_score: number; // 0 - 100 Índice de Salud del Lote
  isl_resumen: string;
  isl_recomendacion: string;
  estado_fenologico?: string;
  establecimiento_id: string;
  campana_id: string;
  // Visual/Geographical attributes for interactive map
  map_coords: {
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
}

export interface TimelineEvent {
  id: string;
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
}

export interface Labor {
  id: string;
  tipo: TipoLabor;
  lote_id: string;
  lote_nombre: string;
  cultivo: Cultivo;
  fecha: string;
  estado: EstadoLabor;
  superficie_ha: number;
  insumo_principal?: string;
  dosis?: string;
  maquinaria?: string;
  operario?: string;
  costo_estimado?: number;
  observaciones?: string;
  campana_id: string;
}

export interface RegistroLluvia {
  id: string;
  fecha: string;
  milimetros: number;
  lote_id?: string; // Optional: can be field-specific or general
  lote_nombre?: string;
  observaciones?: string;
  campana_id: string;
}

export interface GastoCategoria {
  categoria: "Insumos" | "Labores" | "Semillas" | "Flete" | "Otros";
  monto: number;
  porcentaje: number;
  color: string;
}

export interface ResumenEconomico {
  campana_id: string;
  ingresos_totales: number;
  gastos_totales: number;
  margen_bruto: number;
  margen_por_ha: number;
  distribucion_gastos: GastoCategoria[];
}

export interface Maquinaria {
  id: string;
  nombre: string;
  tipo: "Tractor" | "Sembradora" | "Pulverizadora" | "Cosechadora" | "Tolva" | "Camión";
  modelo: string;
  estado: "Operativa" | "En mantenimiento" | "En labor" | "Detenida";
  horas_uso: number;
  ubicacion_actual: string;
}

export interface MensajeChat {
  id: string;
  emisor: "usuario" | "lia";
  mensaje: string;
  timestamp: string;
  sugerencias?: string[];
  datos_adjuntos?: {
    tipo: "lote_resumen" | "grafico" | "comparacion" | "alerta";
    payload: any;
  };
}
