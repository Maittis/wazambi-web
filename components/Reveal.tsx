"use client";

import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none" | "scale";
  initial?: boolean;
};

// Static passthrough wrapper. Scroll-triggered motion has been removed:
// internal pages render instantly for a fast, stable, readable site.
// `initial` plays one short fade-up on mount (used only on the homepage hero).
export default function Reveal({ children, className = "", initial = false }: RevealProps) {
  return <div className={initial ? `${className} animate-fadeUp` : className}>{children}</div>;
}