"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import {
  Farm,
  Season,
  Field,
  FieldActivity,
  TimelineEvent,
  RainfallRecord,
  FinancialTransaction,
  FinancialSummary,
  Machinery,
  ChatMessage,
  ActivityStatus,
} from "./types";
import { supabase, isSupabaseConfigured } from "./client";

/**
 * Interface defining the global state and CRUD dispatchers.
 */
interface FarmStoreContextType {
  // Auth state
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signOut: () => Promise<void>;

  // Domain data
  farm: Farm;
  seasons: Season[];
  selectedSeasonId: string;
  setSelectedSeasonId: (id: string) => void;
  selectedSeason: Season;
  fields: Field[];
  activities: FieldActivity[];
  timelineEvents: Record<string, TimelineEvent[]>;
  rainfallRecords: RainfallRecord[];
  transactions: FinancialTransaction[];
  finances: FinancialSummary;
  machinery: Machinery[];
  chatMessages: ChatMessage[];
  isMock: boolean;
  isLoading: boolean;

  // CRUD Field operations
  addField: (field: Omit<Field, "id" | "establecimiento_id" | "campana_id" | "user_id">) => Promise<void>;
  updateField: (id: string, updates: Partial<Field>) => Promise<void>;
  deleteField: (id: string) => Promise<void>;

  // CRUD Activity operations
  addActivity: (activity: Omit<FieldActivity, "id" | "campana_id" | "user_id">) => Promise<void>;
  updateActivity: (id: string, updates: Partial<FieldActivity>) => Promise<void>;
  updateActivityStatus: (activityId: string, newStatus: ActivityStatus) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;

  // CRUD Machinery operations
  addMachinery: (mach: Omit<Machinery, "id" | "user_id" | "establecimiento_id">) => Promise<void>;
  updateMachinery: (id: string, updates: Partial<Machinery>) => Promise<void>;
  deleteMachinery: (id: string) => Promise<void>;

  // CRUD Rainfall operations
  addRainfall: (millimeters: number, fieldName?: string, notes?: string) => Promise<void>;
  deleteRainfall: (id: string) => Promise<void>;

  // CRUD Financial operations
  addTransaction: (tx: Omit<FinancialTransaction, "id" | "user_id" | "campana_id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Farm & Season management
  updateFarm: (updates: Partial<Farm>) => Promise<void>;
  addSeason: (name: string, startDate: string) => Promise<void>;

  // Timeline & AI Chat
  addTimelineEvent: (fieldId: string, event: Omit<TimelineEvent, "id" | "lote_id" | "user_id">) => Promise<void>;
  sendChatMessage: (text: string) => Promise<void>;
  refetchData: () => Promise<void>;

  // Aliases for Spanish backward compatibility
  establecimiento: Farm;
  campanas: Season[];
  selectedCampanaId: string;
  setSelectedCampanaId: (id: string) => void;
  selectedCampana: Season;
  lotes: Field[];
  labores: FieldActivity[];
  lluvias: RainfallRecord[];
  transacciones: FinancialTransaction[];
  economia: FinancialSummary;
  maquinarias: Machinery[];
  addLote: (lote: Omit<Field, "id" | "establecimiento_id" | "campana_id" | "user_id">) => Promise<void>;
  updateLote: (id: string, updates: Partial<Field>) => Promise<void>;
  deleteLote: (id: string) => Promise<void>;
  addLabor: (labor: Omit<FieldActivity, "id" | "campana_id" | "user_id">) => Promise<void>;
  updateLabor: (id: string, updates: Partial<FieldActivity>) => Promise<void>;
  updateLaborStatus: (laborId: string, nuevoEstado: ActivityStatus) => Promise<void>;
  deleteLabor: (id: string) => Promise<void>;
  addLluvia: (milimetros: number, lote_nombre?: string, observaciones?: string) => Promise<void>;
  deleteLluvia: (id: string) => Promise<void>;
  addTransaccion: (trans: Omit<FinancialTransaction, "id" | "user_id" | "campana_id">) => Promise<void>;
  deleteTransaccion: (id: string) => Promise<void>;
  updateEstablecimiento: (updates: Partial<Farm>) => Promise<void>;
  addCampana: (nombre: string, fechaInicio: string) => Promise<void>;
}

const StoreContext = createContext<FarmStoreContextType | null>(null);

const DEFAULT_FARM: Farm = {
  id: "farm-default",
  nombre: "Mi Establecimiento",
  titular: "Productor Agropecuario",
  ubicacion: "Zona Núcleo, Argentina",
  superficie_total: 0,
};

const DEFAULT_SEASON: Season = {
  id: "season-default",
  nombre: "Campaña 2025/26",
  fecha_inicio: "01/07/2025",
  activa: true,
};

/**
 * Global Store Provider managing authentication state and multi-tenant domain data.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [farm, setFarm] = useState<Farm>(DEFAULT_FARM);
  const [seasons, setSeasons] = useState<Season[]>([DEFAULT_SEASON]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("season-default");
  const [fields, setFields] = useState<Field[]>([]);
  const [activities, setActivities] = useState<FieldActivity[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<Record<string, TimelineEvent[]>>({});
  const [rainfallRecords, setRainfallRecords] = useState<RainfallRecord[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      emisor: "lia",
      mensaje:
        "Hola, soy Lía, tu asistente agronómica con inteligencia artificial. Puedo analizar tus lotes, calcular márgenes, recomendar dosis o responder sobre tus labores cargadas.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sugerencias: [
        "¿Cómo están mis lotes hoy?",
        "Resumen de labores pendientes",
        "Recomendaciones de fertilización",
      ],
    },
  ]);

  /**
   * Recalculates gross margins, revenues, expenses and categorized breakdowns.
   */
  const computeFinancialSummary = useCallback(
    (txList: FinancialTransaction[], fieldList: Field[], seasonId: string): FinancialSummary => {
      let totalIncome = 0;
      let totalExpenses = 0;
      const categoryMap: Record<string, number> = {
        Insumos: 0,
        Labores: 0,
        Semillas: 0,
        Flete: 0,
        Otros: 0,
      };

      txList.forEach((tx) => {
        const amount = Number(tx.monto) || 0;
        if (tx.tipo === "Ingreso") {
          totalIncome += amount;
        } else {
          totalExpenses += amount;
          const cat = tx.categoria in categoryMap ? tx.categoria : "Otros";
          categoryMap[cat] = (categoryMap[cat] || 0) + amount;
        }
      });

      const categoryColors: Record<string, string> = {
        Insumos: "#4F8A3F",
        Labores: "#10B981",
        Semillas: "#F59E0B",
        Flete: "#F97316",
        Otros: "#64748B",
      };

      const breakdown = Object.entries(categoryMap).map(([cat, amount]) => ({
        categoria: cat as any,
        monto: amount,
        porcentaje: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
        color: categoryColors[cat] || "#64748B",
      }));

      const totalHectares = fieldList.reduce((acc, f) => acc + (Number(f.hectareas) || 0), 0);
      const grossMargin = totalIncome - totalExpenses;

      return {
        campana_id: seasonId,
        ingresos_totales: totalIncome,
        gastos_totales: totalExpenses,
        margen_bruto: grossMargin,
        margen_por_ha: totalHectares > 0 ? Math.round(grossMargin / totalHectares) : 0,
        distribucion_gastos: breakdown,
      };
    },
    []
  );

  const [finances, setFinances] = useState<FinancialSummary>(() =>
    computeFinancialSummary([], [], "season-default")
  );

  const isDataLoadingRef = useRef(false);

  /**
   * Loads all farm entities belonging to the authenticated user from Supabase.
   */
  const loadUserData = useCallback(
    async (currentUserId: string, userMetadata?: any) => {
      if (!supabase || isDataLoadingRef.current) return;
      isDataLoadingRef.current = true;

      try {
        // 1. Farm
        let { data: farmData } = await supabase
          .from("establecimientos")
          .select("*")
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (!farmData) {
          const initialFarm = {
            user_id: currentUserId,
            nombre: userMetadata?.establecimiento_nombre || "Establecimiento Principal",
            titular: userMetadata?.full_name || "Productor",
            ubicacion: "Zona Núcleo, Argentina",
            superficie_total: 0,
          };
          const { data: created } = await supabase
            .from("establecimientos")
            .insert(initialFarm)
            .select()
            .maybeSingle();
          farmData = created || { ...initialFarm, id: `farm-${Date.now()}` };
        }

        if (farmData) {
          setFarm(farmData as Farm);
        }

        // 2. Seasons
        let { data: seasonData } = await supabase
          .from("campanas")
          .select("*")
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: false });

        if (!seasonData || seasonData.length === 0) {
          const defaultSeason = {
            user_id: currentUserId,
            nombre: "Campaña 2025/26",
            fecha_inicio: "01/07/2025",
            activa: true,
          };
          const { data: createdSeason } = await supabase
            .from("campanas")
            .insert(defaultSeason)
            .select();
          seasonData = createdSeason || [{ ...defaultSeason, id: `season-${Date.now()}` } as any];
        }

        if (seasonData && seasonData.length > 0) {
          setSeasons(seasonData as Season[]);
          const active = seasonData.find((s) => s.activa) || seasonData[0];
          setSelectedSeasonId(active.id);
        }

        // 3. Fields
        const { data: fieldsData } = await supabase
          .from("lotes")
          .select("*")
          .eq("user_id", currentUserId)
          .order("numero", { ascending: true });

        const currentFields = (fieldsData || []) as Field[];
        setFields(currentFields);

        // Update total hectares in farm if needed
        const sumHectares = currentFields.reduce((acc, f) => acc + (Number(f.hectareas) || 0), 0);
        if (farmData && farmData.superficie_total !== sumHectares) {
          setFarm((prev) => ({ ...prev, superficie_total: sumHectares }));
          await supabase
            .from("establecimientos")
            .update({ superficie_total: sumHectares })
            .eq("id", farmData.id);
        }

        // 4. Activities
        const { data: activitiesData } = await supabase
          .from("labores")
          .select("*")
          .eq("user_id", currentUserId)
          .order("fecha", { ascending: false });

        setActivities((activitiesData || []) as FieldActivity[]);

        // 5. Timeline Events
        const { data: timelineData } = await supabase
          .from("timeline_eventos")
          .select("*")
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: false });

        const grouped: Record<string, TimelineEvent[]> = {};
        (timelineData || []).forEach((ev: any) => {
          if (!grouped[ev.lote_id]) grouped[ev.lote_id] = [];
          grouped[ev.lote_id].push(ev as TimelineEvent);
        });
        setTimelineEvents(grouped);

        // 6. Machinery Fleet
        const { data: machineryData } = await supabase
          .from("maquinarias")
          .select("*")
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: true });

        setMachinery((machineryData || []) as Machinery[]);

        // 7. Rainfall Records
        const { data: rainData } = await supabase
          .from("lluvias")
          .select("*")
          .eq("user_id", currentUserId)
          .order("fecha", { ascending: false });

        setRainfallRecords((rainData || []) as RainfallRecord[]);

        // 8. Financial Transactions
        const { data: txData } = await supabase
          .from("finanzas")
          .select("*")
          .eq("user_id", currentUserId)
          .order("fecha", { ascending: false });

        const currentTx = (txData || []) as FinancialTransaction[];
        setTransactions(currentTx);
        setFinances(
          computeFinancialSummary(
            currentTx,
            currentFields,
            seasonData?.[0]?.id || "season-default"
          )
        );

        // 9. AI Chat Messages
        const { data: chatData } = await supabase
          .from("lia_conversaciones")
          .select("*")
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: true });

        if (chatData && chatData.length > 0) {
          setChatMessages(
            chatData.map((c) => ({
              id: c.id,
              emisor: c.emisor,
              mensaje: c.mensaje,
              timestamp:
                c.timestamp ||
                new Date(c.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              sugerencias: c.sugerencias,
              datos_adjuntos: c.datos_adjuntos,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading user data from Supabase:", err);
      } finally {
        isDataLoadingRef.current = false;
      }
    },
    [computeFinancialSummary]
  );

  // Handle Authentication Lifecycle once on mount
  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Safety timeout: Never stay stuck on loading for more than 4 seconds
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 4000);

    // Initial session check
    supabase.auth
      .getSession()
      .then(async ({ data: { session: currentSession } }) => {
        if (!isMounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await loadUserData(currentSession.user.id, currentSession.user.user_metadata);
        }
      })
      .catch((err) => {
        console.error("Session fetch error:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
          clearTimeout(safetyTimer);
        }
      });

    // Reactive Auth State listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        setIsLoading(true);
        await loadUserData(newSession.user.id, newSession.user.user_metadata);
        if (isMounted) setIsLoading(false);
      } else {
        setFarm(DEFAULT_FARM);
        setSeasons([DEFAULT_SEASON]);
        setFields([]);
        setActivities([]);
        setTimelineEvents({});
        setRainfallRecords([]);
        setTransactions([]);
        setMachinery([]);
        setFinances(computeFinancialSummary([], [], "season-default"));
        if (isMounted) setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, [loadUserData, computeFinancialSummary]);

  const selectedSeason =
    seasons.find((s) => s.id === selectedSeasonId) || seasons[0] || DEFAULT_SEASON;

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  // ----------------------------------------------------
  // FIELD CRUD DISPATCHERS
  // ----------------------------------------------------
  const addField = async (
    fieldData: Omit<Field, "id" | "establecimiento_id" | "campana_id" | "user_id">
  ) => {
    const defaultCoords = fieldData.map_coords || {
      polygon: [
        { x: 30 + Math.floor(Math.random() * 40), y: 20 + Math.floor(Math.random() * 40) },
        { x: 45 + Math.floor(Math.random() * 40), y: 20 + Math.floor(Math.random() * 40) },
        { x: 45 + Math.floor(Math.random() * 40), y: 40 + Math.floor(Math.random() * 40) },
        { x: 30 + Math.floor(Math.random() * 40), y: 40 + Math.floor(Math.random() * 40) },
      ],
      center: { x: 40, y: 35 },
    };

    const newRecord: any = {
      ...fieldData,
      map_coords: defaultCoords,
      establecimiento_id: farm.id !== "farm-default" ? farm.id : undefined,
      campana_id: selectedSeasonId !== "season-default" ? selectedSeasonId : undefined,
      user_id: user?.id,
    };

    if (supabase && user) {
      const { data, error } = await supabase.from("lotes").insert(newRecord).select().single();
      if (data && !error) {
        setFields((prev) => [...prev, data as Field]);
        const newTotalHa = fields.reduce((acc, f) => acc + f.hectareas, 0) + (data.hectareas || 0);
        setFarm((prev) => ({ ...prev, superficie_total: newTotalHa }));
        return;
      }
    }

    const fallbackField: Field = {
      ...newRecord,
      id: `field-${Date.now()}`,
    };
    setFields((prev) => [...prev, fallbackField]);
  };

  const updateField = async (id: string, updates: Partial<Field>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));

    if (supabase && user) {
      await supabase.from("lotes").update(updates).eq("id", id);
    }
  };

  const deleteField = async (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setActivities((prev) => prev.filter((a) => a.lote_id !== id));

    if (supabase && user) {
      await supabase.from("lotes").delete().eq("id", id);
    }
  };

  // ----------------------------------------------------
  // ACTIVITY CRUD DISPATCHERS
  // ----------------------------------------------------
  const addActivity = async (
    activityData: Omit<FieldActivity, "id" | "campana_id" | "user_id">
  ) => {
    const newRecord: any = {
      ...activityData,
      campana_id: selectedSeasonId !== "season-default" ? selectedSeasonId : undefined,
      user_id: user?.id,
    };

    let insertedActivity: FieldActivity = {
      ...newRecord,
      id: `act-${Date.now()}`,
    };

    if (supabase && user) {
      const { data, error } = await supabase.from("labores").insert(newRecord).select().single();
      if (data && !error) {
        insertedActivity = data as FieldActivity;
      }
    }

    setActivities((prev) => [insertedActivity, ...prev]);

    if (insertedActivity.lote_id) {
      const timelineType =
        insertedActivity.tipo === "Siembra"
          ? "siembra"
          : insertedActivity.tipo === "Fertilización"
          ? "fertilizacion"
          : insertedActivity.tipo === "Pulverización"
          ? "pulverizacion"
          : insertedActivity.tipo === "Cosecha"
          ? "cosecha"
          : "otro";

      await addTimelineEvent(insertedActivity.lote_id, {
        fecha: new Date(insertedActivity.fecha).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        tipo: timelineType,
        titulo: `${insertedActivity.tipo} ${insertedActivity.cultivo || ""}`,
        descripcion:
          insertedActivity.observaciones ||
          `Aplicación de ${insertedActivity.insumo_principal || "labor agronómica"}`,
        datos_clave: [
          ...(insertedActivity.dosis ? [{ etiqueta: "Dosis", valor: insertedActivity.dosis }] : []),
          ...(insertedActivity.maquinaria ? [{ etiqueta: "Equipo", valor: insertedActivity.maquinaria }] : []),
        ],
        autor: insertedActivity.operario || "Administración LOTE",
      });
    }
  };

  const updateActivity = async (id: string, updates: Partial<FieldActivity>) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));

    if (supabase && user) {
      await supabase.from("labores").update(updates).eq("id", id);
    }
  };

  const updateActivityStatus = async (activityId: string, newStatus: ActivityStatus) => {
    await updateActivity(activityId, { estado: newStatus });
  };

  const deleteActivity = async (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));

    if (supabase && user) {
      await supabase.from("labores").delete().eq("id", id);
    }
  };

  // ----------------------------------------------------
  // MACHINERY CRUD DISPATCHERS
  // ----------------------------------------------------
  const addMachinery = async (
    machData: Omit<Machinery, "id" | "user_id" | "establecimiento_id">
  ) => {
    const newRecord: any = {
      ...machData,
      establecimiento_id: farm.id !== "farm-default" ? farm.id : undefined,
      user_id: user?.id,
    };

    let insertedMach: Machinery = {
      ...newRecord,
      id: `mach-${Date.now()}`,
    };

    if (supabase && user) {
      const { data, error } = await supabase
        .from("maquinarias")
        .insert(newRecord)
        .select()
        .single();
      if (data && !error) {
        insertedMach = data as Machinery;
      }
    }

    setMachinery((prev) => [...prev, insertedMach]);
  };

  const updateMachinery = async (id: string, updates: Partial<Machinery>) => {
    setMachinery((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));

    if (supabase && user) {
      await supabase.from("maquinarias").update(updates).eq("id", id);
    }
  };

  const deleteMachinery = async (id: string) => {
    setMachinery((prev) => prev.filter((m) => m.id !== id));

    if (supabase && user) {
      await supabase.from("maquinarias").delete().eq("id", id);
    }
  };

  // ----------------------------------------------------
  // RAINFALL CRUD DISPATCHERS
  // ----------------------------------------------------
  const addRainfall = async (
    millimeters: number,
    fieldName: string = "General Establecimiento",
    notes?: string
  ) => {
    const newRecord: any = {
      fecha: new Date().toISOString().split("T")[0],
      milimetros: millimeters,
      lote_nombre: fieldName,
      observaciones: notes || `Registro pluviométrico de ${millimeters} mm`,
      campana_id: selectedSeasonId !== "season-default" ? selectedSeasonId : undefined,
      user_id: user?.id,
    };

    let insertedRain: RainfallRecord = {
      ...newRecord,
      id: `rain-${Date.now()}`,
    };

    if (supabase && user) {
      const { data, error } = await supabase.from("lluvias").insert(newRecord).select().single();
      if (data && !error) {
        insertedRain = data as RainfallRecord;
      }
    }

    setRainfallRecords((prev) => [insertedRain, ...prev]);
  };

  const deleteRainfall = async (id: string) => {
    setRainfallRecords((prev) => prev.filter((r) => r.id !== id));

    if (supabase && user) {
      await supabase.from("lluvias").delete().eq("id", id);
    }
  };

  // ----------------------------------------------------
  // FINANCIAL CRUD DISPATCHERS
  // ----------------------------------------------------
  const addTransaction = async (
    txData: Omit<FinancialTransaction, "id" | "user_id" | "campana_id">
  ) => {
    const newRecord: any = {
      ...txData,
      campana_id: selectedSeasonId !== "season-default" ? selectedSeasonId : undefined,
      user_id: user?.id,
    };

    let insertedTx: FinancialTransaction = {
      ...newRecord,
      id: `tx-${Date.now()}`,
    };

    if (supabase && user) {
      const { data, error } = await supabase.from("finanzas").insert(newRecord).select().single();
      if (data && !error) {
        insertedTx = data as FinancialTransaction;
      }
    }

    const updatedList = [insertedTx, ...transactions];
    setTransactions(updatedList);
    setFinances(computeFinancialSummary(updatedList, fields, selectedSeasonId));
  };

  const deleteTransaction = async (id: string) => {
    const updatedList = transactions.filter((t) => t.id !== id);
    setTransactions(updatedList);
    setFinances(computeFinancialSummary(updatedList, fields, selectedSeasonId));

    if (supabase && user) {
      await supabase.from("finanzas").delete().eq("id", id);
    }
  };

  // ----------------------------------------------------
  // FARM & SEASON MANAGEMENT
  // ----------------------------------------------------
  const updateFarm = async (updates: Partial<Farm>) => {
    setFarm((prev) => ({ ...prev, ...updates }));

    if (supabase && user && farm.id !== "farm-default") {
      await supabase.from("establecimientos").update(updates).eq("id", farm.id);
    }
  };

  const addSeason = async (name: string, startDate: string) => {
    const newRecord: any = {
      nombre: name,
      fecha_inicio: startDate,
      activa: true,
      user_id: user?.id,
    };

    let insertedSeason: Season = {
      ...newRecord,
      id: `season-${Date.now()}`,
    };

    if (supabase && user) {
      const { data } = await supabase.from("campanas").insert(newRecord).select().single();
      if (data) insertedSeason = data as Season;
    }

    setSeasons((prev) => [insertedSeason, ...prev]);
    setSelectedSeasonId(insertedSeason.id);
  };

  // ----------------------------------------------------
  // TIMELINE & AI CHAT DISPATCHERS
  // ----------------------------------------------------
  const addTimelineEvent = async (
    fieldId: string,
    eventData: Omit<TimelineEvent, "id" | "lote_id" | "user_id">
  ) => {
    const newRecord: any = {
      ...eventData,
      lote_id: fieldId,
      user_id: user?.id,
    };

    let newEvent: TimelineEvent = {
      ...newRecord,
      id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    if (supabase && user) {
      const { data } = await supabase.from("timeline_eventos").insert(newRecord).select().single();
      if (data) newEvent = data as TimelineEvent;
    }

    setTimelineEvents((prev) => ({
      ...prev,
      [fieldId]: [newEvent, ...(prev[fieldId] || [])],
    }));
  };

  const sendChatMessage = async (text: string) => {
    const userMsgId = `msg-user-${Date.now()}`;
    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: ChatMessage = {
      id: userMsgId,
      emisor: "usuario",
      mensaje: text,
      timestamp: userTime,
    };

    setChatMessages((prev) => [...prev, userMsg]);

    if (supabase && user) {
      await supabase.from("lia_conversaciones").insert({
        id: userMsgId,
        user_id: user.id,
        emisor: "usuario",
        mensaje: text,
        timestamp: userTime,
      });
    }

    setTimeout(async () => {
      const lower = text.toLowerCase();
      let botResponse = "";

      const totalFields = fields.length;
      const totalHa = fields.reduce((acc, f) => acc + f.hectareas, 0);
      const pendingActivities = activities.filter((a) => a.estado !== "Completada");
      const totalMm = rainfallRecords.reduce((acc, r) => acc + r.milimetros, 0);

      if (totalFields === 0) {
        botResponse = `Hola. Veo que todavía no tenés lotes cargados en **${farm.nombre}**. Podés empezar agregando tu primer lote desde la sección **Lotes** o con el botón "+ Nuevo Lote".`;
      } else if (lower.includes("lote")) {
        const foundField = fields.find((f) => lower.includes(f.nombre.toLowerCase()));
        if (foundField) {
          botResponse = `**Estado de ${foundField.nombre} (${foundField.cultivo_actual} - ${foundField.hectareas} ha):**\n\n• **Índice de Salud (ISL)**: ${foundField.isl_score}/100\n• **Rinde Estimado**: ${foundField.rendimiento_estimado || "--"} qq/ha\n• **Estado**: ${foundField.estado_fenologico || "Vegetativo"}\n• **Diagnóstico**: ${foundField.isl_resumen || "Buen estado general."}\n\n**Recomendación**: ${foundField.isl_recomendacion || "Continuar monitoreo habitual."}`;
        } else {
          botResponse = `Actualmente tenés **${totalFields} lotes** registrados con un total de **${totalHa} hectáreas**:\n\n${fields
            .slice(0, 5)
            .map(
              (f) =>
                `• **${f.nombre}**: ${f.cultivo_actual} (${f.hectareas} ha) - ISL: ${f.isl_score}/100`
            )
            .join("\n")}${
            totalFields > 5 ? `\n• ... y ${totalFields - 5} lotes más.` : ""
          }`;
        }
      } else if (lower.includes("labor") || lower.includes("tarea") || lower.includes("pendiente")) {
        botResponse = `**Labores en el Establecimiento:**\n\n• Tenés **${pendingActivities.length} labores pendientes o en progreso**.\n• Total registradas: ${activities.length}.\n\n${
          pendingActivities.length > 0
            ? pendingActivities
                .slice(0, 3)
                .map((a) => `• [${a.estado}] ${a.tipo} en ${a.lote_nombre} (${a.fecha})`)
                .join("\n")
            : "No tenés labores pendientes por el momento."
        }`;
      } else if (lower.includes("lluvia") || lower.includes("agua") || lower.includes("clima")) {
        botResponse = `**Registro Pluviométrico:**\n\n• **Acumulado en campaña**: ${totalMm} mm\n• **Registros cargados**: ${rainfallRecords.length} eventos pluviométricos.\n• Último registro: ${
          rainfallRecords[0] ? `${rainfallRecords[0].milimetros} mm (${rainfallRecords[0].fecha})` : "Sin lluvias cargadas"
        }`;
      } else if (lower.includes("economia") || lower.includes("gasto") || lower.includes("margen") || lower.includes("rinde")) {
        botResponse = `**Resumen Económico Campaña:**\n\n• **Ingresos Proyectados**: USD ${finances.ingresos_totales.toLocaleString()}\n• **Gastos Totales**: USD ${finances.gastos_totales.toLocaleString()}\n• **Margen Bruto**: USD ${finances.margen_bruto.toLocaleString()}\n• **Margen / ha**: USD ${finances.margen_por_ha} / ha`;
      } else {
        botResponse = `Procesé tu consulta para **${farm.nombre}**. Contamos con **${totalFields} lotes** (${totalHa} ha), **${pendingActivities.length} labores pendientes** y un acumulado de **${totalMm} mm** de lluvia. ¿Te gustaría profundizar en algún lote o labor en particular?`;
      }

      const botMsgId = `msg-lia-${Date.now()}`;
      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const suggestions = [
        "Consultar labores pendientes",
        "Ver balance económico",
        "Resumen de lluvias",
      ];

      const liaMsg: ChatMessage = {
        id: botMsgId,
        emisor: "lia",
        mensaje: botResponse,
        timestamp: botTime,
        sugerencias: suggestions,
      };

      setChatMessages((prev) => [...prev, liaMsg]);

      if (supabase && user) {
        await supabase.from("lia_conversaciones").insert({
          id: botMsgId,
          user_id: user.id,
          emisor: "lia",
          mensaje: botResponse,
          timestamp: botTime,
          sugerencias: suggestions,
        });
      }
    }, 500);
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        session,
        isAuthenticated: Boolean(user),
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        signOut,
        farm,
        seasons,
        selectedSeasonId,
        setSelectedSeasonId,
        selectedSeason,
        fields,
        activities,
        timelineEvents,
        rainfallRecords,
        transactions,
        finances,
        machinery,
        chatMessages,
        isMock: !isSupabaseConfigured,
        isLoading,
        addField,
        updateField,
        deleteField,
        addActivity,
        updateActivity,
        updateActivityStatus,
        deleteActivity,
        addMachinery,
        updateMachinery,
        deleteMachinery,
        addRainfall,
        deleteRainfall,
        addTransaction,
        deleteTransaction,
        updateFarm,
        addSeason,
        addTimelineEvent,
        sendChatMessage,
        refetchData: async () => {
          if (user) await loadUserData(user.id, user.user_metadata);
        },

        // Backward compatibility mappings
        establecimiento: farm,
        campanas: seasons,
        selectedCampanaId: selectedSeasonId,
        setSelectedCampanaId: setSelectedSeasonId,
        selectedCampana: selectedSeason,
        lotes: fields,
        labores: activities,
        lluvias: rainfallRecords,
        transacciones: transactions,
        economia: finances,
        maquinarias: machinery,
        addLote: addField,
        updateLote: updateField,
        deleteLote: deleteField,
        addLabor: addActivity,
        updateLabor: updateActivity,
        updateLaborStatus: updateActivityStatus,
        deleteLabor: deleteActivity,
        addLluvia: addRainfall,
        deleteLluvia: deleteRainfall,
        addTransaccion: addTransaction,
        deleteTransaccion: deleteTransaction,
        updateEstablecimiento: updateFarm,
        addCampana: addSeason,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

/**
 * Hook to consume the global Farm Store.
 */
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

export const useFarmStore = useStore;
