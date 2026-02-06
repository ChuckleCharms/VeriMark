import React from "react";
import { Button } from "../ui.jsx";

export default function NotFound({ navigate }) {
  return (
    <div className="page">
      <h1 className="h1">Not found</h1>
      <p className="sub">That route doesn’t exist in this CU demo.</p>
      <Button variant="ghost" onClick={() => navigate?.("/app/overview")}>
        Go to dashboard
      </Button>
    </div>
  );
}
