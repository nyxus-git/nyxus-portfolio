"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Award, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { getCertifications, createCertification, updateCertification, deleteCertification, Certification } from "@/lib/api";
import { Modal } from "./Modal";
import { AdminInput } from "./AdminInputs";

const DEFAULT_FORM: Omit<Certification, "id"> = {
  name: "", issuing_organization: "", issue_date: "", credential_id: "",
  credential_url: "", skills: [], image_url: "", order_index: 0,
};

export function CertificationsManager() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Certification | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getCertifications().then(data => { setItems(data); setLoading(false); });
  };
  useEffect(load, []);

  function openCreate() { setEditItem(null); setForm(DEFAULT_FORM); setSkillInput(""); setModalOpen(true); }
  function openEdit(item: Certification) {
    setEditItem(item); setForm({ ...item });
    setSkillInput(item.skills?.join(", ") || ""); setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, skills: skillInput.split(",").map(s => s.trim()).filter(Boolean) };
    try {
      if (editItem) { await updateCertification(editItem.id, payload); }
      else { await createCertification(payload); }
      setModalOpen(false); load();
    } catch (e) { alert("Error: " + e); } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete?")) return;
    try {
      await deleteCertification(id);
      load();
    } catch (e) {
      alert("Error deleting certification: " + e);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Certifications</h2>
          <p className="text-gray-500 text-sm">{items.length} certifications</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm transition-all">
          <Plus size={16} /> Add Certification
        </button>
      </div>

      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Award size={14} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm leading-tight">{item.name}</h3>
                    <p className="text-purple-400 text-xs">{item.issuing_organization}</p>
                    <p className="text-gray-600 text-xs font-mono mt-1">{new Date(item.issue_date).toLocaleDateString(undefined, { year: "numeric", month: "short" })}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {item.credential_url && <a href={item.credential_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-all"><ExternalLink size={12} /></a>}
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-lime-500/20 hover:text-lime-400 text-gray-400 transition-all"><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all"><Trash2 size={12} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.skills?.slice(0, 4).map((s, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-400/10 text-purple-300 border border-purple-400/10">{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Certification" : "Add Certification"}>
        <div className="space-y-4">
          <AdminInput label="Certificate Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Machine Learning Specialization" />
          <AdminInput label="Issuing Organization *" value={form.issuing_organization} onChange={e => setForm(f => ({ ...f, issuing_organization: e.target.value }))} placeholder="DeepLearning.AI" />
          <AdminInput label="Issue Date *" type="date" value={form.issue_date} onChange={e => setForm(f => ({ ...f, issue_date: e.target.value }))} />
          <AdminInput label="Credential ID" value={form.credential_id || ""} onChange={e => setForm(f => ({ ...f, credential_id: e.target.value }))} placeholder="ABC-123" />
          <AdminInput label="Credential URL" value={form.credential_url || ""} onChange={e => setForm(f => ({ ...f, credential_url: e.target.value }))} placeholder="https://..." />
          <AdminInput label="Skills (comma-separated)" value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Python, TensorFlow, NLP..." />
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
