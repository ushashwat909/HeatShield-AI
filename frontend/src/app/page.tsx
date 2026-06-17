import Link from "next/link";
import {
  Shield, Satellite, Brain, Map, BarChart3, Thermometer,
  TreePine, Building, Droplets, ChevronRight, Activity,
  Globe, Layers, Zap, ArrowRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ─── Top Banner ─────────────────────────────────── */}
      <div className="bg-[#0A2540] text-white text-center py-1.5 text-xs tracking-wider font-medium border-b border-white/10">
        GOVERNMENT OF INDIA &nbsp;·&nbsp; MINISTRY OF ENVIRONMENT, FOREST AND CLIMATE CHANGE &nbsp;·&nbsp; SMART CITIES MISSION
      </div>

      {/* ─── Navbar ──────────────────────────────────────── */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0A2540] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-[#0A2540] text-lg tracking-tight">HeatShield</span>
              <span className="font-bold text-[#F57C00] text-lg ml-0.5">AI</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5A6977]">
            <a href="#overview" className="hover:text-[#0A2540] transition-colors">Overview</a>
            <a href="#features" className="hover:text-[#0A2540] transition-colors">Features</a>
            <a href="#workflow" className="hover:text-[#0A2540] transition-colors">AI Workflow</a>
            <a href="#strategies" className="hover:text-[#0A2540] transition-colors">Strategies</a>
          </div>
          <Link
            href="/dashboard"
            className="bg-[#0A2540] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#0d2f50] transition-colors flex items-center gap-2"
          >
            Launch Dashboard <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0d2f50] to-[#122a44]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#2E7D32] rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#F57C00] rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="gov-badge mb-6 text-white/90 border-white/20 bg-white/5">
              <Satellite className="w-3.5 h-3.5" /> National Urban Heat Intelligence System v1.0
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              HeatShield <span className="text-[#F57C00]">AI</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100/80 mt-4 leading-relaxed max-w-2xl">
              AI-Powered Urban Heat Mitigation and Cooling Strategy Platform. 
              Real-time satellite monitoring, predictive analytics, and intelligent 
              cooling recommendations for India&apos;s smart cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-[#F57C00] text-white px-7 py-3.5 rounded-lg text-sm font-bold hover:bg-[#e06c00] transition-all shadow-lg shadow-orange-500/25"
              >
                Launch Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/predictions"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-7 py-3.5 rounded-lg text-sm font-bold hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                View Analytics <BarChart3 className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { label: "Cities Monitored", value: "12", icon: Globe },
              { label: "Active Sensors", value: "1,450+", icon: Activity },
              { label: "Satellite Passes / Day", value: "42", icon: Satellite },
              { label: "Heat Zones Identified", value: "2,380", icon: Thermometer },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                <s.icon className="w-5 h-5 text-[#F57C00] mb-2" />
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-blue-200/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Project Overview ────────────────────────────── */}
      <section id="overview" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="gov-badge mb-4 mx-auto w-fit">Project Overview</div>
            <h2 className="text-3xl font-bold text-[#0A2540]">
              Combating Urban Heat Islands with AI
            </h2>
            <p className="text-[#5A6977] mt-4 leading-relaxed">
              Urban Heat Islands (UHIs) cause cities to be 2-10°C hotter than surrounding areas. 
              HeatShield AI uses satellite imagery, machine learning, and environmental data 
              to identify, predict, and mitigate urban heat hotspots.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Satellite,
                title: "Satellite Monitoring",
                desc: "Continuous analysis of Landsat-9 and Sentinel-2 satellite imagery for Land Surface Temperature, NDVI, and NDBI mapping.",
                color: "#0A2540",
              },
              {
                icon: Brain,
                title: "AI/ML Predictions",
                desc: "Random Forest, XGBoost, and Deep Learning models predict heat risk scores and future temperatures with up to 95% confidence.",
                color: "#2E7D32",
              },
              {
                icon: TreePine,
                title: "Cooling Strategies",
                desc: "Data-driven recommendations for tree plantation, cool roofs, green infrastructure, and reflective pavements with cost-benefit analysis.",
                color: "#F57C00",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#F8FAFB] border border-[#E8ECF0] rounded-xl p-8 hover:shadow-lg transition-shadow group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${item.color}10` }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <h3 className="text-lg font-bold text-[#0A2540] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5A6977] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ───────────────────────────────── */}
      <section id="features" className="py-20 bg-[#F8FAFB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="gov-badge mb-4 mx-auto w-fit">Platform Capabilities</div>
            <h2 className="text-3xl font-bold text-[#0A2540]">
              Comprehensive Heat Analytics
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Map, title: "Interactive GIS Dashboard", desc: "Multi-layer heat maps with ward, district, and city boundaries on satellite and street views." },
              { icon: Thermometer, title: "Hotspot Detection", desc: "AI-powered identification of top heat hotspots ranked by severity, with priority classification." },
              { icon: BarChart3, title: "Predictive Analytics", desc: "7-day, 30-day, and 90-day temperature predictions with trend analysis and confidence intervals." },
              { icon: Zap, title: "AI Recommendations", desc: "Intelligent cooling strategies with expected temperature reduction, energy savings, and cost estimates." },
              { icon: Layers, title: "Cooling Simulator", desc: "Interactive simulation of tree plantation, cool roofs, and reflective pavements with impact projections." },
              { icon: Building, title: "Government Reports", desc: "Auto-generated PDF reports with heat maps, statistics, and recommendations in government-standard format." },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white border border-[#E8ECF0] rounded-xl p-6 hover:border-[#0A2540]/20 transition-all hover:shadow-md group"
              >
                <div className="w-10 h-10 bg-[#0A2540]/5 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0A2540]/10 transition-colors">
                  <f.icon className="w-5 h-5 text-[#0A2540]" />
                </div>
                <h3 className="font-semibold text-[#0A2540] mb-1.5">{f.title}</h3>
                <p className="text-sm text-[#5A6977] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Workflow ──────────────────────────────────── */}
      <section id="workflow" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="gov-badge mb-4 mx-auto w-fit">Technical Architecture</div>
            <h2 className="text-3xl font-bold text-[#0A2540]">AI Processing Workflow</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Data Acquisition", desc: "Satellite imagery and IoT sensor data ingestion", icon: Satellite, color: "#0A2540" },
              { step: "02", title: "Feature Extraction", desc: "NDVI, NDBI, LST computation from raw bands", icon: Layers, color: "#1565C0" },
              { step: "03", title: "ML Processing", desc: "Random Forest & XGBoost ensemble prediction", icon: Brain, color: "#2E7D32" },
              { step: "04", title: "Risk Assessment", desc: "Heat vulnerability scoring and hotspot ranking", icon: Thermometer, color: "#F57C00" },
              { step: "05", title: "Strategy Output", desc: "Cooling recommendations and simulation results", icon: TreePine, color: "#C62828" },
            ].map((w, i) => (
              <div key={w.step} className="relative">
                <div className="bg-[#F8FAFB] border border-[#E8ECF0] rounded-xl p-5 text-center hover:shadow-md transition-shadow h-full">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-sm"
                    style={{ backgroundColor: w.color }}
                  >
                    {w.step}
                  </div>
                  <h4 className="font-semibold text-[#0A2540] text-sm mb-1">{w.title}</h4>
                  <p className="text-xs text-[#5A6977]">{w.desc}</p>
                </div>
                {i < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-[#D1D9E0]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Heat Mitigation Strategies ───────────────────── */}
      <section id="strategies" className="py-20 bg-[#0A2540] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="gov-badge text-white/80 border-white/15 bg-white/5 mb-4 mx-auto w-fit">
              Mitigation Approaches
            </div>
            <h2 className="text-3xl font-bold">Heat Mitigation Strategies</h2>
            <p className="text-blue-200/60 mt-3">
              Evidence-based cooling interventions with measurable impact
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TreePine, title: "Urban Forestry", reduction: "2-4°C", desc: "Strategic tree plantation in heat corridors" },
              { icon: Building, title: "Cool Roofs", reduction: "3-5°C", desc: "High-albedo reflective roof coatings" },
              { icon: Layers, title: "Green Roofs", reduction: "2-3°C", desc: "Vegetated rooftop systems" },
              { icon: Droplets, title: "Water Bodies", reduction: "1-3°C", desc: "Urban water features for evaporative cooling" },
            ].map((s) => (
              <div key={s.title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <s.icon className="w-8 h-8 text-[#F57C00] mb-4" />
                <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                <div className="text-[#4CAF50] font-bold text-sm mb-2">↓ {s.reduction} reduction</div>
                <p className="text-sm text-blue-200/50">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Satellite Monitoring ─────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="gov-badge mb-4">Satellite Data Sources</div>
              <h2 className="text-3xl font-bold text-[#0A2540] mb-4">Multi-Satellite Monitoring</h2>
              <p className="text-[#5A6977] leading-relaxed mb-6">
                HeatShield AI integrates data from multiple satellite platforms to provide 
                comprehensive thermal monitoring coverage across Indian cities.
              </p>
              <div className="space-y-4">
                {[
                  { name: "Landsat-9", band: "TIRS Band 10/11", res: "100m thermal", org: "NASA/USGS" },
                  { name: "Sentinel-2", band: "MSI 13 bands", res: "10m optical", org: "ESA/Copernicus" },
                  { name: "MODIS", band: "LST Products", res: "1km daily", org: "NASA Terra/Aqua" },
                  { name: "INSAT-3D", band: "Thermal IR", res: "4km real-time", org: "ISRO" },
                ].map((sat) => (
                  <div key={sat.name} className="flex items-start gap-4 bg-[#F8FAFB] border border-[#E8ECF0] rounded-lg p-4">
                    <Satellite className="w-5 h-5 text-[#0A2540] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-[#0A2540] text-sm">{sat.name} <span className="text-[#5A6977] font-normal">— {sat.org}</span></div>
                      <div className="text-xs text-[#5A6977] mt-0.5">{sat.band} · {sat.res}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#F8FAFB] border border-[#E8ECF0] rounded-xl p-8">
              <h3 className="font-semibold text-[#0A2540] mb-4">Data Processing Pipeline</h3>
              <div className="space-y-3">
                {[
                  { label: "Raw Band Processing", pct: 100 },
                  { label: "Atmospheric Correction", pct: 95 },
                  { label: "LST Retrieval (Split-Window)", pct: 92 },
                  { label: "NDVI / NDBI Computation", pct: 98 },
                  { label: "Heat Vulnerability Mapping", pct: 88 },
                  { label: "ML Risk Prediction", pct: 91 },
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#5A6977]">{p.label}</span>
                      <span className="font-medium text-[#0A2540]">{p.pct}%</span>
                    </div>
                    <div className="h-2 bg-[#E8ECF0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${p.pct}%`,
                          background: p.pct > 95 ? "#2E7D32" : p.pct > 90 ? "#0A2540" : "#F57C00",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────── */}
      <footer className="bg-[#0A2540] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#F57C00]" />
                </div>
                <div>
                  <span className="font-bold text-lg">HeatShield</span>
                  <span className="font-bold text-[#F57C00] text-lg ml-0.5">AI</span>
                </div>
              </div>
              <p className="text-sm text-blue-200/50 max-w-md leading-relaxed">
                A national initiative under the Smart Cities Mission for AI-powered 
                urban heat island monitoring and mitigation. Developed in collaboration 
                with ISRO, IMD, and Ministry of Environment.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-blue-200/50">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/dashboard/heatmaps" className="hover:text-white transition-colors">Heat Maps</Link></li>
                <li><Link href="/dashboard/predictions" className="hover:text-white transition-colors">Predictions</Link></li>
                <li><Link href="/dashboard/simulator" className="hover:text-white transition-colors">Simulator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-blue-200/50">
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data Sources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research Papers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-blue-200/40">
              © 2026 HeatShield AI · Government of India · All rights reserved
            </p>
            <p className="text-xs text-blue-200/40">
              Powered by Landsat-9, Sentinel-2, MODIS, INSAT-3D · Version 1.0.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
