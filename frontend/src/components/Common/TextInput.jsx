import React from "react";

export default function TextInput({ label, error, help, className = "", ...props }) {
  return (
    <label className="block">
      {label && <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>}
      <input {...props} className={`w-full border rounded px-3 py-2 ${error ? "border-red-500" : "border-gray-300"} ${className}`} />
      {help && <div className="text-xs text-gray-500 mt-1">{help}</div>}
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </label>
  );
}
