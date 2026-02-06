import React from "react";
import { Badge, Card, Pill } from "../ui.jsx";
import LineChart from "../components/LineChart.jsx";
import Sparkline from "../components/Sparkline.jsx";

export default function Markets({ state }) {
  return (
    <div className="page">
      <h1 className="h1">Signals</h1>
      <p className="sub">
        Live-looking metrics that a provenance service would monitor (demo
        data).
      </p>

      <div className="grid3">
        <Card
          title="Integrity Index"
          right={<Badge tone="good">Stable</Badge>}
          sub="Percent of assets verifying clean."
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div className="small">current</div>
              <div className="mono" style={{ fontSize: 18 }}>
                {state.markets.integrityIndex.at(-1)}%
              </div>
            </div>
            <Sparkline series={state.markets.integrityIndex} />
          </div>
          <div style={{ height: 10 }} />
          <LineChart
            series={state.markets.integrityIndex}
            height={150}
            labelLeft="low"
            labelRight="high"
          />
        </Card>

        <Card
          title="Verify latency"
          right={<Pill>p95</Pill>}
          sub="Hash recompute + signature check time."
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div className="small">current</div>
              <div className="mono" style={{ fontSize: 18 }}>
                {state.markets.verifyLatencyMs.at(-1)}ms
              </div>
            </div>
            <Sparkline series={state.markets.verifyLatencyMs} />
          </div>
          <div style={{ height: 10 }} />
          <LineChart
            series={state.markets.verifyLatencyMs}
            height={150}
            labelLeft="fast"
            labelRight="slow"
          />
        </Card>

        <Card
          title="API traffic"
          right={<Badge tone="warn">Burst-aware</Badge>}
          sub="Requests per hour across sign/verify."
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div className="small">current</div>
              <div className="mono" style={{ fontSize: 18 }}>
                {state.markets.apiTraffic.at(-1)}/h
              </div>
            </div>
            <Sparkline series={state.markets.apiTraffic} />
          </div>
          <div style={{ height: 10 }} />
          <LineChart
            series={state.markets.apiTraffic}
            height={150}
            labelLeft="low"
            labelRight="high"
          />
        </Card>
      </div>
    </div>
  );
}
