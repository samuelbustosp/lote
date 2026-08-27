"use client";

import React, { useState } from "react";
import {
  Database,
  Key,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  User,
  Building,
  Shield,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function AjustesPage() {
  const { establecimiento, isMock, resetToDefaults } = useStore();
  const [isResetConfirmed, setIsResetConfirmed] = useState(false);

  return (
    <AppShell
      title="Ajustes y Configuración"
      subtitle="Parámetros del sistema, conexión con Supabase y perfil"
    >
      <div className="space-y-6 max-w-4xl">
        {/* Supabase Connection Status Card */}
        <Card className="p-6 border-stone-200/80">
          <CardHeader className="pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#4F8A3F]" />
              <CardTitle>Conexión con Supabase (Base de Datos)</CardTitle>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                isSupabaseConfigured
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {isSupabaseConfigured ? "🟢 Supabase Conectado" : "🟡 Modo Mock Activo"}
            </span>
          </CardHeader>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
            La aplicación funciona actualmente en <strong>Modo Mock</strong> con datos
            completos de prueba y almacenamiento local reactivo. Para conectar tu proyecto real de
            Supabase, simplemente agregá las siguientes variables en tu archivo{" "}
            <code className="px-1.5 py-0.5 rounded bg-stone-100 font-mono text-xs text-stone-800">
              .env.local
            </code>
            :
          </p>

          <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl font-mono text-xs space-y-1.5 overflow-x-auto select-all mb-4">
            <p className="text-stone-400"># Configuración de Supabase</p>
            <p>NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui</p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#4F8A3F] shrink-0 mt-0.5" />
            <p>
              El archivo <code className="font-mono text-[11px] font-bold">lib/supabase/schema.sql</code>{" "}
              contiene todas las tablas, índices y políticas RLS listas para ejecutar en el SQL Editor de
              Supabase.
            </p>
          </div>
        </Card>

        {/* Establishment Profile Card */}
        <Card className="p-6 border-stone-200/80">
          <CardHeader className="pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-stone-600" />
              <CardTitle>Datos del Establecimiento</CardTitle>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-stone-400 font-medium block mb-1">Nombre</label>
              <p className="text-sm font-bold text-stone-900">{establecimiento.nombre}</p>
            </div>
            <div>
              <label className="text-stone-400 font-medium block mb-1">Titular / Administrador</label>
              <p className="text-sm font-bold text-stone-900">{establecimiento.titular}</p>
            </div>
            <div>
              <label className="text-stone-400 font-medium block mb-1">Ubicación</label>
              <p className="text-sm font-bold text-stone-900">{establecimiento.ubicacion}</p>
            </div>
            <div>
              <label className="text-stone-400 font-medium block mb-1">Superficie Total</label>
              <p className="text-sm font-bold text-stone-900">{establecimiento.superficie_total} ha</p>
            </div>
          </div>
        </Card>

        {/* Reset State Card */}
        <Card className="p-6 border-stone-200/80">
          <CardHeader className="pb-3 mb-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-stone-600" />
              <CardTitle>Reiniciar Datos Mock</CardTitle>
            </div>
          </CardHeader>

          <p className="text-xs text-stone-600 mb-4">
            Si querés restaurar los 18 lotes, labores y datos financieros originales del mock, podés
            reiniciar el estado local.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetToDefaults();
              setIsResetConfirmed(true);
              setTimeout(() => setIsResetConfirmed(false), 3000);
            }}
          >
            {isResetConfirmed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                <span>Datos restaurados</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-1.5" />
                <span>Restaurar datos predeterminados</span>
              </>
            )}
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
