"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";

interface RainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RainModal({ isOpen, onClose }: RainModalProps) {
  const { addLluvia, lotes } = useStore();
  const [mm, setMm] = useState("25");
  const [loteNombre, setLoteNombre] = useState("General Establecimiento");
  const [observaciones, setObservaciones] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const milimetros = parseFloat(mm) || 0;
    addLluvia(milimetros, loteNombre, observaciones);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cargar Registro de Lluvia"
      subtitle="Anotá las precipitaciones registradas en el pluviómetro"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Milímetros Caídos (mm)
          </label>
          <div className="relative">
            <input
              type="number"
              step="1"
              value={mm}
              onChange={(e) => setMm(e.target.value)}
              required
              className="w-full px-4 py-3 text-2xl font-bold text-stone-900 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-stone-400">
              mm
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Sector / Lote específico
          </label>
          <select
            value={loteNombre}
            onChange={(e) => setLoteNombre(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
          >
            <option value="General Establecimiento">General Establecimiento (Todo el campo)</option>
            <option value="Zona Norte (Lotes 1 a 6)">Zona Norte (Lotes 1 a 6)</option>
            <option value="Zona Sur (Lotes 7 a 18)">Zona Sur (Lotes 7 a 18)</option>
            {lotes.map((l) => (
              <option key={l.id} value={l.nombre}>
                {l.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Observaciones (opcional)
          </label>
          <textarea
            rows={2}
            placeholder="Ej: Lluvia mansa de 8 horas con excelente infiltración."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Guardar Registro</Button>
        </div>
      </form>
    </Modal>
  );
}
