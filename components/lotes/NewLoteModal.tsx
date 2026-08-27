"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { Cultivo } from "@/lib/supabase/types";

interface NewLoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewLoteModal({ isOpen, onClose }: NewLoteModalProps) {
  const { addLote, lotes } = useStore();

  const nextNumber = lotes.length + 1;
  const [nombre, setNombre] = useState(`Lote ${nextNumber}`);
  const [numero, setNumero] = useState(nextNumber);
  const [hectareas, setHectareas] = useState("80");
  const [cultivo, setCultivo] = useState<Cultivo>("Maíz");
  const [hibrido, setHibrido] = useState("");
  const [rendimiento, setRendimiento] = useState("100");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ha = parseFloat(hectareas) || 50;
    const rinde = parseFloat(rendimiento) || 90;

    // Generate center coords and random polygon
    const posX = 20 + Math.floor(Math.random() * 60);
    const posY = 20 + Math.floor(Math.random() * 60);

    addLote({
      numero: Number(numero),
      nombre,
      hectareas: ha,
      cultivo_actual: cultivo,
      variedad_hibrido: hibrido || undefined,
      rendimiento_estimado: rinde,
      rendimiento_historico: rinde * 0.95,
      isl_score: 88,
      isl_resumen: `Lote ${nombre} incorporado en campaña activa.`,
      isl_recomendacion: "Iniciar plan de monitoreo y fertilización basal.",
      estado_fenologico: "Implantación",
      map_coords: {
        polygon: [
          { x: posX - 6, y: posY - 6 },
          { x: posX + 6, y: posY - 6 },
          { x: posX + 6, y: posY + 6 },
          { x: posX - 6, y: posY + 6 },
        ],
        center: { x: posX, y: posY },
      },
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Lote"
      subtitle="Incorporá un nuevo lote al establecimiento"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nombre del Lote
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Número de Identificación
            </label>
            <input
              type="number"
              value={numero}
              onChange={(e) => setNumero(parseInt(e.target.value) || 1)}
              required
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Superficie (ha)
            </label>
            <input
              type="number"
              step="0.1"
              value={hectareas}
              onChange={(e) => setHectareas(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Cultivo Actual
            </label>
            <select
              value={cultivo}
              onChange={(e) => setCultivo(e.target.value as Cultivo)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
            >
              <option value="Maíz">Maíz</option>
              <option value="Soja">Soja</option>
              <option value="Trigo">Trigo</option>
              <option value="Girasol">Girasol</option>
              <option value="Barbecho">Barbecho</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Variedad / Híbrido
            </label>
            <input
              type="text"
              placeholder="Ej: DK 72-10 VT3P"
              value={hibrido}
              onChange={(e) => setHibrido(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Rendimiento Objetivo (qq/ha)
            </label>
            <input
              type="number"
              value={rendimiento}
              onChange={(e) => setRendimiento(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Guardar Lote</Button>
        </div>
      </form>
    </Modal>
  );
}
