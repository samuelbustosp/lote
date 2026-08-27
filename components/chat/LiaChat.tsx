"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  BarChart3,
  Layers,
  FileDown,
  RefreshCw,
} from "lucide-react";
import { useStore } from "@/lib/supabase/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LIA_SUGGESTED_PROMPTS } from "@/lib/supabase/mock-data";

export function LiaChat() {
  const { chatMessages, sendChatMessage, lotes, establecimiento } = useStore();
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setInputText("");
    setIsTyping(true);
    await sendChatMessage(text);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] max-w-4xl mx-auto">
      {/* Chat Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4">
        {chatMessages.map((msg) => {
          const isUser = msg.emisor === "usuario";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : "flex-row"
              } animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                  isUser
                    ? "bg-[#3E7031] text-white"
                    : "bg-[#4F8A3F] text-white"
                }`}
              >
                {isUser ? (
                  <span className="text-xs font-bold">GB</span>
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? "bg-[#EBF4E7] text-stone-900 rounded-tr-xs border border-[#B6D88A]/40 font-medium"
                      : "bg-white text-stone-800 rounded-tl-xs border border-stone-200/80 shadow-xs"
                  }`}
                >
                  <div className="whitespace-pre-line space-y-2">
                    {msg.mensaje}
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 px-1 text-[10px] text-stone-400 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                </div>

                {/* Follow-up suggestions */}
                {!isUser && msg.sugerencias && msg.sugerencias.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.sugerencias.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-stone-200 hover:border-[#4F8A3F] hover:bg-[#EBF4E7]/40 text-stone-600 font-medium transition-all shadow-2xs text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 animate-in fade-in">
            <div className="w-8 h-8 rounded-full bg-[#4F8A3F] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-4 bg-white rounded-3xl rounded-tl-xs border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
              <span>Lía está analizando los datos agronómicos...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A3F] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A3F] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A3F] animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested quick prompt chips */}
      <div className="py-2 overflow-x-auto flex items-center gap-2 scrollbar-none">
        {LIA_SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-white border border-stone-200/90 text-stone-600 hover:border-[#4F8A3F] hover:bg-[#EBF4E7]/30 whitespace-nowrap shrink-0 shadow-2xs transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="pt-2 bg-[#F7F8F5]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí tu consulta sobre lotes, rindes o labores..."
            className="w-full bg-white pl-4 pr-12 py-3.5 text-xs sm:text-sm text-stone-900 border border-stone-200/90 rounded-2xl shadow-xs focus:ring-2 focus:ring-[#4F8A3F] focus:border-transparent focus:outline-none placeholder:text-stone-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
            className="absolute right-2 p-2 rounded-xl bg-[#4F8A3F] hover:bg-[#3E7031] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-center text-stone-400 mt-2">
          Lía combina modelos agronómicos con la telemetría histórica de {establecimiento.nombre}.
        </p>
      </div>
    </div>
  );
}
