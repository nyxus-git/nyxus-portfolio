"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Download, ArrowRight, Sparkles, Terminal } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { getAbout, type About } from "../../lib/api";
import { NeuralNetCanvas } from "@/components/ui/NeuralNetCanvas";
import { TerminalLine } from "@/components/ui/TerminalLine";

export function Hero() {
  const [about, setAbout] = useState<About | null>(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    getAbout().then(setAbout);
  }, []);

  const roles = about?.roles
    ? about.roles.split(",").map((r) => r.trim())
    : ["AI Engineer", "Full Stack Developer", "Open Source Contributor"];

  useEffect(() => {
    if (roles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <>
      <Navbar />
      <section
        id="home"
        className="relative flex flex-col items-center justify-center min-h-screen py-24 text-center px-4 overflow-hidden pt-32 md:pt-28"
      >
        {/* Interactive Neural Network Canvas */}
        <div className="absolute inset-0 z-0">
          <NeuralNetCanvas />
        </div>

        {/* Radial Obsidian Vignette + Central Violet Spotlight */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_75%_55%_at_50%_45%,rgba(139,92,246,0.14),transparent_60%)]" />
        <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_85%_70%_at_50%_50%,transparent_25%,#04040a_96%)]" />

        <div className="max-w-5xl relative z-10 flex flex-col items-center">
          {/* Status Availability Pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 px-4 py-1.5 rounded-full border border-primary/25 bg-[#0d0c1a]/80 backdrop-blur-xl inline-flex items-center gap-2.5 shadow-[0_0_24px_-4px_rgba(168,85,247,0.3)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-gray-200">
              Available for AI &amp; Systems Engineering
            </span>
          </motion.div>

          {/* Editorial Display Name */}
          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-black mb-5 tracking-[-0.04em] leading-[0.95]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-white block sm:inline">Hi, I&apos;m </span>
            <span className="text-gradient-accent text-glow-primary">
              {about?.name || "Rohan Mane"}
            </span>
          </motion.h1>

          {/* Dynamic Role Ticker */}
          <div className="h-14 md:h-16 mb-5 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRoleIndex}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -28 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md"
              >
                <Sparkles size={18} className="text-accent flex-shrink-0" />
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-100 tracking-tight">
                  {roles[currentRoleIndex]}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mini Terminal Identity */}
          <motion.div
            className="mb-8 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500 uppercase tracking-[0.2em] mb-2">
              <Terminal size={12} className="text-primary" />
              <span>runtime.identity</span>
            </div>
            <TerminalLine
              lines={[
                "$ whoami",
                `> ${
                  about?.roles
                    ? about.roles
                        .split(",")
                        .map((r) => r.trim())
                        .join("  ·  ")
                    : "AI Engineer  ·  ML Engineer  ·  Open Source Contributor"
                }`,
              ]}
              startDelay={1200}
              speed={30}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-base sm:text-lg md:text-xl mb-10 text-gray-400 max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            {about?.tagline ||
              "Building innovative AI solutions and contributing to impactful open source projects."}
          </motion.p>

          {/* Action Row */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <Link
              href="#best-project"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 btn-primary rounded-full text-sm md:text-base active:scale-95"
            >
              <span>Explore My Work</span>
              <ArrowRight
                size={17}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/[0.04] hover:bg-primary/10 text-white border border-white/15 hover:border-primary/45 font-semibold text-sm md:text-base rounded-full backdrop-blur-xl transition-all active:scale-95"
            >
              Get In Touch
            </Link>

            {about?.resume_url && (
              <a
                href={about.resume_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-transparent hover:bg-white/[0.05] text-gray-300 hover:text-white border border-white/10 hover:border-white/20 font-medium text-sm md:text-base rounded-full transition-all active:scale-95"
              >
                <Download size={17} className="text-primary" />
                <span>Resume</span>
              </a>
            )}
          </motion.div>
        </div>

        {/* Scroll Cue */}
        <motion.div
          className="absolute bottom-8 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          <Link
            href="#best-project"
            className="flex flex-col items-center text-gray-500 hover:text-primary transition-colors group"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] mb-2">
              Scroll
            </span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-primary via-accent/60 to-transparent animate-pulse-glow" />
          </Link>
        </motion.div>
      </section>
    </>
  );
}
