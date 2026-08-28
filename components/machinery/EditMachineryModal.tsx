"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { Machinery } from "@/lib/supabase/types";
import { Trash2 } from "lucide-react";

interface EditMachineryModalProps {
  isOpen: boolean;
  onClose: () => void;
  machinery: Machinery;
}

/**
 * Modal to edit an existing machine or remove it from the fleet.
 */
export function EditMachineryModal({ isOpen, onClose, machinery }: EditMachineryModalProps) {
  const { updateMachinery, deleteMachinery } = useStore();

  const [name, setName] = useState(machinery.nombre);
  const [type, setType] = useState(machinery.tipo);
  const [model, setModel] = useState(machinery.modelo);
  const [status, setStatus] = useState(machinery.estado);
  const [hours, setHours] = useState(machinery.horas_uso.toString());
  const [location, setLocation] = useState(machinery.ubicacion_actual || "");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(machinery.nombre);
    setType(machinery.tipo);
    setModel(machinery.modelo);
    setStatus(machinery.estado);
    setHours(machinery.horas_uso.toString());
    setLocation(machinery.ubicacion_actual || "");
    setIsConfirmingDelete(false);
  }, [machinery, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await updateMachinery(machinery.id, {
      nombre: name,
      tipo: type,
      modelo: model,
      estado: status,
      horas_uso: parseFloat(hours) || 0,
      ubicacion_actual: location,
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    await deleteMachinery(machinery.id);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Maquinaria"
      subtitle="Modificá el estado, horas de uso o eliminá el equipo"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nombre / Identificación
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tipo de Equipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
            >
              <option value="Tractor">Tractor</option>
              <option value="Sembradora">Sembradora</option>
              <option value="Pulverizadora">Pulverizadora</option>
              <option value="Cosechadora">Cosechadora</option>
              <option value="Tolva">Tolva Autodescargable</option>
              <option value="Camión">Camión / Transporte</option>
              <option value="Otro">Otro Implemento</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Marca y Modelo
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Estado Operativo
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
            >
              <option value="Operativa">Operativa</option>
              <option value="En labor">En labor</option>
              <option value="En mantenimiento">En mantenimiento</option>
              <option value="Detenida">Detenida</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Horas de Uso Acumuladas
            </label>
            <input
              type="number"
              step="1"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Ubicación Actual
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
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
              <span>Eliminar Equipo</span>
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
