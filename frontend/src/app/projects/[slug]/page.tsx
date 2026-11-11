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
import { Footer } from "@/components/sections/Footer";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

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
      <div className="min-h-screen flex items-center justify-center bg-[#04040a]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary" />
          <p className="text-gray-400 font-mono text-sm">Loading project architecture...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#04040a] text-center px-4">
        <h1 className="text-4xl font-black text-white mb-3">Project Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          The requested project blueprint or architecture page could not be located.
        </p>
        <Link
          href="/#project"
          className="px-6 py-3 btn-primary font-bold rounded-full"
        >
          Return to Portfolio
        </Link>
      </div>
    );
  }

  const galleryImages: string[] = [];
  if (project.image_url) galleryImages.push(project.image_url);
  if (project.screenshots && project.screenshots.length > 0) {
    project.screenshots.forEach((img) => {
      if (!galleryImages.includes(img)) galleryImages.push(img);
    });
  }

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const activeImageUrl = galleryImages[activeImageIndex] || project.image_url;

  return (
    <div className="min-h-screen bg-[#04040a] text-white selection:bg-primary/30 selection:text-white flex flex-col">
      <Navbar />

      {/* Top Sticky Action Bar */}
      <div className="pt-24 pb-5 border-b border-white/[0.06] bg-[#090814]/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
          <Link
            href="/#project"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-gray-400 hover:text-primary transition-colors group"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-primary/15 text-xs font-mono text-gray-300 border border-white/10 hover:border-primary/40 transition-colors"
            >
              <Share2 size={13} className="text-primary" />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
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
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full btn-primary text-xs"
              >
                <ExternalLink size={13} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-6xl mt-10 pb-24 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.16em] bg-primary/10 border border-primary/25 text-primary">
              <Sparkles size={12} />
              {project.featured === 1 ? "Flagship AI Companion" : "Generative AI Project"}
            </span>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              ID #{project.id} · {project.slug || "genai"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-gradient tracking-tight mb-4">
            {project.title}
          </h1>

          {project.tagline && (
            <p className="text-lg md:text-xl text-primary/90 font-medium max-w-3xl mb-6">
              {project.tagline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-8">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full btn-primary text-sm hover-trigger"
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
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] hover:bg-primary/15 text-white font-semibold text-sm border border-white/15 hover:border-primary/45 transition-all hover-trigger"
              >
                <Github size={16} />
                <span>Source Code</span>
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-5 border-t border-white/[0.06]">
            {project.tech_stack?.map((tech, i) => (
              <span
                key={i}
                className="text-xs font-mono text-gray-300 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Screenshot Gallery */}
        {galleryImages.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-14"
          >
            <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-[#080712] shadow-2xl">
              <div className="h-10 bg-[#0e0c1d]/90 border-b border-white/[0.08] px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/80" />
                  <span className="ml-3 font-mono text-xs text-gray-400 hidden sm:inline">
                    {project.slug || "project"}.interface · Screenshot {activeImageIndex + 1} of{" "}
                    {galleryImages.length}
                  </span>
                </div>
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-mono text-gray-300 hover:text-primary transition-colors px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-primary/15"
                >
                  <Maximize2 size={13} />
                  <span className="hidden sm:inline">Fullscreen</span>
                </button>
              </div>

              <div
                className="relative aspect-video w-full overflow-hidden bg-[#04040a] cursor-zoom-in group"
                onClick={() => setLightboxOpen(true)}
              >
                {activeImageUrl ? (
                  <OptimizedImage
                    src={activeImageUrl}
                    alt={`${project.title} Preview`}
                    width={1400}
                    fill
                    priority
                    className="transition-transform duration-500 group-hover:scale-[1.01]"
                    objectFit="contain"
                  />
                ) : (
                  <div className="text-gray-600 font-mono text-sm absolute inset-0 flex items-center justify-center">
                    No preview available
                  </div>
                )}

                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) =>
                          prev === 0 ? galleryImages.length - 1 : prev - 1
                        );
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#090814]/80 hover:bg-primary text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#090814]/80 hover:bg-primary text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="p-4 bg-[#0b0a17] border-t border-white/[0.06] flex items-center gap-3 overflow-x-auto">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-24 sm:w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-primary ring-2 ring-primary/40 shadow-lg scale-105"
                          : "border-white/10 opacity-55 hover:opacity-100"
                      }`}
                    >
                      <OptimizedImage
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        width={280}
                        fill
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

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-6 md:p-8 rounded-3xl"
            >
              <div className="flex items-center gap-2 mb-6 text-primary font-mono font-bold text-xs uppercase tracking-[0.18em]">
                <Layers size={16} />
                <span>Architecture &amp; Overview</span>
              </div>

              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
                {(project.long_description || project.description)
                  .split("\n")
                  .map((line, idx) => {
                    if (line.startsWith("### ")) {
                      return (
                        <h3
                          key={idx}
                          className="text-xl font-bold text-white mt-6 mb-2 border-b border-white/[0.06] pb-2"
                        >
                          {line.slice(4)}
                        </h3>
                      );
                    }
                    if (line.startsWith("## ")) {
                      return (
                        <h2 key={idx} className="text-2xl font-black text-primary mt-8 mb-3">
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

            {project.features && project.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-panel p-6 md:p-8 rounded-3xl"
              >
                <div className="flex items-center gap-2 mb-6 text-primary font-mono font-bold text-xs uppercase tracking-[0.18em]">
                  <CheckCircle2 size={16} />
                  <span>Key Technical Features</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feat, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-primary/40 transition-all"
                    >
                      <p className="text-sm text-gray-200 leading-relaxed font-medium">
                        {feat}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {project.architecture && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-panel p-6 md:p-8 rounded-3xl"
              >
                <div className="flex items-center gap-2 mb-6 text-accent font-mono font-bold text-xs uppercase tracking-[0.18em]">
                  <Cpu size={16} />
                  <span>System Pipeline &amp; Data Flow</span>
                </div>

                <div className="bg-[#05040b] border border-primary/20 rounded-2xl p-5 font-mono text-xs md:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.architecture}
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-panel p-6 rounded-3xl space-y-6 sticky top-36"
            >
              <h3 className="font-bold text-white text-lg border-b border-white/[0.08] pb-3 flex items-center gap-2">
                <Code2 size={18} className="text-primary" />
                <span>Project Specifications</span>
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-[11px] text-gray-500 uppercase tracking-wider font-mono">
                    Category
                  </span>
                  <p className="font-semibold text-gray-200 mt-0.5">
                    {project.featured === 1 ? "Flagship AI Agent" : "Generative AI Application"}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-gray-500 uppercase tracking-wider font-mono">
                    Primary Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {project.tech_stack?.slice(0, 6).map((t, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {project.github_url && (
                  <div>
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider font-mono">
                      Repository
                    </span>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-primary hover:text-accent hover:underline font-mono text-xs truncate mt-0.5"
                    >
                      {project.github_url.replace("https://github.com/", "")}
                    </a>
                  </div>
                )}

                {project.live_url && (
                  <div>
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider font-mono">
                      Live Environment
                    </span>
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-primary hover:text-accent hover:underline font-mono text-xs truncate mt-0.5"
                    >
                      {project.live_url}
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Zap size={14} className="text-accent" />
                    <span>Configurable from Admin Portal</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full btn-primary text-sm"
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
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white/[0.05] hover:bg-primary/15 text-white font-semibold text-sm border border-white/10 hover:border-primary/40 transition-all"
                  >
                    <Github size={16} />
                    <span>View GitHub Repo</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Pagination */}
        <div className="mt-20 pt-10 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug || prevProject.id}`}
              className="flex items-center gap-3 p-4 rounded-2xl glass-card glass-card-hover group w-full sm:w-auto"
            >
              <ChevronLeft
                size={20}
                className="text-gray-400 group-hover:-translate-x-1 transition-transform"
              />
              <div className="text-left">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
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
              className="flex items-center gap-3 p-4 rounded-2xl glass-card glass-card-hover group w-full sm:w-auto sm:ml-auto text-right"
            >
              <div className="text-right">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
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

      <Footer />

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
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-primary text-white transition-colors"
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
                alt={project?.title}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-primary/25"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
