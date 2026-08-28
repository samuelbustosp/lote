"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Bot,
  TrendingUp,
  CloudRain,
  Tractor,
  Lock,
  ChevronRight,
  Activity,
  Sliders,
  CheckCircle2,
  BarChart2,
  MapPin,
  Cpu,
  FileText,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

/**
 * High-impact, scroll-animated Landing Page with interactive simulations and glassmorphism.
 */
export function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Interactive Layer Switcher State in Hero Mockup
  const [activeHeroTab, setActiveHeroTab] = useState<"satelital" | "lia" | "finanzas">("satelital");

  // Interactive Agronomic Simulation State
  const [seedDensity, setSeedDensity] = useState(78000); // seeds/ha
  const [fertDose, setFertDose] = useState(220); // kg/ha
  const [rainMm, setRainMm] = useState(540); // mm

  // Interactive Lía Assistant Prompt Demo State
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [isSimulatingTyping, setIsSimulatingTyping] = useState(false);

  // Track scroll position for parallax and progress animations
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (currentScrollY / totalHeight) * 100 : 0;

      setScrollY(currentScrollY);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate dynamic agronomic outputs for the interactive simulation
  const calcYield = Math.min(
    140,
    Math.max(
      45,
      Math.round((seedDensity / 1000) * 0.95 + fertDose * 0.16 + (rainMm - 300) * 0.12)
    )
  );
  const calcISL = Math.min(99, Math.max(50, Math.round(70 + (calcYield - 80) * 0.45)));
  const calcGrossMarginPerHa = Math.round(calcYield * 18 - (fertDose * 0.75 + (seedDensity / 1000) * 2.8 + 180));

  const liaDemoPrompts = [
    {
      question: "¿Por qué el Lote 4 rindió 17% menos en la última campaña?",
      answer:
        "El análisis satelital ISL detectó un déficit hídrico crítico de -58 mm en el período de floración (R1-R2), sumado a una densidad de siembra excesiva para ese ambiente. Se recomienda reducir la densidad a 72.000 sem/ha y aplicar fertilización variable con SolMix.",
    },
    {
      question: "¿Cuál es la dosis óptima de fertilización nitrogenada para Maíz?",
      answer:
        "Basado en el análisis de suelo y el rendimiento objetivo de 110 qq/ha para el Lote 2, la prescripción óptima es de 220 kg/ha de SolMix fraccionado: 60% a la siembra y 40% en V6.",
    },
    {
      question: "¿Cómo impactaron las últimas lluvias de 45 mm en el balance de margen?",
      answer:
        "Las precipitaciones recargaron el perfil en 38 mm útiles, incrementando el potencial de rinde en +6.5 qq/ha en soja de primera, lo que representa una mejora proyectada de +USD 92/ha en el margen bruto.",
    },
  ];

  const handleSelectPrompt = (index: number) => {
    if (activePromptIndex === index) return;
    setIsSimulatingTyping(true);
    setActivePromptIndex(index);
    setTimeout(() => {
      setIsSimulatingTyping(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-stone-900 flex flex-col selection:bg-[#4F8A3F] selection:text-white relative overflow-hidden">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[#4F8A3F] via-emerald-500 to-[#B6D88A] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Scroll-Reactive Parallax Mesh Orbs */}
      <div
        className="fixed top-20 left-[-10%] w-[500px] h-[500px] rounded-full bg-[#4F8A3F]/12 blur-3xl pointer-events-none -z-10 transition-transform duration-700 ease-out"
        style={{
          transform: `translateY(${scrollY * 0.25}px) scale(${1 + scrollY * 0.0003})`,
        }}
      />
      <div
        className="fixed top-1/3 right-[-12%] w-[600px] h-[600px] rounded-full bg-emerald-400/10 blur-3xl pointer-events-none -z-10 transition-transform duration-700 ease-out"
        style={{
          transform: `translateY(${-scrollY * 0.18}px)`,
        }}
      />
      <div
        className="fixed bottom-10 left-1/4 w-[450px] h-[450px] rounded-full bg-[#B6D88A]/15 blur-3xl pointer-events-none -z-10 transition-transform duration-700 ease-out"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Top Glass Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-stone-200/60 px-6 sm:px-12 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" />

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold text-stone-700 hover:text-stone-900 px-3.5 py-2 rounded-xl hover:bg-stone-100/60 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="rounded-2xl font-bold px-4 sm:px-5 py-2.5 text-xs sm:text-sm shadow-sm hover:shadow-md transition-all"
              >
                <span>Crear Cuenta</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#B6D88A]/80 shadow-xs text-[#3E7031] text-xs font-bold animate-in fade-in slide-in-from-top-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-[#4F8A3F]" />
            <span>Inteligencia Agronómica de Precisión</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A3F]"></span>
            <span className="text-stone-500 font-medium">Dashboard 100% Privado</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-stone-900 leading-[1.1]">
            Entender el campo <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D5324] via-[#4F8A3F] to-emerald-600">
              nunca fue tan simple
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Monitoreo satelital de parcelas, órdenes de labor, control de márgenes brutos y <strong>Lía</strong>, tu copiloto con inteligencia artificial aplicada a tus datos reales.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold shadow-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Comenzar Ahora — Es Gratis</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-7 py-4 text-sm font-bold text-stone-700 bg-white/80 backdrop-blur-md border border-stone-200/90 rounded-2xl hover:bg-stone-50 shadow-xs transition-all cursor-pointer">
                <span>Acceder al Panel Privado</span>
              </button>
            </Link>
          </div>

          {/* Security reassurance */}
          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-stone-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#4F8A3F]" />
              <span>Aislamiento estricto por usuario (RLS)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sin límite de parcelas</span>
            </div>
          </div>
        </div>

        {/* Interactive Dashboard Showcase (Hero Mockup with Layered Glassmorphism) */}
        <div
          className="max-w-6xl mx-auto mt-12 sm:mt-16 transition-all duration-500"
          style={{
            transform: `perspective(1000px) rotateX(${Math.max(0, 8 - scrollY * 0.02)}deg)`,
          }}
        >
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(45,83,36,0.12)] border border-white/80 relative overflow-hidden">
            {/* Header Mockup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-stone-200/60 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-xs font-mono font-semibold text-stone-400">app.lote.agro / dashboard</span>
              </div>

              {/* Interactive Showcase Tabs */}
              <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl">
                <button
                  onClick={() => setActiveHeroTab("satelital")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeHeroTab === "satelital"
                      ? "bg-white text-[#3E7031] shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Visor Satelital
                </button>
                <button
                  onClick={() => setActiveHeroTab("lia")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeHeroTab === "lia"
                      ? "bg-white text-[#3E7031] shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Diagnóstico Lía IA
                </button>
                <button
                  onClick={() => setActiveHeroTab("finanzas")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeHeroTab === "finanzas"
                      ? "bg-white text-[#3E7031] shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Márgenes en Vivo
                </button>
              </div>
            </div>

            {/* Dynamic Interactive Tab Content */}
            {activeHeroTab === "satelital" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch animate-in fade-in duration-300">
                {/* Left metrics */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/70 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 font-semibold uppercase">Superficie Activa</span>
                      <p className="text-xl font-bold text-stone-900">1.125 ha</p>
                      <p className="text-[11px] text-[#4F8A3F] font-semibold">18 parcelas georreferenciadas</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#4F8A3F] text-white">
                      <Layers className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/70 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 font-semibold uppercase">Índice ISL Promedio</span>
                      <p className="text-xl font-bold text-stone-900">88 / 100</p>
                      <p className="text-[11px] text-emerald-700 font-semibold">Condición hídrica óptima</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-[#EBF4E7]/80 p-4 rounded-2xl border border-[#B6D88A]/60">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-[#4F8A3F]" />
                      <span className="text-xs font-bold text-[#3E7031]">Prescripción Variable</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      Lote 4: prescripción de siembra generada con densidad media de 78.000 sem/ha y fertilización SolMix a 220 kg/ha.
                    </p>
                  </div>
                </div>

                {/* Center SVG satellite map */}
                <div className="lg:col-span-5 bg-[#172718] rounded-2xl p-4 flex flex-col justify-between min-h-[260px] relative overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between z-10">
                    <span className="text-xs font-bold text-white">Capas Satelitales NDVI & Dosis</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                      Resolución 10m
                    </span>
                  </div>

                  <div className="flex items-center justify-center my-4">
                    <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-2xl">
                      <polygon points="38,15 48,15 48,35 38,35" fill="rgba(79,138,63,0.9)" stroke="#fff" strokeWidth="1" />
                      <polygon points="49,12 58,12 58,32 49,32" fill="rgba(16,185,129,0.9)" stroke="#fff" strokeWidth="1" />
                      <polygon points="48,33 62,33 60,48 48,48" fill="rgba(79,138,63,0.9)" stroke="#fff" strokeWidth="1" />
                      <polygon points="28,46 42,46 40,64 26,64" fill="rgba(234,179,8,0.9)" stroke="#fff" strokeWidth="1" />
                      <polygon points="42,49 56,49 54,66 40,66" fill="rgba(79,138,63,0.9)" stroke="#fff" strokeWidth="1" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-300 z-10">
                    <span>Lote 4: Maíz Tardío</span>
                    <span className="text-emerald-400 font-bold">Rinde: 104 qq/ha</span>
                  </div>
                </div>

                {/* Right telemetries */}
                <div className="lg:col-span-3 bg-white/90 p-4 rounded-2xl border border-stone-200/70 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-900 block pb-2 border-b border-stone-100 mb-2">
                      Labores a Campo
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                        <p className="font-bold text-stone-900">Siembra Maíz • Lote 4</p>
                        <p className="text-[11px] text-emerald-700 font-semibold">JD DB60 • 78.000 sem/ha</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                        <p className="font-bold text-stone-900">Fertilización • Lote 8</p>
                        <p className="text-[11px] text-sky-700 font-semibold">SolMix • 220 kg/ha</p>
                      </div>
                    </div>
                  </div>

                  <Link href="/register" className="mt-3 block">
                    <Button size="sm" className="w-full justify-center text-xs font-bold">
                      Cargar Mis Parcelas
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {activeHeroTab === "lia" && (
              <div className="bg-[#F7F8F5]/80 p-6 rounded-2xl border border-stone-200/80 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#4F8A3F] text-white flex items-center justify-center shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Lía — Copiloto Agronómico</h4>
                    <p className="text-xs text-stone-500">Respuesta procesada en 340ms</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2 text-xs sm:text-sm text-stone-800 leading-relaxed">
                  <p className="font-bold text-[#3E7031]">
                    Diagnóstico Lote 4 (Maíz - 90 ha):
                  </p>
                  <p>
                    Se detectó una reducción del 17% en el rendimiento proyectado debido a un déficit de precipitaciones de -58 mm en el período crítico de floración.
                  </p>
                  <p className="font-semibold text-stone-900">
                    Recomendación de manejo: Rotar a soja de primera con fertilización fosforada base de 120 kg/ha de MAP y monitoreo semanal de malezas resistentes.
                  </p>
                </div>
              </div>
            )}

            {activeHeroTab === "finanzas" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-300">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs text-stone-400 font-semibold">Ingresos Proyectados</span>
                  <p className="text-2xl font-bold text-stone-900 mt-1">USD 324.580</p>
                  <p className="text-xs text-emerald-700 font-medium mt-1">Cosecha + Contratos</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs text-stone-400 font-semibold">Gastos Totales</span>
                  <p className="text-2xl font-bold text-stone-900 mt-1">USD 142.300</p>
                  <p className="text-xs text-stone-500 font-medium mt-1">Insumos y labores</p>
                </div>
                <div className="bg-[#EBF4E7] p-5 rounded-2xl border border-[#B6D88A]/60">
                  <span className="text-xs text-[#3E7031] font-semibold">Margen Bruto Total</span>
                  <p className="text-2xl font-bold text-[#3E7031] mt-1">USD 182.280</p>
                  <p className="text-xs text-[#3E7031] font-bold mt-1">USD 288 / ha</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Agronomic Lab Simulator Section */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 bg-white/70 backdrop-blur-xl border-y border-stone-200/80 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4E7] text-[#3E7031] text-xs font-bold">
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulador Interactivo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Laboratorio de Decisiones Agronómicas
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Mové los controles en vivo para comprobar cómo el modelo de Lote ajusta el rinde esperado, el índice de salud ISL y el margen bruto por hectárea.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Sliders */}
            <div className="lg:col-span-6 bg-[#F7F8F5]/90 p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6 shadow-xs">
              {/* Slider 1: Seed Density */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-stone-800">Densidad de Siembra</span>
                  <span className="font-bold text-[#3E7031] font-mono">
                    {seedDensity.toLocaleString()} sem/ha
                  </span>
                </div>
                <input
                  type="range"
                  min="55000"
                  max="95000"
                  step="1000"
                  value={seedDensity}
                  onChange={(e) => setSeedDensity(Number(e.target.value))}
                  className="w-full accent-[#4F8A3F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                  <span>55.000 (Baja)</span>
                  <span>78.000 (Óptima)</span>
                  <span>95.000 (Alta)</span>
                </div>
              </div>

              {/* Slider 2: Fertilization Dose */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-stone-800">Dosis de Fertilización Nitrogenada</span>
                  <span className="font-bold text-[#3E7031] font-mono">{fertDose} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="350"
                  step="10"
                  value={fertDose}
                  onChange={(e) => setFertDose(Number(e.target.value))}
                  className="w-full accent-[#4F8A3F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                  <span>100 kg/ha</span>
                  <span>220 kg/ha</span>
                  <span>350 kg/ha</span>
                </div>
              </div>

              {/* Slider 3: Rainfall Cycle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-stone-800">Precipitaciones del Ciclo</span>
                  <span className="font-bold text-sky-700 font-mono">{rainMm} mm</span>
                </div>
                <input
                  type="range"
                  min="320"
                  max="750"
                  step="10"
                  value={rainMm}
                  onChange={(e) => setRainMm(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                  <span>320 mm (Déficit)</span>
                  <span>540 mm (Normal)</span>
                  <span>750 mm (Excelente)</span>
                </div>
              </div>
            </div>

            {/* Dynamic Results Display */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-md flex flex-col justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase">Rinde Estimado</span>
                <div className="my-3">
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight font-mono">
                    {calcYield}
                  </span>
                  <span className="text-sm font-medium text-stone-500 ml-1.5">qq/ha</span>
                </div>
                <span className="text-xs text-emerald-700 font-bold">
                  {calcYield > 95 ? "Potencial Alto" : "Potencial Medio"}
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-md flex flex-col justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase">Índice ISL</span>
                <div className="my-3">
                  <span className="text-4xl font-extrabold text-[#3E7031] tracking-tight font-mono">
                    {calcISL}
                  </span>
                  <span className="text-sm font-medium text-stone-500 ml-1.5">/ 100</span>
                </div>
                <span className="text-xs text-emerald-700 font-bold">
                  {calcISL >= 85 ? "Condición Favorable" : "Condición Regular"}
                </span>
              </div>

              <div className="sm:col-span-2 bg-[#EBF4E7] p-6 rounded-3xl border border-[#B6D88A]/70 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#3E7031] uppercase tracking-wider">
                    Margen Bruto Calculado
                  </span>
                  <div className="my-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#3E7031] font-mono">
                      USD {calcGrossMarginPerHa.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#3E7031] font-medium ml-1">/ ha</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Rentabilidad calculada en base a costos de insumos y rinde esperado.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#4F8A3F] text-white shadow-xs hidden sm:block">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Lía AI Showcase */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 bg-[#F7F8F5] relative">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-[#3E7031] text-xs font-bold">
              <Bot className="w-3.5 h-3.5" />
              <span>Inteligencia Agronómica Conversacional</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Preguntale a Lía sobre tu campo
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Lía analiza el histórico de tus parcelas, órdenes de labor e índices satelitales para responderte con fundamentos técnicos precisos.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">
            {/* Prompt Selector Pills */}
            <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200/80 flex flex-wrap gap-2">
              {liaDemoPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPrompt(idx)}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer text-left ${
                    activePromptIndex === idx
                      ? "bg-[#4F8A3F] text-white shadow-xs"
                      : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {item.question}
                </button>
              ))}
            </div>

            {/* Answer Display */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4F8A3F] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-bold text-stone-900">Diagnóstico de Lía</span>

                  {isSimulatingTyping ? (
                    <div className="flex items-center gap-2 text-xs text-stone-500 py-2">
                      <span>Procesando capas satelitales y datos climáticos...</span>
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A3F] animate-bounce"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A3F] animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A3F] animate-bounce [animation-delay:0.4s]"></span>
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-[#F7F8F5] p-4 rounded-2xl border border-stone-200/70 animate-in fade-in">
                      {liaDemoPrompts[activePromptIndex].answer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Matrix */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 bg-white border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold text-[#4F8A3F] tracking-widest">
              Funcionalidades de Precisión
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Control integral en cada etapa del cultivo
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Herramientas modulares pensadas para ingenieros agrónomos, administradores y contratistas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#F7F8F5]/80 border border-stone-200/80 hover:border-[#4F8A3F]/60 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4E7] text-[#3E7031] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Lía IA Copiloto</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Consultá en lenguaje natural causas de mermas, recomendaciones de híbridos y densidades óptimas según tu histórico.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F8F5]/80 border border-stone-200/80 hover:border-[#4F8A3F]/60 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4E7] text-[#3E7031] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Visor Geoespacial & ISL</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Monitoreo satelital del Índice de Salud del Lote (ISL), estados fenológicos y prescripciones de dosis de siembra variable.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F8F5]/80 border border-stone-200/80 hover:border-[#4F8A3F]/60 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4E7] text-[#3E7031] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Tractor className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Órdenes de Labor & Parque</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Asigná tareas a contratistas, controlá insumos aplicados y registrá horas de labor de cada máquina de tu parque.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F8F5]/80 border border-stone-200/80 hover:border-[#4F8A3F]/60 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4E7] text-[#3E7031] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Márgenes Brutos en Vivo</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Seguimiento minucioso de costos por insumos, fletes y labores para conocer la rentabilidad neta por hectárea.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F8F5]/80 border border-stone-200/80 hover:border-[#4F8A3F]/60 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4E7] text-[#3E7031] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CloudRain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Registro Pluviométrico</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Acumulado de precipitaciones por campaña, balance hídrico por parcela y pronósticos climáticos extendidos.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F8F5]/80 border border-stone-200/80 hover:border-[#4F8A3F]/60 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4E7] text-[#3E7031] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Seguridad & RLS</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tus datos pertenecen únicamente a tu usuario autenticado con aislamiento de base de datos Row Level Security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-6 sm:px-12 bg-gradient-to-br from-[#2D5324] via-[#1E3B17] to-[#142610] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Empezá a tomar decisiones agronómicas basadas en datos
          </h2>
          <p className="text-sm sm:text-base text-stone-200 max-w-xl mx-auto leading-relaxed">
            Creá tu cuenta gratuita en 1 minuto y accedé al panel privado de tu establecimiento.
          </p>

          <div className="pt-3">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-[#2D5324] hover:bg-stone-100 font-extrabold px-8 py-4 text-sm sm:text-base rounded-2xl shadow-2xl hover:scale-105 transition-transform"
              >
                <span>Crear Cuenta Gratuita</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F1C0D] text-stone-400 py-8 px-6 sm:px-12 text-xs border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p>© {new Date().getFullYear()} Lote. Plataforma de Inteligencia Agronómica. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
