"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GitBranch, ArrowUpRight } from "lucide-react";
import { GitHubCalendar } from "react-github-calendar";
import { SectionHeader } from "@/components/ui/SectionHeader";

// Custom Electric Violet heatmap theme
const calendarTheme = {
  dark: [
    "rgba(255,255,255,0.045)",
    "rgba(168,85,247,0.28)",
    "rgba(168,85,247,0.52)",
    "rgba(192,132,252,0.78)",
    "rgba(236,72,153,0.95)",
  ],
};

const LEGEND_COLORS = calendarTheme.dark;

export function GitHubActivity() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="github-activity" className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[130px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeader
          number="07"
          badge="Open Source"
          icon={GitBranch}
          title="GitHub Contributions"
          subtitle="Consistent shipping across AI frameworks, tooling, and full-stack open source."
        />

        <motion.div
          className="glass-card glass-card-hover p-6 md:p-10 rounded-3xl overflow-x-auto"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <div className="min-w-[600px] flex justify-center">
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
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "inherit",
                }}
              />
            ) : (
              <div className="h-32 w-full bg-white/5 rounded-2xl animate-pulse" />
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-4">
            <a
              href="https://github.com/nyxus-git"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 hover:border-primary/60 text-primary hover:text-white hover:bg-primary/20 text-xs sm:text-sm font-semibold transition-all"
            >
              <GitBranch size={14} />
              <span>View GitHub Profile</span>
              <ArrowUpRight size={14} />
            </a>

            <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
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
