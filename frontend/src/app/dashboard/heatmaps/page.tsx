"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Map, Layers, Eye } from "lucide-react";

const HeatMapComponent = dynamic(() => import("@/components/HeatMap"), { ssr: false });

const LAYER_OPTIONS = [
  { id: "lst", label: "Land Surface Temperature", desc: "Thermal infrared surface temperature" },
  { id: "ndvi", label: "NDVI (Vegetation)", desc: "Normalized Difference Vegetation Index" },
  { id: "ndbi", label: "NDBI (Built-up)", desc: "Normalized Difference Built-up Index" },
  { id: "vulnerability", label: "Heat Vulnerability", desc: "Composite vulnerability index" },
];

export default function HeatMapsPage() {
  const [activeLayer, setActiveLayer] = useState("lst");

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            <Map className="w-6 h-6 inline mr-2 text-[var(--muted-foreground)]" />
            Interactive Heat Maps
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Multi-layer GIS visualization · Delhi NCR
          </p>
        </div>
      </div>

      {/* Layer Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {LAYER_OPTIONS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`text-left p-3 rounded-xl border transition-all text-sm ${
              activeLayer === layer.id
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                : "bg-[var(--card)] border-[var(--border)] text-[var(--card-foreground)] hover:border-[var(--primary)]/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span className="font-semibold text-xs">{layer.label}</span>
            </div>
            <p className={`text-[10px] ${activeLayer === layer.id ? "text-white/70" : "text-[var(--muted-foreground)]"}`}>
              {layer.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Full Map */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Eye className="w-3.5 h-3.5" />
            <span>Viewing: <span className="font-medium text-[var(--card-foreground)]">
              {LAYER_OPTIONS.find(l => l.id === activeLayer)?.label}
            </span></span>
          </div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
            Source: Landsat-9 / Sentinel-2
          </div>
        </div>
        <div className="h-[calc(100vh-320px)] min-h-[500px]">
          <HeatMapComponent height="100%" />
        </div>
      </div>

      {/* Color Scale */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[var(--card-foreground)]">Color Scale</span>
          <span className="text-[10px] text-[var(--muted-foreground)]">Temperature (°C)</span>
        </div>
        <div className="heat-scale-gradient h-3 rounded-full" />
        <div className="flex justify-between mt-1.5 text-[10px] text-[var(--muted-foreground)]">
          <span>≤ 30°C (Cool)</span>
          <span>35°C</span>
          <span>40°C</span>
          <span>45°C</span>
          <span>≥ 50°C (Extreme)</span>
        </div>
      </div>
    </div>
  );
}
