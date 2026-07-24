"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getExperiences, type Experience as ExperienceType } from "../../lib/api";
import { Briefcase, MapPin, CalendarDays, ChevronRight } from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
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
            <span>Work History</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
            Experience
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT — Tab List (scrollable on mobile) */}
          <motion.div
            className="lg:w-72 flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Mobile: horizontal scroll tabs */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto pb-3 lg:pb-0 lg:overflow-x-visible scrollbar-none">
              {experiences.map((exp, i) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveIndex(i)}
                  className={`group flex-shrink-0 lg:flex-shrink text-left w-52 lg:w-full p-4 rounded-2xl border transition-all duration-300 ${
                    activeIndex === i
                      ? "bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(163,230,53,0.1)]"
                      : "bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06] hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-bold truncate transition-colors ${
                          activeIndex === i ? "text-primary" : "text-white group-hover:text-primary/80"
                        }`}
                      >
                        {exp.job_title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{exp.company_name}</p>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`flex-shrink-0 mt-0.5 transition-all ${
                        activeIndex === i ? "text-primary rotate-90 lg:rotate-0" : "text-gray-600"
                      }`}
                    />
                  </div>

                  {/* Active indicator dot */}
                  {activeIndex === i && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                      </span>
                      <span className="text-[10px] text-primary/70 font-mono uppercase tracking-wider">Active</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Timeline counter */}
            <div className="hidden lg:block mt-6 p-4 glass-card rounded-2xl text-center">
              <div className="text-2xl font-black text-primary">{experiences.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Positions</div>
            </div>
          </motion.div>

          {/* RIGHT — Detail Panel */}
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
              className="glass-panel rounded-3xl p-8 md:p-10 h-full relative overflow-hidden"
            >
              {/* Decorative gradient corner */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Index badge */}
              <div className="absolute top-6 right-6 text-5xl font-black text-white/[0.04] select-none leading-none">
                {String(activeIndex + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10">
                {/* Role + Company */}
                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-1">
                  {active.job_title}
                </h3>
                <p className="text-lg text-primary font-semibold mb-5">{active.company_name}</p>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-mono text-primary">
                    <CalendarDays size={12} />
                    {formatDate(active.start_date)} — {active.end_date ? formatDate(active.end_date) : "Present"}
                  </div>
                  {active.location && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                      <MapPin size={12} className="text-accent" />
                      {active.location}
                    </div>
                  )}
                  {!active.end_date && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/25 text-xs text-green-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Current Role
                    </div>
                  )}
                </div>

                {/* Description */}
                {active.description && (
                  <div className="space-y-3">
                    {active.description.split(/\n|(?<=\.) (?=[A-Z])/).filter(Boolean).map((para, i) => (
                      <p key={i} className="text-gray-300 leading-relaxed text-[15px]">
                        {para.trim()}
                      </p>
                    ))}
                  </div>
                )}

                {/* Navigation arrows */}
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