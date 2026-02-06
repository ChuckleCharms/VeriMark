import React from "react";
import { Card } from "../ui.jsx";

export default function Portfolio() {
  return (
    <div className="page">
      <h1 className="h1">Portfolio</h1>
      <p className="sub">
        Reserved space in this CU. In a full product this could be
        “Organizations / Projects / Workspaces”.
      </p>
      <Card
        title="Workspaces"
        sub="Demo screen placeholder (intentionally minimal)."
      >
        <div className="small">
          This CU focuses on provenance flows: upload → claims → sign → verify.
        </div>
      </Card>
    </div>
  );
}
