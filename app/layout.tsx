import type { Metadata, Viewport } from "next";
import { StoreProvider } from "@/lib/supabase/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOTE - Gestión Agropecuaria",
  description: "Entender el campo nunca fue tan simple. Plataforma inteligente para gestión de lotes y campañas agrícolas.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LOTE",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#4F8A3F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased bg-[#F7F8F5]">
      <head>
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F7F8F5] text-stone-900 selection:bg-[#4F8A3F]/20 selection:text-[#3E7031]">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
