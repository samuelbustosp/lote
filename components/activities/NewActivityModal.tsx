"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { ActivityType, ActivityStatus } from "@/lib/supabase/types";

interface NewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFieldId?: string;
}

/**
 * Modal to log or schedule a new agricultural activity/task.
 */
export function NewActivityModal({ isOpen, onClose, defaultFieldId }: NewActivityModalProps) {
  const { addActivity, fields, machinery } = useStore();

  const [type, setType] = useState<ActivityType>("Fertilización");
  const [fieldId, setFieldId] = useState(defaultFieldId || fields[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [inputName, setInputName] = useState("");
  const [dose, setDose] = useState("");
  const [selectedMachinery, setSelectedMachinery] = useState(machinery[0]?.nombre || "");
  const [operator, setOperator] = useState("Carlos Benítez");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ActivityStatus>("Pendiente");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedField = fields.find((f) => f.id === fieldId) || fields[0];

    await addActivity({
      tipo: type,
      lote_id: selectedField?.id,
      lote_nombre: selectedField ? `${selectedField.nombre} - ${selectedField.cultivo_actual}` : "General",
      cultivo: selectedField?.cultivo_actual,
      fecha: date,
      estado: status,
      superficie_ha: selectedField ? selectedField.hectareas : 0,
      insumo_principal: inputName || undefined,
      dosis: dose || undefined,
      maquinaria: selectedMachinery || undefined,
      operario: operator || undefined,
      costo_estimado: parseFloat(estimatedCost) || undefined,
      observaciones: notes || undefined,
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Nueva Labor"
      subtitle="Planificá o asentá labores en los lotes del establecimiento"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tipo de Labor
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ActivityType)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
            >
              <option value="Siembra">Siembra</option>
              <option value="Fertilización">Fertilización</option>
              <option value="Pulverización">Pulverización</option>
              <option value="Cosecha">Cosecha</option>
              <option value="Monitoreo">Monitoreo</option>
              <option value="Riego">Riego</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Lote de Destino
            </label>
            <select
              value={fieldId}
              onChange={(e) => setFieldId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre} ({f.cultivo_actual} - {f.hectareas} ha)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Estado
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ActivityStatus)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Completada">Completada</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Insumo Principal / Semilla / Producto
            </label>
            <input
              type="text"
              placeholder="Ej: UREA granulada / SolMix"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Dosis o Densidad
            </label>
            <input
              type="text"
              placeholder="Ej: 200 kg/ha o 75.000 sem/ha"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Maquinaria
            </label>
            <input
              type="text"
              placeholder="Ej: JD DB60"
              value={selectedMachinery}
              onChange={(e) => setSelectedMachinery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Operario
            </label>
            <input
              type="text"
              placeholder="Ej: Roberto Giménez"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Costo Est. (USD)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Observaciones
          </label>
          <textarea
            rows={2}
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
            {isSubmitting ? "Guardando..." : "Guardar Labor"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export const NewLaborModal = NewActivityModal;
