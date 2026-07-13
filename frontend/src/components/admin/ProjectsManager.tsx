"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Github, ExternalLink, Star } from "lucide-react";
import { motion } from "framer-motion";
import { getProjects, createProject, updateProject, deleteProject, Project } from "@/lib/api";
import { Modal } from "./Modal";
import { AdminInput, AdminTextarea } from "./AdminInputs";

const DEFAULT_FORM: Omit<Project, "id"> = {
  title: "", description: "", tech_stack: [], github_url: "", live_url: "",
  image_url: "", featured: 0, order_index: 0,
};

export function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Project | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getProjects().then(data => { setItems(data); setLoading(false); });
  };

  useEffect(load, []);

  function openCreate() {
    setEditItem(null);
    setForm(DEFAULT_FORM);
    setTechInput("");
    setModalOpen(true);
  }

  function openEdit(item: Project) {
    setEditItem(item);
    setForm({ ...item });
    setTechInput(item.tech_stack.join(", "));
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, tech_stack: techInput.split(",").map(t => t.trim()).filter(Boolean) };
    try {
      if (editItem) {
        await updateProject(editItem.id, payload);
      } else {
        await createProject(payload);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      alert("Error saving: " + e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Projects</h2>
          <p className="text-gray-500 text-sm">{items.length} projects total</p>
        </div>
        <button
          id="add-project-btn"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm transition-all"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-900 border border-white/5 rounded-2xl p-5 flex items-start gap-4 hover:border-white/10 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-lime-500/20 border border-lime-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lime-400 font-black text-sm">{item.title.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white truncate">{item.title}</h3>
                  {item.featured === 1 && <Star size={12} className="text-lime-400 fill-lime-400 flex-shrink-0" />}
                </div>
                <p className="text-gray-500 text-xs line-clamp-2 mb-2">{item.description}</p>
                <div className="flex flex-wrap gap-1">
                  {item.tech_stack?.slice(0, 5).map((t, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-300 border border-lime-400/10">{t}</span>
                  ))}
                  {(item.tech_stack?.length || 0) > 5 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500">+{item.tech_stack.length - 5}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.github_url && <a href={item.github_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Github size={14} /></a>}
                {item.live_url && <a href={item.live_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><ExternalLink size={14} /></a>}
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-lime-500/20 hover:text-lime-400 text-gray-400 transition-all"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Project" : "Add Project"}>
        <div className="space-y-4">
          <AdminInput label="Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Project Name" />
          <AdminTextarea label="Description *" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} placeholder="Describe your project..." />
          <AdminInput label="Tech Stack (comma-separated)" value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="Python, TensorFlow, React..." />
          <AdminInput label="GitHub URL" value={form.github_url || ""} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))} placeholder="https://github.com/..." />
          <AdminInput label="Live URL" value={form.live_url || ""} onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))} placeholder="https://..." />
          <AdminInput label="Image URL" value={form.image_url || ""} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
          <div className="flex gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Featured</label>
              <select value={form.featured} onChange={e => setForm(f => ({ ...f, featured: Number(e.target.value) }))} className="px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                <option value={0} className="bg-gray-900">No</option>
                <option value={1} className="bg-gray-900">Yes</option>
              </select>
            </div>
            <AdminInput label="Order" type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: Number(e.target.value) }))} className="w-24" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-bold transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-sm font-black transition-all disabled:opacity-50">
              {saving ? "Saving..." : "Save Project"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
