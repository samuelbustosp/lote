import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  iconOnly?: boolean;
  color?: string;
}

export function LogoIcon({
  className,
  size = "md",
  color = "#4F8A3F",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
}) {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
    xl: "w-16 h-16",
  };

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], "flex-shrink-0 transition-transform duration-200", className)}
    >
      {/* Outer rounded square frame */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="22"
        stroke={color}
        strokeWidth="9"
        fill="none"
      />

      {/* Internal partition grid lines */}
      <line
        x1="10"
        y1="48"
        x2="90"
        y2="48"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />

      <line
        x1="62"
        y1="10"
        x2="62"
        y2="48"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />

      <line
        x1="42"
        y1="48"
        x2="42"
        y2="90"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Crop contour / furrow arcs */}
      <path
        d="M 50 90 A 40 40 0 0 1 90 50"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 62 90 A 28 28 0 0 1 90 62"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 74 90 A 16 16 0 0 1 90 74"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({
  className,
  size = "md",
  showText = true,
  showSubtitle = false,
  iconOnly = false,
}: LogoProps) {
  if (iconOnly) {
    return <LogoIcon size={size} className={className} />;
  }

  const textSizeMap = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <LogoIcon size={size} />
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold text-stone-900 font-sans tracking-wide leading-none",
              textSizeMap[size]
            )}
          >
            LOTE
          </span>
          {showSubtitle && (
            <span className="text-[10px] text-stone-500 font-medium tracking-normal mt-0.5">
              Inteligencia Agronómica
            </span>
          )}
        </div>
      )}
    </div>
  );
}
