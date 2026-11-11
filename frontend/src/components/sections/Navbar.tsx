"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAbout } from "../../lib/api";

const NAV_LINKS = [
  { name: "Home", id: "home", href: "/#home" },
  { name: "Work", id: "best-project", href: "/#best-project" },
  { name: "About", id: "about", href: "/#about" },
  { name: "Skills", id: "skills", href: "/#skills" },
  { name: "Experience", id: "experience", href: "/#experience" },
  { name: "Blog", id: "blog", href: "/#blog" },
  { name: "Contact", id: "contact", href: "/#contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      if (pathname !== "/") return;

      const scrollPos = window.scrollY + 180;
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_LINKS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(NAV_LINKS[i].id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    getAbout().then((data) => {
      if (data?.resume_url) {
        setResumeUrl(data.resume_url);
      }
    });
  }, []);

  const isLinkActive = (id: string) => {
    if (pathname?.startsWith("/projects") && id === "best-project") return true;
    if (pathname?.startsWith("/experience") && id === "experience") return true;
    if (pathname?.startsWith("/blog") && id === "blog") return true;
    return pathname === "/" && activeSection === id;
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 left-0 right-0 mx-auto w-[93%] md:w-[88%] max-w-5xl z-50 transition-all duration-500 rounded-full border ${
        scrolled || isOpen
          ? "bg-[#090814]/80 backdrop-blur-2xl border-primary/20 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8),0_0_24px_-8px_rgba(168,85,247,0.25)]"
          : "bg-[#090814]/40 backdrop-blur-xl border-white/[0.08]"
      }`}
    >
      <div className="px-4 md:px-6 py-2.5 flex justify-between items-center">
        {/* Brand */}
        <Link
          href="/#home"
          className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2.5 group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_rgba(168,85,247,0.9)] group-hover:scale-125 transition-transform" />
          <span className="text-white">Rohan</span>
          <span className="text-gradient-accent">Mane</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] px-1.5 py-1 rounded-full border border-white/[0.05]">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.id);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5 ${
                  active ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeNavPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-primary/20 border border-primary/35 shadow-[0_0_16px_rgba(168,85,247,0.25)] -z-10"
                  />
                )}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(236,72,153,0.9)]" />
                )}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right CTA + Mobile Button */}
        <div className="flex items-center gap-2">
          {resumeUrl && (
            <Link
              href={resumeUrl}
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full btn-primary"
            >
              <Download size={13} />
              <span>Resume</span>
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="md:hidden text-gray-300 hover:text-white focus:outline-none p-2 bg-white/[0.05] rounded-full border border-white/10 hover:border-primary/40 transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#090814]/95 backdrop-blur-2xl rounded-b-3xl border-t border-primary/15"
          >
            <div className="px-5 pt-4 pb-6 space-y-1.5 flex flex-col">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.id);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all font-medium text-sm ${
                      active
                        ? "bg-primary/15 text-white border border-primary/30"
                        : "text-gray-300 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>{link.name}</span>
                    {active && (
                      <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(236,72,153,0.9)]" />
                    )}
                  </Link>
                );
              })}
              {resumeUrl && (
                <Link
                  href={resumeUrl}
                  target="_blank"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 w-full text-center py-3.5 text-sm font-bold btn-primary rounded-2xl flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  <span>Download Resume</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
