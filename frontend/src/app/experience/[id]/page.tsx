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
  Tag,
  ListChecks,
} from "lucide-react";
import { getExperience, getExperiences, type Experience } from "@/lib/api";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

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
  const [expandedImpacts, setExpandedImpacts] = useState<Record<number, boolean>>({});

  const toggleImpact = (idx: number) => {
    setExpandedImpacts((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

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
      <div className="min-h-screen flex items-center justify-center bg-[#04040a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-gray-400 font-mono text-sm">Loading experience details...</p>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#04040a] text-white px-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 mb-4">
          <Briefcase size={28} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Experience Entry Not Found</h1>
        <p className="text-gray-400 text-sm mb-6">
          The experience record you requested does not exist.
        </p>
        <Link
          href="/#experience"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-primary font-bold text-sm"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </div>
    );
  }

  const currentIndex = allExperiences.findIndex((e) => String(e.id) === String(id));
  const prevExp = currentIndex > 0 ? allExperiences[currentIndex - 1] : null;
  const nextExp =
    currentIndex < allExperiences.length - 1 ? allExperiences[currentIndex + 1] : null;

  const hasProjects = experience.projects && experience.projects.filter((p) => p.is_published !== false).length > 0;
  const visibleProjects = (experience.projects || []).filter((p) => p.is_published !== false);
  const hasHighlights = experience.highlights && experience.highlights.length > 0;
  const hasSkills = experience.skills && experience.skills.length > 0;

  return (
    <main className="min-h-screen bg-[#04040a] text-white selection:bg-primary/30 selection:text-white flex flex-col">
      <Navbar />

      <div className="container mx-auto max-w-5xl px-4 pt-28 pb-20 flex-1">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/#experience"
            className="inline-flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-primary transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Experience</span>
          </Link>

          <button
            onClick={copyShareLink}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-gray-300 hover:text-white hover:border-primary/40 transition-all font-mono"
            title="Share Experience Link"
          >
            <Share2 size={13} className="text-primary" />
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative glass-panel rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden mb-10"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {experience.role_type && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/15 border border-primary/35 text-primary">
                  {experience.role_type}
                </span>
              )}
              {!experience.end_date || experience.end_date.toLowerCase() === "present" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/35 text-accent text-xs font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Current Position
                </span>
              ) : null}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {experience.job_title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-lg md:text-2xl font-bold">
              <span className="text-gradient-accent">{experience.company_name}</span>
              {experience.company_url && (
                <a
                  href={experience.company_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-normal text-gray-300 hover:text-white hover:border-primary/40 transition-all"
                >
                  <span>Company Website</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300">
                <CalendarDays size={14} className="text-primary" />
                {formatDate(experience.start_date)} — {formatDate(experience.end_date || "Present")}
              </div>
              {experience.location && (
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-gray-300">
                  <MapPin size={14} className="text-accent" />
                  {experience.location}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 space-y-6">
            {experience.description && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card p-6 sm:p-8 rounded-3xl"
              >
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-gray-400 mb-3 flex items-center gap-2">
                  <Briefcase size={15} className="text-primary" /> Role Overview &amp; Mandate
                </h3>
                <p className="text-gray-300 leading-relaxed text-base">{experience.description}</p>
              </motion.div>
            )}

            {hasHighlights && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="glass-card p-6 sm:p-8 rounded-3xl"
              >
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-gray-400 mb-4 flex items-center gap-2">
                  <Sparkles size={15} className="text-primary" /> Key Achievements &amp; Engineering Impact
                </h3>
                <ul className="space-y-3">
                  {experience.highlights!.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm sm:text-base text-gray-300 leading-relaxed"
                    >
                      <CheckCircle2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            {hasSkills && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card p-6 rounded-3xl"
              >
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-gray-400 mb-3 flex items-center gap-2">
                  <Layers size={15} className="text-primary" /> Technologies Used
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {experience.skills!.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.04] border border-white/10 text-gray-300"
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
              className="p-6 rounded-3xl bg-primary/10 border border-primary/25 text-center space-y-1.5"
            >
              <div className="text-3xl font-black text-gradient-accent">
                {visibleProjects.length}
              </div>
              <div className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">
                Production Deliverables
              </div>
            </motion.div>
          </div>
        </div>

        {hasProjects && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6 mb-16"
          >
            <div className="border-b border-white/[0.08] pb-4">
              <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <Laptop size={24} className="text-primary" />
                <span>Production Systems &amp; Projects Delivered</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Detailed breakdown of applications, integrations, and tools built for{" "}
                {experience.company_name}
              </p>
            </div>

            <div className="space-y-6">
              {visibleProjects.map((proj, pIdx) => {
                // Determine effective links: prefer links[] array, fallback to legacy live_url/github_url
                const effectiveLinks: Array<{ label: string; url: string }> = [];
                if (proj.links && proj.links.length > 0) {
                  proj.links
                    .slice()
                    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                    .forEach((l) => effectiveLinks.push({ label: l.label, url: l.url }));
                } else {
                  if (proj.live_url) effectiveLinks.push({ label: "Live Application", url: proj.live_url });
                  if (proj.github_url) effectiveLinks.push({ label: "View Code", url: proj.github_url });
                }

                // Responsibilities: prefer responsibilities[], fallback to impact[]
                const bulletPoints = (proj.responsibilities && proj.responsibilities.length > 0)
                  ? proj.responsibilities
                  : (proj.impact || []);
                const hasMoreBullets = bulletPoints.length > 2;

                return (
                  <div
                    key={pIdx}
                    className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 md:p-10 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5 mb-1">
                          <h3 className="text-xl sm:text-2xl font-bold text-white">{proj.name}</h3>
                          {proj.role && (
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/[0.05] text-gray-300 border border-white/10">
                              {proj.role}
                            </span>
                          )}
                        </div>
                        {proj.tagline && (
                          <p className="text-sm text-primary font-medium mt-0.5">{proj.tagline}</p>
                        )}
                        {proj.category && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {proj.category.split("|").map((cat, cIdx) => (
                              <span
                                key={cIdx}
                                className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 border border-accent/25 text-accent/80"
                              >
                                <Tag size={9} />
                                {cat.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Project links */}
                      {effectiveLinks.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                          {effectiveLinks.map((lnk, lIdx) => (
                            <a
                              key={lIdx}
                              href={lnk.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={
                                lIdx === 0
                                  ? "inline-flex items-center gap-2 px-4 py-2 rounded-full btn-primary text-xs sm:text-sm"
                                  : "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs sm:text-sm font-bold hover:bg-primary/20 border border-white/10 hover:border-primary/40 transition-all"
                              }
                            >
                              {lnk.label.toLowerCase().includes("android") || lnk.label.toLowerCase().includes("app store") ? (
                                <span className="text-sm">📱</span>
                              ) : lnk.label.toLowerCase().includes("github") || lnk.label.toLowerCase().includes("code") ? (
                                <Github size={15} />
                              ) : (
                                <Globe size={15} />
                              )}
                              <span>{lnk.label} ↗</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {proj.description && (
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                        {proj.description}
                      </p>
                    )}

                    {bulletPoints.length > 0 && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#070612]/80 border border-white/[0.06] space-y-2">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
                          <ListChecks size={12} className="text-primary" />
                          {proj.responsibilities && proj.responsibilities.length > 0
                            ? "Responsibilities & Contributions:"
                            : "Key Engineering Contributions:"}
                        </div>
                        {(expandedImpacts[pIdx] ? bulletPoints : bulletPoints.slice(0, 4)).map(
                          (bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                              <span className="text-accent font-bold mt-0.5">›</span>
                              <span className="leading-relaxed">{bullet}</span>
                            </div>
                          )
                        )}
                        {hasMoreBullets && (
                          <button
                            type="button"
                            onClick={() => toggleImpact(pIdx)}
                            className="text-[11px] font-mono text-primary hover:text-accent hover:underline inline-flex items-center gap-1 pt-1"
                          >
                            {expandedImpacts[pIdx]
                              ? "Show Less ▴"
                              : `+${bulletPoints.length - 4} More Points ▾`}
                          </button>
                        )}
                      </div>
                    )}

                    {proj.tech_stack && proj.tech_stack.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <span className="text-xs text-gray-500 font-mono mr-1">Stack:</span>
                        {proj.tech_stack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] text-gray-300 border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] pt-8 mt-12">
          {prevExp ? (
            <Link
              href={`/experience/${prevExp.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-5 py-3 rounded-2xl glass-card glass-card-hover text-sm text-gray-300 hover:text-white group"
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
              className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-end gap-2 px-5 py-3 rounded-2xl glass-card glass-card-hover text-sm text-gray-300 hover:text-white group"
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

      <Footer />
    </main>
  );
}
