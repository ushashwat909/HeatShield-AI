/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Client-side mock data for HeatShield AI.
 * Used as fallback when the backend API is not available.
 */

// ─── Delhi Regions ──────────────────────────────────────

export const DELHI_REGIONS = [
  { id: 1, name: "Connaught Place", ward: "W-01", lat: 28.6315, lon: 77.2167, type: "commercial" },
  { id: 2, name: "Chandni Chowk", ward: "W-02", lat: 28.6506, lon: 77.2334, type: "old_city" },
  { id: 3, name: "Karol Bagh", ward: "W-03", lat: 28.6519, lon: 77.1907, type: "commercial" },
  { id: 4, name: "Saket", ward: "W-04", lat: 28.5244, lon: 77.2066, type: "residential" },
  { id: 5, name: "Dwarka", ward: "W-05", lat: 28.5823, lon: 77.0500, type: "residential" },
  { id: 6, name: "Nehru Place", ward: "W-06", lat: 28.5491, lon: 77.2533, type: "commercial" },
  { id: 7, name: "Lajpat Nagar", ward: "W-07", lat: 28.5677, lon: 77.2433, type: "commercial" },
  { id: 8, name: "Rohini", ward: "W-08", lat: 28.7321, lon: 77.1199, type: "residential" },
  { id: 9, name: "Janakpuri", ward: "W-09", lat: 28.6219, lon: 77.0878, type: "residential" },
  { id: 10, name: "Mayur Vihar", ward: "W-10", lat: 28.5937, lon: 77.2973, type: "residential" },
  { id: 11, name: "Pitampura", ward: "W-11", lat: 28.7019, lon: 77.1316, type: "residential" },
  { id: 12, name: "Anand Vihar", ward: "W-12", lat: 28.6469, lon: 77.3164, type: "mixed" },
  { id: 13, name: "Shahdara", ward: "W-13", lat: 28.6741, lon: 77.2894, type: "industrial" },
  { id: 14, name: "Okhla Industrial", ward: "W-14", lat: 28.5307, lon: 77.2713, type: "industrial" },
  { id: 15, name: "Narela", ward: "W-15", lat: 28.8526, lon: 77.0929, type: "semi_urban" },
  { id: 16, name: "India Gate", ward: "W-16", lat: 28.6129, lon: 77.2295, type: "green_space" },
  { id: 17, name: "Lodhi Garden", ward: "W-17", lat: 28.5931, lon: 77.2197, type: "green_space" },
  { id: 18, name: "ITO", ward: "W-18", lat: 28.6281, lon: 77.2428, type: "commercial" },
  { id: 19, name: "Noida Border", ward: "W-19", lat: 28.5706, lon: 77.3273, type: "mixed" },
  { id: 20, name: "Mundka Industrial", ward: "W-20", lat: 28.6839, lon: 77.0293, type: "industrial" },
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getBaseTemp(type: string) {
  const m: Record<string, number> = {
    commercial: 44.5, old_city: 46, residential: 42, industrial: 47.5,
    mixed: 43.5, semi_urban: 40, green_space: 37.5,
  };
  return m[type] || 43;
}

function getNdvi(type: string) {
  const m: Record<string, [number, number]> = {
    commercial: [0.05, 0.15], old_city: [0.03, 0.10], residential: [0.15, 0.35],
    industrial: [0.02, 0.08], mixed: [0.10, 0.25], semi_urban: [0.25, 0.45],
    green_space: [0.55, 0.80],
  };
  const r = m[type] || [0.1, 0.3];
  return +rand(r[0], r[1]).toFixed(3);
}

function getNdbi(type: string) {
  const m: Record<string, [number, number]> = {
    commercial: [0.55, 0.75], old_city: [0.65, 0.85], residential: [0.35, 0.55],
    industrial: [0.70, 0.90], mixed: [0.40, 0.60], semi_urban: [0.20, 0.40],
    green_space: [0.05, 0.15],
  };
  const r = m[type] || [0.3, 0.6];
  return +rand(r[0], r[1]).toFixed(3);
}

export function riskLevel(temp: number) {
  if (temp >= 48) return "extreme";
  if (temp >= 45) return "very_high";
  if (temp >= 42) return "high";
  if (temp >= 38) return "moderate";
  return "low";
}

function riskScore(temp: number) {
  return +Math.min(100, Math.max(0, (temp - 30) * 5)).toFixed(1);
}

function priority(risk: string) {
  return { extreme: "Critical", very_high: "Critical", high: "High", moderate: "Medium", low: "Low" }[risk] || "Medium";
}

// ─── Dashboard Summary ──────────────────────────────────

export function getMockDashboardSummary() {
  return {
    current_temperature: +rand(42, 47).toFixed(1),
    avg_lst: +rand(43, 48).toFixed(1),
    max_lst: +rand(48, 53).toFixed(1),
    min_lst: +rand(35, 40).toFixed(1),
    avg_ndvi: +rand(0.15, 0.25).toFixed(3),
    avg_ndbi: +rand(0.45, 0.60).toFixed(3),
    total_hotspots: Math.floor(rand(8, 15)),
    critical_zones: Math.floor(rand(3, 6)),
    overall_risk: "high",
    monitored_area_sqkm: 1483,
    population_at_risk: Math.floor(rand(2500000, 4500000)),
    active_sensors: Math.floor(rand(120, 180)),
    last_satellite_pass: new Date(Date.now() - rand(2, 12) * 3600000).toISOString(),
    data_source: "Landsat-9 / Sentinel-2",
    trend_7day: +rand(-0.5, 1.5).toFixed(1),
    trend_30day: +rand(0.5, 3.0).toFixed(1),
  };
}

// ─── Heatmap GeoJSON ─────────────────────────────────────

export function getMockHeatmapGeoJSON() {
  const features: any[] = [];
  for (const region of DELHI_REGIONS) {
    const temp = +(getBaseTemp(region.type) + rand(-2, 3)).toFixed(1);
    const ndvi = getNdvi(region.type);
    const ndbi = getNdbi(region.type);
    const risk = riskLevel(temp);
    const offset = 0.012;
    features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [region.lon - offset, region.lat - offset],
          [region.lon + offset, region.lat - offset],
          [region.lon + offset, region.lat + offset],
          [region.lon - offset, region.lat + offset],
          [region.lon - offset, region.lat - offset],
        ]],
      },
      properties: {
        id: region.id, name: region.name, ward: region.ward,
        land_surface_temp: temp, air_temperature: +(temp - rand(3, 6)).toFixed(1),
        ndvi, ndbi, humidity: +rand(25, 55).toFixed(1), wind_speed: +rand(2, 12).toFixed(1),
        risk_level: risk, risk_score: riskScore(temp), heat_index: +(temp + rand(2, 8)).toFixed(1),
        land_use: region.type, population_density: Math.floor(rand(5000, 35000)),
      },
    });
  }
  return {
    type: "FeatureCollection",
    features,
    metadata: {
      city: "Delhi", data_source: "Landsat-9 / Sentinel-2",
      acquisition_date: new Date().toISOString().split("T")[0],
      total_features: features.length,
    },
  };
}

// ─── Hotspots ────────────────────────────────────────────

export function getMockHotspots() {
  const hotspots = DELHI_REGIONS.map((r, i) => {
    const temp = +(getBaseTemp(r.type) + rand(-1, 4)).toFixed(1);
    const risk = riskLevel(temp);
    return {
      rank: 0, region_name: r.name, ward_number: r.ward,
      latitude: r.lat, longitude: r.lon, temperature: temp,
      risk_level: risk, risk_score: riskScore(temp),
      ndvi: getNdvi(r.type), ndbi: getNdbi(r.type),
      priority: priority(risk),
      population_affected: Math.floor(rand(15000, 250000)),
    };
  }).sort((a, b) => b.temperature - a.temperature).slice(0, 10);
  hotspots.forEach((h, i) => { h.rank = i + 1; });
  return {
    city: "Delhi", total_hotspots: hotspots.length,
    critical_count: hotspots.filter(h => h.priority === "Critical").length,
    high_count: hotspots.filter(h => h.priority === "High").length,
    hotspots, timestamp: new Date().toISOString(),
  };
}

// ─── Predictions ─────────────────────────────────────────

export function getMockPredictions(regionId = 0, horizon = 30) {
  const region = DELHI_REGIONS[Math.min(regionId, DELHI_REGIONS.length - 1)];
  const baseTemp = getBaseTemp(region.type);
  const currentTemp = +(baseTemp + rand(-1, 2)).toFixed(1);
  const predictions = [];
  const now = Date.now();
  for (let d = 0; d < horizon; d++) {
    const date = new Date(now + d * 86400000);
    const seasonal = Math.sin((d / horizon) * Math.PI) * 2;
    const noise = rand(-1.5, 1.5);
    const predTemp = +(currentTemp + seasonal + noise + d * 0.03).toFixed(1);
    predictions.push({
      date: date.toISOString().split("T")[0],
      current_temp: d === 0 ? currentTemp : null,
      predicted_temp: predTemp,
      risk_level: riskLevel(predTemp),
      confidence: +Math.max(0.65, 0.95 - d * 0.003).toFixed(2),
    });
  }
  const avg = +(predictions.reduce((s, p) => s + p.predicted_temp, 0) / predictions.length).toFixed(1);
  const max = Math.max(...predictions.map(p => p.predicted_temp));
  return {
    region_name: region.name, horizon_days: horizon,
    current_temperature: currentTemp,
    average_predicted_temp: avg, max_predicted_temp: +max.toFixed(1),
    risk_level: riskLevel(avg), predictions,
    trend: avg > currentTemp + 1 ? "increasing" : avg < currentTemp - 1 ? "decreasing" : "stable",
    model_used: "XGBoost + Random Forest Ensemble",
  };
}

// ─── Recommendations ────────────────────────────────────

export function getMockRecommendations() {
  const recs = [
    { id: 1, category: "Vegetation", title: "Increase Urban Tree Canopy Cover", description: "Deploy drought-resistant native tree species in identified heat corridors. Focus on Neem, Peepal, and Banyan trees that provide maximum canopy coverage.", expected_temp_reduction: 2.8, energy_savings_kwh: 45000, estimated_cost_inr: 12500000, priority_score: 92, implementation_timeline: "6-12 months", region_name: "Chandni Chowk" },
    { id: 2, category: "Cool Roofs", title: "Implement Cool Roof Program", description: "Apply high-albedo reflective coatings on commercial and residential buildings. White or light-colored roof surfaces can reduce surface temperature by 20-30°C.", expected_temp_reduction: 3.5, energy_savings_kwh: 62000, estimated_cost_inr: 8500000, priority_score: 88, implementation_timeline: "3-6 months", region_name: "Okhla Industrial" },
    { id: 3, category: "Green Infrastructure", title: "Install Green Roof Systems", description: "Deploy modular green roof systems on government and commercial buildings. Vegetated roofs provide insulation and reduce stormwater runoff.", expected_temp_reduction: 2.2, energy_savings_kwh: 38000, estimated_cost_inr: 18000000, priority_score: 76, implementation_timeline: "6-18 months", region_name: "Connaught Place" },
    { id: 4, category: "Reflective Pavements", title: "Deploy High-Albedo Pavements", description: "Replace dark asphalt surfaces with reflective pavement materials in major arterial roads and parking lots.", expected_temp_reduction: 1.8, energy_savings_kwh: 28000, estimated_cost_inr: 22000000, priority_score: 71, implementation_timeline: "12-24 months", region_name: "Mundka Industrial" },
    { id: 5, category: "Water Features", title: "Restore Urban Water Bodies", description: "Rejuvenate existing water bodies and create new water features in heat hotspot zones for evaporative cooling.", expected_temp_reduction: 1.5, energy_savings_kwh: 15000, estimated_cost_inr: 35000000, priority_score: 65, implementation_timeline: "12-36 months", region_name: "Shahdara" },
    { id: 6, category: "Smart Systems", title: "Deploy IoT Heat Monitoring Network", description: "Install IoT temperature and humidity sensors across the city for real-time monitoring and predictive alerts.", expected_temp_reduction: 0.5, energy_savings_kwh: 55000, estimated_cost_inr: 15000000, priority_score: 82, implementation_timeline: "3-9 months", region_name: "Citywide" },
    { id: 7, category: "Vegetation", title: "Develop Urban Parks & Green Belts", description: "Create new urban parks and expand green belts. Target minimum 0.5 hectare parks within 500m of all residential areas.", expected_temp_reduction: 3.0, energy_savings_kwh: 40000, estimated_cost_inr: 50000000, priority_score: 85, implementation_timeline: "12-36 months", region_name: "Rohini" },
    { id: 8, category: "Urban Planning", title: "Optimize Building Orientation", description: "Enforce urban planning guidelines for new constructions to maximize wind corridors and minimize heat trapping.", expected_temp_reduction: 1.2, energy_savings_kwh: 20000, estimated_cost_inr: 5000000, priority_score: 60, implementation_timeline: "24-48 months", region_name: "Karol Bagh" },
  ];
  const totalReduction = recs.reduce((s, r) => s + r.expected_temp_reduction, 0);
  return {
    total_recommendations: recs.length, recommendations: recs,
    summary: {
      total_expected_temp_reduction: +totalReduction.toFixed(1),
      total_energy_savings_kwh: recs.reduce((s, r) => s + r.energy_savings_kwh, 0),
      total_estimated_cost_inr: recs.reduce((s, r) => s + r.estimated_cost_inr, 0),
      average_priority_score: +(recs.reduce((s, r) => s + r.priority_score, 0) / recs.length).toFixed(1),
    },
  };
}

// ─── Simulator ───────────────────────────────────────────

export function getMockSimulation(
  trees = 0, coolRoof = 0, greenRoof = 0, reflectivePavement = 0
) {
  const baseline = 45.2;
  const treeR = Math.min(trees * 0.00035, 4);
  const coolR = coolRoof * 0.04;
  const greenR = greenRoof * 0.025;
  const pavR = reflectivePavement * 0.02;
  const total = +(treeR + coolR + greenR + pavR).toFixed(2);
  const treeE = trees * 4.5, coolE = coolRoof * 650, greenE = greenRoof * 420, pavE = reflectivePavement * 280;
  const totalE = Math.round(treeE + coolE + greenE + pavE);
  const totalC = +(totalE * 0.00082).toFixed(2);
  const totalCost = trees * 2500 + coolRoof * 85000 + greenRoof * 180000 + reflectivePavement * 220000;
  const breakdown = [
    { strategy: "Tree Plantation", temp_reduction: +treeR.toFixed(2), energy_savings_kwh: Math.round(treeE), carbon_reduction_tons: +(treeE * 0.00082).toFixed(2), cost_estimate_inr: trees * 2500 },
    { strategy: "Cool Roof Coverage", temp_reduction: +coolR.toFixed(2), energy_savings_kwh: Math.round(coolE), carbon_reduction_tons: +(coolE * 0.00082).toFixed(2), cost_estimate_inr: coolRoof * 85000 },
    { strategy: "Green Roof Systems", temp_reduction: +greenR.toFixed(2), energy_savings_kwh: Math.round(greenE), carbon_reduction_tons: +(greenE * 0.00082).toFixed(2), cost_estimate_inr: greenRoof * 180000 },
    { strategy: "Reflective Pavements", temp_reduction: +pavR.toFixed(2), energy_savings_kwh: Math.round(pavE), carbon_reduction_tons: +(pavE * 0.00082).toFixed(2), cost_estimate_inr: reflectivePavement * 220000 },
  ];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const seasonal = [18, 22, 30, 38, 44, 46, 40, 36, 36, 32, 24, 19];
  const monthly = months.map((m, i) => {
    const factor = Math.min(1, (i + 1) / 6);
    return { month: m, baseline_temp: seasonal[i], mitigated_temp: +(seasonal[i] - total * factor).toFixed(1), reduction: +(total * factor).toFixed(1) };
  });
  return {
    baseline_temperature: baseline, simulated_temperature: +(baseline - total).toFixed(1),
    total_temp_reduction: total, total_energy_savings_kwh: totalE,
    total_carbon_reduction_tons: totalC,
    cost_effectiveness_score: +(total / Math.max(totalCost / 1000000, 0.01)).toFixed(2),
    breakdown, monthly_projections: monthly,
  };
}
