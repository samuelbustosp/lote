"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { useStore } from "@/lib/supabase/store";
import { Loader2 } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

/**
 * Main Application Shell guarding private routes with automatic redirect to /login.
 */
export function AppShell({
  children,
  title,
  subtitle,
  headerAction,
}: AppShellProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useStore();

  // If unauthenticated on a protected route, immediately redirect to /login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // If loading or unauthenticated, show a clean, minimal spinner while redirecting
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F8F5] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#4F8A3F] animate-spin" />
        <p className="text-xs font-semibold text-stone-500">
          Cargando...
        </p>
      </div>
    );
  }

  // Render full private dashboard shell
  return (
    <div className="flex min-h-screen bg-[#F7F8F5]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-18 lg:pb-8">
        <Header title={title} subtitle={subtitle} />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
