"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
}

const NODE_COUNT = 52;
const CONNECTION_DISTANCE = 165;
const MOUSE_REPEL_DISTANCE = 130;
const MOUSE_REPEL_STRENGTH = 0.42;

// Electric violet primary & hot magenta accent
const PRIMARY = { r: 168, g: 85, b: 247 };
const ACCENT = { r: 236, g: 72, b: 153 };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function NeuralNetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const nodesRef = useRef<Node[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const initNodes = () => {
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        radius: Math.random() * 2 + 1.4,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      }));
    };

    const handleResize = () => {
      resize();
      initNodes();
    };

    resize();
    initNodes();
    window.addEventListener("resize", handleResize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      for (const node of nodes) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_REPEL_DISTANCE && dist > 0) {
          const force = (MOUSE_REPEL_DISTANCE - dist) / MOUSE_REPEL_DISTANCE;
          node.vx += (dx / dist) * force * MOUSE_REPEL_STRENGTH;
          node.vy += (dy / dist) * force * MOUSE_REPEL_STRENGTH;
        }

        node.vx *= 0.97;
        node.vy *= 0.97;

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = canvas.width;
        if (node.x > canvas.width) node.x = 0;
        if (node.y < 0) node.y = canvas.height;
        if (node.y > canvas.height) node.y = 0;

        node.pulsePhase += node.pulseSpeed;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.38;
            const t = (a.x + b.x) / 2 / Math.max(canvas.width, 1);
            const r = lerp(PRIMARY.r, ACCENT.r, t);
            const g = lerp(PRIMARY.g, ACCENT.g, t);
            const bC = lerp(PRIMARY.b, ACCENT.b, t);

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(bC)},${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const t = node.x / Math.max(canvas.width, 1);
        const r = lerp(PRIMARY.r, ACCENT.r, t);
        const g = lerp(PRIMARY.g, ACCENT.g, t);
        const bC = lerp(PRIMARY.b, ACCENT.b, t);
        const alpha = 0.45 + pulse * 0.55;
        const radius = node.radius + pulse * 1.4;

        const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 4.2);
        grd.addColorStop(0, `rgba(${Math.round(r)},${Math.round(g)},${Math.round(bC)},${alpha * 0.65})`);
        grd.addColorStop(1, `rgba(${Math.round(r)},${Math.round(g)},${Math.round(bC)},0)`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 4.2, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(bC)},${alpha})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto opacity-65"
      aria-hidden="true"
    />
  );
}
