"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, Layers } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LoteCard } from "@/components/lotes/LoteCard";
import { NewLoteModal } from "@/components/lotes/NewLoteModal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { formatHectares } from "@/lib/utils";

export default function LotesPage() {
  const { lotes } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("Todos");
  const [isNewLoteOpen, setIsNewLoteOpen] = useState(false);

  const cropFilters = ["Todos", "Maíz", "Soja", "Trigo", "Otros"];

  const filteredLotes = lotes.filter((lote) => {
    const matchesSearch =
      lote.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lote.cultivo_actual.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lote.variedad_hibrido &&
        lote.variedad_hibrido.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCrop =
      selectedCrop === "Todos"
        ? true
        : selectedCrop === "Otros"
        ? !["Maíz", "Soja", "Trigo"].includes(lote.cultivo_actual)
        : lote.cultivo_actual.toLowerCase() === selectedCrop.toLowerCase();

    return matchesSearch && matchesCrop;
  });

  const totalHaFiltered = filteredLotes.reduce((acc, l) => acc + l.hectareas, 0);

  return (
    <AppShell title="Lotes del Establecimiento" subtitle="Gestión catastral y agronómica de parcelas">
      <div className="space-y-6">
        {/* Header Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
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

          {/* New Lote Action Button */}
          <Button onClick={() => setIsNewLoteOpen(true)} className="shrink-0">
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
            {filteredLotes.length} lotes ({formatHectares(totalHaFiltered)})
          </span>
        </div>

        {/* Lotes Grid */}
        {filteredLotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLotes.map((lote) => (
              <LoteCard key={lote.id} lote={lote} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto">
            <Layers className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-stone-800">No se encontraron lotes</h3>
            <p className="text-xs text-stone-500 mt-1">
              Probá ajustando los términos de búsqueda o el filtro de cultivo.
            </p>
          </div>
        )}

        {/* Floating Action Button for Mobile */}
        <button
          onClick={() => setIsNewLoteOpen(true)}
          className="sm:hidden fixed right-5 bottom-20 z-30 w-14 h-14 rounded-full bg-[#4F8A3F] text-white shadow-xl flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Modal */}
        <NewLoteModal isOpen={isNewLoteOpen} onClose={() => setIsNewLoteOpen(false)} />
      </div>
    </AppShell>
  );
}
