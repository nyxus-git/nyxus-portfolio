"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getProjects, type Project } from "../../lib/api";

export function Project() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section id="project" className="py-20 px-4">
        <div className="container mx-auto text-center text-gray-500">Loading projects...</div>
      </section>
    );
  }

  return (
    <section id="project" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-6xl font-black mb-20 text-center text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400 uppercase tracking-tighter"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Featured Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass glass-hover rounded-2xl overflow-hidden flex flex-col group h-full"
            >
              {/* Image / Placeholder */}
              <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {project.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-lime-500/20 flex items-center justify-center">
                      <span className="text-2xl font-black text-lime-400">{project.title.charAt(0)}</span>
                    </div>
                    <p className="text-gray-600 text-xs font-mono">NO IMAGE</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="flex gap-4">
                    {project.github_url && (
                      <Link href={project.github_url} target="_blank" className="p-2 bg-white/20 backdrop-blur rounded-full hover:bg-lime-400 hover:text-black transition-colors">
                        <Github size={20} />
                      </Link>
                    )}
                    {project.live_url && (
                      <Link href={project.live_url} target="_blank" className="p-2 bg-white/20 backdrop-blur rounded-full hover:bg-lime-400 hover:text-black transition-colors">
                        <ExternalLink size={20} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-lime-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech_stack?.map((tech, i) => (
                    <span key={i} className="px-2 py-1 text-xs font-medium text-lime-300 bg-lime-400/10 rounded-full border border-lime-400/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}