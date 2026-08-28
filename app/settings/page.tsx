"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Building,
  User,
  Shield,
  Save,
  CheckCircle2,
  LogIn,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Farm Settings, Account Management and Database Configuration page.
 */
export default function SettingsPage() {
  const {
    user,
    isAuthenticated,
    openAuthModal,
    signOut,
    farm,
    updateFarm,
  } = useStore();

  const [nombre, setNombre] = useState(farm.nombre);
  const [titular, setTitular] = useState(farm.titular);
  const [ubicacion, setUbicacion] = useState(farm.ubicacion);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNombre(farm.nombre);
    setTitular(farm.titular);
    setUbicacion(farm.ubicacion);
  }, [farm]);

  const handleSaveFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateFarm({
      nombre,
      titular,
      ubicacion,
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppShell
      title="Ajustes y Configuración"
      subtitle="Datos del establecimiento, cuenta y conexión"
    >
      <div className="space-y-6 max-w-4xl">
        {/* User Account Card */}
        <Card className="p-6 border-stone-200/80">
          <CardHeader className="pb-3 mb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#4F8A3F]" />
              <CardTitle>Cuenta de Usuario</CardTitle>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                isAuthenticated
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-stone-100 text-stone-600 border border-stone-200"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? "Sesión Activa" : "Sin Iniciar Sesión"}</span>
            </span>
          </CardHeader>

          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 font-medium block mb-1">Email</span>
                  <p className="text-sm font-bold text-stone-900 break-all">{user?.email}</p>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block mb-1">ID de Usuario (Auth)</span>
                  <p className="text-xs font-mono text-stone-600 truncate">{user?.id}</p>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100">
                <p className="text-xs text-stone-500">
                  Tus datos agronómicos y financieros están aislados y protegidos por RLS.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="text-rose-600 hover:bg-rose-50 border-rose-200 self-start sm:self-auto"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  <span>Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Iniciá sesión o creá tu cuenta gratuita para sincronizar y proteger todos los datos de tu campo en tiempo real.
              </p>
              <Button onClick={openAuthModal} size="sm">
                <LogIn className="w-4 h-4 mr-1.5" />
                <span>Iniciar Sesión / Registrarse</span>
              </Button>
            </div>
          )}
        </Card>

        {/* Farm Profile Card */}
        <Card className="p-6 border-stone-200/80">
          <CardHeader className="pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-[#4F8A3F]" />
              <CardTitle>Datos del Establecimiento</CardTitle>
            </div>
          </CardHeader>

          <form onSubmit={handleSaveFarm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-stone-700 font-semibold block mb-1">
                  Nombre del Campo / Establecimiento
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">
                  Titular / Administrador
                </label>
                <input
                  type="text"
                  required
                  value={titular}
                  onChange={(e) => setTitular(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">
                  Ubicación Geográfica
                </label>
                <input
                  type="text"
                  required
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">
                  Superficie Total (Calculada según Lotes)
                </label>
                <p className="text-sm font-bold text-stone-900 pt-2">
                  {farm.superficie_total} ha
                </p>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100">
              {savedSuccess ? (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Establecimiento actualizado con éxito</span>
                </span>
              ) : (
                <span className="text-xs text-stone-400">
                  Los cambios se guardan automáticamente en tu base de datos.
                </span>
              )}

              <Button type="submit" size="sm" disabled={isSaving} className="self-end sm:self-auto">
                <Save className="w-4 h-4 mr-1.5" />
                <span>{isSaving ? "Guardando..." : "Guardar Cambios"}</span>
              </Button>
            </div>
          </form>
        </Card>

        {/* Supabase Technical Info */}
        <Card className="p-6 border-stone-200/80">
          <CardHeader className="pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#4F8A3F]" />
              <CardTitle>Base de Datos PostgreSQL (Supabase)</CardTitle>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? "Conectado con Supabase" : "Modo Local"}</span>
            </span>
          </CardHeader>

          <p className="text-xs text-stone-600 leading-relaxed mb-3">
            El archivo <code className="font-mono font-bold text-stone-800">lib/supabase/schema.sql</code>{" "}
            define la estructura de tablas multiusuario con Row Level Security (RLS) para proteger los datos de cada productor.
          </p>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#4F8A3F] shrink-0 mt-0.5" />
            <p>
              Tus lotes, labores, maquinaria y balances económicos están encriptados y vinculados únicamente a tu usuario autenticado.
            </p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
