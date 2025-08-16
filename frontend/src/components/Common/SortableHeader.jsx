import React from "react";

export default function SortableHeader({ label, sortKey, current, direction = "asc", onSort }) {
  const active = current === sortKey;
  const nextDir = active && direction === "asc" ? "desc" : "asc";
  return (
    <th
      className={`py-2 px-2 text-left cursor-pointer select-none ${active ? "text-blue-700" : "text-gray-700"}`}
      onClick={() => onSort?.(sortKey, nextDir)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (direction === "asc" ? "▲" : "▼") : "⇵"}
      </span>
    </th>
  );
}
