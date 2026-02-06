import React, { useMemo, useState } from "react";
import { Badge, Button, Card, Field, Modal, Pill } from "../ui.jsx";
import LineChart from "../components/LineChart.jsx";
import Sparkline from "../components/Sparkline.jsx";
import Table from "../components/Table.jsx";
import TickerTape from "../components/TickerTape.jsx";
import {
  createAssetFromUpload,
  formatAgo,
  mb,
  safeFileTypeOk,
} from "../mockData.js";

export default function Overview({
  state,
  setState,
  session,
  search,
  navigate,
}) {
  const [open, setOpen] = useState(false);
  const [upload, setUpload] = useState({
    filename: "studio_shot.png",
    type: "image/png",
    sizeMB: 5.2,
    signerMode: "demo",
    claims: {
      creator: "Kestrel Studio",
      organization: "Kestrel Studio LLC",
      creationDate: new Date().toISOString().slice(0, 10),
      tool: "Photoshop 2025.1",
      editsSummary: "Color grade, crop to 4:5",
      license: "CC BY 4.0",
    },
  });
  const [progress, setProgress] = useState(0);

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase().trim();
    const list = state.assets;
    if (!q) return list;
    return list.filter((a) => {
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
  }, [state.assets, search]);

  const recent = filtered.slice(0, 6);

  const tickerItems = useMemo(() => {
    const ii = lastDelta(state.markets.integrityIndex);
    const lat = lastDelta(state.markets.verifyLatencyMs);
    const traf = lastDelta(state.markets.apiTraffic);
    return [
      { label: "Integrity Index", value: `${ii.last}%`, delta: ii.delta },
      { label: "Verify Latency", value: `${lat.last}ms`, delta: lat.delta },
      { label: "API Traffic", value: `${traf.last}/h`, delta: traf.delta },
    ];
  }, [state.markets]);

  const cols = [
    {
      key: "id",
      header: "Asset",
      width: "22%",
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700 }} className="mono">
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

  function startUpload() {
    // Simulated progress + create asset locally
    if (!safeFileTypeOk(upload.type)) {
      alert(
        "File type blocked by policy (demo). Choose png/jpg/webp/mp4/mov/webm."
      );
      return;
    }

    setProgress(8);
    const steps = [22, 41, 63, 78, 92, 100];
    steps.forEach((p, i) => {
      setTimeout(() => setProgress(p), 250 + i * 180);
    });

    setTimeout(() => {
      const next = createAssetFromUpload(state, {
        filename: upload.filename,
        type: upload.type,
        sizeMB: upload.sizeMB,
        claims: upload.claims,
        signerMode: upload.signerMode,
      });

      setState(next);
      setProgress(0);
      setOpen(false);

      // ✅ Hash router navigation
      navigate(`/verify/${next.assets[0].id}`);
    }, 1450);
  }

  return (
    <div className="page">
      <div className="grid2">
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1 className="h1">Trust dashboard</h1>
              <p className="sub">
                Upload an image/video, attach creator & provenance claims, sign
                a provenance bundle, and publish a public verification page.
              </p>
            </div>
            <div className="btnRow">
              <Button variant="primary" onClick={() => setOpen(true)}>
                Upload + Sign
              </Button>
              <Button variant="ghost" onClick={() => navigate("/app/screener")}>
                Browse assets
              </Button>
            </div>
          </div>

          <TickerTape items={tickerItems} />

          <div style={{ height: 12 }} />

          <div className="kpis">
            <div className="kpi">
              <div className="label">Uploads (7d)</div>
              <div className="val">{state.counters.uploads7d}</div>
              <div className="hint">
                <span className="mono">policy</span> type+size gates enabled
              </div>
            </div>
            <div className="kpi">
              <div className="label">Verified (7d)</div>
              <div className="val">{state.counters.verified7d}</div>
              <div className="hint">
                <span className="mono">sha256</span> recompute on verify
              </div>
            </div>
            <div className="kpi">
              <div className="label">Integrity failures (7d)</div>
              <div className="val">{state.counters.failed7d}</div>
              <div className="hint">
                <span className="mono">diff</span> diagnostics surfaced
              </div>
            </div>
            <div className="kpi">
              <div className="label">API calls (24h)</div>
              <div className="val">{state.counters.apiCalls24h}</div>
              <div className="hint">
                <span className="mono">keys</span> scoped + loggable
              </div>
            </div>
          </div>

          <div style={{ height: 16 }} />

          <Card
            title="Recent assets"
            right={<Pill>{filtered.length} items</Pill>}
            sub="Shows verification status badges and claim metadata. Click a row to open its public verification page."
          >
            <Table
              columns={cols}
              rows={recent}
              onRowClick={(r) => navigate(`/verify/${r.id}`)}
            />
          </Card>
        </div>

        <div>
          <Card
            title="Signals"
            sub="Operational signals that a provenance service typically exposes: integrity health, verification latency, and API traffic."
            right={<span className="small">rolling 30 points</span>}
          >
            <div style={{ display: "grid", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>Integrity Index</div>
                  <div className="small">Percent of assets verifying clean</div>
                </div>
                <Sparkline series={state.markets.integrityIndex} />
              </div>

              <LineChart
                series={state.markets.integrityIndex}
                height={140}
                labelLeft="low"
                labelRight="high"
              />

              <div className="hr" />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>Verify Latency</div>
                  <div className="small">
                    Time to recompute hash + check signature
                  </div>
                </div>
                <Sparkline series={state.markets.verifyLatencyMs} />
              </div>

              <LineChart
                series={state.markets.verifyLatencyMs}
                height={140}
                labelLeft="fast"
                labelRight="slow"
              />
            </div>
          </Card>

          <div style={{ height: 16 }} />

          <Card
            title="Storage status"
            right={
              state.storage.status === "healthy" ? (
                <Badge tone="good">Healthy</Badge>
              ) : (
                <Badge tone="warn">Degraded</Badge>
              )
            }
            sub="S3-compatible storage (demo view)."
          >
            <div className="row">
              <div>
                <div className="small">Provider</div>
                <div style={{ marginTop: 6 }}>{state.storage.provider}</div>
                <div className="small" style={{ marginTop: 10 }}>
                  Bucket
                </div>
                <div className="mono" style={{ marginTop: 6 }}>
                  {state.storage.bucket}
                </div>
              </div>

              <div>
                <div className="small">Usage</div>
                <div style={{ marginTop: 6 }} className="mono">
                  {state.storage.usedGB} GB / {state.storage.capacityGB} GB
                </div>
                <div className="progress" style={{ marginTop: 10 }}>
                  <div
                    style={{
                      width: `${Math.round(
                        (state.storage.usedGB / state.storage.capacityGB) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="small" style={{ marginTop: 10 }}>
                  Region
                </div>
                <div className="mono" style={{ marginTop: 6 }}>
                  {state.storage.region}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {open && (
        <Modal
          title="Upload + Sign (local demo)"
          subtitle="This simulates the full flow: ingest → claim editor → signer selection → bundle creation → verify page."
          onClose={() => {
            setOpen(false);
            setProgress(0);
          }}
        >
          <div className="dropzone">
            <div>
              <div style={{ fontWeight: 700 }}>Drag & drop</div>
              <div className="small">
                Allowed: png/jpg/webp • mp4/mov/webm • size cap simulated
              </div>
            </div>
            <div className="btnRow">
              <Button
                onClick={() =>
                  setUpload((u) => ({
                    ...u,
                    filename: "proof_capture.webp",
                    type: "image/webp",
                    sizeMB: 2.4,
                  }))
                }
              >
                Use sample
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  setUpload((u) => ({
                    ...u,
                    filename: "interview_cut.mp4",
                    type: "video/mp4",
                    sizeMB: 142.6,
                  }))
                }
              >
                Use video
              </Button>
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div className="row">
            <Field label="Filename">
              <input
                className="input"
                value={upload.filename}
                onChange={(e) =>
                  setUpload((u) => ({ ...u, filename: e.target.value }))
                }
              />
            </Field>
            <Field label="Type">
              <select
                className="select"
                value={upload.type}
                onChange={(e) =>
                  setUpload((u) => ({ ...u, type: e.target.value }))
                }
              >
                <option value="image/png">image/png</option>
                <option value="image/jpeg">image/jpeg</option>
                <option value="image/webp">image/webp</option>
                <option value="video/mp4">video/mp4</option>
                <option value="video/quicktime">video/quicktime</option>
                <option value="video/webm">video/webm</option>
              </select>
            </Field>
          </div>

          <div className="row">
            <Field label="Size (MB)">
              <input
                className="input"
                type="number"
                step="0.1"
                value={upload.sizeMB}
                onChange={(e) =>
                  setUpload((u) => ({ ...u, sizeMB: Number(e.target.value) }))
                }
              />
              <div className="small" style={{ marginTop: 6 }}>
                Shown as <span className="mono">{mb(upload.sizeMB)}</span>
              </div>
            </Field>
            <Field label="Signer mode">
              <select
                className="select"
                value={upload.signerMode}
                onChange={(e) =>
                  setUpload((u) => ({ ...u, signerMode: e.target.value }))
                }
              >
                <option value="demo">Demo signer (HMAC)</option>
                <option value="extensible">Extensible signer (adapter)</option>
              </select>
            </Field>
          </div>

          <div className="hr" />

          <div className="row">
            <Field label="Creator">
              <input
                className="input"
                value={upload.claims.creator}
                onChange={(e) =>
                  setUpload((u) => ({
                    ...u,
                    claims: { ...u.claims, creator: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Organization">
              <input
                className="input"
                value={upload.claims.organization}
                onChange={(e) =>
                  setUpload((u) => ({
                    ...u,
                    claims: { ...u.claims, organization: e.target.value },
                  }))
                }
              />
            </Field>
          </div>

          <div className="row">
            <Field label="Creation date">
              <input
                className="input"
                value={upload.claims.creationDate}
                onChange={(e) =>
                  setUpload((u) => ({
                    ...u,
                    claims: { ...u.claims, creationDate: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Tool used">
              <input
                className="input"
                value={upload.claims.tool}
                onChange={(e) =>
                  setUpload((u) => ({
                    ...u,
                    claims: { ...u.claims, tool: e.target.value },
                  }))
                }
              />
            </Field>
          </div>

          <Field label="Edits summary">
            <textarea
              className="textarea"
              value={upload.claims.editsSummary}
              onChange={(e) =>
                setUpload((u) => ({
                  ...u,
                  claims: { ...u.claims, editsSummary: e.target.value },
                }))
              }
            />
          </Field>

          <Field label="License">
            <input
              className="input"
              value={upload.claims.license}
              onChange={(e) =>
                setUpload((u) => ({
                  ...u,
                  claims: { ...u.claims, license: e.target.value },
                }))
              }
            />
          </Field>

          <div style={{ height: 10 }} />
          {progress > 0 ? (
            <div>
              <div className="small">Signing bundle…</div>
              <div className="progress" style={{ marginTop: 8 }}>
                <div style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="inlineWarn">
              Demo note: file bytes aren’t actually uploaded — we generate
              realistic-looking hashes, signatures, timelines, and verification
              pages.
            </div>
          )}

          <div style={{ height: 12 }} />
          <div className="btnRow" style={{ justifyContent: "flex-end" }}>
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setProgress(0);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={startUpload}>
              Create bundle + Open verify page
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function lastDelta(series) {
  const last = series[series.length - 1] || 0;
  const prev = series[series.length - 2] ?? last;
  return { last, delta: last - prev };
}
