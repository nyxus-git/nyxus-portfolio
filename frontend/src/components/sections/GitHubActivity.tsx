"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GitBranch } from "lucide-react";
import { GitHubCalendar } from "react-github-calendar";

// Custom theme matching neon lime + cyan palette
const calendarTheme = {
  dark: [
    "rgba(255,255,255,0.04)",  // 0 contributions
    "rgba(163,230,53,0.25)",   // 1-9
    "rgba(163,230,53,0.50)",   // 10-19
    "rgba(163,230,53,0.75)",   // 20-29
    "rgba(163,230,53,1.00)",   // 30+
  ],
};

const LEGEND_COLORS = [
  "rgba(255,255,255,0.04)",
  "rgba(163,230,53,0.25)",
  "rgba(163,230,53,0.50)",
  "rgba(163,230,53,0.75)",
  "rgba(163,230,53,1)",
];

export function GitHubActivity() {
  // Gate render to client-only to prevent SSR hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <section id="github-activity" className="py-24 px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] mix-blend-screen -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-4">
            <GitBranch size={16} className="text-primary" />
            <span>Open Source Activity</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
            GitHub Contributions
          </h2>
          <p className="text-gray-400 mt-3 text-lg">Consistent coding. Every day counts.</p>
        </motion.div>

        {/* Heatmap card */}
        <motion.div
          className="glass-card p-8 rounded-3xl overflow-x-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="min-w-[600px]">
            {mounted ? (
              <GitHubCalendar
                username="nyxus-git"
                theme={calendarTheme}
                colorScheme="dark"
                fontSize={12}
                blockMargin={4}
                blockRadius={3}
                blockSize={12}
                labels={{
                  totalCount: "{{count}} contributions in the last year",
                }}
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "inherit",
                }}
              />
            ) : (
              <div className="h-32 w-full bg-white/5 rounded-xl animate-pulse" />
            )}
          </div>

          {/* Legend + CTA row */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <a
              href="https://github.com/nyxus-git"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
            >
              <GitBranch size={14} />
              View GitHub Profile
            </a>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Less</span>
              {LEGEND_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: color, border: "1px solid rgba(255,255,255,0.08)" }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
