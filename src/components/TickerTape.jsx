import React, { useEffect, useMemo, useState } from "react";

export default function TickerTape({ items }) {
  // light animation without external libs
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const rendered = useMemo(() => {
    return items.map((it, idx) => {
      const up = it.delta >= 0;
      const col = up ? "rgba(42,245,152,.9)" : "rgba(255,77,109,.9)";
      return (
        <div
          key={idx}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            padding: "8px 12px",
            borderRight: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <div style={{ fontWeight: 700 }}>{it.label}</div>
          <div className="mono" style={{ opacity: 0.9 }}>
            {it.value}
          </div>
          <div className="mono" style={{ color: col }}>
            {up ? "+" : ""}
            {it.delta}
          </div>
        </div>
      );
    });
  }, [items, tick]);

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 16,
        overflow: "hidden",
        background: "rgba(10,18,36,.25)",
      }}
    >
      <div style={{ display: "flex", whiteSpace: "nowrap" }}>{rendered}</div>
    </div>
  );
}
