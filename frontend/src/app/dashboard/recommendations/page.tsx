"use client";

import { useState, useEffect } from "react";
import { Lightbulb, TreePine, Building, Droplets, Cpu, Leaf, ArrowDown, Zap, IndianRupee, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { getMockRecommendations } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Vegetation: TreePine,
  "Cool Roofs": Building,
  "Green Infrastructure": Leaf,
  "Reflective Pavements": Building,
  "Water Features": Droplets,
  "Urban Planning": Building,
  "Smart Systems": Cpu,
};

const CATEGORY_COLORS: Record<string, string> = {
  Vegetation: "#2E7D32",
  "Cool Roofs": "#1565C0",
  "Green Infrastructure": "#4CAF50",
  "Reflective Pavements": "#FF9800",
  "Water Features": "#0288D1",
  "Urban Planning": "#7B1FA2",
  "Smart Systems": "#0A2540",
};

export default function RecommendationsPage() {
  const [data, setData] = useState<ReturnType<typeof getMockRecommendations> | null>(null);

  useEffect(() => {
    setData(getMockRecommendations());
  }, []);

  if (!data) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}</div>;
  }

  const chartData = data.recommendations.map((r) => ({
    name: r.title.length > 20 ? r.title.slice(0, 20) + "…" : r.title,
    reduction: r.expected_temp_reduction,
    priority: r.priority_score,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          <Lightbulb className="w-6 h-6 inline mr-2 text-[#F57C00]" />
          AI Cooling Recommendations
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Data-driven mitigation strategies with impact estimates
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Total Recommendations</p>
          <p className="text-2xl font-bold text-[var(--card-foreground)] mt-1">{data.total_recommendations}</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Expected Temp Reduction</p>
          <p className="text-2xl font-bold text-[#2E7D32] mt-1">↓ {data.summary.total_expected_temp_reduction}°C</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Energy Savings</p>
          <p className="text-2xl font-bold text-[#0A2540] mt-1">{(data.summary.total_energy_savings_kwh / 1000).toFixed(0)}K kWh</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Total Est. Cost</p>
          <p className="text-2xl font-bold text-[#F57C00] mt-1">{formatCurrency(data.summary.total_estimated_cost_inr)}</p>
        </div>
      </div>

      {/* Impact Chart */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
        <h3 className="font-semibold text-sm text-[var(--card-foreground)] mb-4">Temperature Reduction by Strategy</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={130} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="reduction" fill="#2E7D32" radius={[0, 4, 4, 0]} name="Temp Reduction (°C)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {data.recommendations.map((rec) => {
          const Icon = CATEGORY_ICONS[rec.category] || Lightbulb;
          const color = CATEGORY_COLORS[rec.category] || "#0A2540";

          return (
            <div
              key={rec.id}
              className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}10` }}>
                  <span style={{ color }}><Icon className="w-5 h-5" /></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
                        {rec.category}
                      </span>
                      <h3 className="font-semibold text-sm text-[var(--card-foreground)] mt-0.5">{rec.title}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-[var(--muted-foreground)]">Priority</div>
                      <div className="text-lg font-bold" style={{ color }}>{rec.priority_score}</div>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed">
                    {rec.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-[var(--muted)]/30 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)] mb-0.5">
                        <ArrowDown className="w-3 h-3" /> Temp Reduction
                      </div>
                      <p className="text-sm font-bold text-[#2E7D32]">-{rec.expected_temp_reduction}°C</p>
                    </div>
                    <div className="bg-[var(--muted)]/30 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)] mb-0.5">
                        <Zap className="w-3 h-3" /> Energy Savings
                      </div>
                      <p className="text-sm font-bold text-[#0A2540]">{(rec.energy_savings_kwh / 1000).toFixed(0)}K kWh</p>
                    </div>
                    <div className="bg-[var(--muted)]/30 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)] mb-0.5">
                        <IndianRupee className="w-3 h-3" /> Est. Cost
                      </div>
                      <p className="text-sm font-bold text-[#F57C00]">{formatCurrency(rec.estimated_cost_inr)}</p>
                    </div>
                    <div className="bg-[var(--muted)]/30 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)] mb-0.5">
                        <Clock className="w-3 h-3" /> Timeline
                      </div>
                      <p className="text-sm font-bold text-[var(--card-foreground)]">{rec.implementation_timeline}</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-[var(--muted-foreground)] mt-3">
                    <span className="font-medium">Target Region:</span> {rec.region_name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
