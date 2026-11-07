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
  Globe
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

  useEffect(() => {
    getExperiences().then((data) => {
      setExperiences(data);
      setLoading(false);
    });
  }, []);

  if (loading || experiences.length === 0) return null;

  const active = experiences[activeIndex];
  const hasProjects = active.projects && active.projects.length > 0;
  const hasHighlights = active.highlights && active.highlights.length > 0;
  const hasSkills = active.skills && active.skills.length > 0;

  return (
    <section id="experience" className="py-20 md:py-28 px-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[130px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          className="mb-12 md:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs sm:text-sm font-medium mb-4">
            <Briefcase size={15} className="text-primary" />
            <span>Work History & Engineering Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
            Work Experience
          </h2>
          <p className="text-gray-400 mt-3 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-4">
            Production systems, AI platforms, and research contributions engineered at company scale.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT — Tabs List */}
          <motion.div
            className="lg:w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Scrollable on mobile, column on desktop */}
            <div className="flex lg:flex-col gap-2.5 overflow-x-auto pb-3 lg:pb-0 lg:overflow-x-visible scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0">
              {experiences.map((exp, i) => {
                const isSelected = activeIndex === i;
                const projectCount = exp.projects?.length || 0;
                return (
                  <button
                    key={exp.id}
                    onClick={() => setActiveIndex(i)}
                    className={`group flex-shrink-0 lg:flex-shrink text-left w-64 lg:w-full p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? "bg-primary/10 border-primary/40 shadow-[0_0_25px_rgba(163,230,53,0.12)]"
                        : "bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06] hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-bold truncate transition-colors ${
                            isSelected ? "text-primary" : "text-white group-hover:text-primary/90"
                          }`}
                        >
                          {exp.company_name}
                        </p>
                        <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{exp.job_title}</p>
                        <p className="text-[11px] text-gray-500 font-mono mt-1">
                          {formatDate(exp.start_date)} — {formatDate(exp.end_date || "Present")}
                        </p>
                      </div>

                      <ChevronRight
                        size={16}
                        className={`flex-shrink-0 mt-1 transition-all ${
                          isSelected ? "text-primary rotate-90 lg:rotate-0" : "text-gray-600"
                        }`}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2">
                      {projectCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-400">
                          <Laptop size={11} className="text-primary" />
                          {projectCount} {projectCount === 1 ? "project" : "projects"}
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-500 font-mono">Overview</span>
                      )}

                      {isSelected && (
                        <div className="flex items-center gap-1">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                          </span>
                          <span className="text-[10px] text-primary font-mono uppercase tracking-wider">Active</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick summary stats */}
            <div className="hidden lg:grid grid-cols-2 gap-3 mt-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-xl font-black text-primary">{experiences.length}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Companies</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-xl font-black text-white">
                  {experiences.reduce((acc, e) => acc + (e.projects?.length || 0), 0)}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Projects</div>
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
              className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden border border-white/10 space-y-6"
            >
              {/* Decorative Corner Glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Watermark index */}
              <div className="absolute top-6 right-6 text-5xl font-black text-white/[0.03] select-none pointer-events-none">
                {String(activeIndex + 1).padStart(2, "0")}
              </div>

              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {active.role_type && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 border border-primary/30 text-primary">
                      {active.role_type}
                    </span>
                  )}
                  {!active.end_date || active.end_date.toLowerCase() === "present" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Current
                    </span>
                  ) : null}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {active.job_title}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg sm:text-xl text-primary font-bold">{active.company_name}</span>
                  {active.company_url && (
                    <a
                      href={active.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      title="Company Website"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2.5 mt-3.5">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                    <CalendarDays size={13} className="text-primary" />
                    {formatDate(active.start_date)} — {formatDate(active.end_date || "Present")}
                  </div>
                  {active.location && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                      <MapPin size={13} className="text-accent" />
                      {active.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Mission Summary */}
              {active.description && (
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {active.description}
                </p>
              )}

              {/* Key Achievements (Top 3 max for cleanliness) */}
              {hasHighlights && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary" /> Core Impact & Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {active.highlights!.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed">
                        <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Delivered Projects Preview Chips */}
              {hasProjects && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                      <Laptop size={14} className="text-primary" /> Delivered Systems ({active.projects!.length})
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {active.projects!.map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{proj.name}</p>
                          <p className="text-[11px] text-gray-400 truncate">{proj.tagline || "Production Application"}</p>
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
                </div>
              )}

              {/* Technologies Stack */}
              {hasSkills && (
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {active.skills!.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CTA BUTTON: DEDICATED CASE STUDY PAGE ── */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Link
                  href={`/experience/${active.id}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-black font-black text-sm shadow-[0_0_20px_rgba(163,230,53,0.25)] hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all group"
                >
                  <span>View Full Experience & Projects Case Study</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-center sm:justify-end gap-2">
                  <button
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                    disabled={activeIndex === 0}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
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
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
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
