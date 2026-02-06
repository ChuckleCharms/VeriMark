import React, { useMemo } from "react";
import { Badge, Button, Card, Pill } from "../ui.jsx";
import { toggleAssetTamper, formatAgo } from "../mockData.js";

export default function Verify({ state, setState, id, navigate }) {
  const asset = useMemo(() => state.assets.find((a) => a.id === id), [state.assets, id]);

  if (!asset) {
    return (
      <div className="page">
        <h1 className="h1">Verification</h1>
        <p className="sub">No asset found for <span className="mono">{id}</span>.</p>
        <Button variant="ghost" onClick={() => navigate("/app/overview")}>Back to dashboard</Button>
      </div>
    );
  }

  const ok = asset.integrity.current !== "fail";

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 className="h1">Public verification</h1>
          <p className="sub">
            This page recomputes the asset hash and verifies the signature against the stored provenance bundle (demo simulation).
          </p>
        </div>
        <div className="btnRow">
          <Button variant="ghost" onClick={() => navigate("/app/screener")}>Back to assets</Button>
          <Button variant={ok ? "danger" : "primary"} onClick={() => setState(toggleAssetTamper(state, asset.id))}>
            {ok ? "Simulate tamper" : "Restore integrity"}
          </Button>
        </div>
      </div>

      <Card
        title="Trust status"
        right={ok ? <Badge tone="good">Integrity Verified</Badge> : <Badge tone="bad">Integrity Failed</Badge>}
        sub={ok ? "Asset matches the signed bundle. Hash and signature validate." : "Asset bytes differ from the signed bundle. Verification fails with diagnostics."}
      >
        <div className="row">
          <div>
            <div className="small">Asset</div>
            <div style={{ marginTop: 6, fontWeight: 800 }}>{asset.filename}</div>
            <div className="small" style={{ marginTop: 8 }}>Type</div>
            <div className="mono" style={{ marginTop: 6 }}>{asset.type}</div>

            <div className="small" style={{ marginTop: 8 }}>Created</div>
            <div className="mono" style={{ marginTop: 6 }}>
              {asset.createdAt.slice(0, 19).replace("T", " ")} • {formatAgo(asset.createdAt)}
            </div>
          </div>

          <div>
            <div className="small">Bundle</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              <Pill>hash: sha256</Pill>
              <Pill>signer: {asset.signerMode}</Pill>
              <Pill>bundle: {asset.bundle.id}</Pill>
            </div>

            <div className="small" style={{ marginTop: 10 }}>Asset hash</div>
            <div className="mono" style={{ marginTop: 6, wordBreak: "break-all" }}>{asset.bundle.assetHash}</div>

            <div className="small" style={{ marginTop: 10 }}>Signature</div>
            <div className="mono" style={{ marginTop: 6, wordBreak: "break-all" }}>{asset.bundle.signature}</div>
          </div>
        </div>

        <div className="hr" />

        <div className="row">
          <div>
            <div className="small">Computed hash</div>
            <div className="mono" style={{ marginTop: 6, wordBreak: "break-all" }}>
              {asset.integrity.diagnostics.computedHash}
            </div>
            <div className="small" style={{ marginTop: 10 }}>Expected hash</div>
            <div className="mono" style={{ marginTop: 6, wordBreak: "break-all" }}>
              {asset.integrity.diagnostics.expectedHash}
            </div>
            <div className="small" style={{ marginTop: 10 }}>Diagnostics</div>
            <div style={{ marginTop: 6 }} className="small">{asset.integrity.diagnostics.diffHint}</div>
          </div>

          <div>
            <div className="small">Provenance claims</div>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              <div>
                <div className="label">Creator</div>
                <div>{asset.bundle.claims.creator}</div>
              </div>
              <div>
                <div className="label">Organization</div>
                <div>{asset.bundle.claims.organization}</div>
              </div>
              <div className="row">
                <div>
                  <div className="label">Creation date</div>
                  <div className="mono">{asset.bundle.claims.creationDate}</div>
                </div>
                <div>
                  <div className="label">Tool</div>
                  <div className="mono">{asset.bundle.claims.tool}</div>
                </div>
              </div>
              <div>
                <div className="label">Edits summary</div>
                <div className="small">{asset.bundle.claims.editsSummary}</div>
              </div>
              <div>
                <div className="label">License</div>
                <div className="mono">{asset.bundle.claims.license}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hr" />

        <Card title="Provenance timeline" right={<Pill>bundle events</Pill>}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Time</th>
                <th style={{ width: "22%" }}>Event</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {asset.timeline.map((t, idx) => (
                <tr key={idx}>
                  <td className="mono">{t.at.slice(0, 19).replace("T", " ")}</td>
                  <td style={{ fontWeight: 700 }}>{t.label}</td>
                  <td className="dim">{t.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Card>
    </div>
  );
}
