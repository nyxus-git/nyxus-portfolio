"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getProjects, type Project as ProjectType } from "../../lib/api";
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
          className="flex items-end justify-between mb-16"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
              More Projects
            </h2>
          </div>
          <Link href="https://github.com/nyyxus-preditor" target="_blank" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors hover-trigger">
            <span>View all on GitHub</span>
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
              <TiltCard tiltAmount={30} className="h-full">
                <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col group h-full">
                  {/* Image / Placeholder */}
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    {project.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100 pointer-events-none" />
                    ) : (
                      <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
                    )}
                    
                    {/* Overlay Links */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm z-20">
                      {project.github_url && (
                        <Link href={project.github_url} target="_blank" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform hover-trigger">
                          <Github size={20} />
                        </Link>
                      )}
                      {project.live_url && (
                        <Link href={project.live_url} target="_blank" className="p-3 bg-primary text-black rounded-full hover:scale-110 transition-transform hover-trigger">
                          <ExternalLink size={20} />
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                      {project.tech_stack?.slice(0, 4).map((tech, i) => (
                        <span key={i} className="text-xs font-medium text-gray-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack && project.tech_stack.length > 4 && (
                        <span className="text-xs font-medium text-gray-500 px-1 py-1">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
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