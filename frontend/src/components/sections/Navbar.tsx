"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAbout } from "../../lib/api";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getAbout().then(data => {
      if (data?.resume_url) {
        setResumeUrl(data.resume_url);
      }
    });
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Work", href: "#best-project" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Blog", href: "#blog" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 left-0 right-0 mx-auto w-[92%] md:w-[85%] max-w-5xl z-50 transition-all duration-500 rounded-full border ${scrolled || isOpen ? "bg-black/40 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]" : "bg-transparent border-transparent"
        }`}
    >
      <div className="px-5 md:px-6 py-3 flex justify-between items-center">
        <Link href="#home" className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tighter hover:text-white transition-colors">
          Rohan <span className="text-primary text-glow-primary">Mane</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group"
            >
              {link.name}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ease-out duration-300" />
            </Link>
          ))}
          {resumeUrl && (
            <Link href={resumeUrl} target="_blank" className="ml-4 px-5 py-2.5 text-sm font-bold bg-white/10 text-white rounded-full border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all">
              Resume
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none p-2 bg-white/5 rounded-full border border-white/10 transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-black/60 backdrop-blur-2xl rounded-b-[2rem] border-t border-white/10"
          >
            <div className="px-6 pt-4 pb-8 space-y-2 flex flex-col items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-4 text-gray-300 hover:text-primary hover:bg-white/5 rounded-2xl transition-colors font-medium text-lg"
                >
                  {link.name}
                </Link>
              ))}
              {resumeUrl && (
                <Link href={resumeUrl} target="_blank" className="mt-6 w-full text-center py-4 font-bold bg-primary text-black rounded-2xl active:scale-95 transition-transform">
                  Download Resume
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}