"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  number: string;
  badge: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  action?: ReactNode;
}

export function SectionHeader({
  number,
  badge,
  icon: Icon,
  title,
  subtitle,
  align = "center",
  action,
}: SectionHeaderProps) {
  if (align === "left") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-14 md:mb-18 flex flex-col md:flex-row md:items-end justify-between gap-6 relative"
      >
        <div className="relative">
          <span className="section-num absolute -top-9 -left-2 md:-top-12 md:-left-4">
            {number}
          </span>
          <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-semibold uppercase tracking-[0.18em] mb-4">
            <Icon size={12} />
            <span>{badge}</span>
          </div>
          <h2 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="relative z-10 mt-3 text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="relative z-10 flex-shrink-0">{action}</div>}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-14 md:mb-20 text-center relative"
    >
      <span className="section-num absolute -top-9 md:-top-12 left-1/2 -translate-x-1/2">
        {number}
      </span>
      <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-semibold uppercase tracking-[0.18em] mb-4">
        <Icon size={12} />
        <span>{badge}</span>
      </div>
      <h2 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="relative z-10 mt-4 text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

