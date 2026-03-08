"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Linkedin, Youtube, Download } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { useEffect, useState } from "react";
import { getSiteConfig } from "@/lib/siteConfig";

export function Hero() {
  const [resumeUrl, setResumeUrl] = useState("/Rohan_Resume.pdf");

  useEffect(() => {
    async function loadConfig() {
      const config = await getSiteConfig();
      setResumeUrl(config.resumeUrl);
    }
    void loadConfig();
  }, []);

  return (
    <>
      <Navbar />
      <section
        id="home"
        className="relative min-h-screen overflow-hidden bg-[#05050A] px-4 pb-16 pt-28 sm:px-6 lg:px-10"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[100px]" />
          <div className="absolute -bottom-20 right-0 h-[460px] w-[460px] rounded-full bg-cyan-400/15 blur-[120px]" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 space-y-7 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
                System Online
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Build For the{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  Intelligent Future
                </span>
              </h1>
              <p className="max-w-2xl text-base text-gray-300 sm:text-lg">
                I&apos;m <span className="font-semibold text-white">Rohan Mane</span>,
                an AI Engineer and Full Stack Developer building practical
                systems with machine learning, modern web stacks, and open
                source tooling.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["AI Systems", "React.js", "FastAPI", "Linux"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="h-11 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-xs font-bold uppercase tracking-wider text-white"
              >
                <Link href="#project">View Projects</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-lg border-white/20 bg-transparent px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5"
              >
                <Link href="#contact">Contact</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-lg border-cyan-400/40 bg-cyan-400/10 px-6 text-xs font-bold uppercase tracking-wider text-cyan-200 hover:bg-cyan-400/20"
              >
                <a href={resumeUrl} target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/nyxus-git"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 transition-colors hover:text-cyan-300"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/nyxus-link/"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 transition-colors hover:text-cyan-300"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@nyxus-linux"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 transition-colors hover:text-cyan-300"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
          >
            <div className="relative w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/20 bg-black/40 p-2 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 blur-2xl" />
              <div
                className="relative aspect-[4/5] rounded-xl bg-cover bg-center"
                style={{ backgroundImage: "url('/profile.jpeg')" }}
              />
              <div className="absolute bottom-5 left-5 right-5 rounded-xl border-l-4 border-l-cyan-300 bg-black/60 p-3 backdrop-blur">
                <p className="text-[10px] uppercase tracking-widest text-cyan-300">
                  Current Status
                </p>
                <p className="text-sm font-semibold text-white">
                  Accepting New Projects
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
