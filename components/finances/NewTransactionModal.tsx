"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal to register a financial transaction (Expense or Income).
 */
export function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
  const { addTransaction, fields } = useStore();

  const [type, setType] = useState<"Gasto" | "Ingreso">("Gasto");
  const [category, setCategory] = useState<any>("Insumos");
  const [amount, setAmount] = useState("");
  const [fieldId, setFieldId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || isNaN(parsedAmount)) return;

    setIsSubmitting(true);

    await addTransaction({
      tipo: type,
      categoria: category,
      monto: parsedAmount,
      moneda: "USD",
      fecha: date,
      lote_id: fieldId || undefined,
      descripcion: description || undefined,
    });

    setIsSubmitting(false);
    setAmount("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Movimiento Financiero"
      subtitle="Cargá un gasto o ingreso para el cálculo del margen bruto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tipo de Movimiento
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
            >
              <option value="Gasto">Gasto / Costo (-)</option>
              <option value="Ingreso">Ingreso (+)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Rubro / Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
            >
              <option value="Insumos">Insumos (Fertilizantes/Fito)</option>
              <option value="Labores">Labores (Siembra/Cosecha)</option>
              <option value="Semillas">Semillas</option>
              <option value="Flete">Flete y Logística</option>
              <option value="Comercialización">Comercialización</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Monto (USD)
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Lote Imputado (Opcional)
          </label>
          <select
            value={fieldId}
            onChange={(e) => setFieldId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none bg-white"
          >
            <option value="">Gasto General de Establecimiento</option>
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre} ({f.cultivo_actual})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Descripción o Comprobante
          </label>
          <input
            type="text"
            placeholder="Ej: Factura 0001-4492 Fertilizante SolMix"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Registrar Movimiento"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
