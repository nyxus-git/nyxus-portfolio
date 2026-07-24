"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { getExperiences, createExperience, updateExperience, deleteExperience, Experience } from "@/lib/api";
import { Modal } from "./Modal";
import { AdminInput, AdminTextarea } from "./AdminInputs";

const DEFAULT_FORM: Omit<Experience, "id"> = {
  job_title: "", company_name: "", location: "", start_date: "",
  end_date: "", description: "", order_index: 0,
};

export function ExperienceManager() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Experience | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getExperiences().then(data => { setItems(data); setLoading(false); });
  };
  useEffect(load, []);

  function openCreate() { setEditItem(null); setForm(DEFAULT_FORM); setModalOpen(true); }
  function openEdit(item: Experience) { setEditItem(item); setForm({ ...item }); setModalOpen(true); }

  async function handleSave() {
    setSaving(true);
    try {
      if (editItem) { await updateExperience(editItem.id, form); }
      else { await createExperience(form); }
      setModalOpen(false); load();
    } catch (e) { alert("Error: " + e); } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete?")) return;
    try {
      await deleteExperience(id);
      load();
    } catch (e) {
      alert("Error deleting experience: " + e);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Work Experience</h2>
          <p className="text-gray-500 text-sm">{items.length} entries</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm transition-all">
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-gray-900 border border-white/5 rounded-2xl p-5 flex items-start gap-4 hover:border-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-black text-xs">{new Date(item.start_date).getFullYear()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white">{item.job_title}</h3>
                <p className="text-cyan-400 text-sm">{item.company_name}</p>
                {item.location && <p className="text-gray-500 text-xs flex items-center gap-1 mt-1"><MapPin size={10} />{item.location}</p>}
                <p className="text-gray-600 text-xs mt-1 font-mono">
                  {new Date(item.start_date).getFullYear()} — {item.end_date ? new Date(item.end_date).getFullYear() : "Present"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-lime-500/20 hover:text-lime-400 text-gray-400 transition-all"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Experience" : "Add Experience"}>
        <div className="space-y-4">
          <AdminInput label="Job Title *" value={form.job_title} onChange={e => setForm(f => ({ ...f, job_title: e.target.value }))} placeholder="Software Engineer" />
          <AdminInput label="Company Name *" value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} placeholder="Company Inc." />
          <AdminInput label="Location" value={form.location || ""} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Pune, India" />
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Start Date *" type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
            <AdminInput label="End Date (leave blank if current)" type="date" value={form.end_date || ""} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
          </div>
          <AdminTextarea label="Description" value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={5} placeholder="What did you do here..." />
          <AdminInput label="Order" type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: Number(e.target.value) }))} />
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 text-sm font-bold">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-sm font-black disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
