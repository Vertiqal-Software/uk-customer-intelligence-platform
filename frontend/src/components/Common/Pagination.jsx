import React from "react";

export default function Pagination({ page = 1, pageSize = 20, total = 0, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const go = (p) => onChange?.(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="flex items-center justify-between mt-3 text-sm">
      <div className="text-gray-600">Page {page} of {totalPages}</div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 border rounded" onClick={() => go(1)} disabled={page === 1}>First</button>
        <button className="px-3 py-1 border rounded" onClick={() => go(page - 1)} disabled={page === 1}>Prev</button>
        <button className="px-3 py-1 border rounded" onClick={() => go(page + 1)} disabled={page === totalPages}>Next</button>
        <button className="px-3 py-1 border rounded" onClick={() => go(totalPages)} disabled={page === totalPages}>Last</button>
      </div>
    </div>
  );
}
