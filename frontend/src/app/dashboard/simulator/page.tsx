"use client";

import { useState, useEffect, useCallback } from "react";
import { SlidersHorizontal, TreePine, Building, Leaf, Square, Thermometer, Zap, Minus as CO2, IndianRupee, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { getMockSimulation } from "@/lib/mock-data";
import { formatTemperature, formatCurrency } from "@/lib/utils";

export default function SimulatorPage() {
  const [trees, setTrees] = useState(5000);
  const [coolRoof, setCoolRoof] = useState(30);
  const [greenRoof, setGreenRoof] = useState(15);
  const [reflectivePavement, setReflectivePavement] = useState(20);
  const [data, setData] = useState<ReturnType<typeof getMockSimulation> | null>(null);

  const runSimulation = useCallback(() => {
    setData(getMockSimulation(trees, coolRoof, greenRoof, reflectivePavement));
  }, [trees, coolRoof, greenRoof, reflectivePavement]);

  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  if (!data) return null;

  const breakdownColors = ["#2E7D32", "#1565C0", "#4CAF50", "#FF9800"];

  const breakdownChart = data.breakdown.map((b, i) => ({
    name: b.strategy,
    reduction: b.temp_reduction,
    fill: breakdownColors[i],
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          <SlidersHorizontal className="w-6 h-6 inline mr-2 text-[var(--muted-foreground)]" />
          Urban Cooling Simulator
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Interactive mitigation strategy simulation · Adjust parameters to see impact
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="space-y-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="font-semibold text-sm text-[var(--card-foreground)] mb-5">Simulation Controls</h3>

            <SliderControl
              icon={TreePine}
              label="Trees to Plant"
              value={trees}
              max={50000}
              step={500}
              unit="trees"
              color="#2E7D32"
              onChange={setTrees}
            />
            <SliderControl
              icon={Building}
              label="Cool Roof Coverage"
              value={coolRoof}
              max={100}
              step={5}
              unit="%"
              color="#1565C0"
              onChange={setCoolRoof}
            />
            <SliderControl
              icon={Leaf}
              label="Green Roof Coverage"
              value={greenRoof}
              max={100}
              step={5}
              unit="%"
              color="#4CAF50"
              onChange={setGreenRoof}
            />
            <SliderControl
              icon={Square}
              label="Reflective Pavement"
              value={reflectivePavement}
              max={100}
              step={5}
              unit="%"
              color="#FF9800"
              onChange={setReflectivePavement}
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <ResultCard
              icon={Thermometer}
              label="Temp Reduction"
              value={`-${data.total_temp_reduction}°C`}
              sub={`${formatTemperature(data.baseline_temperature)} → ${formatTemperature(data.simulated_temperature)}`}
              color="#2E7D32"
            />
            <ResultCard
              icon={Zap}
              label="Energy Savings"
              value={`${(data.total_energy_savings_kwh / 1000).toFixed(1)}K`}
              sub="kWh / year"
              color="#1565C0"
            />
            <ResultCard
              icon={TrendingDown}
              label="CO₂ Reduction"
              value={`${data.total_carbon_reduction_tons}`}
              sub="tons / year"
              color="#4CAF50"
            />
            <ResultCard
              icon={IndianRupee}
              label="Cost Effectiveness"
              value={data.cost_effectiveness_score.toFixed(1)}
              sub="°C / ₹ Million"
              color="#F57C00"
            />
          </div>

          {/* Breakdown Chart */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <h3 className="font-semibold text-sm text-[var(--card-foreground)] mb-4">
              Temperature Reduction Breakdown
            </h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="reduction" name="Temp Reduction (°C)" radius={[4, 4, 0, 0]}>
                    {breakdownChart.map((entry, i) => (
                      <Cell key={i} fill={breakdownColors[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Projections */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <h3 className="font-semibold text-sm text-[var(--card-foreground)] mb-4">
              Monthly Temperature Projections
            </h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthly_projections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="baseline_temp" stroke="#DC2626" strokeWidth={2} dot={false} name="Baseline" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="mitigated_temp" stroke="#2E7D32" strokeWidth={2.5} dot={{ r: 3 }} name="With Mitigation" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <h3 className="font-semibold text-sm text-[var(--card-foreground)]">Detailed Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Strategy</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Temp ↓</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Energy (kWh)</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">CO₂ (tons)</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {data.breakdown.map((b, i) => (
                    <tr key={i} className="border-b border-[var(--border)]">
                      <td className="px-4 py-2.5 font-medium text-[var(--card-foreground)]">
                        <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ background: breakdownColors[i] }} />
                        {b.strategy}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-[#2E7D32]">-{b.temp_reduction}°C</td>
                      <td className="px-4 py-2.5 text-right text-[var(--card-foreground)]">{b.energy_savings_kwh.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right text-[var(--card-foreground)]">{b.carbon_reduction_tons}</td>
                      <td className="px-4 py-2.5 text-right text-[#F57C00]">{formatCurrency(b.cost_estimate_inr)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slider Control ─────────────────────────────────────────

function SliderControl({
  icon: Icon,
  label,
  value,
  max,
  step,
  unit,
  color,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  max: number;
  step: number;
  unit: string;
  color: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-[var(--card-foreground)]">
          <span style={{ color }}><Icon className="w-4 h-4" /></span>
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold" style={{ color }}>
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${(value / max) * 100}%, var(--border) ${(value / max) * 100}%)`,
        }}
      />
      <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1">
        <span>0</span>
        <span>{max.toLocaleString()} {unit}</span>
      </div>
    </div>
  );
}

// ─── Result Card ────────────────────────────────────────────

function ResultCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3.5">
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color }}><Icon className="w-4 h-4" /></span>
        <span className="text-[10px] text-[var(--muted-foreground)] font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold" style={{ color }}>{value}</p>
      <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{sub}</p>
    </div>
  );
}
