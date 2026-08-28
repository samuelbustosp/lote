"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LiaChat } from "@/components/assistant/LiaChat";
import { useStore } from "@/lib/supabase/store";

/**
 * Lia AI Agronomic Assistant conversation page.
 */
export default function AssistantPage() {
  const { farm, selectedSeason } = useStore();

  return (
    <AppShell
      title="Lía — Asistente Agronómica con IA"
      subtitle={`Copiloto de decisiones • ${farm.nombre} • ${selectedSeason.nombre}`}
    >
      <LiaChat />
    </AppShell>
  );
}
