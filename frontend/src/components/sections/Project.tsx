"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getProjects, type Project as ProjectType } from "../../lib/api";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { TiltCard } from "@/components/ui/TiltCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Project() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});

  const toggleDescription = (id: number) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data.filter((p) => p.featured !== 1 && p.is_visible !== 0));
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (projects.length === 0) return null;

  return (
    <section id="project" className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeader
          number="06"
          badge="Generative AI Ecosystem"
          icon={Sparkles}
          title="Selected Projects"
          subtitle="Full-stack AI companions, autonomous agents, and production ML applications."
          align="left"
          action={
            <Link
              href="https://github.com/nyxus-git"
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-primary/45 hover:bg-primary/10 text-sm font-medium text-gray-300 hover:text-white transition-all hover-trigger"
            >
              <span>Explore GitHub</span>
              <ArrowRight size={15} className="text-primary" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="h-full"
            >
              <TiltCard tiltAmount={20} className="h-full">
                <div className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col group h-full">
                  {/* Thumbnail */}
                  <Link
                    href={`/projects/${project.slug || project.id}`}
                    className="block relative h-48 w-full overflow-hidden bg-[#070612] border-b border-white/[0.06] group/thumb"
                  >
                    <OptimizedImage
                      src={project.image_url}
                      alt={project.title}
                      width={700}
                      fill
                      className="transition-transform duration-700 group-hover/thumb:scale-105 opacity-90 group-hover/thumb:opacity-100"
                      fallback={<div className="absolute inset-0 bg-grid-white pointer-events-none" />}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c1a] via-transparent to-transparent pointer-events-none" />

                    {/* Index Pill */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#090814]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-primary/90 text-white text-[11px] font-mono opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-lg">
                      Blueprint →
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-grow">
                    <Link href={`/projects/${project.slug || project.id}`} className="block group/title">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover/title:text-primary transition-colors leading-snug flex items-center justify-between">
                        <span>{project.title}</span>
                        <ArrowRight
                          size={16}
                          className="opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-accent flex-shrink-0 ml-2"
                        />
                      </h3>
                    </Link>

                    <div className="mb-4 flex-grow">
                      <p
                        className={`text-gray-400 text-xs sm:text-sm leading-relaxed ${
                          !expandedIds[project.id] ? "line-clamp-2 sm:line-clamp-3" : ""
                        }`}
                      >
                        {project.description}
                      </p>
                      {project.description && project.description.length > 95 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleDescription(project.id);
                          }}
                          className="text-[11px] font-mono text-primary hover:text-accent hover:underline mt-1.5 inline-flex items-center gap-0.5"
                        >
                          {expandedIds[project.id] ? "Show Less ▴" : "Read More ▾"}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech_stack?.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack && project.tech_stack.length > 4 && (
                        <span className="text-[11px] font-mono text-gray-500 px-1.5 py-1">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center gap-2 pt-4 border-t border-white/[0.06] mt-auto">
                      <Link
                        href={`/projects/${project.slug || project.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-gray-200 border border-white/10 hover:border-primary/40 transition-all duration-200 hover-trigger"
                      >
                        <Sparkles size={13} className="text-primary" />
                        <span>Details</span>
                      </Link>
                      <Link
                        href={project.github_url || "https://github.com/nyxus-git"}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-gray-200 border border-white/10 hover:border-primary/40 transition-all duration-200 hover-trigger"
                      >
                        <Github size={13} />
                        <span>Code</span>
                      </Link>
                      <Link
                        href={project.live_url || "#"}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-primary/15 hover:bg-primary text-xs font-semibold text-primary hover:text-white border border-primary/35 hover:border-primary transition-all duration-200 hover-trigger"
                      >
                        <ExternalLink size={13} />
                        <span>Live</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
