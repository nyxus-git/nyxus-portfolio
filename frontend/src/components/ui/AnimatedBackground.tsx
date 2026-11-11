"use client";

import React from "react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-[#04040a] pointer-events-none">
      {/* Subtle radial depth gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,237,0.14),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_90%,rgba(236,72,153,0.08),transparent_70%)]" />

      {/* Subtle architectural grid */}
      <div className="absolute inset-0 bg-grid-white opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_85%)]" />

      {/* Animated aurora orbs */}
      <div className="absolute -top-24 left-[12%] w-[460px] h-[460px] bg-violet-600/15 rounded-full blur-[130px] animate-aurora" />
      <div className="absolute top-[30%] right-[8%] w-[420px] h-[420px] bg-fuchsia-600/12 rounded-full blur-[130px] animate-aurora animation-delay-2000" />
      <div className="absolute bottom-[5%] left-[30%] w-[500px] h-[500px] bg-indigo-600/12 rounded-full blur-[140px] animate-aurora animation-delay-4000" />
    </div>
  );
}
