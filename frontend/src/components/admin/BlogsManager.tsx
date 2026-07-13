"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { getAllBlogs, createBlog, updateBlog, deleteBlog, BlogPost } from "@/lib/api";
import { Modal } from "./Modal";
import { AdminInput, AdminTextarea } from "./AdminInputs";

const today = new Date().toISOString().split("T")[0];

const DEFAULT_FORM: Omit<BlogPost, "id"> = {
  title: "", slug: "", content: "", excerpt: "", featured_image: "",
  author: "Rohan Mane", date: today, tags: "", published: 1,
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function BlogsManager() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllBlogs().then(data => { setItems(data); setLoading(false); });
  };
  useEffect(load, []);

  function openCreate() { setEditItem(null); setForm(DEFAULT_FORM); setModalOpen(true); }
  function openEdit(item: BlogPost) { setEditItem(item); setForm({ ...item }); setModalOpen(true); }

  async function handleSave() {
    setSaving(true);
    try {
      if (editItem) { await updateBlog(editItem.id, form); }
      else { await createBlog(form); }
      setModalOpen(false); load();
    } catch (e) { alert("Error: " + e); } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this blog post?")) return;
    await deleteBlog(id); load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Blog Posts</h2>
          <p className="text-gray-500 text-sm">{items.length} posts ({items.filter(b => b.published === 1).length} published)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm transition-all">
          <Plus size={16} /> New Post
        </button>
      </div>

      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-gray-900 border border-white/5 rounded-2xl p-5 flex items-start gap-4 hover:border-white/10 transition-all">
              <div className={`w-2 h-full min-h-[40px] rounded-full flex-shrink-0 ${item.published === 1 ? "bg-lime-400" : "bg-gray-600"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-sm truncate">{item.title}</h3>
                  {item.published === 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Draft</span>}
                </div>
                <p className="text-gray-600 text-xs font-mono mb-1">/blog/{item.slug}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={10} />{new Date(item.date).toLocaleDateString()}</span>
                  {item.tags && <span>{item.tags.split(",").slice(0,2).map(t => `#${t.trim()}`).join(" ")}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-lime-500/20 hover:text-lime-400 text-gray-400 transition-all"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Blog Post" : "New Blog Post"}>
        <div className="space-y-4">
          <AdminInput label="Title *"
            value={form.title}
            onChange={e => {
              const title = e.target.value;
              setForm(f => ({ ...f, title, slug: editItem ? f.slug : toSlug(title) }));
            }}
            placeholder="My Amazing Blog Post"
          />
          <AdminInput label="Slug *" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="my-amazing-blog-post" />
          <AdminInput label="Date *" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <AdminTextarea label="Excerpt" value={form.excerpt || ""} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} placeholder="Brief summary of the post..." />
          <AdminTextarea label="Content (Markdown supported)" value={form.content || ""} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={10} placeholder="# Your blog content here..." />
          <AdminInput label="Featured Image URL" value={form.featured_image || ""} onChange={e => setForm(f => ({ ...f, featured_image: e.target.value }))} placeholder="https://..." />
          <AdminInput label="Tags (comma-separated)" value={form.tags || ""} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="ml, python, tutorial" />
          <AdminInput label="Author" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
            <select value={form.published} onChange={e => setForm(f => ({ ...f, published: Number(e.target.value) }))}
              className="px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none w-full">
              <option value={1} className="bg-gray-900">Published</option>
              <option value={0} className="bg-gray-900">Draft</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 text-sm font-bold">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-sm font-black disabled:opacity-50">
              {saving ? "Saving..." : "Save Post"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
