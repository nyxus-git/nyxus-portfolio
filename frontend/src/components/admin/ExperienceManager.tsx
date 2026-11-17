"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, MapPin, Globe, Laptop, ChevronDown, ChevronUp, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  Experience,
  CompanyProject,
  ProjectLink,
} from "@/lib/api";
import { Modal } from "./Modal";
import { AdminInput, AdminTextarea } from "./AdminInputs";

const DEFAULT_PROJECT: CompanyProject = {
  name: "",
  tagline: "",
  description: "",
  role: "",
  category: "",
  is_published: true,
  live_url: "",
  github_url: "",
  links: [],
  responsibilities: [],
  impact: [],
  tech_stack: [],
};

const DEFAULT_FORM: Omit<Experience, "id"> = {
  job_title: "",
  company_name: "",
  company_url: "",
  role_type: "Full-Time",
  location: "",
  start_date: "",
  end_date: "",
  description: "",
  highlights: [],
  skills: [],
  projects: [],
  order_index: 0,
};

export function ExperienceManager() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Experience | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  // Helper strings for comma-separated / newline-separated inputs
  const [skillsStr, setSkillsStr] = useState("");
  const [highlightsStr, setHighlightsStr] = useState("");

  // Projects editor state
  const [activeProjectIdx, setActiveProjectIdx] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getExperiences().then((data) => {
      setItems(data);
      setLoading(false);
    });
  };
  useEffect(load, []);

  function openCreate() {
    setEditItem(null);
    setForm(DEFAULT_FORM);
    setSkillsStr("");
    setHighlightsStr("");
    setActiveProjectIdx(null);
    setModalOpen(true);
  }

  function openEdit(item: Experience) {
    setEditItem(item);
    setForm({
      job_title: item.job_title,
      company_name: item.company_name,
      company_url: item.company_url || "",
      role_type: item.role_type || "Full-Time",
      location: item.location || "",
      start_date: item.start_date,
      end_date: item.end_date || "",
      description: item.description || "",
      highlights: item.highlights || [],
      skills: item.skills || [],
      projects: item.projects || [],
      order_index: item.order_index,
    });
    setSkillsStr((item.skills || []).join(", "));
    setHighlightsStr((item.highlights || []).join("\n"));
    setActiveProjectIdx(null);
    setModalOpen(true);
  }

  function handleAddProject() {
    const newProj: CompanyProject = { ...DEFAULT_PROJECT };
    setForm((f) => ({
      ...f,
      projects: [...(f.projects || []), newProj],
    }));
    setActiveProjectIdx(form.projects?.length || 0);
  }

  function handleUpdateProject(index: number, updated: CompanyProject) {
    setForm((f) => {
      const next = [...(f.projects || [])];
      next[index] = updated;
      return { ...f, projects: next };
    });
  }

  function handleDeleteProject(index: number) {
    setForm((f) => ({
      ...f,
      projects: (f.projects || []).filter((_, i) => i !== index),
    }));
    if (activeProjectIdx === index) setActiveProjectIdx(null);
  }

  // ── Link helpers per project ──────────────────────────────
  function handleAddLink(pIdx: number) {
    const proj = (form.projects || [])[pIdx];
    if (!proj) return;
    const newLink: ProjectLink = { label: "", url: "", display_order: (proj.links?.length || 0) };
    handleUpdateProject(pIdx, { ...proj, links: [...(proj.links || []), newLink] });
  }

  function handleUpdateLink(pIdx: number, lIdx: number, field: keyof ProjectLink, value: string | number) {
    const proj = (form.projects || [])[pIdx];
    if (!proj) return;
    const updatedLinks = [...(proj.links || [])];
    updatedLinks[lIdx] = { ...updatedLinks[lIdx], [field]: value };
    handleUpdateProject(pIdx, { ...proj, links: updatedLinks });
  }

  function handleRemoveLink(pIdx: number, lIdx: number) {
    const proj = (form.projects || [])[pIdx];
    if (!proj) return;
    const updatedLinks = (proj.links || []).filter((_, i) => i !== lIdx);
    handleUpdateProject(pIdx, { ...proj, links: updatedLinks });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const finalSkills = skillsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const finalHighlights = highlightsStr
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        skills: finalSkills,
        highlights: finalHighlights,
      };

      if (editItem) {
        await updateExperience(editItem.id, payload);
      } else {
        await createExperience(payload);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      alert("Error saving experience: " + e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
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
          <p className="text-gray-500 text-sm">{items.length} companies &amp; organizations</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm transition-all"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-mono">Loading experiences...</div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const projectCount = item.projects?.length || 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-900 border border-white/5 rounded-2xl p-5 flex items-start gap-4 hover:border-white/10 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0 text-primary font-black text-xs font-mono">
                  {item.start_date.slice(0, 4)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white text-base">{item.job_title}</h3>
                    {item.role_type && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                        {item.role_type}
                      </span>
                    )}
                  </div>

                  <p className="text-primary text-sm font-semibold mt-0.5">{item.company_name}</p>

                  <div className="flex items-center gap-3 text-gray-500 text-xs mt-1.5 font-mono flex-wrap">
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-gray-400" />
                        {item.location}
                      </span>
                    )}
                    <span>•</span>
                    <span>
                      {item.start_date} — {item.end_date || "Present"}
                    </span>
                    {projectCount > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-primary font-bold flex items-center gap-1">
                          <Laptop size={11} />
                          {projectCount} {projectCount === 1 ? "project" : "projects"}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-400 transition-all"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Experience Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? `Edit: ${editItem.company_name}` : "Add Experience"}
      >
        <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Job Title *"
              value={form.job_title}
              onChange={(e) => setForm((f) => ({ ...f, job_title: e.target.value }))}
              placeholder="Junior ML Engineer"
            />
            <AdminInput
              label="Company Name *"
              value={form.company_name}
              onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
              placeholder="SAMPRO LICENSE INDIA PRIVATE LIMITED"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Company URL (Optional)"
              value={form.company_url || ""}
              onChange={(e) => setForm((f) => ({ ...f, company_url: e.target.value }))}
              placeholder="https://samprolicense.com"
            />
            <AdminInput
              label="Role Type"
              value={form.role_type || ""}
              onChange={(e) => setForm((f) => ({ ...f, role_type: e.target.value }))}
              placeholder="Full-Time / Research / Internship"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminInput
              label="Location"
              value={form.location || ""}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Wakad, Pune"
            />
            <AdminInput
              label="Start Date *"
              value={form.start_date}
              onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
              placeholder="Dec 2024"
            />
            <AdminInput
              label="End Date (or 'Present')"
              value={form.end_date || ""}
              onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
              placeholder="Present"
            />
          </div>

          <AdminTextarea
            label="Role Overview / Mission Description"
            value={form.description || ""}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="High level overview of your responsibilities at this company..."
          />

          <AdminTextarea
            label="Key Highlights & Achievements (One per line)"
            value={highlightsStr}
            onChange={(e) => setHighlightsStr(e.target.value)}
            rows={3}
            placeholder={"Architected 4+ production AI systems\nReduced latency by 30%..."}
          />

          <AdminInput
            label="Company Tech Stack (Comma separated)"
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            placeholder="Python, Flask, React.js, Azure, Docker"
          />

          <AdminInput
            label="Display Order (0 = Top)"
            type="number"
            value={form.order_index}
            onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
          />

          {/* ── Sub-Projects Section ── */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Laptop size={15} className="text-primary" />
                  Company Projects &amp; Deliverables ({form.projects?.length || 0})
                </h3>
                <p className="text-xs text-gray-500">
                  Projects engineered during your tenure at {form.company_name || "this company"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30 text-xs font-bold hover:bg-primary/30 transition-all"
              >
                <Plus size={13} /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {(form.projects || []).map((proj, pIdx) => {
                const isExpanded = activeProjectIdx === pIdx;
                const linkCount = proj.links?.length || 0;
                return (
                  <div
                    key={pIdx}
                    className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveProjectIdx(isExpanded ? null : pIdx)}
                        className="flex items-center gap-2 text-left font-bold text-sm text-white hover:text-primary transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        <span>{proj.name || `Project #${pIdx + 1} (Untitled)`}</span>
                        {linkCount > 0 && (
                          <span className="text-[10px] font-mono text-primary px-1.5 py-0.5 rounded bg-primary/15">
                            {linkCount} link{linkCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {proj.is_published === false && (
                          <span className="text-[10px] font-mono text-orange-400 px-1.5 py-0.5 rounded bg-orange-400/15">
                            Hidden
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(pIdx)}
                        className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="pt-3 border-t border-white/5 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <AdminInput
                            label="Project Name *"
                            value={proj.name}
                            onChange={(e) => handleUpdateProject(pIdx, { ...proj, name: e.target.value })}
                            placeholder="Smart Resume – AI-Powered Resume Builder"
                          />
                          <AdminInput
                            label="Tagline"
                            value={proj.tagline || ""}
                            onChange={(e) => handleUpdateProject(pIdx, { ...proj, tagline: e.target.value })}
                            placeholder="AI-powered career development platform..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <AdminInput
                            label="Role / Your Title"
                            value={proj.role || ""}
                            onChange={(e) => handleUpdateProject(pIdx, { ...proj, role: e.target.value })}
                            placeholder="Backend & AI Developer"
                          />
                          <AdminInput
                            label="Category (pipe-separated)"
                            value={proj.category || ""}
                            onChange={(e) => handleUpdateProject(pIdx, { ...proj, category: e.target.value })}
                            placeholder="Generative AI | Backend Development | DevOps"
                          />
                        </div>

                        {/* Published toggle */}
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={proj.is_published !== false}
                              onChange={(e) => handleUpdateProject(pIdx, { ...proj, is_published: e.target.checked })}
                            />
                            <div
                              className={`w-10 h-5 rounded-full transition-colors ${proj.is_published !== false ? "bg-primary" : "bg-white/10"}`}
                            />
                            <div
                              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${proj.is_published !== false ? "translate-x-5" : ""}`}
                            />
                          </div>
                          <span className="text-sm text-gray-300">Published (visible on portfolio)</span>
                        </label>

                        <AdminTextarea
                          label="Description"
                          value={proj.description || ""}
                          onChange={(e) => handleUpdateProject(pIdx, { ...proj, description: e.target.value })}
                          rows={2}
                          placeholder="Brief technical summary of this project..."
                        />

                        {/* ── Project Links ── */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Link2 size={12} className="text-primary" />
                              Project Links ({linkCount})
                            </label>
                            <button
                              type="button"
                              onClick={() => handleAddLink(pIdx)}
                              className="text-[11px] font-mono text-primary hover:text-accent flex items-center gap-1 px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all"
                            >
                              <Plus size={11} /> Add Link
                            </button>
                          </div>

                          {(proj.links || []).map((link, lIdx) => (
                            <div key={lIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={link.label}
                                onChange={(e) => handleUpdateLink(pIdx, lIdx, "label", e.target.value)}
                                placeholder="Label (e.g. Live Application)"
                                className="w-36 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50 font-mono"
                              />
                              <input
                                type="url"
                                value={link.url}
                                onChange={(e) => handleUpdateLink(pIdx, lIdx, "url", e.target.value)}
                                placeholder="https://..."
                                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-primary/50"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveLink(pIdx, lIdx)}
                                className="text-gray-500 hover:text-red-400 p-1.5 transition-colors flex-shrink-0"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}

                          {linkCount === 0 && (
                            <p className="text-[11px] text-gray-600 font-mono italic">
                              No links yet. Click &quot;Add Link&quot; to add website, app store, etc.
                            </p>
                          )}
                        </div>

                        {/* Legacy live_url fallback */}
                        <AdminInput
                          label="Legacy Live URL (Fallback if no links above)"
                          value={proj.live_url || ""}
                          onChange={(e) => handleUpdateProject(pIdx, { ...proj, live_url: e.target.value })}
                          placeholder="https://..."
                        />

                        <AdminTextarea
                          label="Responsibilities (One per line)"
                          value={(proj.responsibilities || []).join("\n")}
                          onChange={(e) =>
                            handleUpdateProject(pIdx, {
                              ...proj,
                              responsibilities: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          rows={4}
                          placeholder={"Developed backend APIs using Python and Flask\nIntegrated Groq LLM APIs..."}
                        />

                        <AdminTextarea
                          label="Key Impact / Achievements (One per line)"
                          value={(proj.impact || []).join("\n")}
                          onChange={(e) =>
                            handleUpdateProject(pIdx, {
                              ...proj,
                              impact: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          rows={3}
                          placeholder={"Integrated Groq LLM for AI resume generation\nContainerized on Azure..."}
                        />

                        <AdminInput
                          label="Tech Stack (Comma separated)"
                          value={(proj.tech_stack || []).join(", ")}
                          onChange={(e) =>
                            handleUpdateProject(pIdx, {
                              ...proj,
                              tech_stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          placeholder="Python, Flask, React.js, Groq API, Docker, Azure"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 text-sm font-bold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 rounded-xl btn-primary text-sm font-black disabled:opacity-50 transition-all"
            >
              {saving ? "Saving Experience..." : "Save Experience"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
