import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-blue-600 font-medium">Loading...</span>
    </div>
  );
}
