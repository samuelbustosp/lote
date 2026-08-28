"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase/client";

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

/**
 * Reusable Login Form component with validation and Spanish error feedback.
 */
export function LoginForm({ onSuccess, redirectTo = "/" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMessage("Configuración de Supabase no encontrada en las variables de entorno.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Email o contraseña incorrectos. Por favor verificá tus datos.");
        } else {
          setErrorMessage(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.session) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Ocurrió un error inesperado al intentar ingresar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

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
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-stone-700">
            Contraseña
          </label>
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            placeholder="••••••••"
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
            <span>Ingresando...</span>
          ) : (
            <>
              <span>Ingresar al Sistema</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </>
          )}
        </Button>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-stone-500">
          ¿No tenés una cuenta?{" "}
          <Link href="/register" className="text-[#4F8A3F] font-bold hover:underline">
            Creá tu cuenta aquí
          </Link>
        </p>
      </div>
    </form>
  );
}
