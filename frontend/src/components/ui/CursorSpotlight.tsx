"use client";

import { useEffect, useRef } from "react";

/**
 * CursorSpotlight — a soft radial violet/magenta glow that follows the cursor.
 * Renders as a fixed overlay (pointer-events: none) so it doesn't block interactions.
 * Hidden on touch devices.
 */
export function CursorSpotlight() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      posRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    const animate = () => {
      if (overlayRef.current) {
        overlayRef.current.style.setProperty("--x", `${posRef.current.x}px`);
        overlayRef.current.style.setProperty("--y", `${posRef.current.y}px`);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-30 hidden md:block"
      style={{
        background: `radial-gradient(
          620px circle at var(--x, -9999px) var(--y, -9999px),
          rgba(168, 85, 247, 0.075),
          rgba(236, 72, 153, 0.03) 35%,
          transparent 68%
        )`,
      }}
    />
  );
}
