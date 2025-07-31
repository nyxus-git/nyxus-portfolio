// frontend/src/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Removed Download icon

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Certifications", href: "#certifications" },
    { name: "Education", href: "#education" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false); // Close mobile menu on link click
  };

  return (
    <nav className="fixed w-full top-0 left-0 bg-gray-900/80 backdrop-filter backdrop-blur-lg z-50 shadow-lg border-b border-lime-400/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand/Logo */}
        <Link href="#home" className="text-xl md:text-2xl font-extrabold text-lime-400 uppercase tracking-wider hover:text-lime-300 transition-colors">
          ROHAN MANE
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-lime-400 transition-colors font-medium text-lg"
              onClick={handleLinkClick}
            >
              {link.name}
            </Link>
          ))}
          {/* Resume button is removed from here */}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-lime-400 focus:outline-none focus:text-lime-400"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-900/90 backdrop-filter backdrop-blur-lg ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3 flex flex-col items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-gray-300 hover:text-lime-400 px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-center"
              onClick={handleLinkClick}
            >
              {link.name}
            </Link>
          ))}
          {/* Resume button is removed from here */}
        </div>
      </div>
    </nav>
  );
}