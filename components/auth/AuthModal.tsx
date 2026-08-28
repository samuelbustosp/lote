"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase/client";
import { Lock, Mail, User, Building, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [establecimientoName, setEstablecimientoName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMsg("Supabase no está configurado. Revisá tus variables en .env.local.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setErrorMsg("Email o contraseña incorrectos. Por favor verificá tus datos.");
          } else {
            setErrorMsg(error.message);
          }
          setLoading(false);
          return;
        }

        if (data.session) {
          onClose();
        }
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || "Productor",
              establecimiento_nombre: establecimientoName || "Mi Campo",
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.user && !data.session) {
          setSuccessMsg(
            "¡Cuenta creada con éxito! Por favor revisá tu casilla de correo para confirmar tu cuenta e iniciar sesión."
          );
        } else if (data.session) {
          // If auto-confirmed
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ocurrió un error inesperado al procesar la autenticación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "login" ? "Iniciar Sesión" : "Crear Cuenta en LOTE"}
      subtitle={
        mode === "login"
          ? "Accedé a tu establecimiento, lotes y telemetría agronómica"
          : "Empezá a gestionar tu campo con inteligencia agronómica"
      }
    >
      <div className="space-y-4">
        {/* Toggle Mode Tabs */}
        <div className="flex bg-stone-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === "login"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === "register"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Registrarse
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <p className="leading-relaxed">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nombre y Apellido
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ej: Gabriel Borgogno"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nombre de tu Establecimiento
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ej: Establecimiento La Posta"
                    value={establecimientoName}
                    onChange={(e) => setEstablecimientoName(e.target.value)}
                    className="w-full bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none"
              />
            </div>
            {mode === "register" && (
              <p className="text-[10px] text-stone-400 mt-1">Mínimo 6 caracteres.</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full justify-center py-3 text-xs sm:text-sm font-bold shadow-xs"
            >
              {loading ? (
                <span>Procesando...</span>
              ) : mode === "login" ? (
                <span>Ingresar al Sistema</span>
              ) : (
                <span>Crear Cuenta Gratis</span>
              )}
            </Button>
          </div>
        </form>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-stone-400">
            {mode === "login" ? "¿No tenés una cuenta? " : "¿Ya tenés una cuenta? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-[#4F8A3F] font-bold hover:underline cursor-pointer"
            >
              {mode === "login" ? "Registrate aquí" : "Iniciá sesión"}
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
