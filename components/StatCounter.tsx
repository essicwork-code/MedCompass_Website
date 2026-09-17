"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a stat value up from zero once it scrolls into view. Parses the
 * leading numeric run out of strings like "98.6%", "50,000+" or "42 min" and
 * counts that up, re-attaching the original prefix/suffix so the displayed
 * value is still exactly what was authored in lib/content.ts.
 */
export default function StatCounter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // The prerendered HTML carries the real figure, so crawlers and no-JS
  // visitors never read "0". It's zeroed only when there's a count to run.
  const [display, setDisplay] = useState<string>(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Already on screen: zeroing now would visibly flash the real value away.
    const alreadyVisible = node.getBoundingClientRect().top < window.innerHeight;
    if (reduceMotion || alreadyVisible) {
      setDisplay(value);
      return;
    }
    setDisplay(zeroed(value));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        animate(value, setDisplay);
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {display}
    </span>
  );
}

function parse(value: string) {
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  // A value like "24/7" isn't a quantity; counting it up reads as "0/7".
  if (!match || /\d/.test(match[3])) return null;
  const [, prefix, numStr, suffix] = match;
  return { prefix, num: parseFloat(numStr.replace(/,/g, "")), decimals: (numStr.split(".")[1] ?? "").length, suffix, raw: numStr };
}

function format(n: number, decimals: number, hasComma: boolean) {
  const fixed = n.toFixed(decimals);
  if (!hasComma) return fixed;
  const [int, dec] = fixed.split(".");
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec ? `${withCommas}.${dec}` : withCommas;
}

function zeroed(value: string) {
  const p = parse(value);
  if (!p) return value;
  return `${p.prefix}${format(0, p.decimals, p.raw.includes(","))}${p.suffix}`;
}

function animate(value: string, setDisplay: (v: string) => void) {
  const p = parse(value);
  if (!p) {
    setDisplay(value);
    return;
  }
  const hasComma = p.raw.includes(",");
  const duration = 1200;
  const start = performance.now();

  function tick(now: number) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = p!.num * eased;
    setDisplay(`${p!.prefix}${format(current, p!.decimals, hasComma)}${p!.suffix}`);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
