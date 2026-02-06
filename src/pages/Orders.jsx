import React from "react";
import { Card } from "../ui.jsx";

export default function Orders() {
  return (
    <div className="page">
      <h1 className="h1">Orders</h1>
      <p className="sub">
        In a commercial SaaS, this is often billing / subscriptions / invoices.
      </p>
      <Card title="Billing" sub="Demo-only view">
        <div className="small">
          Add Stripe billing later if turning this into a real service.
        </div>
      </Card>
    </div>
  );
}
