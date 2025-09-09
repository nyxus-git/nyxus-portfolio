"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { getContentfulClient } from "@/lib/contentfulClient";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Document } from "@contentful/rich-text-types";
import { Entry, EntrySkeletonType } from "contentful";

interface ProjectFields {
  projectName: string;
  description: Document | string;
  technologies: string[];
  featuredImage?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  liveUrl?: string;
  sourceCodeUrl?: string;
}

interface ProjectSkeleton extends EntrySkeletonType {
  fields: ProjectFields;
}

type ProjectEntry = Entry<ProjectSkeleton>;


export function Project() {
  const [projects, setProjects] = useState<ProjectFields[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getContentfulClient().getEntries<ProjectSkeleton>({
          content_type: "project",
          include: 1,
        });

        const fetchedProjects: ProjectFields[] = response.items.map((item: ProjectEntry) => {
          const locale = 'en-US'; // Assuming default English locale
          let description: Document | string;
          const rawDescription = item.fields.description;
          if (rawDescription && typeof rawDescription === 'object' && 'nodeType' in rawDescription) {
            description = rawDescription as unknown as Document;
          } else {
            description = ((rawDescription as unknown as { [key: string]: string })?.[locale] || '') as string;
          }
          return {
            projectName: ((item.fields.projectName as unknown as { [key: string]: string })?.[locale] || '') as string,
            description,
            technologies: (item.fields.technologies as unknown as string[]) || [],
            featuredImage: ((item.fields.featuredImage as unknown as { [key: string]: ProjectFields['featuredImage'] })?.[locale]) || undefined,
            liveUrl: ((item.fields.liveUrl as unknown as { [key: string]: string })?.[locale] || '') as string,
            sourceCodeUrl: ((item.fields.sourceCodeUrl as unknown as { [key: string]: string })?.[locale] || '') as string,
          };
        });

        setProjects(fetchedProjects); 

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="project" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white text-center">
        <p>Loading projects...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="project" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-red-500 text-center">
        <p>Error loading projects: {error}</p>
      </section>
    );
  }

  return (
    <section id="project" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
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
              No projects found in Contentful.
            </div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700/50 text-white flex flex-col"
              >
                {project.featuredImage?.fields?.file?.url && (
                  <div className="relative w-full h-48 rounded-t-lg mb-4 overflow-hidden">
                    <Image
                      src={`https:${project.featuredImage.fields.file.url}`}
                      alt={project.projectName || "Project Image"}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-t-lg"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-lime-400 mb-2">{project.projectName}</h3>
                <div className="text-gray-300 mb-4 flex-grow contentful-rich-text">
                  {project.description && typeof project.description === "object" && "nodeType" in project.description
                    ? documentToReactComponents(project.description)
                    : <p>{String(project.description)}</p>}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-lime-600/30 text-lime-300 px-3 py-1 rounded-full text-xs font-medium border border-lime-500/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 mt-auto">
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-300 hover:text-lime-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" /> Live Demo
                    </Link>
                  )}
                  {project.sourceCodeUrl && (
                    <Link
                      href={project.sourceCodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-300 hover:text-lime-400 transition-colors"
                    >
                      <Github className="w-5 h-5 mr-2" /> GitHub
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