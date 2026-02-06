import React from "react";
import { Card } from "../ui.jsx";

export default function Backtest() {
  return (
    <div className="page">
      <h1 className="h1">Backtest</h1>
      <p className="sub">Used here as “historical integrity replay” (demo).</p>
      <Card title="Integrity replay" sub="Demo-only visualization">
        <div className="small">
          A real build would replay verification outcomes across time and export
          reports.
        </div>
      </Card>
    </div>
  );
}
