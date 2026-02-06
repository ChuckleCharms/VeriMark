import React, { useState } from "react";
import { Badge, Button, Card, Field, Pill } from "../ui.jsx";

export default function ModelLab() {
  const [mode, setMode] = useState("claims-normalizer");
  const [input, setInput] = useState(`{
  "creator": "Kestrel Studio",
  "organization": "Kestrel Studio LLC",
  "creationDate": "2026-02-05",
  "tool": "Photoshop 2025.1",
  "editsSummary": "Color grade, minor retouch, crop to 4:5",
  "license": "CC BY 4.0"
}`);

  return (
    <div className="page">
      <h1 className="h1">Model Lab</h1>
      <p className="sub">
        A safe “AI workspace” panel that looks real for demos: normalize claims,
        flag anomalies, generate structured summaries (simulated).
      </p>

      <div className="grid2">
        <Card
          title="Tools"
          right={<Pill>simulated</Pill>}
          sub="These controls make the CU feel like a production-grade product without requiring a live model."
        >
          <Field label="Model / pipeline">
            <select
              className="select"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="claims-normalizer">Claims Normalizer</option>
              <option value="anomaly-flagger">Anomaly Flagger</option>
              <option value="license-classifier">License Classifier</option>
              <option value="tool-detector">Tool Detector</option>
            </select>
          </Field>

          <div style={{ height: 12 }} />
          <Badge tone="good">Ready</Badge>
          <div style={{ height: 12 }} />

          <div className="btnRow">
            <Button
              variant="primary"
              onClick={() =>
                alert("Demo: would run inference + output normalized JSON.")
              }
            >
              Run
            </Button>
            <Button variant="ghost" onClick={() => setInput(input.trim())}>
              Format
            </Button>
          </div>
        </Card>

        <Card title="Input" sub="Paste claim JSON or extracted metadata.">
          <textarea
            className="textarea mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ minHeight: 220 }}
          />
        </Card>
      </div>

      <div style={{ height: 16 }} />

      <Card
        title="Output"
        sub="Example output that looks like a real pipeline result (static)."
      >
        <pre
          className="mono"
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            color: "rgba(233,238,255,.9)",
          }}
        >
          {`{
  "normalized": true,
  "schemaVersion": "vm.claims/1.0",
  "creator": "Kestrel Studio",
  "organization": "Kestrel Studio LLC",
  "creationDate": "2026-02-05",
  "tool": {
    "name": "Adobe Photoshop",
    "version": "2025.1"
  },
  "edits": [
    { "type": "color_grade", "confidence": 0.78 },
    { "type": "crop", "confidence": 0.71 },
    { "type": "retouch", "confidence": 0.63 }
  ],
  "license": { "id": "CC-BY-4.0", "confidence": 0.93 },
  "warnings": []
}`}
        </pre>
      </Card>
    </div>
  );
}
