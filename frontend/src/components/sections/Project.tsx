"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { getProjects, Project as ProjectType } from "../../lib/contentfulApi";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export function Project() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getProjects();
      setProjects(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <section id="project" className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
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
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass glass-hover rounded-2xl overflow-hidden flex flex-col group h-full"
            >
              <div className="relative h-60 w-full overflow-hidden">
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.projectTitle}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="flex gap-4">
                    {project.sourceCodeLink && (
                      <Link href={project.sourceCodeLink} target="_blank" className="p-2 bg-white/20 backdrop-blur rounded-full hover:bg-lime-400 hover:text-black transition-colors">
                        <Github size={20} />
                      </Link>
                    )}
                    {project.liveDemoLink && (
                      <Link href={project.liveDemoLink} target="_blank" className="p-2 bg-white/20 backdrop-blur rounded-full hover:bg-lime-400 hover:text-black transition-colors">
                        <ExternalLink size={20} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-lime-400 transition-colors">
                  {project.projectTitle}
                </h3>

                <div className="text-gray-400 mb-6 flex-grow line-clamp-3 text-sm">
                  {documentToReactComponents(project.description)}
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies?.map((tech, i) => (
                    <span key={i} className="px-3 py-1 text-xs font-medium text-lime-300 bg-lime-400/10 rounded-full border border-lime-400/20">
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