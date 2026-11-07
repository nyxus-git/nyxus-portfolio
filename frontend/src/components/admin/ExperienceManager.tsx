"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, MapPin, Globe, Laptop, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  Experience,
  CompanyProject
} from "@/lib/api";
import { Modal } from "./Modal";
import { AdminInput, AdminTextarea } from "./AdminInputs";

const DEFAULT_PROJECT: CompanyProject = {
  name: "",
  tagline: "",
  description: "",
  role: "",
  live_url: "",
  github_url: "",
  impact: [],
  tech_stack: []
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
    getExperiences().then(data => {
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
    setForm(f => ({
      ...f,
      projects: [...(f.projects || []), newProj]
    }));
    setActiveProjectIdx((form.projects?.length || 0));
  }

  function handleUpdateProject(index: number, updated: CompanyProject) {
    setForm(f => {
      const next = [...(f.projects || [])];
      next[index] = updated;
      return { ...f, projects: next };
    });
  }

  function handleDeleteProject(index: number) {
    setForm(f => ({
      ...f,
      projects: (f.projects || []).filter((_, i) => i !== index)
    }));
    if (activeProjectIdx === index) setActiveProjectIdx(null);
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Process highlights and skills
      const finalSkills = skillsStr
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const finalHighlights = highlightsStr
        .split("\n")
        .map(h => h.trim())
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
          <p className="text-gray-500 text-sm">{items.length} companies & organizations</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(163,230,53,0.2)]"
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
                <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center flex-shrink-0 text-lime-400 font-black text-xs font-mono">
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

                  <p className="text-lime-400 text-sm font-semibold mt-0.5">{item.company_name}</p>

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
                    className="p-2 rounded-lg bg-white/5 hover:bg-lime-500/20 hover:text-lime-400 text-gray-400 transition-all"
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
              onChange={e => setForm(f => ({ ...f, job_title: e.target.value }))}
              placeholder="Junior ML Engineer"
            />
            <AdminInput
              label="Company Name *"
              value={form.company_name}
              onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
              placeholder="Sampro License India Pvt. Ltd."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Company URL (Optional)"
              value={form.company_url || ""}
              onChange={e => setForm(f => ({ ...f, company_url: e.target.value }))}
              placeholder="https://samprolicense.com"
            />
            <AdminInput
              label="Role Type"
              value={form.role_type || ""}
              onChange={e => setForm(f => ({ ...f, role_type: e.target.value }))}
              placeholder="Full-Time / Research / Internship"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminInput
              label="Location"
              value={form.location || ""}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="Wakad, Pune"
            />
            <AdminInput
              label="Start Date *"
              value={form.start_date}
              onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
              placeholder="Dec 2025"
            />
            <AdminInput
              label="End Date (or 'Present')"
              value={form.end_date || ""}
              onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
              placeholder="Present"
            />
          </div>

          <AdminTextarea
            label="Role Overview / Mission Description"
            value={form.description || ""}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="High level overview of your responsibilities at this company..."
          />

          <AdminTextarea
            label="Key Highlights & Achievements (One per line)"
            value={highlightsStr}
            onChange={e => setHighlightsStr(e.target.value)}
            rows={3}
            placeholder="Architected 4+ production AI systems&#10;Reduced latency by 30%..."
          />

          <AdminInput
            label="Company Tech Stack (Comma separated)"
            value={skillsStr}
            onChange={e => setSkillsStr(e.target.value)}
            placeholder="FastAPI, React, LangChain, Azure, Docker"
          />

          <AdminInput
            label="Display Order (0 = Top)"
            type="number"
            value={form.order_index}
            onChange={e => setForm(f => ({ ...f, order_index: Number(e.target.value) }))}
          />

          {/* ── Sub-Projects Section ── */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Laptop size={15} className="text-lime-400" />
                  Company Projects & Deliverables ({form.projects?.length || 0})
                </h3>
                <p className="text-xs text-gray-500">
                  Projects engineered during your tenure at {form.company_name || "this company"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-lime-500/20 text-lime-400 border border-lime-500/30 text-xs font-bold hover:bg-lime-500/30 transition-all"
              >
                <Plus size={13} /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {(form.projects || []).map((proj, pIdx) => {
                const isExpanded = activeProjectIdx === pIdx;
                return (
                  <div
                    key={pIdx}
                    className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveProjectIdx(isExpanded ? null : pIdx)}
                        className="flex items-center gap-2 text-left font-bold text-sm text-white hover:text-lime-400 transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        <span>{proj.name || `Project #${pIdx + 1} (Untitled)`}</span>
                        {proj.live_url && (
                          <span className="text-[10px] font-mono text-lime-400 px-1.5 py-0.5 rounded bg-lime-500/10">
                            Live
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
                            onChange={e => {
                              const updated = { ...proj, name: e.target.value };
                              handleUpdateProject(pIdx, updated);
                            }}
                            placeholder="SmartResume"
                          />
                          <AdminInput
                            label="Tagline"
                            value={proj.tagline || ""}
                            onChange={e => {
                              const updated = { ...proj, tagline: e.target.value };
                              handleUpdateProject(pIdx, updated);
                            }}
                            placeholder="AI ATS Resume Optimization Platform"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <AdminInput
                            label="Live URL (e.g. https://...)"
                            value={proj.live_url || ""}
                            onChange={e => {
                              const updated = { ...proj, live_url: e.target.value };
                              handleUpdateProject(pIdx, updated);
                            }}
                            placeholder="https://smartresume.samprolicense.com"
                          />
                          <AdminInput
                            label="Role / Title"
                            value={proj.role || ""}
                            onChange={e => {
                              const updated = { ...proj, role: e.target.value };
                              handleUpdateProject(pIdx, updated);
                            }}
                            placeholder="Lead AI Developer"
                          />
                        </div>

                        <AdminTextarea
                          label="Description"
                          value={proj.description || ""}
                          onChange={e => {
                            const updated = { ...proj, description: e.target.value };
                            handleUpdateProject(pIdx, updated);
                          }}
                          rows={2}
                          placeholder="Brief technical summary..."
                        />

                        <AdminTextarea
                          label="Impact / Key Highlights (One per line)"
                          value={(proj.impact || []).join("\n")}
                          onChange={e => {
                            const updated = {
                              ...proj,
                              impact: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                            };
                            handleUpdateProject(pIdx, updated);
                          }}
                          rows={3}
                          placeholder="Structured JSON output extraction under 2s&#10;ATS keyword comparison..."
                        />

                        <AdminInput
                          label="Tech Stack (Comma separated)"
                          value={(proj.tech_stack || []).join(", ")}
                          onChange={e => {
                            const updated = {
                              ...proj,
                              tech_stack: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                            };
                            handleUpdateProject(pIdx, updated);
                          }}
                          placeholder="Python, FastAPI, LangChain, React, Azure"
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
              className="flex-1 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-sm font-black disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)]"
            >
              {saving ? "Saving Experience..." : "Save Experience"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
