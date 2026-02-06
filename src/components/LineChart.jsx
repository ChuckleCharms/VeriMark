import React, { useMemo } from "react";

export default function LineChart({
  series = [],
  height = 160,
  labelLeft = "min",
  labelRight = "max",
}) {
  const { path, min, max } = useMemo(() => {
    if (!series.length) return { path: "", min: 0, max: 0 };
    const mn = Math.min(...series);
    const mx = Math.max(...series);
    const w = 640;
    const h = height;
    const pad = 12;

    const toX = (i) => pad + (i / (series.length - 1)) * (w - pad * 2);
    const toY = (v) => pad + (1 - (v - mn) / (mx - mn || 1)) * (h - pad * 2);

    let d = "";
    series.forEach((v, i) => {
      const x = toX(i);
      const y = toY(v);
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });

    return { path: d, min: mn, max: mx };
  }, [series, height]);

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
        className="small"
      >
        <span>
          {labelLeft}: <span className="mono">{min}</span>
        </span>
        <span>
          {labelRight}: <span className="mono">{max}</span>
        </span>
      </div>
      <svg
        viewBox={`0 0 640 ${height}`}
        width="100%"
        height={height}
        style={{ marginTop: 8 }}
      >
        <defs>
          <linearGradient id="vm_grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(0,229,255,.85)" />
            <stop offset="1" stopColor="rgba(177,255,106,.75)" />
          </linearGradient>
        </defs>

        <path d={path} fill="none" stroke="url(#vm_grad)" strokeWidth="3.2" />
        <path
          d={path}
          fill="none"
          stroke="rgba(0,0,0,.35)"
          strokeWidth="6"
          opacity=".25"
        />
      </svg>
    </div>
  );
}
