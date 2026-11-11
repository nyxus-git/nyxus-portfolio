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
  Laptop,
  ArrowRight,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

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

  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    getExperiences().then((data) => {
      setExperiences(data);
      setLoading(false);
    });
  }, []);

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
    <section id="experience" className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="absolute top-1/2 left-0 w-[480px] h-[480px] bg-primary/10 rounded-full blur-[130px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[130px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeader
          number="08"
          badge="Work History"
          icon={Briefcase}
          title="Work Experience"
          subtitle="Production AI systems, microservices, and research contributions engineered at company scale."
        />

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* LEFT — Vertical Timeline Rail & Selector */}
          <motion.div
            className="lg:w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative lg:pl-7">
              {/* Vertical Timeline Rail (Desktop) */}
              <div className="hidden lg:block absolute left-2 top-3 bottom-3 w-[2px] bg-gradient-to-b from-primary via-accent/60 to-white/10 rounded-full" />

              <div className="flex lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0 lg:overflow-x-visible -mx-4 px-4 lg:mx-0 lg:px-0">
                {experiences.map((exp, i) => {
                  const isSelected = activeIndex === i;
                  const projectCount = exp.projects?.length || 0;
                  return (
                    <div key={exp.id} className="relative flex-shrink-0 lg:flex-shrink">
                      {/* Timeline Node Dot (Desktop) */}
                      <span
                        className={`hidden lg:flex absolute -left-[27px] top-6 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 items-center justify-center ${
                          isSelected
                            ? "bg-primary border-white shadow-[0_0_16px_rgba(168,85,247,0.95)] scale-110"
                            : "bg-[#0d0c1a] border-white/25"
                        }`}
                      />

                      <button
                        onClick={() => setActiveIndex(i)}
                        className={`group text-left w-60 sm:w-64 lg:w-full p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                          isSelected
                            ? "bg-primary/15 border-primary/50 shadow-[0_0_24px_rgba(168,85,247,0.2)]"
                            : "bg-[#0d0c1a]/60 border-white/[0.07] hover:bg-[#131126]/80 hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                                isSelected ? "text-white" : "text-gray-200 group-hover:text-primary"
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

                        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2">
                          {projectCount > 0 ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-gray-400">
                              <Laptop size={11} className="text-primary" />
                              {projectCount} {projectCount === 1 ? "system" : "systems"}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-mono">Overview</span>
                          )}

                          {isSelected && (
                            <div className="flex items-center gap-1.5">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                              </span>
                              <span className="text-[9px] text-primary font-mono uppercase tracking-wider">
                                Selected
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary KPI Tiles (Desktop) */}
            <div className="hidden lg:grid grid-cols-2 gap-3 mt-5 pl-7">
              <div className="p-3.5 rounded-2xl glass-card text-center">
                <div className="text-xl font-black text-gradient-accent">{experiences.length}</div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-0.5">
                  Companies
                </div>
              </div>
              <div className="p-3.5 rounded-2xl glass-card text-center">
                <div className="text-xl font-black text-white">
                  {experiences.reduce((acc, e) => acc + (e.projects?.length || 0), 0)}
                </div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-0.5">
                  Live Systems
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Executive Overview Panel */}
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
              className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden space-y-5"
            >
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <div className="absolute top-4 right-6 text-4xl sm:text-5xl font-black text-white/[0.03] select-none pointer-events-none font-mono">
                {String(activeIndex + 1).padStart(2, "0")}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {active.role_type && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-primary/15 border border-primary/35 text-primary">
                      {active.role_type}
                    </span>
                  )}
                  {!active.end_date || active.end_date.toLowerCase() === "present" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/35 text-accent text-[11px] font-mono font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      Current Position
                    </span>
                  ) : null}
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                  {active.job_title}
                </h3>

                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-base sm:text-lg md:text-xl text-gradient-accent font-bold">
                    {active.company_name}
                  </span>
                  {active.company_url && (
                    <a
                      href={active.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary transition-colors p-1"
                      title="Company Website"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-3.5">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-gray-300">
                    <CalendarDays size={12} className="text-primary" />
                    {formatDate(active.start_date)} — {formatDate(active.end_date || "Present")}
                  </div>
                  {active.location && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-gray-300">
                      <MapPin size={12} className="text-accent" />
                      {active.location}
                    </div>
                  )}
                </div>
              </div>

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
                        <>
                          Show Less <ChevronUp size={12} />
                        </>
                      ) : (
                        <>
                          Read More <ChevronDown size={12} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {hasHighlights && (
                <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                  <h4 className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-400 font-bold flex items-center gap-1.5">
                    <Sparkles size={13} className="text-primary" /> Core Impact &amp; Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {(showAllHighlights ? active.highlights! : active.highlights!.slice(0, 2)).map(
                      (item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed"
                        >
                          <CheckCircle2 size={15} className="text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>

                  {active.highlights!.length > 2 && (
                    <button
                      onClick={() => setShowAllHighlights(!showAllHighlights)}
                      className="text-[11px] font-mono text-primary hover:text-accent hover:underline inline-flex items-center gap-1 pt-0.5"
                    >
                      {showAllHighlights ? (
                        <>
                          Show Less Highlights <ChevronUp size={11} />
                        </>
                      ) : (
                        <>
                          +{active.highlights!.length - 2} More Achievements <ChevronDown size={11} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {hasProjects && (
                <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                  <h4 className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-400 font-bold flex items-center gap-1.5">
                    <Laptop size={13} className="text-accent" /> Key Systems Delivered ({active.projects!.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(showAllProjects ? active.projects! : active.projects!.slice(0, 2)).map(
                      (proj, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-primary/35 flex items-center justify-between gap-2 transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{proj.name}</p>
                            <p className="text-[11px] text-gray-400 truncate">
                              {proj.tagline || "Production Application"}
                            </p>
                          </div>
                          {proj.live_url && (
                            <a
                              href={proj.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-primary/15 text-primary hover:bg-primary hover:text-white transition-all flex-shrink-0"
                              title="Open Live App"
                            >
                              <Globe size={13} />
                            </a>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  {active.projects!.length > 2 && (
                    <button
                      onClick={() => setShowAllProjects(!showAllProjects)}
                      className="text-[11px] font-mono text-primary hover:text-accent hover:underline inline-flex items-center gap-1 pt-0.5"
                    >
                      {showAllProjects ? (
                        <>
                          Show Less Projects <ChevronUp size={11} />
                        </>
                      ) : (
                        <>
                          +{active.projects!.length - 2} More Projects <ChevronDown size={11} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {hasSkills && (
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {active.skills!.slice(0, 8).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.04] border border-white/10 text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {active.skills!.length > 8 && (
                    <span className="text-[10px] text-gray-500 font-mono py-1 px-1.5">
                      +{active.skills!.length - 8} more
                    </span>
                  )}
                </div>
              )}

              <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Link
                  href={`/experience/${active.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full btn-primary text-xs sm:text-sm group"
                >
                  <span>Explore Full Case Study &amp; Projects</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-center sm:justify-end gap-2">
                  <button
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                    disabled={activeIndex === 0}
                    className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white hover:border-primary/40 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-xs"
                    title="Previous Experience"
                  >
                    ←
                  </button>
                  <span className="text-xs text-gray-400 font-mono px-1">
                    {activeIndex + 1} / {experiences.length}
                  </span>
                  <button
                    onClick={() => setActiveIndex((i) => Math.min(experiences.length - 1, i + 1))}
                    disabled={activeIndex === experiences.length - 1}
                    className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white hover:border-primary/40 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-xs"
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
