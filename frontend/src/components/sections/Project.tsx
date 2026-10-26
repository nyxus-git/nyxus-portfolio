"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getProjects, getImageUrl, type Project as ProjectType } from "../../lib/api";
import { TiltCard } from "@/components/ui/TiltCard";

export function Project() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      // Filter out the featured project since it's in BestProject
      setProjects(data.filter(p => p.featured !== 1));
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (projects.length === 0) return null;

  return (
    <section id="project" className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <Sparkles size={14} />
              <span>Generative AI Ecosystem</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
              GenAI Projects
            </h2>
          </div>
          <Link
            href="https://github.com/nyxus-git"
            target="_blank"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors hover-trigger text-sm"
          >
            <span>Explore all on GitHub</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="h-full"
            >
              <TiltCard tiltAmount={24} className="h-full">
                <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col group h-full border border-white/[0.08] bg-black/40 backdrop-blur-xl">
                  {/* Image / Thumbnail */}
                  <Link
                    href={`/projects/${project.slug || project.id}`}
                    className="block relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black flex items-center justify-center border-b border-white/5 group/thumb"
                  >
                    {project.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageUrl(project.image_url) ?? project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-108 opacity-90 group-hover/thumb:opacity-100"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* View Details Badge */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-gray-300 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                      View Blueprint →
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-grow">
                    <Link href={`/projects/${project.slug || project.id}`} className="block group/title">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover/title:text-primary transition-colors leading-snug flex items-center justify-between">
                        <span>{project.title}</span>
                        <ArrowRight
                          size={16}
                          className="opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-primary flex-shrink-0 ml-2"
                        />
                      </h3>
                    </Link>
                    <p className="text-gray-400 text-sm mb-5 flex-grow line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech_stack?.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium text-gray-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack && project.tech_stack.length > 4 && (
                        <span className="text-[11px] font-medium text-gray-500 px-1.5 py-1">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Three Action Buttons: Details, Code, Live */}
                    <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-auto">
                      <Link
                        href={`/projects/${project.slug || project.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-200 border border-white/10 hover:border-white/20 transition-all duration-200 hover-trigger"
                      >
                        <Sparkles size={13} className="text-primary" />
                        <span>Details</span>
                      </Link>
                      <Link
                        href={project.github_url || "https://github.com/nyxus-git"}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-200 border border-white/10 hover:border-white/20 transition-all duration-200 hover-trigger"
                      >
                        <Github size={13} />
                        <span>Code</span>
                      </Link>
                      <Link
                        href={project.live_url || "#"}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-xs font-semibold text-primary border border-primary/30 hover:border-primary/50 transition-all duration-200 hover-trigger"
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