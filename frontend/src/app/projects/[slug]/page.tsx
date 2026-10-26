"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
  Share2,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Code2,
  Zap,
} from "lucide-react";
import { getProject, getProjects, getImageUrl, type Project } from "@/lib/api";
import { Navbar } from "@/components/sections/Navbar";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setActiveImageIndex(0);

    Promise.all([getProject(slug), getProjects()]).then(([p, all]) => {
      setProject(p);
      setAllProjects(all);
      setLoading(false);
    });
  }, [slug]);

  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-400 font-mono text-sm">Loading project architecture...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-center px-4">
        <h1 className="text-4xl font-black text-white mb-3">Project Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          The requested project blueprint or architecture page could not be located.
        </p>
        <Link
          href="/#project"
          className="px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          Return to Portfolio
        </Link>
      </div>
    );
  }

  // Aggregate all gallery images
  const galleryImages: string[] = [];
  if (project.image_url) galleryImages.push(project.image_url);
  if (project.screenshots && project.screenshots.length > 0) {
    project.screenshots.forEach((img) => {
      if (!galleryImages.includes(img)) galleryImages.push(img);
    });
  }

  // Determine prev and next projects
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const activeImageUrl = galleryImages[activeImageIndex] || project.image_url;

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-primary/30 selection:text-white pb-24">
      <Navbar />

      {/* Top Banner Navigation */}
      <div className="pt-24 pb-6 border-b border-white/5 bg-gray-900/40 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
          <Link
            href="/#project"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 border border-white/10 transition-colors"
            >
              <Share2 size={13} />
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
              >
                <Github size={13} />
                <span>GitHub</span>
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-xs font-bold text-black transition-all shadow-md shadow-primary/20"
              >
                <ExternalLink size={13} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-6xl mt-8">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
              <Sparkles size={13} />
              {project.featured === 1 ? "Flagship AI Companion" : "Generative AI Project"}
            </span>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              ID #{project.id} • {project.slug || "genai"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight mb-4">
            {project.title}
          </h1>

          {project.tagline && (
            <p className="text-lg md:text-xl text-primary/90 font-medium max-w-3xl mb-6">
              {project.tagline}
            </p>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover-trigger"
              >
                <ExternalLink size={16} />
                <span>Launch Live Demo</span>
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition-all hover-trigger"
              >
                <Github size={16} />
                <span>Source Code</span>
              </a>
            )}
          </div>

          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
            {project.tech_stack?.map((tech, i) => (
              <span
                key={i}
                className="text-xs font-medium text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Screenshot Gallery & Carousel Showcase */}
        {galleryImages.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl backdrop-blur-xl">
              {/* macOS Style Bar */}
              <div className="h-10 bg-gray-900/90 border-b border-white/10 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="ml-3 font-mono text-xs text-gray-400 hidden sm:inline">
                    {project.slug || "project"}.interface • Screenshot {activeImageIndex + 1} of{" "}
                    {galleryImages.length}
                  </span>
                </div>
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                >
                  <Maximize2 size={13} />
                  <span className="hidden sm:inline">Fullscreen</span>
                </button>
              </div>

              {/* Active Image Display */}
              <div
                className="relative aspect-video w-full overflow-hidden bg-gray-950 flex items-center justify-center cursor-zoom-in group"
                onClick={() => setLightboxOpen(true)}
              >
                {activeImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getImageUrl(activeImageUrl) ?? activeImageUrl}
                    alt={`${project.title} Preview`}
                    className="w-full h-full object-contain md:object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                ) : (
                  <div className="text-gray-600 font-mono text-sm">No preview available</div>
                )}

                {/* Left / Right Nav Arrows on Main Image */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) =>
                          prev === 0 ? galleryImages.length - 1 : prev - 1
                        );
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) =>
                          prev === galleryImages.length - 1 ? 0 : prev + 1
                        );
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Selector Strip */}
              {galleryImages.length > 1 && (
                <div className="p-4 bg-gray-900/60 border-t border-white/5 flex items-center gap-3 overflow-x-auto">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-24 sm:w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-primary ring-2 ring-primary/40 shadow-lg scale-105"
                          : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(img) ?? img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  <p className="text-xs text-gray-500 font-mono ml-auto hidden sm:block">
                    Click any thumbnail to preview
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* In-Depth Project Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column: In-Depth Description & Features */}
          <div className="lg:col-span-2 space-y-10">
            {/* Long Description / Case Study */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 bg-gray-900/40"
            >
              <div className="flex items-center gap-2 mb-6 text-primary font-bold text-sm uppercase tracking-wider">
                <Layers size={18} />
                <span>Architecture & Overview</span>
              </div>

              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
                {(project.long_description || project.description)
                  .split("\n")
                  .map((line, idx) => {
                    if (line.startsWith("### ")) {
                      return (
                        <h3
                          key={idx}
                          className="text-xl font-bold text-white mt-6 mb-2 border-b border-white/5 pb-2"
                        >
                          {line.slice(4)}
                        </h3>
                      );
                    }
                    if (line.startsWith("## ")) {
                      return (
                        <h2
                          key={idx}
                          className="text-2xl font-black text-white mt-8 mb-3"
                        >
                          {line.slice(3)}
                        </h2>
                      );
                    }
                    if (line.startsWith("- ")) {
                      return (
                        <li key={idx} className="ml-5 list-disc text-gray-300">
                          {line.slice(2)}
                        </li>
                      );
                    }
                    if (line.trim() === "") return <div key={idx} className="h-2" />;
                    return (
                      <p key={idx} className="text-gray-300 leading-relaxed">
                        {line}
                      </p>
                    );
                  })}
              </div>
            </motion.div>

            {/* Key Features Section */}
            {project.features && project.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 bg-gray-900/40"
              >
                <div className="flex items-center gap-2 mb-6 text-primary font-bold text-sm uppercase tracking-wider">
                  <CheckCircle2 size={18} />
                  <span>Key Technical Features</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feat, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all group"
                    >
                      <p className="text-sm text-gray-200 leading-relaxed font-medium">
                        {feat}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* System Architecture Flow */}
            {project.architecture && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 bg-gray-900/40"
              >
                <div className="flex items-center gap-2 mb-6 text-primary font-bold text-sm uppercase tracking-wider">
                  <Cpu size={18} />
                  <span>System Pipeline & Data Flow</span>
                </div>

                <div className="bg-black/50 border border-white/10 rounded-2xl p-5 font-mono text-xs md:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.architecture}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar: Quick Specs & Meta */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-panel p-6 rounded-3xl border border-white/10 bg-gray-900/40 space-y-6 sticky top-36"
            >
              <h3 className="font-bold text-white text-lg border-b border-white/10 pb-3 flex items-center gap-2">
                <Code2 size={18} className="text-primary" />
                <span>Project Specifications</span>
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                    Category
                  </span>
                  <p className="font-semibold text-gray-200 mt-0.5">
                    {project.featured === 1 ? "Flagship AI Agent" : "Generative AI Application"}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                    Primary Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {project.tech_stack?.slice(0, 6).map((t, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {project.github_url && (
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                      Repository
                    </span>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-primary hover:underline font-mono text-xs truncate mt-0.5"
                    >
                      {project.github_url.replace("https://github.com/", "")}
                    </a>
                  </div>
                )}

                {project.live_url && (
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                      Live Environment
                    </span>
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-primary hover:underline font-mono text-xs truncate mt-0.5"
                    >
                      {project.live_url}
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Zap size={14} className="text-yellow-400" />
                    <span>Configurable from Admin Portal</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Action CTAs */}
              <div className="space-y-2.5 pt-2">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-sm transition-all shadow-lg shadow-primary/20"
                  >
                    <ExternalLink size={16} />
                    <span>Open Live Demo</span>
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all"
                  >
                    <Github size={16} />
                    <span>View GitHub Repo</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Pagination: Next & Previous Project Switcher */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug || prevProject.id}`}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/15 transition-all group w-full sm:w-auto"
            >
              <ChevronLeft
                size={20}
                className="text-gray-400 group-hover:-translate-x-1 transition-transform"
              />
              <div className="text-left">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block">
                  Previous Project
                </span>
                <span className="font-bold text-white text-sm group-hover:text-primary transition-colors">
                  {prevProject.title}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug || nextProject.id}`}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/15 transition-all group w-full sm:w-auto sm:ml-auto text-right"
            >
              <div className="text-right">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block">
                  Next Project
                </span>
                <span className="font-bold text-white text-sm group-hover:text-primary transition-colors">
                  {nextProject.title}
                </span>
              </div>
              <ChevronRight
                size={20}
                className="text-gray-400 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && activeImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div
              className="max-w-6xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(activeImageUrl) ?? activeImageUrl}
                alt={project.title}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
