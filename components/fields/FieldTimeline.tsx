"use client";

import React, { useState } from "react";
import {
  Sprout,
  Droplet,
  CloudRain,
  ShieldAlert,
  Snowflake,
  Wheat,
  Plus,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useStore } from "@/lib/supabase/store";
import { Field } from "@/lib/supabase/types";

interface FieldTimelineProps {
  field: Field;
}

/**
 * Historical field timeline component detailing all interventions and weather impacts.
 */
export function FieldTimeline({ field }: FieldTimelineProps) {
  const { timelineEvents, addTimelineEvent } = useStore();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<any>("fertilizacion");
  const [author, setAuthor] = useState("Ing. Agrónomo");

  const events = timelineEvents[field.id] || [];

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await addTimelineEvent(field.id, {
      fecha: new Date().toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      tipo: type,
      titulo: title,
      descripcion: desc,
      autor: author,
    });

    setTitle("");
    setDesc("");
    setIsAddEventOpen(false);
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "siembra":
        return <Sprout className="w-4 h-4 text-[#4F8A3F]" />;
      case "fertilizacion":
        return <Droplet className="w-4 h-4 text-[#4F8A3F]" />;
      case "lluvia":
        return <CloudRain className="w-4 h-4 text-sky-600" />;
      case "pulverizacion":
        return <ShieldAlert className="w-4 h-4 text-emerald-600" />;
      case "helada":
        return <Snowflake className="w-4 h-4 text-cyan-600" />;
      case "cosecha":
        return <Wheat className="w-4 h-4 text-amber-600" />;
      case "informe_ia":
        return <Sparkles className="w-4 h-4 text-[#4F8A3F]" />;
      default:
        return <Sprout className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <Card className="p-6 border-stone-200/80">
      <CardHeader className="pb-3 mb-4">
        <div>
          <CardTitle>Línea de Tiempo del Lote</CardTitle>
          <span className="text-xs text-stone-400">Historial completo de intervenciones</span>
        </div>
        <Button size="sm" variant="outline" onClick={() => setIsAddEventOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Nuevo Evento</span>
        </Button>
      </CardHeader>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="relative group">
              {/* Event node dot */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#4F8A3F] flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A3F]" />
              </div>

              <div className="bg-stone-50/70 group-hover:bg-stone-50 rounded-2xl p-4 border border-stone-200/70 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-white shadow-2xs">
                      {getEventIcon(event.tipo)}
                    </div>
                    <h4 className="text-sm font-bold text-stone-900">{event.titulo}</h4>
                  </div>
                  <span className="text-xs text-stone-400 font-semibold">{event.fecha}</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-2">{event.descripcion}</p>

                {event.datos_clave && event.datos_clave.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-200/60">
                    {event.datos_clave.map((d, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 font-medium"
                      >
                        <strong className="text-stone-900">{d.etiqueta}:</strong> {d.valor}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-stone-400">
            No hay eventos registrados en este lote.
          </div>
        )}
      </div>

      {/* Modal to add event */}
      <Modal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        title="Registrar Evento en el Lote"
        subtitle={`Lote: ${field.nombre}`}
      >
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tipo de Evento
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
            >
              <option value="fertilizacion">Fertilización</option>
              <option value="siembra">Siembra</option>
              <option value="pulverizacion">Pulverización</option>
              <option value="lluvia">Lluvia / Riego</option>
              <option value="helada">Helada / Contingencia</option>
              <option value="cosecha">Cosecha</option>
              <option value="informe_ia">Informe Lía IA</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Título del Evento
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Fertilización con SolMix"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Descripción o Detalle
            </label>
            <textarea
              rows={3}
              placeholder="Detalle de productos, condiciones ambientales..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
            <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Evento</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}

export const LoteTimeline = FieldTimeline;
