import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function RoleGate({ role, children, fallback = null }) {
  const { hasRole } = useAuth();
  if (role && !hasRole(role)) return fallback;
  return <>{children}</>;
}
