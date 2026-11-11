"use client";

import { motion } from "framer-motion";
import { CalendarDays, GraduationCap } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Education() {
  const educationEntries = [
    {
      id: 1,
      degree: "Bachelor of Engineering - BE, Artificial Intelligence & Machine Learning",
      university: "Savitribai Phule Pune University",
      duration: "Nov 2022 - Jun 2025",
    },
    {
      id: 2,
      degree: "Diploma, Information Technology",
      university: "Shivnagar Vidya Prasarak Mandal's College Of Engineering",
      duration: "Jul 2019 - Oct 2022",
    },
  ];

  return (
    <section id="education" className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="container mx-auto max-w-4xl relative z-10">
        <SectionHeader
          number="09"
          badge="Academic Background"
          icon={GraduationCap}
          title="Education"
          subtitle="Formal foundation in Artificial Intelligence, Machine Learning, and Systems Engineering."
        />

        <div className="relative pl-6 md:pl-8 space-y-6">
          {/* Vertical Timeline Connector */}
          <div className="absolute left-2 md:left-2.5 top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary via-accent/60 to-transparent rounded-full" />

          {educationEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              className="relative glass-card glass-card-hover p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              {/* Timeline Dot */}
              <span className="absolute -left-[22px] md:-left-[28px] top-9 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white shadow-[0_0_14px_rgba(168,85,247,0.9)]" />

              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-7 h-7 text-primary" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 leading-snug">
                  {entry.degree}
                </h3>
                <p className="text-gray-400 text-sm md:text-base font-medium">
                  {entry.university}
                </p>
              </div>

              <div className="flex-shrink-0">
                <span className="text-xs font-mono text-gray-300 px-4 py-2 bg-white/[0.04] rounded-full border border-white/10 inline-flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-accent" />
                  {entry.duration}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
