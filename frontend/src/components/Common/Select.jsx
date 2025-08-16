import React from "react";

export default function Select({ label, error, help, className = "", children, ...props }) {
  return (
    <label className="block">
      {label && <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>}
      <select {...props} className={`w-full border rounded px-3 py-2 ${error ? "border-red-500" : "border-gray-300"} ${className}`}>
        {children}
      </select>
      {help && <div className="text-xs text-gray-500 mt-1">{help}</div>}
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </label>
  );
}
