import React, { useEffect, useRef } from "react";
import { Button, Pill } from "../ui.jsx";

export default function TopBar({ title, subtitle, search, setSearch, right }) {
  const ref = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="topbarWrap">
      <div style={{ padding: "14px 16px", maxWidth: 1320, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 280 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <div style={{ fontWeight: 700 }}>{title}</div>
              <Pill>c2pa-style bundle</Pill>
              <Pill>local demo</Pill>
            </div>
            <div className="small">{subtitle}</div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <input
              ref={ref}
              className="input"
              style={{ width: `clamp(280px, 40vw, 360px)` }}
              placeholder="Search assets, ids, claims…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {right || <Button variant="ghost">Quick Actions</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
