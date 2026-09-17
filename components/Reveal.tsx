"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper. Fades/lifts a section in once it crosses the
 * viewport, using IntersectionObserver rather than a scroll listener.
 *
 * Reduced motion is handled in CSS (see .reveal in globals.css): the
 * @media query there simply removes the transform/opacity delta, so a
 * failed observer or JS-disabled visitor still sees full content — this
 * component only ever adds an "is-visible" class, never hides content by
 * default in markup.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  /** ms, staggers siblings without needing separate observers. */
  delay?: number;
  as?: "div" | "li" | "span";
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? ({ transitionDelay: `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
