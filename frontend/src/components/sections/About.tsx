// frontend/src/components/sections/About.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function About() {
  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-lime-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About Me
          <div className="w-24 h-1 bg-lime-400 mx-auto mt-4 rounded-full"></div>
        </motion.h2>

        <motion.div
          className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-xl border border-gray-700/50 text-white flex flex-col md:flex-row items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-lime-400 shadow-lg relative">
            <Image
              src="/profile.jpeg"
              alt="Rohan Mane Profile"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>

          <div className="flex-grow text-center md:text-left">
            <p className="text-lg md:text-xl mb-4 text-gray-300">
              Hi, I&apos;m <strong className="text-lime-400">Rohan Mane</strong>, an aspiring machine learning engineer and full stack developer with hands-on experience in AI, open source contributions, and Linux. I completed an internship at DIAT-DRDO. I am passionate about building innovative solutions and contributing to impactful projects in AI and Web development.
            </p>
            <p className="text-lg md:text-xl text-gray-300">
              I&apos;m driven by the desire to build intelligent systems and innovative tech solutions that make a real impact. Let&apos;s connect and build something amazing together!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}