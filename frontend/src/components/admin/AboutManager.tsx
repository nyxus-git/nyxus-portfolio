"use client";

import { useState, useEffect } from "react";
import { Save, User } from "lucide-react";
import { motion } from "framer-motion";
import { getAbout, updateAbout, About } from "@/lib/api";
import { AdminInput, AdminTextarea } from "./AdminInputs";
import { FileUploadButton } from "./FileUploadButton";

export function AboutManager() {
  const [form, setForm] = useState<Omit<About, "id">>({
    name: "", tagline: "", bio: "", bio2: "", email: "", phone: "", location: "",
    github_url: "", linkedin_url: "", twitter_url: "", youtube_url: "",
    leetcode_url: "", resume_url: "", profile_image: "", roles: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAbout().then(data => {
      if (data) {
        const { id, ...rest } = data;
        setForm(rest);
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await updateAbout(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Error: " + e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">About & Profile</h2>
          <p className="text-gray-500 text-sm">Manage your personal information, bio, and social links</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm transition-all disabled:opacity-50">
          <Save size={16} />
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <User size={14} /> Basic Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Rohan Mane" />
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Image URL</label>
                <FileUploadButton accept="image/*" label="Upload Image" onUploadSuccess={(url) => setForm(f => ({ ...f, profile_image: url }))} />
              </div>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all" value={form.profile_image || ""} onChange={e => setForm(f => ({ ...f, profile_image: e.target.value }))} placeholder="/profile.jpeg" />
            </div>
            <div className="md:col-span-2">
              <AdminInput label="Tagline" value={form.tagline || ""} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="Building intelligent systems that make a real impact" />
            </div>
            <div className="md:col-span-2">
              <AdminInput label="Rotating Roles (comma-separated)" value={form.roles || ""} onChange={e => setForm(f => ({ ...f, roles: e.target.value }))} placeholder="AI Engineer,ML Engineer,Full Stack Developer" />
            </div>
            <AdminInput label="Email" type="email" value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="rohan@example.com" />
            <AdminInput label="Phone" value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 9356216808" />
            <div className="md:col-span-2">
              <AdminInput label="Location" value={form.location || ""} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Pune, Maharashtra" />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Bio</h3>
          <div className="space-y-4">
            <AdminTextarea label="Bio (Paragraph 1)" value={form.bio || ""} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4} placeholder="Main bio paragraph about yourself..." />
            <AdminTextarea label="Bio (Paragraph 2)" value={form.bio2 || ""} onChange={e => setForm(f => ({ ...f, bio2: e.target.value }))} rows={3} placeholder="Second paragraph..." />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="GitHub URL" value={form.github_url || ""} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))} placeholder="https://github.com/..." />
            <AdminInput label="LinkedIn URL" value={form.linkedin_url || ""} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." />
            <AdminInput label="Twitter/X URL" value={form.twitter_url || ""} onChange={e => setForm(f => ({ ...f, twitter_url: e.target.value }))} placeholder="https://x.com/..." />
            <AdminInput label="YouTube URL" value={form.youtube_url || ""} onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))} placeholder="https://youtube.com/..." />
            <AdminInput label="LeetCode URL" value={form.leetcode_url || ""} onChange={e => setForm(f => ({ ...f, leetcode_url: e.target.value }))} placeholder="https://leetcode.com/u/..." />
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resume URL</label>
                <FileUploadButton accept=".pdf,.doc,.docx" label="Upload Resume" onUploadSuccess={(url) => setForm(f => ({ ...f, resume_url: url }))} />
              </div>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all" value={form.resume_url || ""} onChange={e => setForm(f => ({ ...f, resume_url: e.target.value }))} placeholder="/Rohan_Resume.pdf" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
