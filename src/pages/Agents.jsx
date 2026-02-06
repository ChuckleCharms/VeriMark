import React from "react";
import { Badge, Card } from "../ui.jsx";
import Table from "../components/Table.jsx";
import { formatAgo } from "../mockData.js";

export default function Agents({ state }) {
  const cols = [
    { key: "name", header: "Agent", width: "26%" },
    {
      key: "status",
      header: "Status",
      width: "16%",
      render: (r) =>
        r.status === "online" ? (
          <Badge tone="good">Online</Badge>
        ) : (
          <Badge tone="warn">Degraded</Badge>
        ),
    },
    {
      key: "queue",
      header: "Queue",
      width: "12%",
      render: (r) => <span className="mono">{r.queue}</span>,
    },
    { key: "lastAction", header: "Last action" },
    {
      key: "at",
      header: "When",
      width: "14%",
      render: (r) => <span className="mono">{formatAgo(r.at)}</span>,
    },
  ];

  return (
    <div className="page">
      <h1 className="h1">Agents</h1>
      <p className="sub">
        Background-style actors (simulated) that watch integrity, normalize
        claims, and monitor rate limiting.
      </p>

      <Card title="Agent fleet">
        <Table columns={cols} rows={state.agents} />
      </Card>
    </div>
  );
}
