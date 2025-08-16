import React from "react";

export default function Header({ title, subtitle }) {
  return (
    <div className="border-b bg-white px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
