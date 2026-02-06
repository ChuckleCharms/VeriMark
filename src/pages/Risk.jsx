import React from "react";
import { Badge, Card, Pill } from "../ui.jsx";
import Table from "../components/Table.jsx";

export default function Risk({ state }) {
  const cols = [
    { key: "reason", header: "Block / failure reason" },
    {
      key: "count",
      header: "Count (24h)",
      width: "20%",
      render: (r) => <span className="mono">{r.count}</span>,
    },
  ];

  return (
    <div className="page">
      <h1 className="h1">Risk</h1>
      <p className="sub">
        Security and abuse posture (simulated). Shows typical gates: type/size
        checks, signature validity, rate limiting.
      </p>

      <div className="grid3">
        <Card
          title="Rate limiting"
          right={<Badge tone="warn">Active</Badge>}
          sub="Requests blocked by burst thresholds."
        >
          <div className="mono" style={{ fontSize: 22 }}>
            {state.risk.rateLimited24h}
          </div>
          <div className="small">blocked in last 24 hours</div>
        </Card>

        <Card
          title="Blocked uploads"
          right={<Badge tone="warn">Policy</Badge>}
          sub="Files rejected by type/size rules."
        >
          <div className="mono" style={{ fontSize: 22 }}>
            {state.risk.blockedUploads24h}
          </div>
          <div className="small">blocked in last 24 hours</div>
        </Card>

        <Card
          title="Suspicious IPs"
          right={<Pill>watch</Pill>}
          sub="IPs flagged by anomaly patterns."
        >
          <div className="mono" style={{ fontSize: 22 }}>
            {state.risk.suspiciousIPs24h}
          </div>
          <div className="small">flagged in last 24 hours</div>
        </Card>
      </div>

      <div style={{ height: 16 }} />

      <Card
        title="Top reasons"
        sub="This table mirrors what an operations team looks at when integrity failures increase."
      >
        <Table columns={cols} rows={state.risk.topReasons} />
      </Card>
    </div>
  );
}
