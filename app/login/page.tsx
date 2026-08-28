"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "@/components/auth/LoginForm";
import { useStore } from "@/lib/supabase/store";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

/**
 * Dedicated standalone Login Page.
 */
export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex flex-col justify-between selection:bg-[#4F8A3F] selection:text-white px-4 py-8">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>
        <Logo size="sm" showText={false} />
      </div>

      {/* Main Container Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200/80 space-y-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Logo size="md" />
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight pt-2">
              Iniciar Sesión
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Accedé a tu dashboard agronómico, telemetría y consultas con Lía IA.
            </p>
          </div>

          <LoginForm />
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-stone-400 pt-6">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encriptación Segura</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#4F8A3F]" />
            <span>Inteligencia Agronómica</span>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-stone-400">
        © {new Date().getFullYear()} LOTE. Todos los derechos reservados.
      </div>
    </div>
  );
}
