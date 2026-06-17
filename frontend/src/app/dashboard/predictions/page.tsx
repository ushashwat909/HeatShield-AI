"use client";

import { useState, useEffect } from "react";
import { Brain, TrendingUp, TrendingDown, Minus, AlertTriangle, Clock } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, AreaChart, Area, BarChart, Bar
} from "recharts";
import { getMockPredictions, DELHI_REGIONS } from "@/lib/mock-data";
import { formatTemperature, getRiskColor } from "@/lib/utils";

const HORIZONS = [
  { value: 7, label: "7 Days" },
  { value: 30, label: "30 Days" },
  { value: 90, label: "90 Days" },
];

export default function PredictionsPage() {
  const [horizon, setHorizon] = useState(30);
  const [regionId, setRegionId] = useState(0);
  const [data, setData] = useState<ReturnType<typeof getMockPredictions> | null>(null);

  useEffect(() => {
    setData(getMockPredictions(regionId, horizon));
  }, [horizon, regionId]);

  if (!data) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}</div>;
  }

  const trendIcon = data.trend === "increasing" ? TrendingUp : data.trend === "decreasing" ? TrendingDown : Minus;
  const trendColor = data.trend === "increasing" ? "#DC2626" : data.trend === "decreasing" ? "#2E7D32" : "#F57C00";

  const chartData = data.predictions.map((p) => ({
    date: p.date.slice(5),
    predicted: p.predicted_temp,
    confidence_low: p.predicted_temp - (1 - p.confidence) * 5,
    confidence_high: p.predicted_temp + (1 - p.confidence) * 5,
  }));

  // Weekly averages for bar chart
  const weeklyData = [];
  for (let i = 0; i < data.predictions.length; i += 7) {
    const week = data.predictions.slice(i, i + 7);
    const avg = week.reduce((s, p) => s + p.predicted_temp, 0) / week.length;
    weeklyData.push({ week: `W${Math.floor(i / 7) + 1}`, avg_temp: +avg.toFixed(1) });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            <Brain className="w-6 h-6 inline mr-2 text-[var(--muted-foreground)]" />
            AI Temperature Predictions
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            ML-powered heat forecasting · {data.model_used}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          {HORIZONS.map((h) => (
            <button
              key={h.value}
              onClick={() => setHorizon(h.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                horizon === h.value
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                  : "bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)] hover:border-[var(--primary)]/30"
              }`}
            >
              <Clock className="w-3.5 h-3.5 inline mr-1.5" />
              {h.label}
            </button>
          ))}
        </div>
        <select
          value={regionId}
          onChange={(e) => setRegionId(+e.target.value)}
          className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
        >
          {DELHI_REGIONS.map((r, i) => (
            <option key={r.id} value={i}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Current Temperature</p>
          <p className="text-2xl font-bold text-[var(--card-foreground)] mt-1">
            {formatTemperature(data.current_temperature)}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">{data.region_name}</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Avg Predicted</p>
          <p className="text-2xl font-bold mt-1" style={{ color: getRiskColor(data.risk_level) }}>
            {formatTemperature(data.average_predicted_temp)}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">{horizon}-day average</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Max Predicted</p>
          <p className="text-2xl font-bold text-[#DC2626] mt-1">
            {formatTemperature(data.max_predicted_temp)}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Peak temperature</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Trend</p>
          <div className="flex items-center gap-2 mt-1">
            {(() => { const Icon = trendIcon; return <span style={{ color: trendColor }}><Icon className="w-6 h-6" /></span>; })()}
            <span className="text-lg font-bold capitalize" style={{ color: trendColor }}>
              {data.trend}
            </span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Risk: <span className="font-semibold" style={{ color: getRiskColor(data.risk_level) }}>
              {data.risk_level.replace("_", " ").toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      {/* Main Prediction Chart */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
        <h3 className="font-semibold text-sm text-[var(--card-foreground)] mb-4">
          Temperature Prediction — {horizon}-Day Forecast
        </h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F57C00" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F57C00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} interval={Math.floor(horizon / 10)} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value) => [`${Number(value).toFixed(1)}°C`, ""]}
              />
              <ReferenceLine y={data.current_temperature} stroke="#0A2540" strokeDasharray="5 5" label={{ value: "Current", fontSize: 10 }} />
              <ReferenceLine y={45} stroke="#DC2626" strokeDasharray="3 3" label={{ value: "Danger", fontSize: 10, fill: "#DC2626" }} />
              <Area type="monotone" dataKey="predicted" stroke="#F57C00" strokeWidth={2} fill="url(#predGrad)" name="Predicted Temp" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      {weeklyData.length > 1 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <h3 className="font-semibold text-sm text-[var(--card-foreground)] mb-4">
            Weekly Average Temperature
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="avg_temp" fill="#0A2540" radius={[4, 4, 0, 0]} name="Avg Temp (°C)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
