"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Establecimiento,
  Campana,
  Lote,
  Labor,
  TimelineEvent,
  RegistroLluvia,
  ResumenEconomico,
  Maquinaria,
  MensajeChat,
  Cultivo,
  EstadoLabor,
  TipoLabor,
} from "./types";
import {
  ESTABLECIMIENTO_ACTUAL,
  CAMPANAS_MOCK,
  LOTES_MOCK,
  LABORES_MOCK,
  TIMELINE_MOCK,
  LLUVIAS_MOCK,
  ECONOMIA_MOCK,
  MAQUINARIAS_MOCK,
} from "./mock-data";
import { isSupabaseConfigured } from "./client";

interface StoreContextType {
  establecimiento: Establecimiento;
  campanas: Campana[];
  selectedCampanaId: string;
  setSelectedCampanaId: (id: string) => void;
  selectedCampana: Campana;
  lotes: Lote[];
  labores: Labor[];
  timelineEvents: Record<string, TimelineEvent[]>;
  lluvias: RegistroLluvia[];
  economia: ResumenEconomico;
  maquinarias: Maquinaria[];
  chatMessages: MensajeChat[];
  isMock: boolean;
  addLote: (lote: Omit<Lote, "id" | "establecimiento_id" | "campana_id">) => void;
  addLabor: (labor: Omit<Labor, "id" | "campana_id">) => void;
  updateLaborStatus: (laborId: string, nuevoEstado: EstadoLabor) => void;
  addLluvia: (milimetros: number, lote_nombre?: string, observaciones?: string) => void;
  addTimelineEvent: (loteId: string, event: Omit<TimelineEvent, "id" | "lote_id">) => void;
  sendChatMessage: (texto: string) => Promise<void>;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY_PREFIX = "lote_app_state_v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [establecimiento, setEstablecimiento] = useState<Establecimiento>(ESTABLECIMIENTO_ACTUAL);
  const [campanas, setCampanas] = useState<Campana[]>(CAMPANAS_MOCK);
  const [selectedCampanaId, setSelectedCampanaId] = useState<string>("camp-2025-26");
  const [lotes, setLotes] = useState<Lote[]>(LOTES_MOCK);
  const [labores, setLabores] = useState<Labor[]>(LABORES_MOCK);
  const [timelineEvents, setTimelineEvents] = useState<Record<string, TimelineEvent[]>>(TIMELINE_MOCK);
  const [lluvias, setLluvias] = useState<RegistroLluvia[]>(LLUVIAS_MOCK);
  const [economia, setEconomia] = useState<ResumenEconomico>(ECONOMIA_MOCK);
  const [maquinarias, setMaquinarias] = useState<Maquinaria[]>(MAQUINARIAS_MOCK);
  const [chatMessages, setChatMessages] = useState<MensajeChat[]>([
    {
      id: "msg-welcome",
      emisor: "lia",
      mensaje:
        "¡Hola Gabriel! 👋 Soy Lía, tu asistente inteligente del campo. ¿En qué puedo ayudarte hoy? Podés preguntarme sobre rindes, comparaciones de campañas, dosis o historia de tus lotes.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sugerencias: [
        "¿Por qué el lote 4 rindió menos?",
        "Comparar rendimiento 2024 vs 2025",
        "Recomendaciones de fertilización",
        "Contame qué pasó en el lote 7",
      ],
    },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedLotes = localStorage.getItem(`${STORAGE_KEY_PREFIX}_lotes`);
      const savedLabores = localStorage.getItem(`${STORAGE_KEY_PREFIX}_labores`);
      const savedLluvias = localStorage.getItem(`${STORAGE_KEY_PREFIX}_lluvias`);
      const savedCampana = localStorage.getItem(`${STORAGE_KEY_PREFIX}_campana`);
      const savedTimeline = localStorage.getItem(`${STORAGE_KEY_PREFIX}_timeline`);
      const savedChat = localStorage.getItem(`${STORAGE_KEY_PREFIX}_chat`);

      if (savedLotes) setLotes(JSON.parse(savedLotes));
      if (savedLabores) setLabores(JSON.parse(savedLabores));
      if (savedLluvias) setLluvias(JSON.parse(savedLluvias));
      if (savedCampana) setSelectedCampanaId(savedCampana);
      if (savedTimeline) setTimelineEvents(JSON.parse(savedTimeline));
      if (savedChat) setChatMessages(JSON.parse(savedChat));
    } catch (e) {
      console.warn("Could not read local storage state:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_lotes`, JSON.stringify(lotes));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_labores`, JSON.stringify(labores));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_lluvias`, JSON.stringify(lluvias));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_campana`, selectedCampanaId);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_timeline`, JSON.stringify(timelineEvents));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_chat`, JSON.stringify(chatMessages));
    } catch (e) {
      console.warn("Could not save to local storage:", e);
    }
  }, [lotes, labores, lluvias, selectedCampanaId, timelineEvents, chatMessages, isLoaded]);

  const selectedCampana =
    campanas.find((c) => c.id === selectedCampanaId) || campanas[0];

  const addLote = (newLoteData: Omit<Lote, "id" | "establecimiento_id" | "campana_id">) => {
    const newLote: Lote = {
      ...newLoteData,
      id: `lote-${Date.now()}`,
      establecimiento_id: establecimiento.id,
      campana_id: selectedCampanaId,
    };
    setLotes((prev) => [...prev, newLote]);
  };

  const addLabor = (newLaborData: Omit<Labor, "id" | "campana_id">) => {
    const newLabor: Labor = {
      ...newLaborData,
      id: `lab-${Date.now()}`,
      campana_id: selectedCampanaId,
    };
    setLabores((prev) => [newLabor, ...prev]);

    // Also add to timeline if it belongs to a lote
    if (newLabor.lote_id) {
      const timelineType =
        newLabor.tipo === "Siembra"
          ? "siembra"
          : newLabor.tipo === "Fertilización"
          ? "fertilizacion"
          : newLabor.tipo === "Pulverización"
          ? "pulverizacion"
          : newLabor.tipo === "Cosecha"
          ? "cosecha"
          : "otro";

      addTimelineEvent(newLabor.lote_id, {
        fecha: new Date(newLabor.fecha).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        tipo: timelineType,
        titulo: `${newLabor.tipo} ${newLabor.cultivo}`,
        descripcion: newLabor.observaciones || `Aplicación de ${newLabor.insumo_principal || "labor agronómica"}`,
        datos_clave: [
          ...(newLabor.dosis ? [{ etiqueta: "Dosis", valor: newLabor.dosis }] : []),
          ...(newLabor.maquinaria ? [{ etiqueta: "Equipo", valor: newLabor.maquinaria }] : []),
        ],
        autor: newLabor.operario || "Administración LOTE",
      });
    }
  };

  const updateLaborStatus = (laborId: string, nuevoEstado: EstadoLabor) => {
    setLabores((prev) =>
      prev.map((l) => (l.id === laborId ? { ...l, estado: nuevoEstado } : l))
    );
  };

  const addLluvia = (milimetros: number, lote_nombre: string = "General Establecimiento", observaciones?: string) => {
    const nuevaLluvia: RegistroLluvia = {
      id: `lluv-${Date.now()}`,
      fecha: new Date().toISOString().split("T")[0],
      milimetros,
      lote_nombre,
      observaciones: observaciones || `Registro pluviométrico de ${milimetros} mm`,
      campana_id: selectedCampanaId,
    };
    setLluvias((prev) => [nuevaLluvia, ...prev]);
  };

  const addTimelineEvent = (loteId: string, eventData: Omit<TimelineEvent, "id" | "lote_id">) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: `tl-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      lote_id: loteId,
    };
    setTimelineEvents((prev) => {
      const existing = prev[loteId] || [];
      return {
        ...prev,
        [loteId]: [newEvent, ...existing],
      };
    });
  };

  const sendChatMessage = async (texto: string) => {
    const userMsg: MensajeChat = {
      id: `msg-user-${Date.now()}`,
      emisor: "usuario",
      mensaje: texto,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Generate intelligent contextual response
    setTimeout(() => {
      let botResponse = "";
      const lower = texto.toLowerCase();

      if (lower.includes("lote 4") || lower.includes("rendimiento") || lower.includes("rindió menos")) {
        botResponse = `Analicé los datos del **Lote 4 (Soja - 110 ha)** y estas fueron las principales causas de menor rinde:\n\n• **Menor lluvia en floración**: -58 mm respecto a la media histórica en enero.\n• **Menor dosis de nitrógeno y fósforo**: -40 kg/ha en fertilización de base.\n• **Mayor temperatura promedio**: +2.1 °C durante llenado de grano.\n\n🌱 **Recomendación Lía**: Para la campaña 2026/27 sugiero rotar a Maíz con fertilización variable de base y cobertura previa de vicia.`;
      } else if (lower.includes("comparar") || (lower.includes("2024") && lower.includes("2025"))) {
        botResponse = `📊 **Comparación Campaña 2024/25 vs 2025/26:**\n\n• **Superficie Sembrada**: 1.125 ha (Igualada)\n• **Rendimiento Maíz promedio**: +7.4% (de 96 qq/ha a 103 qq/ha)\n• **Margen Bruto Total**: USD 324.580 (+$42.100 respecto al ciclo anterior)\n• **Consumo de Insumos**: Ahorro del 6.8% gracias a dosis variable en sembradora John Deere DB60.`;
      } else if (lower.includes("fertiliz") || lower.includes("dosis")) {
        botResponse = `🌾 **Recomendaciones de Fertilización:**\n\n• **Lote 1 (Maíz - 125 ha)**: Aplicar 180 lts/ha de UAN en estado V6 antes de la lluvia pronosticada.\n• **Lote 8 (Maíz - 80 ha)**: Fertilización con SolMix completada exitosamente. Respuesta esperada en 10 días.\n• **Lote 2 (Soja - 102 ha)**: Excelente nodulación, no se requiere aporte nitrogenado sintético.`;
      } else if (lower.includes("lote 7")) {
        botResponse = `🏆 **Estado del Lote 7 (Maíz DK 73-20 TRE - 65 ha):**\n\n• **Índice de Salud (ISL)**: **94/100 (Excelente)**\n• **Rendimiento estimado**: 112 qq/ha (El más alto del campo)\n• **Suelo**: Serie Marcos Juárez (Clase I, alta materia orgánica)\n• **Última labor**: Monitoreo foliar sin presencia de plagas ni tizón.`;
      } else if (lower.includes("lluvia") || lower.includes("clima")) {
        botResponse = `🌧 **Balance Hídrico Actual:**\n\n• **Última lluvia registrada**: 18 mm (hace 4 días).\n• **Acumulado mensual**: 95 mm (+12 mm por encima del promedio histórico).\n• **Humedad útil en perfil 0-100cm**: 82% de capacidad de campo.`;
      } else {
        botResponse = `Entendido, Gabriel. Procesé tu consulta sobre "${texto}". Actualmente el establecimiento **${establecimiento.nombre}** tiene **18 lotes activos** (11 en maíz, 7 en soja, trigo cosechado) con un Margen Bruto estimado de **USD 324.580**. ¿Te gustaría profundizar en algún lote específico o labor?`;
      }

      const liaMsg: MensajeChat = {
        id: `msg-lia-${Date.now()}`,
        emisor: "lia",
        mensaje: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sugerencias: [
          "Ver mapa de dosis Lote 4",
          "Descargar informe ejecutivo",
          "Consultar labores pendientes",
        ],
      };

      setChatMessages((prev) => [...prev, liaMsg]);
    }, 600);
  };

  const resetToDefaults = () => {
    setEstablecimiento(ESTABLECIMIENTO_ACTUAL);
    setCampanas(CAMPANAS_MOCK);
    setSelectedCampanaId("camp-2025-26");
    setLotes(LOTES_MOCK);
    setLabores(LABORES_MOCK);
    setTimelineEvents(TIMELINE_MOCK);
    setLluvias(LLUVIAS_MOCK);
    setEconomia(ECONOMIA_MOCK);
    setMaquinarias(MAQUINARIAS_MOCK);
    localStorage.clear();
  };

  return (
    <StoreContext.Provider
      value={{
        establecimiento,
        campanas,
        selectedCampanaId,
        setSelectedCampanaId,
        selectedCampana,
        lotes,
        labores,
        timelineEvents,
        lluvias,
        economia,
        maquinarias,
        chatMessages,
        isMock: !isSupabaseConfigured,
        addLote,
        addLabor,
        updateLaborStatus,
        addLluvia,
        addTimelineEvent,
        sendChatMessage,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
