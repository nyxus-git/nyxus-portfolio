"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Github,
  ExternalLink,
  Star,
  Image as ImageIcon,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
  deleteUpload,
  toggleProjectVisibility,
  getImageUrl,
  Project,
} from "@/lib/api";
import { Modal } from "./Modal";
import { AdminInput, AdminTextarea } from "./AdminInputs";
import { FileUploadButton } from "./FileUploadButton";
import Link from "next/link";

const DEFAULT_FORM: Omit<Project, "id"> = {
  title: "",
  slug: "",
  tagline: "",
  description: "",
  long_description: "",
  features: [],
  architecture: "",
  tech_stack: [],
  github_url: "",
  live_url: "",
  image_url: "",
  screenshots: [],
  featured: 0,
  order_index: 0,
  is_visible: 1,
};

export function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Project | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [techInput, setTechInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [newScreenshotUrl, setNewScreenshotUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [tempUploads, setTempUploads] = useState<string[]>([]);

  const load = () => {
    setLoading(true);
    getAllProjectsAdmin()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(load, []);

  function openCreate() {
    setEditItem(null);
    setForm(DEFAULT_FORM);
    setTechInput("");
    setFeaturesInput("");
    setNewScreenshotUrl("");
    setTempUploads([]);
    setModalOpen(true);
  }

  function openEdit(item: Project) {
    setEditItem(item);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      tagline: item.tagline || "",
      description: item.description || "",
      long_description: item.long_description || "",
      features: item.features || [],
      architecture: item.architecture || "",
      tech_stack: item.tech_stack || [],
      github_url: item.github_url || "",
      live_url: item.live_url || "",
      image_url: item.image_url || "",
      screenshots: item.screenshots || [],
      featured: item.featured ?? 0,
      order_index: item.order_index ?? 0,
      is_visible: item.is_visible ?? 1,
    });
    setTechInput((item.tech_stack || []).join(", "));
    setFeaturesInput((item.features || []).join("\n"));
    setNewScreenshotUrl("");
    setTempUploads([]);
    setModalOpen(true);
  }

  function closeModalWithoutSave() {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
    if (token && tempUploads.length > 0) {
      tempUploads.forEach((url) => {
        deleteUpload(url, token).catch(() => {});
      });
    }
    setTempUploads([]);
    setModalOpen(false);
  }

  async function handleToggleVisibility(item: Project) {
    const currentVis = item.is_visible ?? 1;
    const newVis = currentVis === 0 ? 1 : 0;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, is_visible: newVis } : p))
    );
    setTogglingId(item.id);

    try {
      await toggleProjectVisibility(item.id);
    } catch (e) {
      // Revert if failed
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, is_visible: currentVis } : p))
      );
      alert("Failed to toggle project visibility: " + e);
    } finally {
      setTogglingId(null);
    }
  }

  function addScreenshot(url: string) {
    if (!url.trim()) return;
    setForm((f) => ({
      ...f,
      screenshots: [...(f.screenshots || []), url.trim()],
    }));
    setNewScreenshotUrl("");
  }

  function removeScreenshot(index: number) {
    const target = (form.screenshots || [])[index];
    const nextScreenshots = (form.screenshots || []).filter((_, i) => i !== index);
    setForm((f) => ({
      ...f,
      screenshots: nextScreenshots,
    }));
    if (
      target &&
      tempUploads.includes(target) &&
      target !== form.image_url &&
      !nextScreenshots.includes(target)
    ) {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
      if (token) deleteUpload(target, token).catch(() => {});
      setTempUploads((prev) => prev.filter((u) => u !== target));
    }
  }

  async function handleSave() {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    const generatedSlug =
      form.slug?.trim() ||
      form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const payload: Omit<Project, "id"> = {
      ...form,
      slug: generatedSlug,
      tech_stack: techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      features: featuresInput
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      is_visible: form.is_visible ?? 1,
    };

    try {
      if (editItem) {
        await updateProject(editItem.id, payload);
      } else {
        await createProject(payload);
      }
      setTempUploads([]);
      setModalOpen(false);
      load();
    } catch (e) {
      alert("Error saving: " + e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      load();
    } catch (e) {
      alert("Error deleting project: " + e);
    }
  }

  const visibleCount = items.filter((p) => p.is_visible !== 0).length;
  const hiddenCount = items.filter((p) => p.is_visible === 0).length;

  const filteredItems = items.filter((item) => {
    if (filter === "visible") return item.is_visible !== 0;
    if (filter === "hidden") return item.is_visible === 0;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Project Case Studies & Visibility</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {items.length} total •{" "}
            <span className="text-emerald-400 font-semibold">{visibleCount} live on portfolio</span> •{" "}
            <span className="text-amber-400 font-semibold">{hiddenCount} hidden</span>
          </p>
        </div>
        <button
          id="add-project-btn"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm transition-all shadow-md shadow-lime-500/20 self-start sm:self-auto"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "all"
              ? "bg-white text-black shadow-sm"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          All ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("visible")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filter === "visible"
              ? "bg-emerald-500 text-black shadow-sm"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-emerald-400"
          }`}
        >
          <Eye size={13} />
          Live ({visibleCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("hidden")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filter === "hidden"
              ? "bg-amber-500 text-black shadow-sm"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-amber-400"
          }`}
        >
          <EyeOff size={13} />
          Hidden ({hiddenCount})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading projects...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-900/50 rounded-2xl border border-white/5">
          No projects found in this tab.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item, i) => {
            const isVisible = item.is_visible !== 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-gray-900 border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all ${
                  isVisible
                    ? "border-white/5 hover:border-white/15"
                    : "border-dashed border-amber-500/25 bg-amber-950/10 hover:border-amber-500/40"
                }`}
              >
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-800 border border-white/10 flex-shrink-0 relative">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(item.image_url) ?? item.image_url}
                      alt={item.title}
                      className={`w-full h-full object-cover transition-opacity ${
                        isVisible ? "opacity-100" : "opacity-60 grayscale-[40%]"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lime-400 font-bold">
                      {item.title.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className={`font-bold text-base truncate ${isVisible ? "text-white" : "text-gray-300"}`}>
                      {item.title}
                    </h3>

                    {/* Visibility status badge */}
                    {isVisible ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <Eye size={11} /> Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <EyeOff size={11} /> Hidden
                      </span>
                    )}

                    {item.featured === 1 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-400 border border-lime-500/30">
                        <Star size={10} className="fill-lime-400" /> Flagship
                      </span>
                    )}
                    {item.slug && (
                      <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                        /{item.slug}
                      </span>
                    )}
                    <span className="text-xs font-mono text-gray-400">
                      📸 {item.screenshots?.length || (item.image_url ? 1 : 0)} screens
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs line-clamp-1 mb-2">
                    {item.tagline || item.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {item.tech_stack?.slice(0, 5).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                    {(item.tech_stack?.length || 0) > 5 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-white/5 text-gray-500">
                        +{item.tech_stack.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions & Toggle */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-auto w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                  {/* ON / OFF Toggle Button */}
                  <button
                    type="button"
                    id={`toggle-visibility-${item.id}`}
                    onClick={() => handleToggleVisibility(item)}
                    disabled={togglingId === item.id}
                    title={
                      isVisible
                        ? "Currently LIVE on portfolio. Click to Turn OFF (Hide)"
                        : "Currently HIDDEN from portfolio. Click to Turn ON (Show)"
                    }
                    className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      isVisible
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50"
                        : "bg-gray-800/80 border-amber-500/30 text-amber-300 hover:bg-amber-500/15"
                    }`}
                  >
                    <span
                      className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${
                        isVisible ? "bg-emerald-500" : "bg-gray-700"
                      }`}
                    >
                      <span
                        className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
                          isVisible ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </span>
                    <span className="text-[11px] tracking-wide font-mono">
                      {isVisible ? "SHOW" : "HIDE"}
                    </span>
                  </button>

                  {/* View Landing Page Link */}
                  <Link
                    href={`/projects/${item.slug || item.id}`}
                    target="_blank"
                    title="View Landing Page"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium"
                  >
                    <Eye size={14} className="text-primary" />
                    <span className="hidden lg:inline">Preview</span>
                  </Link>

                  {item.github_url && (
                    <a
                      href={item.github_url}
                      target="_blank"
                      rel="noreferrer"
                      title="GitHub Repository"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    >
                      <Github size={14} />
                    </a>
                  )}
                  {item.live_url && (
                    <a
                      href={item.live_url}
                      target="_blank"
                      rel="noreferrer"
                      title="Live Demo"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(item)}
                    title="Edit Project"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-lime-500/20 hover:text-lime-400 text-gray-400 transition-all"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Delete Project"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModalWithoutSave}
        title={editItem ? `Edit Project: ${editItem.title}` : "Add New Project"}
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Project Title *"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. DocMind"
            />
            <AdminInput
              label="URL Slug (e.g. docmind)"
              value={form.slug || ""}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="unique-slug"
            />
          </div>

          <AdminInput
            label="Tagline / Short Subtitle"
            value={form.tagline || ""}
            onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
            placeholder="e.g. Enterprise-grade multimodal RAG agent with hybrid vector search"
          />

          <AdminTextarea
            label="Card Summary Description *"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="Brief overview shown on the main portfolio card..."
          />

          <AdminTextarea
            label="Full In-Depth Architecture / Case Study (Markdown supported)"
            value={form.long_description || ""}
            onChange={(e) => setForm((f) => ({ ...f, long_description: e.target.value }))}
            rows={6}
            placeholder="Detailed architectural breakdown, problem statement, technical solution, benchmarks..."
          />

          <AdminTextarea
            label="Key Features (One feature per line)"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            rows={4}
            placeholder="Multi-Agent Fact Verification&#10;Sub-100ms Latency Engine&#10;Semantic Qdrant Embeddings"
          />

          <AdminTextarea
            label="System Pipeline & Data Flow Architecture (Markdown/Text)"
            value={form.architecture || ""}
            onChange={(e) => setForm((f) => ({ ...f, architecture: e.target.value }))}
            rows={4}
            placeholder="Step-by-step description of system pipeline, data flows, and workers..."
          />

          <AdminInput
            label="Tech Stack (comma-separated)"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Python, FastAPI, Qdrant, Next.js, PyTorch"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="GitHub Repository URL"
              value={form.github_url || ""}
              onChange={(e) => setForm((f) => ({ ...f, github_url: e.target.value }))}
              placeholder="https://github.com/..."
            />
            <AdminInput
              label="Live Demo URL"
              value={form.live_url || ""}
              onChange={(e) => setForm((f) => ({ ...f, live_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          {/* Main Cover Image */}
          <div className="p-4 rounded-xl bg-gray-800/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon size={14} className="text-lime-400" />
                <span>Primary Cover Image</span>
              </label>
              <FileUploadButton
                accept="image/*"
                label="Upload Cover Image"
                previousUrl={form.image_url && tempUploads.includes(form.image_url) ? form.image_url : null}
                onUploadSuccess={(url) => {
                  const prevTemp = form.image_url && tempUploads.includes(form.image_url) ? form.image_url : null;
                  setTempUploads((prev) => [...prev.filter((u) => u !== prevTemp), url]);
                  setForm((f) => ({ ...f, image_url: url }));
                }}
              />
            </div>
            <input
              type="text"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-lime-500/50"
              value={form.image_url || ""}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="/images/uploads/example.jpg"
            />
            {form.image_url && (
              <div className="relative group w-28 aspect-video rounded-lg overflow-hidden border border-white/10 mt-2 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(form.image_url) ?? form.image_url}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    const target = form.image_url;
                    if (
                      target &&
                      tempUploads.includes(target) &&
                      !(form.screenshots || []).includes(target)
                    ) {
                      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
                      if (token) deleteUpload(target, token).catch(() => {});
                      setTempUploads((prev) => prev.filter((u) => u !== target));
                    }
                    setForm((f) => ({ ...f, image_url: "" }));
                  }}
                  title="Remove Cover Image"
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={11} />
                </button>
              </div>
            )}
          </div>

          {/* Screenshot Gallery Management */}
          <div className="p-4 rounded-xl bg-gray-800/40 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  Screenshot Gallery ({(form.screenshots || []).length} screenshots)
                </label>
                <p className="text-[11px] text-gray-500">
                  Add multiple screenshots to be displayed in the project landing page carousel.
                </p>
              </div>
              <FileUploadButton
                accept="image/*"
                label="Upload Screenshot"
                onUploadSuccess={(url) => {
                  setTempUploads((prev) => [...prev, url]);
                  addScreenshot(url);
                }}
              />
            </div>

            {/* Screenshots Thumbnails Grid */}
            {(form.screenshots || []).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {(form.screenshots || []).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden aspect-video border border-white/10 bg-black"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(img) ?? img}
                      alt={`Screenshot ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(idx)}
                      title="Remove Screenshot"
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-mono text-gray-400 bg-black/60 px-1 rounded">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Manual URL Input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-lime-500/50"
                value={newScreenshotUrl}
                onChange={(e) => setNewScreenshotUrl(e.target.value)}
                placeholder="Or paste screenshot URL (/images/uploads/...)"
              />
              <button
                type="button"
                onClick={() => addScreenshot(newScreenshotUrl)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                Add URL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Portfolio Visibility
              </label>
              <select
                value={form.is_visible ?? 1}
                onChange={(e) => setForm((f) => ({ ...f, is_visible: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
              >
                <option value={1} className="bg-gray-900">
                  🟢 Show to Public (ON)
                </option>
                <option value={0} className="bg-gray-900">
                  🟡 Hide from Public (OFF)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Featured Flagship
              </label>
              <select
                value={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
              >
                <option value={0} className="bg-gray-900">
                  No (Regular Project)
                </option>
                <option value={1} className="bg-gray-900">
                  Yes (Flagship Project)
                </option>
              </select>
            </div>

            <AdminInput
              label="Sort Order"
              type="number"
              value={form.order_index}
              onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
            />
          </div>

          <div className="flex gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={closeModalWithoutSave}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-xs font-black transition-all disabled:opacity-50 shadow-md shadow-lime-500/20"
            >
              {saving ? "Saving Changes..." : editItem ? "Update Project" : "Create Project"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
