import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTemperature(temp: number): string {
  return `${temp.toFixed(1)}°C`;
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString("en-IN");
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getRiskColor(risk: string): string {
  const colors: Record<string, string> = {
    low: "#2196F3",
    moderate: "#4CAF50",
    high: "#FF9800",
    very_high: "#F44336",
    extreme: "#B71C1C",
  };
  return colors[risk] || "#9E9E9E";
}

export function getRiskBgClass(risk: string): string {
  const classes: Record<string, string> = {
    low: "risk-bg-low",
    moderate: "risk-bg-moderate",
    high: "risk-bg-high",
    very_high: "risk-bg-very-high",
    extreme: "risk-bg-extreme",
  };
  return classes[risk] || "";
}

export function getRiskTextClass(risk: string): string {
  const classes: Record<string, string> = {
    low: "risk-low",
    moderate: "risk-moderate",
    high: "risk-high",
    very_high: "risk-very-high",
    extreme: "risk-extreme",
  };
  return classes[risk] || "";
}
