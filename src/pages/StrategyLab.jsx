import React from "react";
import { Card } from "../ui.jsx";

export default function StrategyLab() {
  return (
    <div className="page">
      <h1 className="h1">Strategy Lab</h1>
      <p className="sub">
        A planning space for policy rules (allowed types, size caps, org
        defaults), shown as a product surface.
      </p>
      <Card title="Policy presets" sub="Demo panel">
        <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
          <li>Allowed types: png/jpg/webp/mp4/mov/webm</li>
          <li>Size caps: image 25MB • video 500MB (simulated)</li>
          <li>Default signer: demo-hmac (safe), extensible signer optional</li>
          <li>Rate limits enabled on /verify</li>
        </ul>
      </Card>
    </div>
  );
}
