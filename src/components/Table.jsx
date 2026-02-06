import React from "react";

export default function Table({ columns, rows, onRowClick }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{ width: c.width }}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => (
          <tr
            key={r.id || idx}
            style={{ cursor: onRowClick ? "pointer" : "default" }}
            onClick={() => onRowClick?.(r)}
          >
            {columns.map((c) => (
              <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
