"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { FieldActivity, ActivityType, ActivityStatus } from "@/lib/supabase/types";
import { Trash2 } from "lucide-react";

interface EditActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: FieldActivity;
}

/**
 * Modal to update an existing field activity or delete it.
 */
export function EditActivityModal({ isOpen, onClose, activity }: EditActivityModalProps) {
  const { updateActivity, deleteActivity, fields } = useStore();

  const [type, setType] = useState<ActivityType>(activity.tipo);
  const [fieldId, setFieldId] = useState(activity.lote_id || "");
  const [date, setDate] = useState(activity.fecha);
  const [inputName, setInputName] = useState(activity.insumo_principal || "");
  const [dose, setDose] = useState(activity.dosis || "");
  const [machineryName, setMachineryName] = useState(activity.maquinaria || "");
  const [operator, setOperator] = useState(activity.operario || "");
  const [cost, setCost] = useState(activity.costo_estimado?.toString() || "");
  const [notes, setNotes] = useState(activity.observaciones || "");
  const [status, setStatus] = useState<ActivityStatus>(activity.estado);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setType(activity.tipo);
    setFieldId(activity.lote_id || "");
    setDate(activity.fecha);
    setInputName(activity.insumo_principal || "");
    setDose(activity.dosis || "");
    setMachineryName(activity.maquinaria || "");
    setOperator(activity.operario || "");
    setCost(activity.costo_estimado?.toString() || "");
    setNotes(activity.observaciones || "");
    setStatus(activity.estado);
    setIsConfirmingDelete(false);
  }, [activity, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedField = fields.find((f) => f.id === fieldId);

    await updateActivity(activity.id, {
      tipo: type,
      lote_id: fieldId || undefined,
      lote_nombre: selectedField ? `${selectedField.nombre} - ${selectedField.cultivo_actual}` : activity.lote_nombre,
      cultivo: selectedField ? selectedField.cultivo_actual : activity.cultivo,
      fecha: date,
      estado: status,
      superficie_ha: selectedField ? selectedField.hectareas : activity.superficie_ha,
      insumo_principal: inputName || undefined,
      dosis: dose || undefined,
      maquinaria: machineryName || undefined,
      operario: operator || undefined,
      costo_estimado: parseFloat(cost) || undefined,
      observaciones: notes || undefined,
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    await deleteActivity(activity.id);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Labor Agrícola"
      subtitle="Modificá los detalles de la labor o eliminá el registro"
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
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Insumo Principal
            </label>
            <input
              type="text"
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
              value={machineryName}
              onChange={(e) => setMachineryName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Operario
            </label>
            <input
              type="text"
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
              value={cost}
              onChange={(e) => setCost(e.target.value)}
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

        <div className="pt-3 flex items-center justify-between gap-2 border-t border-stone-100">
          {isConfirmingDelete ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmingDelete(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirmar
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmingDelete(true)}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              <Trash2 className="w-4 h-4 mr-1 text-rose-600" />
              <span>Eliminar Labor</span>
            </Button>
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export const EditLaborModal = EditActivityModal;
