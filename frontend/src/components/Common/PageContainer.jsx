import React from "react";

export default function PageContainer({ children, maxWidth = "max-w-7xl", className = "", header = null, breadcrumbs = null }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {header}
      <div className={`${maxWidth} mx-auto px-4 py-6`}>
        {breadcrumbs && <div className="mb-4">{breadcrumbs}</div>}
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
