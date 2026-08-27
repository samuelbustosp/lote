"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { TipoLabor, EstadoLabor } from "@/lib/supabase/types";

interface NewLaborModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLoteId?: string;
}

export function NewLaborModal({ isOpen, onClose, defaultLoteId }: NewLaborModalProps) {
  const { addLabor, lotes, maquinarias } = useStore();

  const [tipo, setTipo] = useState<TipoLabor>("Fertilización");
  const [loteId, setLoteId] = useState(defaultLoteId || lotes[0]?.id || "");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [insumo, setInsumo] = useState("");
  const [dosis, setDosis] = useState("");
  const [maquinaria, setMaquinaria] = useState(maquinarias[0]?.nombre || "");
  const [operario, setOperario] = useState("Carlos Benítez");
  const [costo, setCosto] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [estado, setEstado] = useState<EstadoLabor>("Pendiente");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedLote = lotes.find((l) => l.id === loteId) || lotes[0];

    addLabor({
      tipo,
      lote_id: selectedLote.id,
      lote_nombre: `${selectedLote.nombre} - ${selectedLote.cultivo_actual}`,
      cultivo: selectedLote.cultivo_actual,
      fecha,
      estado,
      superficie_ha: selectedLote.hectareas,
      insumo_principal: insumo || undefined,
      dosis: dosis || undefined,
      maquinaria: maquinaria || undefined,
      operario: operario || undefined,
      costo_estimado: parseFloat(costo) || undefined,
      observaciones: observaciones || undefined,
    });

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
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoLabor)}
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
              value={loteId}
              onChange={(e) => setLoteId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
            >
              {lotes.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre} ({l.cultivo_actual} - {l.hectareas} ha)
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
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Estado
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoLabor)}
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
              value={insumo}
              onChange={(e) => setInsumo(e.target.value)}
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
              value={dosis}
              onChange={(e) => setDosis(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Maquinaria
            </label>
            <input
              type="text"
              placeholder="Ej: Fertilizadora Metalfor / JD DB60"
              value={maquinaria}
              onChange={(e) => setMaquinaria(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Operario / Contratista
            </label>
            <input
              type="text"
              placeholder="Ej: Roberto Giménez"
              value={operario}
              onChange={(e) => setOperario(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Observaciones y condiciones meteorológicas
          </label>
          <textarea
            rows={2}
            placeholder="Ej: Aplicación con viento menor a 8 km/h y buena humedad de suelo."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Guardar Labor</Button>
        </div>
      </form>
    </Modal>
  );
}
