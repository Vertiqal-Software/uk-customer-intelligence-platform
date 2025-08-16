import React from "react";
import { NavLink } from "react-router-dom";

export function Tabs({ children }) {
  return <div className="border-b bg-white px-4">{children}</div>;
}

export function TabList({ children }) {
  return <div className="flex gap-2">{children}</div>;
}

export function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `px-3 py-2 -mb-px border-b-2 ${isActive ? "border-blue-600 text-blue-700" : "border-transparent text-gray-600 hover:text-gray-800"}`
      }
    >
      {children}
    </NavLink>
  );
}
