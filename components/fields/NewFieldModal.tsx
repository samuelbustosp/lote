"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { CropType } from "@/lib/supabase/types";

interface NewFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal to register a new field parcel into the farm.
 */
export function NewFieldModal({ isOpen, onClose }: NewFieldModalProps) {
  const { addField, fields } = useStore();

  const nextNumber = fields.length + 1;
  const [name, setName] = useState(`Lote ${nextNumber}`);
  const [number, setNumber] = useState(nextNumber);
  const [hectares, setHectares] = useState("80");
  const [crop, setCrop] = useState<CropType>("Maíz");
  const [hybrid, setHybrid] = useState("");
  const [targetYield, setTargetYield] = useState("100");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ha = parseFloat(hectares) || 50;
    const rinde = parseFloat(targetYield) || 90;

    const posX = 20 + Math.floor(Math.random() * 60);
    const posY = 20 + Math.floor(Math.random() * 60);

    await addField({
      numero: Number(number),
      nombre: name,
      hectareas: ha,
      cultivo_actual: crop,
      variedad_hibrido: hybrid || undefined,
      rendimiento_estimado: rinde,
      rendimiento_historico: rinde * 0.95,
      isl_score: 88,
      isl_resumen: `Lote ${name} incorporado a la campaña activa.`,
      isl_recomendacion: "Iniciar plan de fertilización basal y monitoreo foliar.",
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

    setIsSubmitting(false);
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={number}
              onChange={(e) => setNumber(parseInt(e.target.value) || 1)}
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
              value={hectares}
              onChange={(e) => setHectares(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Cultivo Actual
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value as CropType)}
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
              value={hybrid}
              onChange={(e) => setHybrid(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Rendimiento Objetivo (qq/ha)
            </label>
            <input
              type="number"
              value={targetYield}
              onChange={(e) => setTargetYield(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Lote"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export const NewLoteModal = NewFieldModal;
