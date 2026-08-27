import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount).replace("US$", "USD ");
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatHectares(ha: number): string {
  return `${formatNumber(ha, 0)} ha`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getCropColor(crop: string): {
  bg: string;
  text: string;
  border: string;
  fill: string;
  badge: string;
} {
  switch (crop?.toLowerCase()) {
    case "maíz":
    case "maiz":
      return {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-400",
        fill: "#EAB308",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "soja":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-400",
        fill: "#10B981",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "trigo":
      return {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-400",
        fill: "#F97316",
        badge: "bg-orange-50 text-orange-700 border-orange-200",
      };
    case "girasol":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-400",
        fill: "#EAB308",
        badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
      };
    case "barbecho":
    case "otros":
    default:
      return {
        bg: "bg-stone-100",
        text: "text-stone-800",
        border: "border-stone-400",
        fill: "#78716C",
        badge: "bg-stone-50 text-stone-700 border-stone-200",
      };
  }
}

export function getStatusBadge(status: string): {
  badge: string;
  label: string;
} {
  switch (status?.toLowerCase()) {
    case "completada":
    case "completado":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Completada",
      };
    case "en progreso":
    case "en_progreso":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        label: "En progreso",
      };
    case "pendiente":
      return {
        badge: "bg-stone-100 text-stone-700 border-stone-200",
        label: "Pendiente",
      };
    case "cancelada":
      return {
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        label: "Cancelada",
      };
    default:
      return {
        badge: "bg-stone-100 text-stone-700 border-stone-200",
        label: status,
      };
  }
}

export function getISLColor(score: number): {
  color: string;
  badge: string;
  label: string;
} {
  if (score >= 85) {
    return {
      color: "text-emerald-700",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Excelente",
    };
  } else if (score >= 70) {
    return {
      color: "text-lime-700",
      badge: "bg-lime-50 text-lime-700 border-lime-200",
      label: "Bueno",
    };
  } else if (score >= 50) {
    return {
      color: "text-amber-700",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Alerta / Regular",
    };
  } else {
    return {
      color: "text-rose-700",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      label: "Crítico",
    };
  }
}
