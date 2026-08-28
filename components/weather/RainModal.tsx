"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";

interface RainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal to record a rainfall event in millimeters.
 */
export function RainModal({ isOpen, onClose }: RainModalProps) {
  const { addRainfall, fields } = useStore();
  const [mm, setMm] = useState("");
  const [fieldName, setFieldName] = useState("General Establecimiento");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMm = parseFloat(mm);
    if (!parsedMm || isNaN(parsedMm)) return;

    setIsSubmitting(true);
    await addRainfall(parsedMm, fieldName, notes);
    setIsSubmitting(false);

    setMm("");
    setNotes("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cargar Registro Pluviométrico"
      subtitle="Ingresá los milímetros caídos en el pluviómetro"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Milímetros (mm)
          </label>
          <input
            type="number"
            step="0.1"
            required
            placeholder="Ej: 24.5"
            value={mm}
            onChange={(e) => setMm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Lote o Ubicación del Pluviómetro
          </label>
          <select
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
          >
            <option value="General Establecimiento">General Establecimiento</option>
            {fields.map((f) => (
              <option key={f.id} value={f.nombre}>
                {f.nombre} ({f.cultivo_actual})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Observaciones (Opcional)
          </label>
          <textarea
            rows={2}
            placeholder="Lluvia mansa sin granizo, viento leve..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Registro"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
