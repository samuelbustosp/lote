"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LiaChat } from "@/components/chat/LiaChat";

export default function LiaPage() {
  return (
    <AppShell
      title="Asistente Inteligente Lía"
      subtitle="Consultas agronómicas, análisis de rinde y memoria histórica de lotes"
    >
      <LiaChat />
    </AppShell>
  );
}
