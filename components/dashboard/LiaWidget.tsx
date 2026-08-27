"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  HelpCircle,
  BarChart2,
  Droplets,
  Info,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/supabase/store";
import { LIA_SUGGESTED_PROMPTS } from "@/lib/supabase/mock-data";

export function LiaWidget() {
  const router = useRouter();
  const { sendChatMessage, establecimiento } = useStore();
  const [quickInput, setQuickInput] = useState("");

  const handlePromptClick = async (prompt: string) => {
    await sendChatMessage(prompt);
    router.push("/lia");
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) {
      router.push("/lia");
      return;
    }
    await sendChatMessage(quickInput);
    router.push("/lia");
  };

  const promptIcons = [
    HelpCircle,
    BarChart2,
    Droplets,
    Info,
  ];

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-2 mb-3">
          <div className="flex items-center gap-2">
            <CardTitle>Asistente Lía</CardTitle>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#4F8A3F] text-white tracking-wider">
              BETA
            </span>
          </div>
          <span className="text-[11px] text-stone-400">IA Agro Inteligente</span>
        </CardHeader>

        {/* Greeting Box */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 mb-4">
          <p className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <span>¡Hola {establecimiento.titular.split(" ")[0]}!</span>
            <span>👋</span>
          </p>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Soy Lía, tu asistente inteligente. ¿En qué puedo ayudarte hoy?
          </p>
        </div>

        {/* Quick Question List */}
        <div className="flex flex-col gap-2 mb-4">
          {LIA_SUGGESTED_PROMPTS.slice(0, 4).map((prompt, idx) => {
            const Icon = promptIcons[idx % promptIcons.length];
            return (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="w-full text-left p-2.5 rounded-xl border border-stone-200/90 hover:border-[#4F8A3F]/60 hover:bg-[#EBF4E7]/40 text-stone-700 text-xs font-medium transition-all duration-150 flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#4F8A3F] shrink-0" />
                  <span className="truncate">{prompt}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-stone-300 group-hover:text-[#4F8A3F] shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <form onSubmit={handleCustomSubmit} className="pt-2">
        <Button
          type="submit"
          className="w-full justify-center text-xs py-3 rounded-xl font-semibold shadow-xs"
        >
          <MessageSquare className="w-4 h-4 mr-1.5" />
          <span>Hacer una pregunta</span>
        </Button>
      </form>
    </Card>
  );
}
