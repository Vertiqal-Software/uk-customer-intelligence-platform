import React, { useState } from "react";

export default function CopyButton({ text, className = "" }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  return (
    <button onClick={onCopy} className={`px-2 py-1 border rounded text-sm ${className}`}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
