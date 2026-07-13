"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getAbout, type About as AboutType } from "../../lib/api";
import { User, Sparkles } from "lucide-react";

export function About() {
  const [about, setAbout] = useState<AboutType | null>(null);

  useEffect(() => {
    getAbout().then(setAbout);
  }, []);

  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] mix-blend-screen -translate-y-1/2" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-4">
            <User size={16} className="text-primary" />
            <span>Profile</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
            About Me
          </h2>
        </motion.div>

        <motion.div
          className="glass-card p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative group flex-shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-white/10 bg-black">
              {about?.profile_image ? (
                <Image
                  src={about.profile_image}
                  alt={about.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <User size={64} className="text-gray-500" />
                </div>
              )}
            </div>
            
            {/* Floating badge */}
            <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur border border-white/10 p-3 rounded-2xl shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="flex-grow text-center md:text-left flex flex-col justify-center h-full pt-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              I&apos;m <span className="text-primary">{about?.name || "Rohan Mane"}</span>
            </h3>
            
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                {about?.bio || "An aspiring machine learning engineer and full stack developer with hands-on experience in AI, open source contributions, and Linux. I completed an internship at DIAT-DRDO. I am passionate about building innovative solutions and contributing to impactful projects in AI and Web development."}
              </p>
              {about?.bio2 && (
                <p>{about.bio2}</p>
              )}
              {!about?.bio2 && (
                <p>
                  I&apos;m driven by the desire to build intelligent systems and innovative tech solutions that make a real impact. Let&apos;s connect and build something amazing together!
                </p>
              )}
            </div>
            
            {about?.email && (
              <div className="mt-8 pt-6 border-t border-white/10 inline-flex gap-4 items-center flex-wrap justify-center md:justify-start">
                <a href={`mailto:${about.email}`} className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-colors">
                  {about.email}
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}