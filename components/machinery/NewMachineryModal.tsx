"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";

interface NewMachineryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal to register a new agricultural machine or tractor.
 */
export function NewMachineryModal({ isOpen, onClose }: NewMachineryModalProps) {
  const { addMachinery } = useStore();

  const [name, setName] = useState("");
  const [type, setType] = useState("Tractor");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState("Operativa");
  const [hours, setHours] = useState("0");
  const [location, setLocation] = useState("Galpón Principal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    await addMachinery({
      nombre: name,
      tipo: type,
      modelo: model,
      estado: status,
      horas_uso: parseFloat(hours) || 0,
      ubicacion_actual: location,
    });

    setIsSubmitting(false);
    setName("");
    setModel("");
    setHours("0");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Incorporar Maquinaria"
      subtitle="Registrá un equipo para telemetría y control de horas de uso"
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
              placeholder="Ej: Tractor John Deere 8R"
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
              placeholder="Ej: John Deere 8370R - Año 2022"
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
              placeholder="Ej: Galpón Central o Lote 4"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Equipo"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
