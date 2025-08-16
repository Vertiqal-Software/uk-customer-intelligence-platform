import React from "react";
import { NavLink } from "react-router-dom";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-gray-200 font-semibold" : "text-gray-700"}`
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white min-h-screen p-3">
      <div className="font-bold text-lg mb-3">UCIP</div>
      <nav className="space-y-1">
        <Item to="/dashboard">Dashboard</Item>
        <Item to="/analytics">Analytics</Item>
        {/* CRM section */}
        <div className="mt-3 text-xs uppercase text-gray-400 px-1">CRM</div>
        <Item to="/prospects">Prospects</Item>
        <Item to="/pipeline">Pipeline</Item>
        <Item to="/integrations">Integrations</Item>
        {/* Admin / Settings */}
        <div className="mt-3 text-xs uppercase text-gray-400 px-1">Admin</div>
        <Item to="/users">Users</Item>
        <Item to="/settings">Settings</Item>
      </nav>
    </aside>
  );
}
