"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getAbout, type About as AboutType } from "../../lib/api";
import { User, Sparkles, MapPin, Cpu, Mail } from "lucide-react";
import { StatCounterRow } from "@/components/ui/StatCounter";
import { SectionHeader } from "@/components/ui/SectionHeader";

const FOCUS_PILLS = [
  "LLM & RAG Systems",
  "Computer Vision",
  "Full-Stack Architecture",
  "Linux & MLOps",
];

export function About() {
  const [about, setAbout] = useState<AboutType | null>(null);

  useEffect(() => {
    getAbout().then(setAbout);
  }, []);

  return (
    <section id="about" className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[420px] h-[420px] bg-primary/10 rounded-full blur-[130px] -translate-y-1/2" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeader
          number="02"
          badge="Profile"
          icon={User}
          title="About Me"
          subtitle="Bridging deep learning research with production-grade full-stack engineering."
        />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Bento Tile: Portrait & Identity Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 glass-card glass-card-hover rounded-3xl p-8 flex flex-col items-center justify-between text-center"
          >
            <div className="relative group my-2">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-violet-600 via-primary to-accent rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
              <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-primary/30 bg-[#070612]">
                <OptimizedImage
                  src={about?.profile_image || "/profile.jpeg"}
                  alt={about?.name ?? "Rohan Mane"}
                  width={512}
                  fill
                  priority
                  className="rounded-full transition-transform duration-700 group-hover:scale-110"
                  fallback={
                    <div className="w-full h-full flex items-center justify-center bg-[#0d0c1a]">
                      <User size={64} className="text-gray-500" />
                    </div>
                  }
                />
              </div>

              <div className="absolute bottom-2 right-2 bg-[#0d0c1a]/90 backdrop-blur-xl border border-primary/35 p-2.5 rounded-2xl shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
            </div>

            <div className="w-full mt-6 pt-6 border-t border-white/[0.06] space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-300">
                <MapPin size={13} className="text-primary" />
                <span>Pune, Maharashtra · India</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-400">
                <Cpu size={13} className="text-accent" />
                <span>DIAT-DRDO Research Intern Alum</span>
              </div>
            </div>
          </motion.div>

          {/* Right Bento Tile: Bio, Focus Areas & Stat Counters */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8 glass-card rounded-3xl p-7 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  I&apos;m <span className="text-gradient-accent">{about?.name || "Rohan Mane"}</span>
                </h3>
                {about?.email && (
                  <a
                    href={`mailto:${about.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 hover:border-primary/50 hover:bg-primary/20 text-xs font-mono text-gray-200 transition-all"
                  >
                    <Mail size={13} className="text-primary" />
                    <span>{about.email}</span>
                  </a>
                )}
              </div>

              <div className="space-y-4 text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                <p>
                  {about?.bio ||
                    "An aspiring machine learning engineer and full stack developer with hands-on experience in AI, open source contributions, and Linux. I completed an internship at DIAT-DRDO. I am passionate about building innovative solutions and contributing to impactful projects in AI and Web development."}
                </p>
                {about?.bio2 ? (
                  <p className="text-gray-400">{about.bio2}</p>
                ) : (
                  <p className="text-gray-400">
                    I&apos;m driven by the desire to build intelligent systems and innovative tech solutions that make a real impact. Let&apos;s connect and build something amazing together!
                  </p>
                )}
              </div>

              {/* Focus Domain Pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                {FOCUS_PILLS.map((pill) => (
                  <span
                    key={pill}
                    className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bento Stat Tiles */}
            <StatCounterRow />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
