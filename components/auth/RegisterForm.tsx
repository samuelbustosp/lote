"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Building, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase/client";

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

/**
 * Reusable Register Form component with account setup and feedback.
 */
export function RegisterForm({ onSuccess, redirectTo = "/" }: RegisterFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMessage("Configuración de Supabase no encontrada en las variables de entorno.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || "Productor",
            establecimiento_nombre: farmName || "Mi Campo",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user && !data.session) {
        setSuccessMessage(
          "¡Cuenta creada con éxito! Por favor revisá tu casilla de correo para confirmar tu cuenta e iniciar sesión."
        );
      } else if (data.session) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Ocurrió un error inesperado al procesar el registro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <p className="leading-relaxed">{successMessage}</p>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
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
            className="w-full bg-white pl-10 pr-4 py-3 text-xs sm:text-sm border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none placeholder:text-stone-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
          Nombre de tu Establecimiento / Campo
        </label>
        <div className="relative">
          <Building className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            placeholder="Ej: Establecimiento La Posta"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-3 text-xs sm:text-sm border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none placeholder:text-stone-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
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
            className="w-full bg-white pl-10 pr-4 py-3 text-xs sm:text-sm border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none placeholder:text-stone-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-3 text-xs sm:text-sm border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#4F8A3F] focus:outline-none placeholder:text-stone-400"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full justify-center py-3.5 text-xs sm:text-sm font-bold shadow-md rounded-2xl"
        >
          {isLoading ? (
            <span>Creando cuenta...</span>
          ) : (
            <>
              <span>Registrarme y Comenzar</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </>
          )}
        </Button>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-stone-500">
          ¿Ya tenés una cuenta?{" "}
          <Link href="/login" className="text-[#4F8A3F] font-bold hover:underline">
            Iniciá sesión aquí
          </Link>
        </p>
      </div>
    </form>
  );
}
