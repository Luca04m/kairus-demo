"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/* ─── Dynamic recharts re-exports (code-split, no SSR) ─── */

function lazyRecharts<K extends string>(name: K) {
  return dynamic(
    () => import("recharts").then((mod) => ({ default: (mod as unknown as Record<string, ComponentType>)[name] })),
    { ssr: false }
  ) as ComponentType<Record<string, unknown>>;
}

// Layout
export const ResponsiveContainer = lazyRecharts("ResponsiveContainer");

// Charts
export const AreaChart = lazyRecharts("AreaChart");
export const BarChart = lazyRecharts("BarChart");
export const PieChart = lazyRecharts("PieChart");
export const LineChart = lazyRecharts("LineChart");

// Components
export const Area = lazyRecharts("Area");
export const Bar = lazyRecharts("Bar");
export const Line = lazyRecharts("Line");
export const Pie = lazyRecharts("Pie");
export const Cell = lazyRecharts("Cell");
export const XAxis = lazyRecharts("XAxis");
export const YAxis = lazyRecharts("YAxis");
export const CartesianGrid = lazyRecharts("CartesianGrid");
export const Tooltip = lazyRecharts("Tooltip");
export const Legend = lazyRecharts("Legend");
export const ReferenceLine = lazyRecharts("ReferenceLine");
export const ReferenceDot = lazyRecharts("ReferenceDot");
