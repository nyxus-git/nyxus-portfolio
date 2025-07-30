"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDownIcon } from "lucide-react";

export function Hero() {
  const roles = ["AI Engineer", "Tech Enthusiast", "Startup Founder"];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="flex flex-col items-center justify-center min-h-screen py-20 text-center px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10"
    >
      <motion.div
        className="max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Hi, I&apos;m <span className="text-primary">Nyxus</span>
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-4xl font-semibold mb-8 h-12 text-muted-foreground"
          key={currentRoleIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {roles[currentRoleIndex]}
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl mb-10 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Final-year AIML student passionate about building intelligent systems and innovative tech solutions.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href="#projects">View My Work</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
            <Link href="#contact">Get In Touch</Link>
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
          <ArrowDownIcon className="h-6 w-6 text-muted-foreground" />
          <span className="sr-only">Scroll Down</span>
        </Link>
      </motion.div>
    </section>
  );
}
