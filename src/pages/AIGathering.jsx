import React from "react";
import { Card } from "../ui.jsx";

export default function AIGathering() {
  return (
    <div className="page">
      <h1 className="h1">AI Gathering</h1>
      <p className="sub">
        Represents ingestion pipelines that extract metadata and prefill claims
        (demo view).
      </p>
      <Card title="Extraction sources" sub="Demo">
        <div className="small">
          EXIF parsing • container metadata • edit history hints • license
          heuristics • tool fingerprinting (simulated)
        </div>
      </Card>
    </div>
  );
}
