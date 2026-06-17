"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Flame, AlertTriangle, MapPin, Users, ArrowUpRight } from "lucide-react";
import { getMockHotspots } from "@/lib/mock-data";
import { formatTemperature, formatNumber, getRiskColor } from "@/lib/utils";

const HeatMapComponent = dynamic(() => import("@/components/HeatMap"), { ssr: false });

export default function HotspotsPage() {
  const [data, setData] = useState<ReturnType<typeof getMockHotspots> | null>(null);

  useEffect(() => {
    setData(getMockHotspots());
  }, []);

  if (!data) {
    return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          <Flame className="w-6 h-6 inline mr-2 text-[#F57C00]" />
          Hotspot Detection
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Top urban heat hotspots ranked by severity · {data.city}
        </p>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-[var(--card-foreground)]">{data.total_hotspots}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Total Hotspots</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-[#B71C1C]">{data.critical_count}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Critical</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-[#FF9800]">{data.high_count}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">High Priority</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Map */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[var(--border)] text-xs font-semibold text-[var(--card-foreground)]">
            <MapPin className="w-3.5 h-3.5 inline mr-1.5 text-[var(--muted-foreground)]" />
            Hotspot Locations
          </div>
          <div className="h-[400px]">
            <HeatMapComponent height="100%" />
          </div>
        </div>

        {/* Hotspot Cards */}
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {data.hotspots.map((h) => (
            <div
              key={h.rank}
              className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: getRiskColor(h.risk_level) }}
                >
                  #{h.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-[var(--card-foreground)]">{h.region_name}</h3>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ color: getRiskColor(h.risk_level), background: `${getRiskColor(h.risk_level)}15` }}
                    >
                      {h.priority}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Ward {h.ward_number}</p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted-foreground)]">Temperature</span>
                      <span className="font-semibold" style={{ color: getRiskColor(h.risk_level) }}>
                        {formatTemperature(h.temperature)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted-foreground)]">Risk Score</span>
                      <span className="font-semibold text-[var(--card-foreground)]">{h.risk_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted-foreground)]">NDVI</span>
                      <span className="font-semibold text-[#2E7D32]">{h.ndvi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted-foreground)]">NDBI</span>
                      <span className="font-semibold text-[#F57C00]">{h.ndbi}</span>
                    </div>
                    <div className="flex justify-between col-span-2">
                      <span className="text-[var(--muted-foreground)]">
                        <Users className="w-3 h-3 inline mr-1" />Population Affected
                      </span>
                      <span className="font-semibold text-[var(--card-foreground)]">
                        {formatNumber(h.population_affected)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ranking Table */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="font-semibold text-sm text-[var(--card-foreground)]">Heat Ranking Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Rank</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Location</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Ward</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Temp (°C)</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Risk Score</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">NDVI</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">NDBI</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-[var(--muted-foreground)]">Priority</th>
              </tr>
            </thead>
            <tbody>
              {data.hotspots.map((h) => (
                <tr key={h.rank} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/20 transition-colors">
                  <td className="px-4 py-2.5 font-bold" style={{ color: getRiskColor(h.risk_level) }}>{h.rank}</td>
                  <td className="px-4 py-2.5 font-medium text-[var(--card-foreground)]">{h.region_name}</td>
                  <td className="px-4 py-2.5 text-[var(--muted-foreground)]">{h.ward_number}</td>
                  <td className="px-4 py-2.5 text-right font-semibold" style={{ color: getRiskColor(h.risk_level) }}>
                    {h.temperature.toFixed(1)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-[var(--card-foreground)]">{h.risk_score}</td>
                  <td className="px-4 py-2.5 text-right text-[#2E7D32]">{h.ndvi}</td>
                  <td className="px-4 py-2.5 text-right text-[#F57C00]">{h.ndbi}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ color: getRiskColor(h.risk_level), background: `${getRiskColor(h.risk_level)}15` }}
                    >
                      {h.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
