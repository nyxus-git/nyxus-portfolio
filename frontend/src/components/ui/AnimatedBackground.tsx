"use client";

import React from "react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-[#101622] pointer-events-none">
      {/* Soft gradient base */}
      <div className="absolute inset-0 bg-gradient-radial from-[#182033] to-[#0b1020] opacity-90" />

      {/* Animated glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-56 h-56 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-56 h-56 sm:w-96 sm:h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-56 h-56 sm:w-96 sm:h-96 bg-indigo-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Overlay Mesh/Noise if needed (can add texture later) */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
    </div>
  );
}
