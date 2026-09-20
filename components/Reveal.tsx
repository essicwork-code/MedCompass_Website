/**
 * Scroll reveal wrapper.
 *
 * Pure CSS: the fade-up is driven by a scroll-driven `view()` timeline (see
 * `.reveal` in globals.css), not JavaScript. This used to be a client
 * component running an IntersectionObserver, which meant the content was
 * hidden by default and only revealed once a script ran — so a failed
 * observer risked leaving a section permanently invisible.
 *
 * Now nothing is ever hidden by default. A browser without scroll-driven
 * animation support, or a visitor who prefers reduced motion, lands on the
 * same result: the fully visible content, with no animation. That also makes
 * this a server component — no "use client", no hydration cost.
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
  /**
   * Authored in ms by the previous implementation, where siblings were
   * staggered with a transition-delay. A scroll-driven animation has no
   * clock to delay against — the cascade is instead a shift in where each
   * item's scroll range begins — so the value is reduced to a step index.
   * Kept in ms so the call sites reading `i * 80` still make sense.
   */
  delay?: number;
  as?: "div" | "li" | "span";
  id?: string;
}) {
  // Capped so a long list can't push the last item's range past the point
  // where it would still be mid-animation when it reaches the viewport.
  const step = delay ? Math.min(Math.round(delay / 70), 6) : 0;

  return (
    <Tag
      id={id}
      className={`reveal ${className}`}
      style={step ? ({ "--reveal-i": step } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
