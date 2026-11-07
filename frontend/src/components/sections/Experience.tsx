"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  Globe,
  Github,
  Laptop
} from "lucide-react";

function formatDate(dateStr: string) {
  // If date is like "Dec 2025" or "Present", return as is
  if (!dateStr || dateStr.toLowerCase() === "present") return "Present";
  if (/^[A-Za-z]{3}\s\d{4}$/.test(dateStr)) return dateStr;
  
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
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
    <section id="experience" className="py-24 px-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[130px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-4">
            <Briefcase size={16} className="text-primary" />
            <span>Career History & Impact</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
            Work Experience
          </h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base max-w-2xl mx-auto">
            Production systems, AI platforms, and research contributions engineered at company scale.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT — Tab List (scrollable on mobile) */}
          <motion.div
            className="lg:w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Mobile: horizontal scroll tabs */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto pb-3 lg:pb-0 lg:overflow-x-visible scrollbar-none">
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
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`text-sm font-bold truncate transition-colors ${
                              isSelected ? "text-primary" : "text-white group-hover:text-primary/90"
                            }`}
                          >
                            {exp.company_name}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 font-medium truncate">{exp.job_title}</p>
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

                    {/* Project counter pill */}
                    <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                      {projectCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-400">
                          <Laptop size={11} className="text-primary" />
                          {projectCount} {projectCount === 1 ? "project" : "projects"}
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-500 font-mono">Role Details</span>
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

            {/* Timeline Summary Box */}
            <div className="hidden lg:block mt-6 p-5 glass-card rounded-2xl border border-white/10 text-center">
              <div className="flex items-center justify-around">
                <div>
                  <div className="text-2xl font-black text-primary">{experiences.length}</div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">Companies</div>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div>
                  <div className="text-2xl font-black text-white">
                    {experiences.reduce((acc, e) => acc + (e.projects?.length || 0), 0)}
                  </div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">Live Projects</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Detail Dossier Panel */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-3xl p-6 md:p-10 h-full relative overflow-hidden border border-white/10"
            >
              {/* Decorative gradient corner */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Index watermark */}
              <div className="absolute top-6 right-6 text-6xl font-black text-white/[0.03] select-none leading-none pointer-events-none">
                {String(activeIndex + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10 space-y-8">
                {/* ── 1. Company Header & Meta ── */}
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
                        Current Position
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    {active.job_title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg md:text-xl text-primary font-bold">{active.company_name}</span>
                    {active.company_url && (
                      <a
                        href={active.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
                        title="Visit company website"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-2.5 mt-4">
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

                {/* ── 2. Overview / Mission Description ── */}
                {active.description && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-gray-300 leading-relaxed text-[15px]">
                      {active.description}
                    </p>
                  </div>
                )}

                {/* ── 3. Core Highlights / Engineering Impact ── */}
                {hasHighlights && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm uppercase tracking-wider text-gray-400 font-bold mb-3">
                      <Sparkles size={15} className="text-primary" /> Key Achievements & Contributions
                    </h4>
                    <ul className="space-y-2.5">
                      {active.highlights!.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
                          <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ── 4. Company-Wide Tech Stack ── */}
                {hasSkills && (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 font-bold mb-2.5">
                      <Layers size={14} className="text-primary" /> Stack & Ecosystem
                    </h4>
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

                {/* ── 5. PROJECTS BUILT AT THIS COMPANY (Hero Feature) ── */}
                {hasProjects && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                          <Laptop size={18} className="text-primary" />
                          Projects & Systems Delivered
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Production applications and architectures built for {active.company_name}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                        {active.projects!.length} {active.projects!.length === 1 ? "Project" : "Projects"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {active.projects!.map((proj, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-primary/40 transition-all duration-300 group"
                        >
                          {/* Project Header & Links */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                                  {proj.name}
                                </h5>
                                {proj.role && (
                                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                                    {proj.role}
                                  </span>
                                )}
                              </div>
                              {proj.tagline && (
                                <p className="text-xs text-primary/90 font-medium mt-0.5">{proj.tagline}</p>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {proj.live_url && (
                                <a
                                  href={proj.live_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-black text-xs font-bold shadow-[0_0_15px_rgba(163,230,53,0.25)] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                  <Globe size={13} />
                                  <span>Live App ↗</span>
                                </a>
                              )}
                              {proj.github_url && (
                                <a
                                  href={proj.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all"
                                >
                                  <Github size={13} />
                                  <span>Code</span>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Project Description */}
                          {proj.description && (
                            <p className="text-xs text-gray-300 leading-relaxed mb-3">
                              {proj.description}
                            </p>
                          )}

                          {/* Impact Bullets */}
                          {proj.impact && proj.impact.length > 0 && (
                            <div className="mb-3 space-y-1.5 bg-black/20 p-3 rounded-xl border border-white/5">
                              {proj.impact.map((bullet, bIdx) => (
                                <div key={bIdx} className="flex items-start gap-2 text-xs text-gray-300">
                                  <span className="text-primary font-bold mt-0.5">›</span>
                                  <span>{bullet}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Project Tech Stack */}
                          {proj.tech_stack && proj.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {proj.tech_stack.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 6. Pagination Navigation ── */}
                <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                  <button
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                    disabled={activeIndex === 0}
                    className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-gray-600 font-mono">
                    {activeIndex + 1} / {experiences.length}
                  </span>
                  <button
                    onClick={() => setActiveIndex((i) => Math.min(experiences.length - 1, i + 1))}
                    disabled={activeIndex === experiences.length - 1}
                    className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
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
