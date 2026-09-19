"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

/*
 * Plays a short clip while it is on screen and pauses it when it isn't.
 *
 * Browsers only allow autoplay when the video is muted, so it starts muted
 * with a visible button to turn the sound on. Native controls stay available,
 * and someone who asked their system for reduced motion gets a still poster
 * with controls instead of anything moving on its own.
 */
export default function AutoplayVideo({
  src,
  poster,
  width,
  height,
  label,
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // A blocked autoplay rejects the promise; there is nothing to fix,
          // the controls are right there.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div className="relative">
      <video
        ref={ref}
        controls
        loop
        muted={muted}
        playsInline
        preload="metadata"
        poster={asset(poster)}
        width={width}
        height={height}
        className="h-auto w-full bg-black"
      >
        <source src={asset(src)} type="video/mp4" />
        {label}
      </video>

      <button
        type="button"
        onClick={() => {
          const video = ref.current;
          if (!video) return;
          const next = !muted;
          setMuted(next);
          video.muted = next;
          if (!next) video.play().catch(() => {});
        }}
        className="absolute right-3 top-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-deep/80 px-4 text-[0.85rem] font-bold text-white backdrop-blur hover:bg-deep"
      >
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4zM17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4zM17 8a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {muted ? "Sound on" : "Sound off"}
      </button>
    </div>
  );
}
