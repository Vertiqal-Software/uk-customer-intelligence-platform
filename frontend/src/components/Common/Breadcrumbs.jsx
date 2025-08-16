import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="text-sm text-gray-500">
      <ol className="flex items-center gap-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {idx > 0 && <span>/</span>}
            {item.to ? <Link className="hover:underline" to={item.to}>{item.label}</Link> : <span className="text-gray-700">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
