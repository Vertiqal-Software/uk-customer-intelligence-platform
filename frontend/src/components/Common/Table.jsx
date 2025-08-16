import React from "react";

export default function Table({ children }) {
  return (
    <table className="w-full text-sm bg-white border rounded overflow-hidden">
      {children}
    </table>
  );
}
