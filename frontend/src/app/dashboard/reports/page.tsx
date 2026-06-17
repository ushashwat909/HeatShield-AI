"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Printer, Calendar, MapPin, BarChart3, Flame, Lightbulb, CheckCircle2, Shield } from "lucide-react";
import { getMockDashboardSummary, getMockHotspots, getMockRecommendations } from "@/lib/mock-data";
import { formatTemperature, formatNumber, formatCurrency, getRiskColor } from "@/lib/utils";

export default function ReportsPage() {
  const [summary, setSummary] = useState<ReturnType<typeof getMockDashboardSummary> | null>(null);
  const [hotspots, setHotspots] = useState<ReturnType<typeof getMockHotspots> | null>(null);
  const [recs, setRecs] = useState<ReturnType<typeof getMockRecommendations> | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    setSummary(getMockDashboardSummary());
    setHotspots(getMockHotspots());
    setRecs(getMockRecommendations());
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!summary || !hotspots || !recs) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            <FileText className="w-6 h-6 inline mr-2 text-[var(--muted-foreground)]" />
            Reports
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Generate government-standard heat analysis reports
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Generate Report
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] text-[var(--card-foreground)] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--muted)]/50 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {generated && (
        <div className="bg-[#2E7D32]/10 border border-[#2E7D32]/20 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#2E7D32]">Report Generated Successfully</p>
            <p className="text-xs text-[#2E7D32]/70">Report ID: HS-{Math.random().toString(36).slice(2, 8).toUpperCase()}</p>
          </div>
        </div>
      )}

      {/* Report Preview */}
      <div className="bg-white border border-[var(--border)] rounded-xl shadow-sm print:shadow-none" id="report-content">
        {/* Report Header */}
        <div className="bg-[#0A2540] text-white p-6 rounded-t-xl print:rounded-none">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-[#F57C00]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">HeatShield AI — Urban Heat Analysis Report</h2>
              <p className="text-sm text-blue-200/60">AI-Powered Urban Heat Island Monitoring & Mitigation</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs text-blue-200/50">
            <div><Calendar className="w-3.5 h-3.5 inline mr-1.5" />Report Date: {new Date().toLocaleDateString("en-IN")}</div>
            <div><MapPin className="w-3.5 h-3.5 inline mr-1.5" />City: Delhi, India</div>
            <div><BarChart3 className="w-3.5 h-3.5 inline mr-1.5" />Data Source: Landsat-9 / Sentinel-2</div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Executive Summary */}
          <section>
            <h3 className="text-lg font-bold text-[#0A2540] mb-4 pb-2 border-b border-[#E8ECF0]">
              1. Executive Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-[#F8FAFB] border border-[#E8ECF0] rounded-lg p-3 text-center">
                <p className="text-xs text-[#5A6977]">Avg LST</p>
                <p className="text-xl font-bold text-[#DC2626]">{formatTemperature(summary.avg_lst)}</p>
              </div>
              <div className="bg-[#F8FAFB] border border-[#E8ECF0] rounded-lg p-3 text-center">
                <p className="text-xs text-[#5A6977]">Max LST</p>
                <p className="text-xl font-bold text-[#B71C1C]">{formatTemperature(summary.max_lst)}</p>
              </div>
              <div className="bg-[#F8FAFB] border border-[#E8ECF0] rounded-lg p-3 text-center">
                <p className="text-xs text-[#5A6977]">NDVI Avg</p>
                <p className="text-xl font-bold text-[#2E7D32]">{summary.avg_ndvi}</p>
              </div>
              <div className="bg-[#F8FAFB] border border-[#E8ECF0] rounded-lg p-3 text-center">
                <p className="text-xs text-[#5A6977]">Risk Level</p>
                <p className="text-xl font-bold" style={{ color: getRiskColor(summary.overall_risk) }}>
                  {summary.overall_risk.toUpperCase()}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#5A6977] leading-relaxed">
              Analysis of {summary.monitored_area_sqkm} sq km across Delhi NCR using {summary.active_sensors} active sensors 
              and satellite data from {summary.data_source}. The monitoring period identified {summary.total_hotspots} heat 
              hotspots, with {summary.critical_zones} zones classified as critical. An estimated {formatNumber(summary.population_at_risk)} people 
              are currently at heat-related health risk.
            </p>
          </section>

          {/* Hotspot Analysis */}
          <section>
            <h3 className="text-lg font-bold text-[#0A2540] mb-4 pb-2 border-b border-[#E8ECF0]">
              <Flame className="w-5 h-5 inline mr-2 text-[#F57C00]" />
              2. Heat Hotspot Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFB]">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-[#5A6977] border border-[#E8ECF0]">Rank</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-[#5A6977] border border-[#E8ECF0]">Location</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-[#5A6977] border border-[#E8ECF0]">Temp (°C)</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-[#5A6977] border border-[#E8ECF0]">Risk</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-[#5A6977] border border-[#E8ECF0]">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {hotspots.hotspots.slice(0, 5).map((h) => (
                    <tr key={h.rank}>
                      <td className="px-3 py-2 font-bold border border-[#E8ECF0]" style={{ color: getRiskColor(h.risk_level) }}>{h.rank}</td>
                      <td className="px-3 py-2 font-medium text-[#0A2540] border border-[#E8ECF0]">{h.region_name}</td>
                      <td className="px-3 py-2 text-right font-semibold border border-[#E8ECF0]" style={{ color: getRiskColor(h.risk_level) }}>{h.temperature.toFixed(1)}</td>
                      <td className="px-3 py-2 text-right border border-[#E8ECF0]">{h.risk_score}</td>
                      <td className="px-3 py-2 text-center border border-[#E8ECF0]">
                        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: getRiskColor(h.risk_level), background: `${getRiskColor(h.risk_level)}15` }}>
                          {h.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recommendations */}
          <section>
            <h3 className="text-lg font-bold text-[#0A2540] mb-4 pb-2 border-b border-[#E8ECF0]">
              <Lightbulb className="w-5 h-5 inline mr-2 text-[#F57C00]" />
              3. AI Cooling Recommendations
            </h3>
            <div className="space-y-3">
              {recs.recommendations.slice(0, 5).map((r) => (
                <div key={r.id} className="bg-[#F8FAFB] border border-[#E8ECF0] rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-[#5A6977] uppercase">{r.category}</span>
                      <h4 className="font-semibold text-sm text-[#0A2540]">{r.title}</h4>
                    </div>
                    <span className="text-sm font-bold text-[#2E7D32]">-{r.expected_temp_reduction}°C</span>
                  </div>
                  <p className="text-xs text-[#5A6977] mt-1">{r.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-[#5A6977]">
                    <span>Energy: {(r.energy_savings_kwh / 1000).toFixed(0)}K kWh</span>
                    <span>Cost: {formatCurrency(r.estimated_cost_inr)}</span>
                    <span>Timeline: {r.implementation_timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-[#E8ECF0] pt-4 mt-8">
            <div className="flex justify-between text-[10px] text-[#5A6977]">
              <span>HeatShield AI · Confidential</span>
              <span>Page 1 of 1</span>
              <span>Generated: {new Date().toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
