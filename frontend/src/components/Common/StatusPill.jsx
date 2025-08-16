import React from "react";

const color = {
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  neutral: "bg-gray-100 text-gray-800",
};

export default function StatusPill({ children, tone = "neutral" }) {
  const cls = color[tone] || color.neutral;
  return <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>{children}</span>;
}
