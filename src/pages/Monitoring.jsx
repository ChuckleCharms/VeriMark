import React, { useMemo } from "react";
import { Card } from "../ui.jsx";
import Table from "../components/Table.jsx";
import { formatAgo } from "../mockData.js";

export default function Monitoring({ state }) {
  const cols = [
    {
      key: "at",
      header: "Time",
      width: "16%",
      render: (r) => <span className="mono">{formatAgo(r.at)}</span>,
    },
    {
      key: "level",
      header: "Level",
      width: "10%",
      render: (r) => (
        <span className="mono" style={{ opacity: 0.9 }}>
          {r.level}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      width: "18%",
      render: (r) => <span className="mono">{r.action}</span>,
    },
    {
      key: "actor",
      header: "Actor",
      width: "18%",
      render: (r) => <span className="mono">{r.actor}</span>,
    },
    { key: "meta", header: "Details" },
  ];

  const rows = useMemo(() => state.usageLogs.slice(0, 18), [state.usageLogs]);

  return (
    <div className="page">
      <h1 className="h1">Monitoring</h1>
      <p className="sub">
        Usage logs (demo) showing sign/verify actions, API key operations, and
        integrity mismatches.
      </p>

      <Card
        title="Usage logs"
        sub="In a real system this would be an audit log table with query + export."
      >
        <Table columns={cols} rows={rows} />
      </Card>
    </div>
  );
}
