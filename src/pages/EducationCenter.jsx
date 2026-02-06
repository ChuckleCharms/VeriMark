import React from "react";
import { Card, Pill } from "../ui.jsx";

export default function EducationCenter({ state }) {
  return (
    <div className="page">
      <h1 className="h1">Education Center</h1>
      <p className="sub">
        Short lessons that make the product feel complete and “enterprise-ready”
        (demo).
      </p>

      <div className="grid3">
        {state.edu.map((x) => (
          <Card
            key={x.id}
            title={x.title}
            right={<Pill>{x.level}</Pill>}
            sub={`${x.mins} min`}
          >
            <div className="small">
              This would open a lesson page in production. For the CU, it
              demonstrates a complete product surface.
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
