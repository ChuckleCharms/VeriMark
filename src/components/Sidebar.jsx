import React from "react";

const NAV = [
  { to: "/app/overview", label: "Overview" },
  { to: "/app/markets", label: "Signals" },
  { to: "/app/screener", label: "Assets" },
  { to: "/app/pipelines", label: "Pipelines" },
  { to: "/app/agents", label: "Agents" },
  { to: "/app/model-lab", label: "Model Lab" },
  { to: "/app/news-sentiment", label: "News + Sentiment" },
  { to: "/app/monitoring", label: "Monitoring" },
  { to: "/app/risk", label: "Risk" },
  { to: "/app/education", label: "Education Center" },
];

export default function Sidebar({ session, onLogout, path, navigate }) {
  return (
    <div className="sidebarWrap">
      <div style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, letterSpacing: 0.2 }}>VeriMark</div>
            <div className="small">Provenance • Integrity • Trust</div>
          </div>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "var(--brand)",
              boxShadow: "0 0 18px rgba(0,229,255,.6)",
            }}
          />
        </div>

        <div className="hr" />

        <div className="small" style={{ marginBottom: 10 }}>
          Signed in as{" "}
          <span style={{ color: "rgba(233,238,255,.9)" }}>
            {session?.email}
          </span>
          <div className="mono" style={{ marginTop: 6, opacity: 0.8 }}>
            role: {session?.role}
          </div>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          {NAV.map((item) => {
            const isActive = path === item.to;
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                style={{
                  display: "flex",
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: `1px solid ${
                    isActive ? "rgba(0,229,255,.35)" : "rgba(255,255,255,.08)"
                  }`,
                  background: isActive
                    ? "rgba(0,229,255,.08)"
                    : "rgba(10,18,36,.20)",
                  color: "rgba(233,238,255,.92)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="hr" />

        <button
          className="btn ghost"
          onClick={onLogout}
          style={{ width: "100%" }}
        >
          Log out
        </button>

        <div style={{ marginTop: 12 }} className="small">
          Tip: Press <kbd>/</kbd> to focus search
        </div>
      </div>
    </div>
  );
}
