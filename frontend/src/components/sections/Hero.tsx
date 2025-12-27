// frontend/src/components/sections/Hero.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDownIcon, Github, Linkedin, Mail } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";

export function Hero() {
  const roles = useMemo(() => ["AI Engineer", "Linux Enthusiast", "Full Stack Developer", "Open Source Contributor"], []);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [roles]);

  return (
    <>
      <Navbar />
      <section
        id="home"
        className="relative flex flex-col items-center justify-center min-h-screen py-20 text-center px-4 pt-32 md:pt-24 overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-500/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>

        <motion.div
          className="max-w-4xl z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="px-4 py-2 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-400 text-sm font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(132,204,22,0.3)]">
              Available for hire
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-8xl font-black mb-6 text-white leading-tight tracking-tighter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            I BUILD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400">
              INTELLIGENT
            </span>{" "}
            SYSTEMS
          </motion.h1>

          <motion.div
            className="h-16 md:h-20 mb-8 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-2xl md:text-4xl text-gray-400 font-light">
              I am a <span className="text-white font-semibold">{roles[currentRoleIndex]}</span>
            </span>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl mb-12 text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Crafting the future with cutting-edge AI solutions and robust full-stack architectures. Let's turn ideas into reality.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold bg-lime-400 hover:bg-lime-300 text-black rounded-full shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:shadow-[0_0_30px_rgba(163,230,53,0.6)] transition-all transform hover:scale-105">
              <Link href="#project">
                View Projects
              </Link>
            </Button>

            <div className="flex gap-4">
              <a href="https://github.com/nyxus-git" target="_blank" className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-lime-400 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="mailto:rohanmane9841@gmail.com" className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-lime-400 transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <Link href="#about" className="flex flex-col items-center gap-2 text-gray-500 hover:text-lime-400 transition-colors">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDownIcon className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>
    </>
  );
}