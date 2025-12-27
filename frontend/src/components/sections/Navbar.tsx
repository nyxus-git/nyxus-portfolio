// frontend/src/components/sections/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Work", href: "#experience" },
    { name: "Projects", href: "#project" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-4 left-0 right-0 mx-auto w-[95%] md:w-[85%] max-w-5xl z-50 transition-all duration-300 rounded-full border border-white/10 ${scrolled || isOpen ? "bg-gray-900/60 backdrop-blur-md shadow-2xl" : "bg-transparent border-transparent"
        }`}
    >
      <div className="px-6 py-3 flex justify-between items-center">
        <Link href="#home" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400 tracking-tighter">
          ROHAN <span className="text-white">MANE</span>
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
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-lime-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
          <Link href="/Rohan_Resume.pdf" target="_blank" className="ml-4 px-5 py-2 text-sm font-bold bg-lime-400 text-black rounded-full hover:bg-lime-300 transition-colors shadow-[0_0_15px_rgba(163,230,53,0.5)] hover:shadow-[0_0_25px_rgba(163,230,53,0.7)]">
            Resume
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="md:hidden overflow-hidden bg-gray-900/95 backdrop-blur-xl rounded-b-3xl border-t border-white/5"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/Rohan_Resume.pdf" target="_blank" className="mt-4 w-full text-center py-3 font-bold bg-lime-400 text-black rounded-lg">
                Download Resume
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}