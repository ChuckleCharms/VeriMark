import React, { useMemo, useState } from "react";
import { Badge, Button, Card, Pill } from "../ui.jsx";
import Table from "../components/Table.jsx";
import { formatAgo } from "../mockData.js";

export default function Screener({ state, search, navigate }) {
  const [status, setStatus] = useState("all"); // all | verified | failed | pending
  const [signer, setSigner] = useState("all"); // all | demo | extensible

  const rows = useMemo(() => {
    const q = (search || "").toLowerCase().trim();

    let list = [...(state.assets || [])];

    if (status !== "all") {
      list = list.filter((a) => a.status === status);
    }

    if (signer !== "all") {
      list = list.filter((a) => a.signerMode === signer);
    }

    if (q) {
      list = list.filter((a) => {
        const hay = [
          a.id,
          a.filename,
          a.type,
          a.status,
          a.signerMode,
          a.bundle?.claims?.creator,
          a.bundle?.claims?.organization,
          a.bundle?.signature,
          a.bundle?.assetHash,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    // newest first
    list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return list;
  }, [state.assets, search, status, signer]);

  const cols = [
    {
      key: "id",
      header: "Asset",
      width: "24%",
      render: (r) => (
        <div>
          <div style={{ fontWeight: 800 }} className="mono">
            {r.id}
          </div>
          <div className="dim">{r.filename}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "18%",
      render: (r) =>
        r.status === "verified" ? (
          <Badge tone="good">Verified</Badge>
        ) : r.status === "failed" ? (
          <Badge tone="bad">Integrity Failed</Badge>
        ) : (
          <Badge tone="warn">Pending</Badge>
        ),
    },
    {
      key: "type",
      header: "Type",
      width: "16%",
      render: (r) => <span className="mono">{r.type}</span>,
    },
    {
      key: "signerMode",
      header: "Signer",
      width: "16%",
      render: (r) => (
        <span className="mono">
          {r.signerMode === "demo" ? "demo-hmac" : "extensible"}
        </span>
      ),
    },
    {
      key: "claims",
      header: "Claims",
      render: (r) => (
        <div>
          <div>{r.bundle?.claims?.creator}</div>
          <div className="dim">{r.bundle?.claims?.organization}</div>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      width: "14%",
      render: (r) => (
        <div>
          <div className="mono">{formatAgo(r.createdAt)}</div>
          <div className="dim">{r.createdAt.slice(0, 10)}</div>
        </div>
      ),
    },
  ];

  const counts = useMemo(() => {
    const all = state.assets?.length || 0;
    const verified = (state.assets || []).filter(
      (a) => a.status === "verified"
    ).length;
    const failed = (state.assets || []).filter(
      (a) => a.status === "failed"
    ).length;
    const pending = (state.assets || []).filter(
      (a) => a.status === "pending"
    ).length;
    return { all, verified, failed, pending };
  }, [state.assets]);

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="h1">Assets</h1>
          <p className="sub">
            Browse signed provenance bundles. Click a row to open its public
            verification page.
          </p>
        </div>

        <div className="btnRow">
          <Button variant="ghost" onClick={() => navigate("/app/overview")}>
            Back to dashboard
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Quick demo jump to first asset verify page
              const first = rows[0];
              if (first) navigate(`/verify/${first.id}`);
              else alert("No assets found in demo state.");
            }}
          >
            Open latest verify page
          </Button>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="row" style={{ alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Pill>All: {counts.all}</Pill>
          <Pill>Verified: {counts.verified}</Pill>
          <Pill>Failed: {counts.failed}</Pill>
          <Pill>Pending: {counts.pending}</Pill>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ minWidth: 170 }}
          >
            <option value="all">Status: All</option>
            <option value="verified">Status: Verified</option>
            <option value="failed">Status: Failed</option>
            <option value="pending">Status: Pending</option>
          </select>

          <select
            className="select"
            value={signer}
            onChange={(e) => setSigner(e.target.value)}
            style={{ minWidth: 210 }}
          >
            <option value="all">Signer: All</option>
            <option value="demo">Signer: Demo (HMAC)</option>
            <option value="extensible">Signer: Extensible (adapter)</option>
          </select>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <Card
        title="Asset registry"
        right={<Pill>{rows.length} results</Pill>}
        sub="Rows include status, signer mode, and claim metadata. Public verify pages show integrity diagnostics and provenance timeline."
      >
        <Table
          columns={cols}
          rows={rows}
          onRowClick={(r) => navigate(`/verify/${r.id}`)}
        />
      </Card>
    </div>
  );
}
