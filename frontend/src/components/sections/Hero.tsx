"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDownIcon, Download, Code2, Cpu, Terminal } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { getAbout, type About } from "../../lib/api";

export function Hero() {
  const [about, setAbout] = useState<About | null>(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    getAbout().then(setAbout);
  }, []);

  const roles = about?.roles ? about.roles.split(",").map(r => r.trim()) : ["AI Engineer", "Full Stack Developer", "Open Source Contributor"];

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
        className="relative flex flex-col items-center justify-center min-h-screen py-20 text-center px-4 overflow-hidden pt-32 md:pt-24"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        </div>

        {/* Floating Icons Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
          <motion.div className="absolute top-1/3 left-1/4 text-primary" animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <Code2 size={48} />
          </motion.div>
          <motion.div className="absolute top-1/4 right-1/4 text-accent" animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <Cpu size={64} />
          </motion.div>
          <motion.div className="absolute bottom-1/3 left-1/3 text-white/50" animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
            <Terminal size={32} />
          </motion.div>
        </div>

        <div className="max-w-4xl relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md inline-flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-gray-300">Available for new opportunities</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-white">Hi, I&apos;m </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-glow-primary">
              {about?.name || "Rohan Mane"}
            </span>
          </motion.h1>

          <div className="h-16 md:h-20 mb-6 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentRoleIndex}
                className="text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-300"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {roles[currentRoleIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>

          <motion.p
            className="text-lg md:text-xl lg:text-2xl mb-12 text-gray-400 max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {about?.tagline || "Building innovative AI solutions and contributing to impactful open source projects."}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="#best-project" className="group relative px-8 py-4 bg-primary text-black font-bold text-lg rounded-full overflow-hidden transition-transform active:scale-95">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10">View My Work</span>
            </Link>
            
            <Link href="#contact" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-lg rounded-full backdrop-blur-md transition-all active:scale-95">
              Get In Touch
            </Link>

            {about?.resume_url && (
              <a
                href={about.resume_url}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-transparent hover:bg-white/5 text-gray-300 border border-transparent hover:border-white/10 font-medium text-lg rounded-full transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Download size={20} />
                Resume
              </a>
            )}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <Link href="#best-project" className="flex flex-col items-center text-gray-500 hover:text-primary transition-colors">
            <span className="text-xs uppercase tracking-widest mb-2 font-semibold">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent animate-pulse-glow" />
          </Link>
        </motion.div>
      </section>
    </>
  );
}