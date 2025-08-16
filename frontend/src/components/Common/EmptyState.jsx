import React from "react";

export default function EmptyState({ title = "Nothing here yet", description = "", action = null, icon = null }) {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-white">
      {icon && <div className="mx-auto mb-3">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description && <p className="text-gray-500 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
