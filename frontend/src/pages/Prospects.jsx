import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import { listProspects, createProspect, updateProspect, archiveProspect } from "../services/crm";

export default function Prospects() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    title: "",
    email: "",
    phone: "",
    linkedin_url: "",
    source: "manual",
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await listProspects();
      setRows(data);
    } catch (e) {
      setError("Failed to load prospects");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createProspect(form);
      setRows([created, ...rows]);
      setForm({
        first_name: "",
        last_name: "",
        title: "",
        email: "",
        phone: "",
        linkedin_url: "",
        source: "manual",
      });
    } finally { setSaving(false); }
  };

  const onUpdateStatus = async (id, status) => {
    setSaving(true);
    try {
      const item = await updateProspect(id, { status });
      setRows(rows.map((r) => (r.id === id ? item : r)));
    } finally { setSaving(false); }
  };

  const onArchive = async (id) => {
    setSaving(true);
    try {
      await archiveProspect(id);
      setRows(rows.filter((r) => r.id !== id));
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Prospects" subtitle="Contacts you’re working" />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white border rounded p-4 shadow-sm mb-6">
          <h2 className="font-semibold mb-3">Add Prospect</h2>
          <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="border rounded px-3 py-2" placeholder="First name" value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="Last name" value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <input className="border rounded px-3 py-2 md:col-span-2" placeholder="LinkedIn URL" value={form.linkedin_url} onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))} />
            <select className="border rounded px-3 py-2" value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}>
              <option value="manual">Manual</option>
              <option value="import">Import</option>
              <option value="linkedin">LinkedIn</option>
            </select>
            <div className="md:col-span-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? "Saving…" : "Add Prospect"}</button>
            </div>
          </form>
        </div>

        <div className="bg-white border rounded p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Prospect List</h2>
          {loading ? (
            <div className="text-gray-500">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="text-gray-500">No prospects yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Title</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Source</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2">{[r.first_name, r.last_name].filter(Boolean).join(" ") || "—"}</td>
                    <td className="py-2">{r.title || "—"}</td>
                    <td className="py-2">{r.email || "—"}</td>
                    <td className="py-2 capitalize">{r.source || "manual"}</td>
                    <td className="py-2 capitalize">{r.status || "new"}</td>
                    <td className="py-2 text-right">
                      <button onClick={() => onUpdateStatus(r.id, r.status === "contacted" ? "qualified" : "contacted")} className="px-3 py-1 border rounded mr-2 hover:bg-gray-50">Progress</button>
                      <button onClick={() => onArchive(r.id)} className="px-3 py-1 border rounded text-red-700 hover:bg-red-50">Archive</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
}
