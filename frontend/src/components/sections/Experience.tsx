"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getExperiences, type Experience as ExperienceType } from "../../lib/api";
import {
  Briefcase,
  MapPin,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Layers,
  Laptop,
  ArrowRight,
  Globe,
  ChevronDown,
  ChevronUp
} from "lucide-react";

function formatDate(dateStr: string) {
  if (!dateStr || dateStr.toLowerCase() === "present") return "Present";
  if (/^[A-Za-z]{3}\s\d{4}$/.test(dateStr)) return dateStr;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Mobile read-more expansion toggles
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    getExperiences().then((data) => {
      setExperiences(data);
      setLoading(false);
    });
  }, []);

  // Reset toggles when active tab changes
  useEffect(() => {
    setShowFullDesc(false);
    setShowAllHighlights(false);
    setShowAllProjects(false);
  }, [activeIndex]);

  if (loading || experiences.length === 0) return null;

  const active = experiences[activeIndex];
  const hasProjects = active.projects && active.projects.length > 0;
  const hasHighlights = active.highlights && active.highlights.length > 0;
  const hasSkills = active.skills && active.skills.length > 0;

  return (
    <section id="experience" className="py-16 md:py-28 px-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[130px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          className="mb-10 md:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium mb-3">
            <Briefcase size={14} className="text-primary" />
            <span>Work History & Engineering Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
            Work Experience
          </h2>
          <p className="text-gray-400 mt-2 text-xs sm:text-sm md:text-base max-w-xl mx-auto px-2">
            Production AI systems, microservices, and research contributions engineered at company scale.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-5 md:gap-6">
          {/* LEFT — Tabs List */}
          <motion.div
            className="lg:w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Horizontal scroll on mobile, vertical stack on desktop */}
            <div className="flex lg:flex-col gap-2.5 overflow-x-auto pb-2 lg:pb-0 lg:overflow-x-visible scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0">
              {experiences.map((exp, i) => {
                const isSelected = activeIndex === i;
                const projectCount = exp.projects?.length || 0;
                return (
                  <button
                    key={exp.id}
                    onClick={() => setActiveIndex(i)}
                    className={`group flex-shrink-0 lg:flex-shrink text-left w-56 sm:w-64 lg:w-full p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? "bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(163,230,53,0.12)]"
                        : "bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06] hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                            isSelected ? "text-primary" : "text-white group-hover:text-primary/90"
                          }`}
                        >
                          {exp.company_name}
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-400 font-medium truncate mt-0.5">
                          {exp.job_title}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 font-mono mt-1">
                          {formatDate(exp.start_date)} — {formatDate(exp.end_date || "Present")}
                        </p>
                      </div>

                      <ChevronRight
                        size={15}
                        className={`flex-shrink-0 mt-0.5 transition-all ${
                          isSelected ? "text-primary rotate-90 lg:rotate-0" : "text-gray-600"
                        }`}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.06] pt-2">
                      {projectCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-gray-400">
                          <Laptop size={11} className="text-primary" />
                          {projectCount} {projectCount === 1 ? "project" : "projects"}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-mono">Overview</span>
                      )}

                      {isSelected && (
                        <div className="flex items-center gap-1">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                          </span>
                          <span className="text-[9px] text-primary font-mono uppercase tracking-wider">Active</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick summary stats (Desktop) */}
            <div className="hidden lg:grid grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-xl font-black text-primary">{experiences.length}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Companies</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-xl font-black text-white">
                  {experiences.reduce((acc, e) => acc + (e.projects?.length || 0), 0)}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Live Projects</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Clean Executive Overview Card */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-3xl p-5 sm:p-7 md:p-9 relative overflow-hidden border border-white/10 space-y-5"
            >
              {/* Decorative Corner Glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Watermark index */}
              <div className="absolute top-4 right-5 text-4xl sm:text-5xl font-black text-white/[0.03] select-none pointer-events-none">
                {String(activeIndex + 1).padStart(2, "0")}
              </div>

              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {active.role_type && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 border border-primary/30 text-primary">
                      {active.role_type}
                    </span>
                  )}
                  {!active.end_date || active.end_date.toLowerCase() === "present" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Current Position
                    </span>
                  ) : null}
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                  {active.job_title}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base sm:text-lg md:text-xl text-primary font-bold">{active.company_name}</span>
                  {active.company_url && (
                    <a
                      href={active.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      title="Company Website"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300">
                    <CalendarDays size={12} className="text-primary" />
                    {formatDate(active.start_date)} — {formatDate(active.end_date || "Present")}
                  </div>
                  {active.location && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400">
                      <MapPin size={12} className="text-accent" />
                      {active.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Mission Summary (Expandable on Mobile) */}
              {active.description && (
                <div className="space-y-1">
                  <p
                    className={`text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base ${
                      !showFullDesc ? "line-clamp-2 md:line-clamp-none" : ""
                    }`}
                  >
                    {active.description}
                  </p>
                  {active.description.length > 120 && (
                    <button
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="md:hidden text-xs text-primary font-mono inline-flex items-center gap-1 hover:underline pt-0.5"
                    >
                      {showFullDesc ? (
                        <>Show Less <ChevronUp size={12} /></>
                      ) : (
                        <>Read More <ChevronDown size={12} /></>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Key Achievements (Expandable on Mobile) */}
              {hasHighlights && (
                <div className="space-y-2 pt-1 border-t border-white/5">
                  <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                    <Sparkles size={13} className="text-primary" /> Core Impact & Responsibilities
                  </h4>
                  <ul className="space-y-1.5">
                    {(showAllHighlights ? active.highlights! : active.highlights!.slice(0, 2)).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
                        <CheckCircle2 size={15} className="text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {active.highlights!.length > 2 && (
                    <button
                      onClick={() => setShowAllHighlights(!showAllHighlights)}
                      className="text-[11px] font-mono text-primary hover:underline inline-flex items-center gap-1 pt-0.5"
                    >
                      {showAllHighlights ? (
                        <>Show Less Highlights <ChevronUp size={11} /></>
                      ) : (
                        <>+{active.highlights!.length - 2} More Achievements <ChevronDown size={11} /></>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Delivered Systems Preview (Expandable on Mobile) */}
              {hasProjects && (
                <div className="space-y-2 pt-1 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                      <Laptop size={13} className="text-primary" /> Key Systems Delivered ({active.projects!.length})
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(showAllProjects ? active.projects! : active.projects!.slice(0, 2)).map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{proj.name}</p>
                          <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">
                            {proj.tagline || "Production Application"}
                          </p>
                        </div>
                        {proj.live_url && (
                          <a
                            href={proj.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all flex-shrink-0"
                            title="Open Live App"
                          >
                            <Globe size={13} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>

                  {active.projects!.length > 2 && (
                    <button
                      onClick={() => setShowAllProjects(!showAllProjects)}
                      className="text-[11px] font-mono text-primary hover:underline inline-flex items-center gap-1 pt-0.5"
                    >
                      {showAllProjects ? (
                        <>Show Less Projects <ChevronUp size={11} /></>
                      ) : (
                        <>+{active.projects!.length - 2} More Projects <ChevronDown size={11} /></>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Technologies Stack */}
              {hasSkills && (
                <div className="pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {active.skills!.slice(0, 8).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {active.skills!.length > 8 && (
                      <span className="text-[10px] text-gray-500 font-mono py-0.5 px-1">
                        +{active.skills!.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* ── ACTION CTA: VIEW FULL CASE STUDY ── */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Link
                  href={`/experience/${active.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-2xl bg-primary text-black font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(163,230,53,0.25)] hover:bg-primary/90 transition-all group"
                >
                  <span>Explore Full Case Study & Projects</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-center sm:justify-end gap-2">
                  <button
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                    disabled={activeIndex === 0}
                    className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all text-xs"
                    title="Previous Experience"
                  >
                    ←
                  </button>
                  <span className="text-xs text-gray-500 font-mono px-1">
                    {activeIndex + 1} / {experiences.length}
                  </span>
                  <button
                    onClick={() => setActiveIndex((i) => Math.min(experiences.length - 1, i + 1))}
                    disabled={activeIndex === experiences.length - 1}
                    className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all text-xs"
                    title="Next Experience"
                  >
                    →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
