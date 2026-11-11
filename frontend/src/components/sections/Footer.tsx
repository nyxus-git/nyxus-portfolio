"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Flagship", href: "/#best-project" },
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Projects", href: "/#project" },
    { label: "Experience", href: "/#experience" },
    { label: "Insights", href: "/#blog" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#030308]/80 backdrop-blur-xl">
      <div className="section-divider" />
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/#home" className="text-xl font-black tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
              <span className="text-white">Rohan</span>
              <span className="text-gradient-accent">Mane</span>
            </Link>
            <p className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
              <Sparkles size={11} className="text-primary" />
              AI Engineer &amp; Full-Stack Architect · Pune, India
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-medium text-gray-400 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href="https://github.com/nyxus-git"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-primary/40 hover:bg-primary/10 text-xs font-mono text-gray-300 hover:text-white transition-all"
          >
            <span>@nyxus-git</span>
            <ArrowUpRight size={13} className="text-primary" />
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-600 font-mono">
          <span>© {year} Rohan Mane. All rights reserved.</span>
          <span>Obsidian Violet Design System · Built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}

