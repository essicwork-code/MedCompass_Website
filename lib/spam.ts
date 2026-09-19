"use client";

import { useCallback, useEffect, useRef } from "react";

/*
 * Spam checks for the EmailJS forms.
 *
 * These stop the common browser-driven bots: a hidden honeypot field, a
 * minimum time between the form appearing and being sent, a cap on links, and
 * a per-browser send limit. A script that calls the EmailJS API directly skips
 * all of this, so the EmailJS dashboard settings (allowed domain, rate limit,
 * CAPTCHA) remain the real gate. See lib/emailjs.ts.
 */

/** A person can't fill out any of these forms faster than this. */
const MIN_FILL_MS = 3000;
/** More links than this in one message is almost always spam. */
const MAX_LINKS = 2;
/** Longer than any real field; also caps what gets relayed by email. */
const MAX_FIELD_CHARS = 3000;

const RATE_KEY = "mc-form-sends";
const RATE_MAX = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export interface SpamGuard {
  /** Value of the hidden honeypot field. Real visitors leave it empty. */
  honeypot: string;
  /** When the form was shown, from useFormTimer(). */
  startedAt: number;
}

/** Thrown when this browser has sent too many forms recently. */
export class RateLimitedError extends Error {
  constructor() {
    super("Too many messages sent from this browser. Please call dispatch.");
    this.name = "RateLimitedError";
  }
}

/**
 * True when the submission looks automated. The caller should act as if it
 * was sent, so a bot gets no signal about what gave it away.
 */
export function looksLikeSpam(guard: SpamGuard, values: (string | undefined)[]): boolean {
  if (guard.honeypot.trim()) return true;
  if (!guard.startedAt || Date.now() - guard.startedAt < MIN_FILL_MS) return true;
  if (values.some((v) => (v?.length ?? 0) > MAX_FIELD_CHARS)) return true;
  const links = values.join("\n").match(/https?:\/\/|www\./gi)?.length ?? 0;
  return links > MAX_LINKS;
}

function recentSends(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RATE_KEY) ?? "[]");
    const cutoff = Date.now() - RATE_WINDOW_MS;
    return Array.isArray(raw) ? raw.filter((t): t is number => typeof t === "number" && t > cutoff) : [];
  } catch {
    return [];
  }
}

export function isRateLimited(): boolean {
  return recentSends().length >= RATE_MAX;
}

export function recordSend(): void {
  try {
    localStorage.setItem(RATE_KEY, JSON.stringify([...recentSends(), Date.now()]));
  } catch {
    // Storage blocked (private mode etc.): skip the limit rather than the send.
  }
}

/**
 * Timestamp of when the form was shown. Call restart() when a form is
 * re-shown without remounting (e.g. a dialog reopening).
 */
export function useFormTimer() {
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const restart = useCallback(() => {
    startedAt.current = Date.now();
  }, []);
  return { startedAt, restart };
}
