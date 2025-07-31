// frontend/src/components/Projects.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Github, ExternalLink } from "lucide-react"; // Import Github and ExternalLink icons

// Assuming Project interface and getProjects function are in lib/api.ts
import { getProjects, type Project } from "@/lib/api";

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors on a new fetch attempt
        const allProjects = await getProjects();
        // Since you've deleted projects from the backend, we no longer need client-side filtering here.
        setProjects(allProjects);
      } catch (err: unknown) {
        console.error("Error fetching projects:", err);
        let errorMessage = "Failed to load projects. Please try again later.";
        if (err instanceof Error) {
            errorMessage = err.message;
        } else if (typeof err === 'object' && err !== null && 'detail' in err && typeof err.detail === 'string') {
            errorMessage = err.detail;
        } else if (typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string') {
            errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"> {/* Consistent background gradient */}
      <div className="container mx-auto max-w-6xl"> {/* Max width for content consistency */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-lime-400 uppercase tracking-wide" // Larger, bold, uppercase, tracking
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Projects
          <div className="w-24 h-1 bg-lime-400 mx-auto mt-4 rounded-full"></div> {/* Underline consistent with other sections */}
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl mb-12 text-center text-gray-300" // Sub-heading style
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore a selection of my latest and most impactful projects.
        </motion.p>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin w-8 h-8 text-lime-400" />
            <span className="sr-only text-white">Loading projects...</span>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-64 bg-red-800/50 backdrop-filter backdrop-blur-lg p-4 rounded-lg border border-red-700/50 text-red-300">
            <p className="text-xl text-center">{error}</p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-10 text-gray-300">
            <p className="text-lg">No projects available yet. Check back soon!</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,255,102,0.2)" }}
              >
                <Card className="flex flex-col h-full 2shadow-xl hover:shadow-2xl transition-shadow duration-300
                                bg-gray-800/60 backdrop-filter backdrop-blur-lg border border-gray-700/50
                                text-white rounded-xl overflow-hidden group">
                  {project.image_url && (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <CardHeader className="p-6">
                    <CardTitle className="text-2xl font-semibold text-lime-400 mb-2">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-6 pt-0">
                    <p className="mb-4 text-gray-300 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.map((tech, index) => (
                        <Badge
                          key={index}
                          className="bg-lime-600/30 text-lime-300 border border-lime-500/50 hover:bg-lime-600/50 text-sm px-3 py-1 rounded-full"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    {/* Add GitHub and Live Demo links with icons */}
                    <div className="flex justify-start gap-4 mt-6 border-t border-gray-700/50 pt-4">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium group"
                        >
                          <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors duration-200 font-medium group"
                        >
                          <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}