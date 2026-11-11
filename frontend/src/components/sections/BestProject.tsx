"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProjects, type Project } from "../../lib/api";
import { ExternalLink, Github, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "@/components/ui/TiltCard";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function BestProject() {
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    getProjects().then((data) => {
      const best = data.find((p) => p.featured === 1 && p.is_visible !== 0);
      if (best) setFeaturedProject(best);
    });
  }, []);

  if (!featuredProject) return null;

  const projectUrl = `/projects/${featuredProject.slug || featuredProject.id}`;

  return (
    <section id="best-project" className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeader
          number="01"
          badge="Featured Work"
          icon={Sparkles}
          title="Flagship Project"
          subtitle="Production architecture spotlight — engineered from system pipeline to user interface."
        />

        <TiltCard tiltAmount={32} className="mx-auto relative group">
          {/* Outer Violet-Magenta Aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/35 via-primary/35 to-accent/35 rounded-[2rem] blur-2xl opacity-35 group-hover:opacity-65 transition duration-700 pointer-events-none" />

          <div className="relative glass-panel rounded-[2rem] p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row gap-10 items-center overflow-hidden">
            {/* Subtle architectural grid */}
            <div className="absolute inset-0 bg-grid-white opacity-40 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />

            {/* Left Column: Narrative & Stack */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="w-full lg:w-1/2 flex flex-col z-10"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-[0.2em] bg-accent/15 text-accent border border-accent/30">
                  Spotlight
                </span>
                <span className="text-[11px] font-mono text-gray-500">
                  /{featuredProject.slug || "flagship"}
                </span>
              </div>

              <Link href={projectUrl} className="group/title block">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight group-hover/title:text-primary transition-colors flex items-center gap-3 tracking-tight">
                  <span>{featuredProject.title}</span>
                  <ArrowRight
                    size={22}
                    className="opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-accent hidden sm:inline"
                  />
                </h3>
              </Link>

              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 sm:p-6 mb-6">
                <p
                  className={`text-gray-300 text-sm sm:text-base leading-relaxed ${
                    !expanded ? "line-clamp-3 sm:line-clamp-none" : ""
                  }`}
                >
                  {featuredProject.description}
                </p>
                {featuredProject.description && featuredProject.description.length > 140 && (
                  <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="sm:hidden text-xs text-primary font-mono inline-flex items-center gap-1 hover:underline mt-2 pt-2 border-t border-white/[0.06] w-full"
                  >
                    {expanded ? "Show Less ▴" : "Read Full Overview ▾"}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {featuredProject.tech_stack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-white/[0.04] text-gray-200 border border-white/10 hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={projectUrl}
                  className="flex items-center gap-2 px-6 py-3 rounded-full btn-primary text-sm hover-trigger"
                >
                  <Sparkles size={15} />
                  <span>Case Study &amp; Architecture</span>
                </Link>
                <Link
                  href={featuredProject.github_url || "https://github.com/nyxus-git/NyxAI"}
                  target="_blank"
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-white text-gray-950 font-bold text-sm hover:bg-gray-200 transition-colors hover-trigger"
                >
                  <Github size={15} />
                  <span>Code</span>
                </Link>
                <Link
                  href={featuredProject.live_url || "https://nyxai-demo.vercel.app"}
                  target="_blank"
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.06] text-white font-semibold text-sm border border-white/15 hover:border-primary/45 hover:bg-primary/10 transition-all hover-trigger"
                >
                  <ExternalLink size={15} />
                  <span>Live Demo</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Viewport Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="w-full lg:w-1/2 relative z-10 hover-trigger"
            >
              <Link
                href={projectUrl}
                className="block relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-primary/20 bg-[#05040c] shadow-2xl group/mockup"
              >
                {/* Studio Window Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-9 bg-[#0e0c1d]/90 backdrop-blur-md border-b border-white/10 flex items-center px-4 gap-2 z-20">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-400/80" />
                  <span className="text-[11px] font-mono text-gray-400 ml-2 hidden sm:inline truncate">
                    {featuredProject.slug || "flagship"}.arch · inspect blueprint →
                  </span>
                </div>

                {featuredProject.image_url ? (
                  <OptimizedImage
                    src={featuredProject.image_url}
                    alt={featuredProject.title}
                    width={1000}
                    fill
                    priority
                    className="pt-9 transition-transform duration-700 group-hover/mockup:scale-105"
                    fallback={
                      <div className="absolute inset-0 pt-9 flex items-center justify-center bg-gradient-to-br from-[#0e0c1c] to-[#04040a]">
                        <Sparkles size={64} className="text-primary/30" />
                      </div>
                    }
                  />
                ) : (
                  <div className="absolute inset-0 pt-9 flex items-center justify-center bg-gradient-to-br from-[#0e0c1c] to-[#04040a]">
                    <Sparkles size={64} className="text-primary/30" />
                  </div>
                )}
              </Link>
            </motion.div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
