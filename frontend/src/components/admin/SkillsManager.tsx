"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { getSkills, createSkill, updateSkill, deleteSkill, Skill } from "@/lib/api";
import { Modal } from "./Modal";
import { AdminInput, AdminSelect } from "./AdminInputs";

const CATEGORIES = [
  "PROGRAMMING LANGUAGES",
  "FRAMEWORKS & LIBRARIES",
  "TOOLS & TECHNOLOGIES",
];

const DEFAULT_FORM: Omit<Skill, "id"> = {
  name: "", level: 80, category: CATEGORIES[0], order_index: 0,
};

const CATEGORY_COLORS: Record<string, string> = {
  "PROGRAMMING LANGUAGES": "bg-lime-500/20 text-lime-400 border-lime-500/20",
  "FRAMEWORKS & LIBRARIES": "bg-cyan-500/20 text-cyan-400 border-cyan-500/20",
  "TOOLS & TECHNOLOGIES": "bg-purple-500/20 text-purple-400 border-purple-500/20",
};

export function SkillsManager() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Skill | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState("All");

  const load = () => {
    setLoading(true);
    getSkills().then(data => { setItems(data); setLoading(false); });
  };
  useEffect(load, []);

  function openCreate() { setEditItem(null); setForm(DEFAULT_FORM); setModalOpen(true); }
  function openEdit(item: Skill) { setEditItem(item); setForm({ ...item }); setModalOpen(true); }

  async function handleSave() {
    setSaving(true);
    try {
      if (editItem) { await updateSkill(editItem.id, form); }
      else { await createSkill(form); }
      setModalOpen(false); load();
    } catch (e) { alert("Error: " + e); } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete?")) return;
    try {
      await deleteSkill(id);
      load();
    } catch (e) {
      alert("Error deleting skill: " + e);
    }
  }

  const filtered = filterCat === "All" ? items : items.filter(s => s.category === filterCat);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Skills</h2>
          <p className="text-gray-500 text-sm">{items.length} skills across {CATEGORIES.length} categories</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm transition-all">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              filterCat === cat ? "bg-lime-500/20 text-lime-400 border-lime-500/30" : "bg-white/5 text-gray-400 border-white/5 hover:border-white/15"
            }`}
          >
            {cat === "All" ? "All" : cat.split(" ")[0]}
          </button>
        ))}
      </div>

      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-gray-900 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{item.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[item.category] || "bg-gray-500/20 text-gray-400 border-gray-500/20"}`}>
                    {item.category.split(" ")[0]}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-lime-500/20 hover:text-lime-400 text-gray-400 transition-all"><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all"><Trash2 size={12} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-lime-400 rounded-full transition-all" style={{ width: `${item.level}%` }} />
                </div>
                <span className="text-xs text-gray-500 font-mono w-8">{item.level}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Skill" : "Add Skill"}>
        <div className="space-y-4">
          <AdminInput label="Skill Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Python" />
          <AdminSelect label="Category *" value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            options={CATEGORIES.map(c => ({ value: c, label: c }))}
          />
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Proficiency Level: <span className="text-lime-400">{form.level}%</span>
            </label>
            <input type="range" min={0} max={100} value={form.level}
              onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))}
              className="w-full accent-lime-400"
            />
          </div>
          <AdminInput label="Order" type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: Number(e.target.value) }))} />
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 text-sm font-bold">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-sm font-black disabled:opacity-50">
              {saving ? "Saving..." : "Save Skill"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
