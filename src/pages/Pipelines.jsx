import React from "react";
import { Badge, Card } from "../ui.jsx";
import Table from "../components/Table.jsx";
import { formatAgo } from "../mockData.js";

export default function Pipelines({ state }) {
  const cols = [
    { key: "name", header: "Pipeline", width: "40%" },
    {
      key: "status",
      header: "Status",
      width: "16%",
      render: (r) =>
        r.status === "healthy" ? (
          <Badge tone="good">Healthy</Badge>
        ) : (
          <Badge tone="warn">Degraded</Badge>
        ),
    },
    {
      key: "lastRunAt",
      header: "Last run",
      width: "16%",
      render: (r) => <span className="mono">{formatAgo(r.lastRunAt)}</span>,
    },
    { key: "notes", header: "Notes" },
  ];

  return (
    <div className="page">
      <h1 className="h1">Pipelines</h1>
      <p className="sub">
        Automations that a provenance service would run in production (demo).
      </p>

      <Card
        title="Automation pipelines"
        sub="Upload & signing flows, scheduled integrity scans, and usage rollups."
      >
        <Table columns={cols} rows={state.aiPipelines} />
      </Card>
    </div>
  );
}
