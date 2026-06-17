"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Shield, LayoutDashboard, Map, Brain, Flame, Lightbulb,
  SlidersHorizontal, FileText, Sun, Moon, Menu, X, ChevronRight,
  Bell, User, Settings, LogOut
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/heatmaps", label: "Heat Maps", icon: Map },
  { href: "/dashboard/predictions", label: "Predictions", icon: Brain },
  { href: "/dashboard/hotspots", label: "Hotspots", icon: Flame },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/dashboard/simulator", label: "Simulator", icon: SlidersHorizontal },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* ─── Top Navbar ──────────────────────────────────── */}
      <header className="h-14 bg-[#0A2540] text-white flex items-center px-4 shrink-0 z-50 relative">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-1.5 rounded-md hover:bg-white/10 mr-3"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link href="/" className="flex items-center gap-2.5 mr-8">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-[#F57C00]" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-sm tracking-tight">HeatShield</span>
            <span className="font-bold text-[#F57C00] text-sm ml-0.5">AI</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleDark}
            className="p-2 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className="p-2 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#F57C00] rounded-full" />
          </button>
          <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-white/15">
            <div className="w-7 h-7 bg-[#2E7D32] rounded-full flex items-center justify-center text-xs font-bold">
              A
            </div>
            <div className="text-xs">
              <div className="font-medium text-white/90">Admin</div>
              <div className="text-white/40">System Admin</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ─── Sidebar ─────────────────────────────────────── */}
        <aside
          className={`fixed lg:static inset-y-14 left-0 z-40 w-60 bg-[var(--sidebar)] border-r border-white/5 transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="flex flex-col h-full text-[var(--sidebar-foreground)]">
            <div className="p-4 border-b border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-3">
                Navigation
              </div>
              <nav className="space-y-0.5">
                {NAV_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        active
                          ? "bg-white/10 text-white font-medium"
                          : "text-white/50 hover:text-white/80 hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.label}
                      {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Filters */}
            <div className="p-4 border-b border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-3">
                City
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70">
                Delhi, India
              </div>
            </div>

            <div className="p-4 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-3">
                Data Source
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-white/50">
                  <span>Landsat-9</span>
                  <span className="w-2 h-2 bg-[#4CAF50] rounded-full" />
                </div>
                <div className="flex items-center justify-between text-white/50">
                  <span>Sentinel-2</span>
                  <span className="w-2 h-2 bg-[#4CAF50] rounded-full" />
                </div>
                <div className="flex items-center justify-between text-white/50">
                  <span>MODIS</span>
                  <span className="w-2 h-2 bg-[#F57C00] rounded-full" />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/5">
              <Link
                href="#"
                className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" /> Settings
              </Link>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── Main Content ────────────────────────────────── */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
