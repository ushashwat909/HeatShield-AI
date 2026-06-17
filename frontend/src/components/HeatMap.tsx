"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getMockHeatmapGeoJSON, riskLevel } from "@/lib/mock-data";
import { getRiskColor, formatTemperature } from "@/lib/utils";

function getHeatColor(temp: number): string {
  if (temp >= 48) return "#B71C1C";
  if (temp >= 45) return "#F44336";
  if (temp >= 42) return "#FF9800";
  if (temp >= 38) return "#FFEB3B";
  if (temp >= 34) return "#4CAF50";
  return "#2196F3";
}

export default function HeatMap({ height = "100%" }: { height?: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [28.6139, 77.209],
      zoom: 11,
      zoomControl: true,
      attributionControl: true,
    });

    // Tile layers
    const streetLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }
    );

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "© Esri" }
    );

    const terrainLayer = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      { attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a>' }
    );

    streetLayer.addTo(map);

    // Layer control
    const baseMaps: Record<string, L.TileLayer> = {
      "Street": streetLayer,
      "Satellite": satelliteLayer,
      "Terrain": terrainLayer,
    };
    L.control.layers(baseMaps, {}, { position: "topright" }).addTo(map);

    // Load heatmap GeoJSON data
    const geojson = getMockHeatmapGeoJSON();

    L.geoJSON(geojson as unknown as GeoJSON.GeoJsonObject, {
      style: (feature) => {
        const temp = feature?.properties?.land_surface_temp ?? 40;
        return {
          fillColor: getHeatColor(temp),
          fillOpacity: 0.55,
          color: getHeatColor(temp),
          weight: 1.5,
          opacity: 0.8,
        };
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties?.name) {
          const p = feature.properties;
          const riskColor = getRiskColor(p.risk_level);
          layer.bindPopup(`
            <div style="min-width:200px;font-family:Inter,sans-serif">
              <div style="font-weight:700;font-size:14px;color:#0A2540;margin-bottom:6px">
                ${p.name}
                <span style="font-size:11px;font-weight:400;color:#5A6977;margin-left:4px">${p.ward || ""}</span>
              </div>
              <table style="width:100%;font-size:12px;border-collapse:collapse">
                <tr><td style="color:#5A6977;padding:2px 0">Surface Temp</td><td style="font-weight:600;text-align:right">${formatTemperature(p.land_surface_temp)}</td></tr>
                <tr><td style="color:#5A6977;padding:2px 0">Air Temp</td><td style="font-weight:600;text-align:right">${p.air_temperature ? formatTemperature(p.air_temperature) : "—"}</td></tr>
                <tr><td style="color:#5A6977;padding:2px 0">NDVI</td><td style="font-weight:600;text-align:right;color:#2E7D32">${p.ndvi}</td></tr>
                <tr><td style="color:#5A6977;padding:2px 0">NDBI</td><td style="font-weight:600;text-align:right;color:#F57C00">${p.ndbi}</td></tr>
                <tr><td style="color:#5A6977;padding:2px 0">Risk Score</td><td style="font-weight:600;text-align:right">${p.risk_score}/100</td></tr>
                <tr><td style="color:#5A6977;padding:2px 0">Risk Level</td><td style="font-weight:700;text-align:right;color:${riskColor}">${p.risk_level?.replace("_", " ").toUpperCase()}</td></tr>
              </table>
            </div>
          `);
        }
      },
    }).addTo(map);

    // Color scale legend
    const legend = new L.Control({ position: "bottomright" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "");
      div.innerHTML = `
        <div style="background:white;padding:10px 14px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);font-family:Inter,sans-serif">
          <div style="font-size:10px;font-weight:600;color:#5A6977;margin-bottom:6px;letter-spacing:0.05em">TEMPERATURE °C</div>
          <div style="display:flex;align-items:center;gap:0">
            <div style="width:120px;height:12px;border-radius:6px;background:linear-gradient(90deg,#2196F3,#4CAF50,#FFEB3B,#FF9800,#F44336,#B71C1C)"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:9px;color:#5A6977;margin-top:3px">
            <span>30</span><span>38</span><span>42</span><span>48</span><span>52+</span>
          </div>
        </div>
      `;
      return div;
    };
    legend.addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return <div ref={mapRef} style={{ height, width: "100%" }} />;
}
