// frontend/src/components/sections/Hero.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDownIcon, Download } from "lucide-react"; // Import Download icon
import { Navbar } from "@/components/sections/Navbar";

export function Hero() {
  const roles = ["AI Engineer", "Linux Enthusiast", "Full Stack Developer", "Open Source Contributor"];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [roles, roles.length]);

  return (
    <>
      <Navbar />
      <section
        id="home"
        className="flex flex-col items-center justify-center min-h-screen py-20 text-center px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 pt-32 md:pt-24" // Added pt-32 for spacing below fixed navbar
      >
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Hi, I'm <span className="text-lime-400">Rohan Mane</span>
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-4xl font-semibold mb-8 h-12 text-gray-300"
            key={currentRoleIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {roles[currentRoleIndex]}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl mb-10 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Building innovative AI solutions and contributing to impactful open source projects
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center" // Added flex-col for small screens, sm:flex-row for larger
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button asChild size="lg" className="px-8 py-6 text-lg bg-lime-600 hover:bg-lime-700 text-white">
              <Link href="#projects">
                View My Work
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg border-lime-400 text-lime-400 hover:bg-lime-400/20 hover:text-lime-400">
              <Link href="#contact">
                Get In Touch
              </Link>
            </Button>
            {/* New Resume Download Button */}
            <Button asChild size="lg" className="px-8 py-6 text-lg bg-gray-700 hover:bg-gray-600 text-white border border-gray-600">
              <a
                href="Rohan_Resume.pdf" // Make sure this path is correct relative to your public folder
                download="Rohan_Resume.pdf" // Suggests a filename for download
                className="inline-flex items-center justify-center" // Added justify-center for consistent icon alignment
              >
                <Download className="w-5 h-5 mr-2" /> Download Resume
              </a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Link href="#about">
            <ArrowDownIcon className="h-6 w-6 text-lime-400" />
            <span className="sr-only">Scroll Down</span>
          </Link>
        </motion.div>
      </section>
    </>
  );
}