import React, { useEffect, useMemo, useState } from "react";
import { listIntegrations, upsertIntegration, patchIntegration, deleteIntegration } from "../services/crm";
import Header from "../components/Common/Header";

const KNOWN_INTEGRATIONS = [
  { service: "clearbit", label: "Clearbit" },
  { service: "linkedin", label: "LinkedIn (basic link storage)" },
  { service: "hubspot", label: "HubSpot (future use)" },
  { service: "opencorporates", label: "OpenCorporates" },
];

const StatusBadge = ({ status }) => {
  const cls =
    status === "connected"
      ? "bg-green-100 text-green-800"
      : status === "error"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";
  return <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>{status || "disconnected"}</span>;
};

export default function Integrations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ service: "clearbit", status: "connected", config: {} });
  const [error, setError] = useState("");
  const [jsonText, setJsonText] = useState("{}");

  const byService = useMemo(() => {
    const map = {};
    rows.forEach((r) => (map[r.service] = r));
    return map;
  }, [rows]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listIntegrations();
      setRows(data);
    } catch (e) {
      setError("Failed to load integrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onUpsert = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const cfg = jsonText.trim() ? JSON.parse(jsonText) : {};
      const item = await upsertIntegration({ ...form, config: cfg });
      const existing = rows.filter((r) => r.service !== item.service);
      setRows([...existing, item].sort((a, b) => a.service.localeCompare(b.service)));
    } catch (err) {
      setError("Invalid JSON or server error");
    } finally {
      setSaving(false);
    }
  };

  const onDisconnect = async (service) => {
    setSaving(true);
    try {
      await patchIntegration(service, { status: "disconnected" });
      setRows(rows.map((r) => (r.service === service ? { ...r, status: "disconnected" } : r)));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (service) => {
    setSaving(true);
    try {
      await deleteIntegration(service);
      setRows(rows.filter((r) => r.service !== service));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Integrations" subtitle="Connect external data sources" />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
          <h2 className="font-semibold mb-3">Connect / Update Integration</h2>
          <form onSubmit={onUpsert} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.service}
                onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
              >
                {KNOWN_INTEGRATIONS.map((k) => (
                  <option key={k.service} value={k.service}>{k.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="connected">Connected</option>
                <option value="disconnected">Disconnected</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1">Config (JSON)</label>
              <textarea
                rows="4"
                className="w-full border rounded px-3 py-2 font-mono text-sm"
                placeholder='e.g. {"apiKey": "xxxx"}'
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
              />
            </div>
            <div className="md:col-span-3 flex gap-2">
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Saving…" : "Save Integration"}
              </button>
              {error && <span className="text-sm text-red-600">{error}</span>}
            </div>
          </form>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Connected Integrations</h2>
          {loading ? (
            <div className="text-gray-500">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="text-gray-500">No integrations yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Service</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Connected</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.sort((a, b) => a.service.localeCompare(b.service)).map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2 capitalize">{r.service}</td>
                    <td className="py-2"><StatusBadge status={r.status} /></td>
                    <td className="py-2">{r.connected_at ? new Date(r.connected_at).toLocaleString() : "—"}</td>
                    <td className="py-2 text-right">
                      <button onClick={() => onDisconnect(r.service)} className="px-3 py-1 border rounded mr-2 hover:bg-gray-50">Disconnect</button>
                      <button onClick={() => onDelete(r.service)} className="px-3 py-1 border rounded text-red-700 hover:bg-red-50">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
