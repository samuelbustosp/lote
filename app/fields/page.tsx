"use client";

import React, { useState } from "react";
import { Plus, Search, Layers } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FieldCard } from "@/components/fields/FieldCard";
import { NewFieldModal } from "@/components/fields/NewFieldModal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { formatHectares } from "@/lib/utils";

/**
 * Fields management page listing all registered parcels with crop filtering and search.
 */
export default function FieldsPage() {
  const { fields } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("Todos");
  const [isNewFieldOpen, setIsNewFieldOpen] = useState(false);

  const cropFilters = ["Todos", "Maíz", "Soja", "Trigo", "Otros"];

  const filteredFields = fields.filter((field) => {
    const matchesSearch =
      field.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.cultivo_actual.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (field.variedad_hibrido &&
        field.variedad_hibrido.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCrop =
      selectedCrop === "Todos"
        ? true
        : selectedCrop === "Otros"
        ? !["Maíz", "Soja", "Trigo"].includes(field.cultivo_actual)
        : field.cultivo_actual.toLowerCase() === selectedCrop.toLowerCase();

    return matchesSearch && matchesCrop;
  });

  const totalHaFiltered = filteredFields.reduce((acc, f) => acc + f.hectareas, 0);

  return (
    <AppShell title="Lotes del Establecimiento" subtitle="Gestión catastral y agronómica de parcelas">
      <div className="space-y-6">
        {/* Header Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar lote por nombre o híbrido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-stone-200/90 rounded-2xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none placeholder:text-stone-400"
            />
          </div>

          <Button onClick={() => setIsNewFieldOpen(true)} className="shrink-0">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Nuevo Lote</span>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {cropFilters.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCrop === crop
                  ? "bg-[#4F8A3F] text-white shadow-xs"
                  : "bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {crop}
            </button>
          ))}
          <span className="text-xs text-stone-400 font-medium ml-auto hidden sm:inline">
            {filteredFields.length} lotes ({formatHectares(totalHaFiltered)})
          </span>
        </div>

        {/* Fields Grid */}
        {filteredFields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFields.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-3">
            <Layers className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-800">No se encontraron lotes</h3>
            <p className="text-xs text-stone-500">
              Probá ajustando los términos de búsqueda o incorporá tu primer lote.
            </p>
            <Button onClick={() => setIsNewFieldOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              <span>Incorporar Lote</span>
            </Button>
          </div>
        )}

        {/* Floating Action Button for Mobile */}
        <button
          onClick={() => setIsNewFieldOpen(true)}
          className="sm:hidden fixed right-5 bottom-20 z-30 w-14 h-14 rounded-full bg-[#4F8A3F] text-white shadow-xl flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Modal */}
        <NewFieldModal isOpen={isNewFieldOpen} onClose={() => setIsNewFieldOpen(false)} />
      </div>
    </AppShell>
  );
}
