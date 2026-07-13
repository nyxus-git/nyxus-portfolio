"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProjects, type Project } from "../../lib/api";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "@/components/ui/TiltCard";

export function BestProject() {
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null);

  useEffect(() => {
    getProjects().then((data) => {
      // Find the first featured project
      const best = data.find((p) => p.featured === 1);
      if (best) setFeaturedProject(best);
    });
  }, []);

  if (!featuredProject) return null;

  return (
    <section id="best-project" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles size={16} />
            <span>Featured Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-6 tracking-tight">
            Flagship Project
          </h2>
        </motion.div>

        <TiltCard tiltAmount={40} className="max-w-6xl mx-auto relative group">
          {/* Animated Glow Behind the Project */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative glass-panel rounded-3xl p-6 md:p-10 flex flex-col lg:flex-row gap-10 items-center overflow-hidden border border-white/[0.08]">
            
            {/* Background Texture inside card */}
            <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
            
            {/* Project Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-1/2 flex flex-col z-10"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {featuredProject.title}
              </h3>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 shadow-inner">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {featuredProject.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {featuredProject.tech_stack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 rounded-full text-sm font-medium bg-secondary/50 text-gray-200 border border-white/10 backdrop-blur-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {featuredProject.github_url && (
                  <Link
                    href={featuredProject.github_url}
                    target="_blank"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors hover-trigger"
                  >
                    <Github size={20} />
                    View Code
                  </Link>
                )}
                {featuredProject.live_url && (
                  <Link
                    href={featuredProject.live_url}
                    target="_blank"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-medium border border-white/20 hover:bg-white/20 transition-colors hover-trigger"
                  >
                    <ExternalLink size={20} />
                    Live Demo
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Project Image Mockup / Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full lg:w-1/2 relative z-10 hover-trigger"
            >
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                {/* Mac window controls mockup */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900/80 backdrop-blur border-b border-white/10 flex items-center px-4 gap-2 z-20">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                
                {featuredProject.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={featuredProject.image_url} 
                    alt={featuredProject.title} 
                    className="absolute inset-0 w-full h-full object-cover pt-8 transition-transform duration-700 hover:scale-105 pointer-events-none"
                  />
                ) : (
                  <div className="absolute inset-0 pt-8 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black pointer-events-none">
                    <Sparkles size={64} className="text-primary/30" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </TiltCard>
      </div>
    </section>
  );
}
