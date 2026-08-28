"use client";

import React from "react";
import Link from "next/link";
import { Field } from "@/lib/supabase/types";
import { formatHectares, getCropColor, getISLColor } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { ArrowRight } from "lucide-react";

interface FieldCardProps {
  field: Field;
}

/**
 * Card component for displaying agricultural field parcel summary.
 */
export function FieldCard({ field }: FieldCardProps) {
  const cropStyle = getCropColor(field.cultivo_actual);
  const islStyle = getISLColor(field.isl_score);

  return (
    <Link href={`/fields/${field.id}`} className="block group">
      <Card className="p-5 border-stone-200/80 hover:border-[#4F8A3F]/50 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cropStyle.fill }}
              />
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {field.cultivo_actual}
              </span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 leading-tight group-hover:text-[#4F8A3F] transition-colors">
              {field.nombre}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {field.variedad_hibrido || "Variedad no especificada"}
            </p>
          </div>

          {/* ISL score badge */}
          <div className="flex flex-col items-end">
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${islStyle.badge}`}>
              ISL {field.isl_score}/100
            </span>
            <span className="text-[10px] text-stone-400 font-medium mt-1">
              {islStyle.label}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
          <div>
            <span className="text-stone-400 font-medium">Superficie</span>
            <p className="font-bold text-stone-800">{formatHectares(field.hectareas)}</p>
          </div>

          <div>
            <span className="text-stone-400 font-medium">Rinde Estimado</span>
            <p className="font-bold text-stone-800">
              {field.rendimiento_estimado ? `${field.rendimiento_estimado} qq/ha` : "--"}
            </p>
          </div>
        </div>

        {/* Card Footer Link */}
        <div className="mt-3 pt-2 flex items-center justify-between text-xs text-[#4F8A3F] font-semibold group-hover:translate-x-0.5 transition-transform">
          <span>Ver prescripción & mapa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </Card>
    </Link>
  );
}

// Backward compatibility alias
export const LoteCard = FieldCard;
