"use client";

import { useEffect, useRef } from "react";

export function MouseBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf: number;
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;

    function onMove(e: MouseEvent) {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    }

    function animate() {
      currentX += (targetX - currentX) * 0.03;
      currentY += (targetY - currentY) * 0.03;
      el!.style.background = `
        radial-gradient(ellipse 600px 400px at ${currentX}% ${currentY}%, oklch(0.18 0.04 270 / 60%) 0%, transparent 70%),
        radial-gradient(ellipse 800px 600px at ${100 - currentX * 0.5}% ${100 - currentY * 0.5}%, oklch(0.12 0.03 250 / 40%) 0%, transparent 70%),
        linear-gradient(135deg, oklch(0.07 0.02 270) 0%, oklch(0.04 0.01 250) 50%, oklch(0.06 0.015 280) 100%)
      `;
      raf = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", onMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 -z-10"
      style={{
        background: "linear-gradient(135deg, oklch(0.07 0.02 270) 0%, oklch(0.04 0.01 250) 50%, oklch(0.06 0.015 280) 100%)",
      }}
    />
  );
}
