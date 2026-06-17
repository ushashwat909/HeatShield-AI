"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  Thermometer, Leaf, Flame, AlertTriangle, TrendingUp,
  TrendingDown, Satellite, Users, Activity, MapPin
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { getMockDashboardSummary, getMockHotspots, getMockPredictions } from "@/lib/mock-data";
import { formatTemperature, formatNumber, getRiskColor } from "@/lib/utils";

const HeatMapComponent = dynamic(() => import("@/components/HeatMap"), { ssr: false });

export default function DashboardPage() {
  const [summary, setSummary] = useState<ReturnType<typeof getMockDashboardSummary> | null>(null);
  const [hotspots, setHotspots] = useState<ReturnType<typeof getMockHotspots> | null>(null);
  const [predictions, setPredictions] = useState<ReturnType<typeof getMockPredictions> | null>(null);

  useEffect(() => {
    setSummary(getMockDashboardSummary());
    setHotspots(getMockHotspots());
    setPredictions(getMockPredictions(0, 14));
  }, []);

  if (!summary || !hotspots || !predictions) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  const trendData = predictions.predictions.slice(0, 14).map((p) => ({
    date: p.date.slice(5),
    temp: p.predicted_temp,
  }));

  const riskDistribution = [
    { name: "Extreme", value: 3, color: "#B71C1C" },
    { name: "Very High", value: 4, color: "#F44336" },
    { name: "High", value: 6, color: "#FF9800" },
    { name: "Moderate", value: 5, color: "#4CAF50" },
    { name: "Low", value: 2, color: "#2196F3" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Overview</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Real-time urban heat monitoring · Delhi, India
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
            <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
            Live · {summary.data_source}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current LST"
          value={formatTemperature(summary.avg_lst)}
          subtitle={`Max: ${formatTemperature(summary.max_lst)}`}
          icon={Thermometer}
          trend={summary.trend_7day}
          variant="destructive"
        />
        <StatCard
          title="Average NDVI"
          value={summary.avg_ndvi.toFixed(3)}
          subtitle="Vegetation Index"
          icon={Leaf}
          variant="secondary"
        />
        <StatCard
          title="Heat Hotspots"
          value={summary.total_hotspots.toString()}
          subtitle={`${summary.critical_zones} Critical Zones`}
          icon={Flame}
          variant="accent"
        />
        <StatCard
          title="Population at Risk"
          value={formatNumber(summary.population_at_risk)}
          subtitle={`${summary.active_sensors} Active Sensors`}
          icon={Users}
          variant="primary"
        />
      </div>

      {/* Map + Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[var(--card-foreground)]">
              <MapPin className="w-4 h-4 inline mr-1.5 text-[var(--muted-foreground)]" />
              Heat Map — Delhi NCR
            </h3>
            <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
              Land Surface Temperature
            </span>
          </div>
          <div className="h-[380px]">
            <HeatMapComponent />
          </div>
        </div>

        <div className="space-y-4">
          {/* Risk Distribution */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <h3 className="font-semibold text-sm text-[var(--card-foreground)] mb-3">Risk Distribution</h3>
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    dataKey="value"
                    stroke="none"
                  >
                    {riskDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 justify-center">
              {riskDistribution.map((r) => (
                <div key={r.name} className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                  {r.name}
                </div>
              ))}
            </div>
          </div>

          {/* Top Hotspots */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <h3 className="font-semibold text-sm text-[var(--card-foreground)] mb-3">Top Hotspots</h3>
            <div className="space-y-2">
              {hotspots.hotspots.slice(0, 5).map((h) => (
                <div key={h.rank} className="flex items-center gap-3 text-xs">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: getRiskColor(h.risk_level) }}
                  >
                    {h.rank}
                  </span>
                  <span className="flex-1 truncate text-[var(--card-foreground)]">{h.region_name}</span>
                  <span className="font-semibold" style={{ color: getRiskColor(h.risk_level) }}>
                    {formatTemperature(h.temperature)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-[var(--card-foreground)]">
            <Activity className="w-4 h-4 inline mr-1.5 text-[var(--muted-foreground)]" />
            14-Day Temperature Forecast
          </h3>
          <span className="text-xs text-[var(--muted-foreground)]">{predictions.model_used}</span>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F57C00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F57C00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="temp" stroke="#F57C00" strokeWidth={2} fill="url(#tempGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── StatCard Component ────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "primary",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  trend?: number;
  variant?: "primary" | "secondary" | "accent" | "destructive";
}) {
  const borderColor = {
    primary: "#0A2540",
    secondary: "#2E7D32",
    accent: "#F57C00",
    destructive: "#DC2626",
  }[variant];

  return (
    <div className="stat-card bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-md transition-shadow">
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: borderColor, borderRadius: "12px 12px 0 0" }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--muted-foreground)] font-medium">{title}</p>
          <p className="text-2xl font-bold text-[var(--card-foreground)] mt-1">{value}</p>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-1">{subtitle}</p>
        </div>
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${borderColor}10` }}>
          <span style={{ color: borderColor }}>
            <Icon className="w-5 h-5" />
          </span>
        </div>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend > 0 ? "text-[#DC2626]" : "text-[#2E7D32]"}`}>
          {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend > 0 ? "+" : ""}{trend}°C (7d trend)
        </div>
      )}
    </div>
  );
}
