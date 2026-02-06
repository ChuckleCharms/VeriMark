import React, { useMemo } from "react";

export default function Sparkline({ series = [], height = 34 }) {
  const d = useMemo(() => {
    if (!series.length) return "";
    const mn = Math.min(...series);
    const mx = Math.max(...series);
    const w = 160;
    const h = height;
    const pad = 4;
    const toX = (i) => pad + (i / (series.length - 1)) * (w - pad * 2);
    const toY = (v) => pad + (1 - (v - mn) / (mx - mn || 1)) * (h - pad * 2);
    let p = "";
    series.forEach((v, i) => {
      p += i === 0 ? `M ${toX(i)} ${toY(v)}` : ` L ${toX(i)} ${toY(v)}`;
    });
    return p;
  }, [series, height]);

  return (
    <svg viewBox={`0 0 160 ${height}`} width="160" height={height}>
      <path d={d} fill="none" stroke="rgba(0,229,255,.9)" strokeWidth="2.5" />
    </svg>
  );
}
