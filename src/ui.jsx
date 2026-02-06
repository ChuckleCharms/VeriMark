import React from "react";

export function Badge({ tone = "info", children }) {
  const cls =
    tone === "good"
      ? "dot good"
      : tone === "warn"
      ? "dot warn"
      : tone === "bad"
      ? "dot bad"
      : "dot";
  return (
    <span className="badge">
      <span className={cls} />
      {children}
    </span>
  );
}

export function Card({ title, right, sub, children }) {
  return (
    <div className="card">
      <div className="cardTitle">
        <h3>{title}</h3>
        {right}
      </div>
      {sub ? <div className="small">{sub}</div> : null}
      {sub ? <div className="hr" /> : <div style={{ height: 8 }} />}
      {children}
    </div>
  );
}

export function Button({ variant = "default", children, ...props }) {
  const cls =
    variant === "primary"
      ? "btn primary"
      : variant === "danger"
      ? "btn danger"
      : variant === "ghost"
      ? "btn ghost"
      : "btn";
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <div className="label">{label}</div>
      {children}
    </div>
  );
}

export function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

export function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modalHead">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button className="btn ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function levelDot(level) {
  if (level === "info") return "dot";
  if (level === "warn") return "dot warn";
  if (level === "bad" || level === "error") return "dot bad";
  return "dot";
}

export function Empty({
  title = "Nothing here yet",
  sub = "Add items to see them appear.",
}) {
  return (
    <div className="card" style={{ textAlign: "center", padding: "22px" }}>
      <div style={{ fontSize: 14, marginBottom: 6 }}>{title}</div>
      <div className="small">{sub}</div>
    </div>
  );
}
