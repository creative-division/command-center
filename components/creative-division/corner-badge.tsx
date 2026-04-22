"use client";

import { useState } from "react";

export function CornerBadge() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://creativedivision.io"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full px-3 py-1.5 glass transition-all duration-300 no-underline"
      style={{
        filter: hovered ? "brightness(1.3)" : "brightness(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="transition-transform duration-700 ease-in-out"
        style={{
          transform: hovered ? "rotate(360deg)" : "rotate(0deg)",
          color: "var(--cyan)",
        }}
      >
        <rect
          x="2"
          y="2"
          width="10"
          height="10"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          transform="rotate(45 7 7)"
        />
      </svg>
      <span className="text-[11px] font-medium tracking-tight" style={{ color: "oklch(0.7 0 0)" }}>
        Powered by Creative Division
      </span>
    </a>
  );
}
