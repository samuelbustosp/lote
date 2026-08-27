import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary:
      "bg-[#4F8A3F] hover:bg-[#3E7031] text-white font-medium shadow-sm hover:shadow active:scale-[0.99]",
    secondary:
      "bg-[#EBF4E7] hover:bg-[#DDECD7] text-[#3E7031] font-medium active:scale-[0.99]",
    outline:
      "bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 active:scale-[0.99]",
    ghost:
      "bg-transparent hover:bg-stone-100 text-stone-700 hover:text-stone-900",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm active:scale-[0.99]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base rounded-2xl gap-2.5",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
