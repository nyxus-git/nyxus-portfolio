"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component
import React, { useState, useEffect } from 'react'; // Import useState and useEffect

// Define the type for your project data
interface ProjectData {
  id: number; // Or string if your backend returns string IDs (e.g., UUIDs or ObjectId strings)
  title: string;
  description: string;
  image_url?: string; // Cloudinary URL from backend
  image_public_id?: string; // Cloudinary public ID from backend
  tech_stack: string[]; // Changed from techStack to tech_stack to match backend
  github_url?: string; // Changed from githubUrl to github_url to match backend
  live_url?: string; // Changed from liveDemoUrl to live_url to match backend
}

export function Projects() {
  const [projects, setProjects] = useState<ProjectData[]>([]); // State to store fetched projects
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ProjectData[] = await response.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // Empty dependency array means this effect runs once on component mount

  // Handle loading and error states
  if (loading) {
    return (
      <section id="projects" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white text-center">
        <p>Loading projects...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-red-500 text-center">
        <p>Error loading projects: {error}</p>
        <p>Please ensure your backend is running at {process.env.NEXT_PUBLIC_API_URL}</p>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-lime-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Projects
          <div className="w-24 h-1 bg-lime-400 mx-auto mt-4 rounded-full"></div>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-lg">
              No projects found. Create one from the backend API!
            </div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700/50 text-white flex flex-col"
              >
                {/* Use image_url from backend */}
                {project.image_url && (
                  <div className="relative w-full h-48 rounded-t-lg mb-4 overflow-hidden">
                    <Image
                      src={project.image_url} // Use image_url here
                      alt={project.title}
                      fill // Use fill for responsive image sizing
                      style={{ objectFit: 'cover' }} // Use style prop for objectFit
                      className="rounded-t-lg"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-lime-400 mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.map((tech, techIndex) => ( // Use tech_stack
                    <span key={techIndex} className="bg-lime-600/30 text-lime-300 px-3 py-1 rounded-full text-xs font-medium border border-lime-500/50">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 mt-auto">
                  {project.github_url && ( // Use github_url
                    <Link
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-300 hover:text-lime-400 transition-colors"
                    >
                      <Github className="w-5 h-5 mr-2" /> GitHub
                    </Link>
                  )}
                  {project.live_url && ( // Use live_url
                    <Link
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-300 hover:text-lime-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" /> Live Demo
                    </Link>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
