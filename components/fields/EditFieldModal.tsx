"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { Field, CropType } from "@/lib/supabase/types";
import { Trash2 } from "lucide-react";

interface EditFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: Field;
  onDeleted?: () => void;
}

/**
 * Modal to edit an existing field's agronomic data or delete it.
 */
export function EditFieldModal({ isOpen, onClose, field, onDeleted }: EditFieldModalProps) {
  const { updateField, deleteField } = useStore();

  const [name, setName] = useState(field.nombre);
  const [number, setNumber] = useState(field.numero);
  const [hectares, setHectares] = useState(field.hectareas.toString());
  const [crop, setCrop] = useState<CropType>(field.cultivo_actual);
  const [hybrid, setHybrid] = useState(field.variedad_hibrido || "");
  const [estimatedYield, setEstimatedYield] = useState(field.rendimiento_estimado?.toString() || "");
  const [historicalYield, setHistoricalYield] = useState(field.rendimiento_historico?.toString() || "");
  const [islScore, setIslScore] = useState(field.isl_score.toString());
  const [phenologicalStage, setPhenologicalStage] = useState(field.estado_fenologico || "");
  const [summary, setSummary] = useState(field.isl_resumen || "");
  const [recommendation, setRecommendation] = useState(field.isl_recomendacion || "");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(field.nombre);
    setNumber(field.numero);
    setHectares(field.hectareas.toString());
    setCrop(field.cultivo_actual);
    setHybrid(field.variedad_hibrido || "");
    setEstimatedYield(field.rendimiento_estimado?.toString() || "");
    setHistoricalYield(field.rendimiento_historico?.toString() || "");
    setIslScore(field.isl_score.toString());
    setPhenologicalStage(field.estado_fenologico || "");
    setSummary(field.isl_resumen || "");
    setRecommendation(field.isl_recomendacion || "");
    setIsConfirmingDelete(false);
  }, [field, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await updateField(field.id, {
      nombre: name,
      numero: Number(number) || 1,
      hectareas: parseFloat(hectares) || 0,
      cultivo_actual: crop,
      variedad_hibrido: hybrid || undefined,
      rendimiento_estimado: parseFloat(estimatedYield) || undefined,
      rendimiento_historico: parseFloat(historicalYield) || undefined,
      isl_score: parseInt(islScore) || 85,
      estado_fenologico: phenologicalStage || undefined,
      isl_resumen: summary || undefined,
      isl_recomendacion: recommendation || undefined,
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    await deleteField(field.id);
    setIsSubmitting(false);
    onClose();
    if (onDeleted) onDeleted();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar ${field.nombre}`}
      subtitle="Modificá las características agronómicas y catastrales del lote"
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
              Estado Fenológico
            </label>
            <input
              type="text"
              placeholder="Ej: R2 (Cuaje)"
              value={phenologicalStage}
              onChange={(e) => setPhenologicalStage(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Rinde Est. (qq/ha)
            </label>
            <input
              type="number"
              step="0.1"
              value={estimatedYield}
              onChange={(e) => setEstimatedYield(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Rinde Hist. (qq/ha)
            </label>
            <input
              type="number"
              step="0.1"
              value={historicalYield}
              onChange={(e) => setHistoricalYield(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Índice ISL (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={islScore}
              onChange={(e) => setIslScore(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Resumen Agronómico / Diagnóstico
          </label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
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
                Confirmar Eliminación
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
              <span>Eliminar Lote</span>
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

export const EditLoteModal = EditFieldModal;
