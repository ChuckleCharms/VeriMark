import React from "react";
import { Badge, Card } from "../ui.jsx";
import Table from "../components/Table.jsx";
import { formatAgo } from "../mockData.js";

export default function NewsSentiment({ state }) {
  const cols = [
    { key: "title", header: "Headline" },
    { key: "source", header: "Source", width: "18%" },
    {
      key: "sentiment",
      header: "Sentiment",
      width: "16%",
      render: (r) =>
        r.sentiment === "positive" ? (
          <Badge tone="good">Positive</Badge>
        ) : r.sentiment === "negative" ? (
          <Badge tone="bad">Negative</Badge>
        ) : (
          <Badge tone="warn">Neutral</Badge>
        ),
    },
    {
      key: "at",
      header: "When",
      width: "14%",
      render: (r) => <span className="mono">{formatAgo(r.at)}</span>,
    },
  ];

  return (
    <div className="page">
      <h1 className="h1">News + Sentiment</h1>
      <p className="sub">
        “External signals” panel (demo) used by teams to anticipate demand
        spikes and abuse patterns.
      </p>

      <Card title="Signals feed">
        <Table columns={cols} rows={state.news} />
      </Card>
    </div>
  );
}
