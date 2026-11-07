"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  MapPin,
  ExternalLink,
  Globe,
  Github,
  Sparkles,
  CheckCircle2,
  Layers,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import { getExperience, getExperiences, type Experience } from "@/lib/api";
import { Navbar } from "@/components/sections/Navbar";

function formatDate(dateStr: string) {
  if (!dateStr || dateStr.toLowerCase() === "present") return "Present";
  if (/^[A-Za-z]{3}\s\d{4}$/.test(dateStr)) return dateStr;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ExperienceDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([getExperience(id), getExperiences()]).then(([exp, all]) => {
      setExperience(exp);
      setAllExperiences(all);
      setLoading(false);
    });
  }, [id]);

  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-gray-400 font-mono text-sm">Loading experience details...</p>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
          <Briefcase size={28} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Experience Entry Not Found</h1>
        <p className="text-gray-400 text-sm mb-6">The experience record you requested does not exist.</p>
        <Link
          href="/#experience"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-all"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </div>
    );
  }

  // Find index for Previous / Next navigation
  const currentIndex = allExperiences.findIndex((e) => String(e.id) === String(id));
  const prevExp = currentIndex > 0 ? allExperiences[currentIndex - 1] : null;
  const nextExp = currentIndex < allExperiences.length - 1 ? allExperiences[currentIndex + 1] : null;

  const hasProjects = experience.projects && experience.projects.length > 0;
  const hasHighlights = experience.highlights && experience.highlights.length > 0;
  const hasSkills = experience.skills && experience.skills.length > 0;

  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-primary selection:text-black">
      <Navbar />

      <div className="container mx-auto max-w-5xl px-4 pt-28 pb-20">
        {/* Top Breadcrumb & Share */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/#experience"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Experience</span>
          </Link>

          <button
            onClick={copyShareLink}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all font-mono"
            title="Share Experience Link"
          >
            <Share2 size={13} />
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </button>
        </div>

        {/* ── HERO BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] mb-10"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              {experience.role_type && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/30 text-primary">
                  {experience.role_type}
                </span>
              )}
              {!experience.end_date || experience.end_date.toLowerCase() === "present" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Current Position
                </span>
              ) : null}
            </div>

            {/* Title & Company */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {experience.job_title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-lg md:text-2xl text-primary font-bold">
              <span>{experience.company_name}</span>
              {experience.company_url && (
                <a
                  href={experience.company_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-normal text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  <span>Company Website</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Meta Row */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                <CalendarDays size={14} className="text-primary" />
                {formatDate(experience.start_date)} — {formatDate(experience.end_date || "Present")}
              </div>
              {experience.location && (
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                  <MapPin size={14} className="text-accent" />
                  {experience.location}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── OVERVIEW & HIGHLIGHTS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Left 2 Cols: Role Mission & Achievements */}
          <div className="md:col-span-2 space-y-6">
            {experience.description && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08]"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <Briefcase size={16} className="text-primary" /> Role Overview & Mandate
                </h3>
                <p className="text-gray-300 leading-relaxed text-base">
                  {experience.description}
                </p>
              </motion.div>
            )}

            {hasHighlights && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08]"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" /> Key Achievements & Engineering Impact
                </h3>
                <ul className="space-y-3">
                  {experience.highlights!.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-gray-300 leading-relaxed">
                      <CheckCircle2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Right Col: Tech Stack & Overview Sidebar */}
          <div className="space-y-6">
            {hasSkills && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08]"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <Layers size={15} className="text-primary" /> Technologies Used
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {experience.skills!.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center space-y-2"
            >
              <div className="text-3xl font-black text-primary">{experience.projects?.length || 0}</div>
              <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Production Deliverables
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── PROJECTS DELIVERED AT THIS COMPANY ── */}
        {hasProjects && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6 mb-16"
          >
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <Laptop size={24} className="text-primary" />
                Production Systems & Projects Delivered
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Detailed breakdown of applications, LLM pipelines, and tools built for {experience.company_name}
              </p>
            </div>

            <div className="space-y-6">
              {experience.projects!.map((proj, pIdx) => (
                <div
                  key={pIdx}
                  className="rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 hover:border-primary/40 transition-all duration-300 space-y-4"
                >
                  {/* Project Header & Links */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-xl sm:text-2xl font-bold text-white">{proj.name}</h3>
                        {proj.role && (
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                            {proj.role}
                          </span>
                        )}
                      </div>
                      {proj.tagline && (
                        <p className="text-sm text-primary font-medium mt-1">{proj.tagline}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                      {proj.live_url && (
                        <a
                          href={proj.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-black text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          <Globe size={15} />
                          <span>Visit Live App ↗</span>
                        </a>
                      )}
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-xs sm:text-sm font-bold hover:bg-white/20 transition-all"
                        >
                          <Github size={15} />
                          <span>View Code</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {proj.description && (
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {proj.description}
                    </p>
                  )}

                  {/* Impact Bullets */}
                  {proj.impact && proj.impact.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                      <div className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold mb-1">
                        Key Engineering Contributions:
                      </div>
                      {proj.impact.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                          <span className="text-primary font-bold mt-0.5">›</span>
                          <span className="leading-relaxed">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Project Tech Stack */}
                  {proj.tech_stack && proj.tech_stack.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <span className="text-xs text-gray-500 font-mono mr-1">Stack:</span>
                      {proj.tech_stack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── BOTTOM PREV / NEXT NAVIGATION ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 mt-12">
          {prevExp ? (
            <Link
              href={`/experience/${prevExp.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <div className="text-[10px] text-gray-500 uppercase font-mono">Previous Company</div>
                <div className="font-bold truncate max-w-[200px]">{prevExp.company_name}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/#experience"
            className="text-xs font-mono text-gray-400 hover:text-primary transition-colors uppercase tracking-wider"
          >
            All Experiences
          </Link>

          {nextExp ? (
            <Link
              href={`/experience/${nextExp.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-end gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
            >
              <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase font-mono">Next Company</div>
                <div className="font-bold truncate max-w-[200px]">{nextExp.company_name}</div>
              </div>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  );
}
