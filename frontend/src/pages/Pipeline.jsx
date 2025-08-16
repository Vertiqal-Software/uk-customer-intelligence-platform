import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Common/Header";
import { listStages, createStage, updateStage, deleteStage, listDeals, createDeal, updateDeal, deleteDeal } from "../services/crm";

export default function Pipeline() {
  const [stages, setStages] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stageForm, setStageForm] = useState({ name: "", probability: 0 });
  const [dealForm, setDealForm] = useState({ title: "", value_amount: 0, stage_id: "" });
  const [error, setError] = useState("");

  const byStage = useMemo(() => {
    const m = {};
    stages.forEach((s) => (m[s.id] = s));
    return m;
  }, [stages]);

  const load = async () => {
    setLoading(true);
    try {
      const [s, d] = await Promise.all([listStages(), listDeals()]);
      setStages(s);
      setDeals(d);
    } catch (e) {
      setError("Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const onCreateStage = async (e) => {
    e.preventDefault();
    if (!stageForm.name.trim()) return;
    setSaving(true);
    try {
      const item = await createStage({ name: stageForm.name, probability: Number(stageForm.probability || 0) });
      setStages([...stages, item].sort((a, b) => a.order_index - b.order_index));
      setStageForm({ name: "", probability: 0 });
    } finally { setSaving(false); }
  };

  const onUpdateStage = async (id, patch) => {
    setSaving(true);
    try {
      const item = await updateStage(id, patch);
      setStages(stages.map((s) => (s.id === id ? item : s)));
    } finally { setSaving(false); }
  };
  const onDeleteStage = async (id) => {
    setSaving(true);
    try {
      await deleteStage(id);
      setStages(stages.filter((s) => s.id !== id));
    } finally { setSaving(false); }
  };

  const onCreateDeal = async (e) => {
    e.preventDefault();
    if (!dealForm.title.trim()) return;
    setSaving(true);
    try {
      const item = await createDeal({
        title: dealForm.title,
        value_amount: Number(dealForm.value_amount || 0),
        stage_id: dealForm.stage_id || null,
      });
      setDeals([item, ...deals]);
      setDealForm({ title: "", value_amount: 0, stage_id: "" });
    } finally { setSaving(false); }
  };

  const onUpdateDeal = async (id, patch) => {
    setSaving(true);
    try {
      const item = await updateDeal(id, patch);
      setDeals(deals.map((d) => (d.id === id ? item : d)));
    } finally { setSaving(false); }
  };
  const onDeleteDeal = async (id) => {
    setSaving(true);
    try {
      await deleteDeal(id);
      setDeals(deals.filter((d) => d.id !== id));
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Pipeline" subtitle="Stages and deals" />
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stages */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded p-4 shadow-sm">
            <h2 className="font-semibold mb-3">Stages</h2>
            <form onSubmit={onCreateStage} className="flex gap-2 mb-4">
              <input
                className="flex-1 border rounded px-3 py-2"
                placeholder="Stage name (e.g., Qualified)"
                value={stageForm.name}
                onChange={(e) => setStageForm((f) => ({ ...f, name: e.target.value }))}
              />
              <input
                type="number"
                min="0"
                max="100"
                className="w-28 border rounded px-3 py-2"
                placeholder="%"
                value={stageForm.probability}
                onChange={(e) => setStageForm((f) => ({ ...f, probability: e.target.value }))}
              />
              <button className="px-3 py-2 bg-blue-600 text-white rounded">{saving ? "…" : "Add"}</button>
            </form>
            {loading ? (
              <div className="text-gray-500">Loading…</div>
            ) : (
              <ul className="space-y-2">
                {stages.sort((a, b) => a.order_index - b.order_index).map((s) => (
                  <li key={s.id} className="flex items-center justify-between border rounded px-3 py-2">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500">Probability: {s.probability}%</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateStage(s.id, { probability: Math.min(100, (s.probability || 0) + 5) })}
                        className="px-2 py-1 border rounded hover:bg-gray-50"
                      >
                        +5%
                      </button>
                      <button
                        onClick={() => onDeleteStage(s.id)}
                        className="px-2 py-1 border rounded text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Deals */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded p-4 shadow-sm">
            <h2 className="font-semibold mb-3">Deals</h2>
            <form onSubmit={onCreateDeal} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
              <input
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="Deal title"
                value={dealForm.title}
                onChange={(e) => setDealForm((f) => ({ ...f, title: e.target.value }))}
              />
              <input
                type="number"
                step="0.01"
                className="border rounded px-3 py-2"
                placeholder="Value (£)"
                value={dealForm.value_amount}
                onChange={(e) => setDealForm((f) => ({ ...f, value_amount: e.target.value }))}
              />
              <select
                className="border rounded px-3 py-2"
                value={dealForm.stage_id}
                onChange={(e) => setDealForm((f) => ({ ...f, stage_id: e.target.value }))}
              >
                <option value="">No stage</option>
                {stages.sort((a, b) => a.order_index - b.order_index).map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <div className="md:col-span-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? "Saving…" : "Add Deal"}</button>
              </div>
            </form>

            {loading ? (
              <div className="text-gray-500">Loading…</div>
            ) : deals.length === 0 ? (
              <div className="text-gray-500">No deals yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Title</th>
                    <th className="py-2">Value</th>
                    <th className="py-2">Stage</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((d) => (
                    <tr key={d.id} className="border-b last:border-0">
                      <td className="py-2">{d.title}</td>
                      <td className="py-2">£{Number(d.value_amount || 0).toLocaleString()}</td>
                      <td className="py-2">{d.stage_id ? (byStage[d.stage_id]?.name || "Unknown") : "—"}</td>
                      <td className="py-2 capitalize">{d.status}</td>
                      <td className="py-2 text-right">
                        <button onClick={() => onUpdateDeal(d.id, { status: d.status === "open" ? "won" : "open" })} className="px-3 py-1 border rounded mr-2 hover:bg-gray-50">Toggle Won</button>
                        <button onClick={() => onDeleteDeal(d.id)} className="px-3 py-1 border rounded text-red-700 hover:bg-red-50">Delete</button>
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
    </div>
  );
}
