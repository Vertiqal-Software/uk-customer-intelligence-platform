import React from "react";

export default function InputGroup({ children }) {
  return (
    <div className="flex items-stretch rounded overflow-hidden border">
      {children}
    </div>
  );
}
