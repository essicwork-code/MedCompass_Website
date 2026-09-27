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
  /*
   * Nothing is fetched until the video is nearly in view. A `poster` is
   * requested the moment it is set, and preload="metadata" is only a hint —
   * Chrome routinely buffers megabytes of the clip under it, which put the
   * whole 2.7MB file into the initial page load even though the video sits
   * roughly three viewports down. So the poster and the src both wait for the
   * observer below. Setting `src` on the element itself (not a <source>
   * child) makes the browser start loading as soon as it arrives, and the
   * 400px margin means that happens before the autoplay observer fires.
   * Space is reserved by width/height either way, so nothing shifts.
   */
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // Generous margin so the poster is decoded before it is actually on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
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
        poster={nearViewport ? asset(poster) : undefined}
        src={nearViewport ? asset(src) : undefined}
        width={width}
        height={height}
        className="h-auto w-full bg-black"
      >
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
