/*
 * Cloudflare Worker entry point.
 *
 * This is a "static assets with a Worker" deployment, not OpenNext/SSR: the
 * site itself is still the prerendered `out/` export (see wrangler.jsonc and
 * next.config.ts's `output: "export"`). The Worker's only job is to catch
 * `POST /api/book` for the booking-modal email flow and otherwise get out of
 * the way, handing every other request straight to the static asset binding
 * so all existing behaviour (routing, the custom 404 page, etc.) is
 * unchanged.
 *
 * Intentionally typed by hand rather than pulling in `@cloudflare/workers-
 * types`: this project's tsconfig applies the `dom` lib to the whole repo
 * (needed for the Next.js app), and `dom` already declares global
 * `Request`/`Response`/`fetch` — adding workers-types' ambient Worker globals
 * on top of that risks colliding declarations for the same names. Since this
 * file only needs a handful of Worker-specific shapes (`Env`, a minimal
 * `ExecutionContext`), declaring them locally avoids that entirely.
 */

import { SERVICES } from "../lib/content";
import { COMPANY } from "../lib/demo/data";

interface Env {
  /** Static-assets binding declared in wrangler.jsonc (`assets.binding`). */
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Set as a Cloudflare secret; absent locally until `wrangler secret put` / `.dev.vars`. */
  RESEND_API_KEY?: string;
  /** Optional override; falls back to Resend's sandbox sender below. */
  RESEND_FROM_EMAIL?: string;
}

/** Only the piece of the real ExecutionContext this file touches. */
interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));

// Resend's shared sandbox sender. It works with no domain verification, but
// it can only deliver to the Resend account owner's own verified email —
// broad delivery to arbitrary riders' inboxes requires verifying a real
// sending domain in the Resend dashboard and pointing RESEND_FROM_EMAIL at it.
const DEFAULT_FROM = "Ride MedCompass <onboarding@resend.dev>";

const MAX_BODY_BYTES = 20_000;

interface BookingPayload {
  name: string;
  phone: string;
  email: string;
  service: string;
  pickup: string;
  dropoff: string;
  when: string;
  roundTrip?: boolean;
  escort?: boolean;
  /** Courier only: STAT dispatch. */
  stat?: boolean;
  notes?: string;
  /** Honeypot. Real riders never see or fill this field. */
  website?: string;
}

const REQUIRED_FIELDS: (keyof BookingPayload)[] = [
  "name",
  "phone",
  "email",
  "service",
  "pickup",
  "dropoff",
  "when",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(
  env: Env,
  message: { to: string; subject: string; html: string; text: string },
): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    console.error("Resend request failed", err);
    return { ok: false, status: 0 };
  }
}

function dispatchEmail(payload: BookingPayload) {
  const service = SERVICES.find((s) => s.slug === payload.service);
  const serviceName = service?.name ?? payload.service;

  const rows: [string, string][] = [
    ["Name", payload.name],
    ["Phone", payload.phone],
    ["Email", payload.email],
    ["Service", serviceName],
    ["Pickup", payload.pickup],
    ["Dropoff", payload.dropoff],
    ["Pickup time", payload.when],
    ["Round trip", payload.roundTrip ? "Yes" : "No"],
    payload.service === "courier"
      ? ["STAT", payload.stat === true ? "Yes, dispatch within 30 min" : "No, routine"]
      : ["Escort", payload.escort ? "Yes (one, free)" : "No"],
    ["Notes", payload.notes?.trim() || "None"],
  ];

  const text = [
    `New booking request via ridemedcompass.com`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");

  const html = `
    <div style="font-family:sans-serif;max-width:560px">
      <h2 style="color:#0f4c75;margin-bottom:4px">New booking request</h2>
      <p style="color:#5a7183;margin-top:0">Submitted from the site's booking modal.</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:6px 12px 6px 0;font-weight:bold;color:#10222e;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>
            <td style="padding:6px 0;color:#10222e">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;

  return {
    to: COMPANY.email,
    subject: `New booking: ${serviceName} for ${payload.name}`,
    text,
    html,
  };
}

function confirmationEmail(payload: BookingPayload) {
  const service = SERVICES.find((s) => s.slug === payload.service);
  const serviceName = service?.name ?? payload.service;

  const text = [
    `Hi ${payload.name},`,
    "",
    `We got your request for ${serviceName.toLowerCase()} and dispatch is on it. Someone will call you at ${payload.phone} shortly to confirm your exact pickup window and price.`,
    "",
    `Trip details you sent us:`,
    `Pickup: ${payload.pickup}`,
    `Drop-off: ${payload.dropoff}`,
    `Requested time: ${payload.when}`,
    "",
    `Need to reach us sooner? Call dispatch at ${COMPANY.phone}, staffed 24/7.`,
    "",
    `Ride MedCompass`,
  ].join("\n");

  const html = `
    <div style="font-family:sans-serif;max-width:560px;color:#10222e">
      <div style="background:#0f4c75;padding:20px 24px;border-radius:12px 12px 0 0">
        <p style="color:#8dc63f;font-weight:bold;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;margin:0">Ride MedCompass</p>
        <h2 style="color:#fff;margin:6px 0 0">We&rsquo;ve got your request</h2>
      </div>
      <div style="border:1px solid #d9e5ee;border-top:none;padding:24px;border-radius:0 0 12px 12px">
        <p>Hi ${escapeHtml(payload.name)},</p>
        <p>
          We got your request for <strong>${escapeHtml(serviceName.toLowerCase())}</strong> and
          dispatch is on it. Someone will call you at <strong>${escapeHtml(payload.phone)}</strong>
          shortly to confirm your exact pickup window and price. You won&rsquo;t need a card
          until the trip is locked in.
        </p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0">
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;white-space:nowrap">Pickup</td><td style="padding:4px 0">${escapeHtml(payload.pickup)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;white-space:nowrap">Drop-off</td><td style="padding:4px 0">${escapeHtml(payload.dropoff)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;white-space:nowrap">Requested time</td><td style="padding:4px 0">${escapeHtml(payload.when)}</td></tr>
        </table>
        <p>
          Need to reach us sooner? Dispatch is staffed 24/7 at
          <a href="tel:${COMPANY.phoneHref}" style="color:#146a9f;font-weight:bold">${COMPANY.phone}</a>.
        </p>
        <p style="color:#5a7183;font-size:0.9em;margin-top:24px">Ride MedCompass</p>
      </div>
    </div>
  `;

  return {
    to: payload.email,
    subject: "Ride MedCompass: we got your booking request",
    text,
    html,
  };
}

async function handleBooking(request: Request, env: Env): Promise<Response> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse({ ok: false, error: "Expected a JSON request body." }, 400);
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: "Request body too large." }, 413);
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return jsonResponse({ ok: false, error: "Could not read request body." }, 400);
  }
  if (raw.length > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: "Request body too large." }, 413);
  }

  let body: Partial<BookingPayload>;
  try {
    body = JSON.parse(raw) as Partial<BookingPayload>;
  } catch {
    return jsonResponse({ ok: false, error: "Request body was not valid JSON." }, 400);
  }
  if (!body || typeof body !== "object") {
    return jsonResponse({ ok: false, error: "Request body was not valid JSON." }, 400);
  }

  // Spam trap: a hidden field real riders never see or fill. If it has a
  // value, a bot filled every input on the form. Pretend success and send
  // nothing, so the bot doesn't learn to look for a different signal.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return jsonResponse({ ok: true }, 200);
  }

  for (const field of REQUIRED_FIELDS) {
    const value = body[field];
    if (typeof value !== "string" || value.trim() === "") {
      return jsonResponse({ ok: false, error: `Missing required field: ${field}.` }, 400);
    }
  }

  const payload = body as BookingPayload;

  if (!EMAIL_RE.test(payload.email.trim())) {
    return jsonResponse({ ok: false, error: "That email address doesn't look valid." }, 400);
  }
  if (!SERVICE_SLUGS.has(payload.service)) {
    return jsonResponse({ ok: false, error: "Unrecognized service type." }, 400);
  }
  if (payload.notes && payload.notes.length > 2000) {
    return jsonResponse({ ok: false, error: "Notes are too long." }, 400);
  }

  if (!env.RESEND_API_KEY) {
    // Expected until the real key is added as a Cloudflare secret.
    return jsonResponse({ ok: false, error: "Email service not configured yet." }, 500);
  }

  const dispatchResult = await sendEmail(env, dispatchEmail(payload));
  if (!dispatchResult.ok) {
    // The dispatch notification is the one that actually matters — if it
    // failed, the trip request didn't really land anywhere, so tell the
    // rider honestly rather than promising a callback nobody will make.
    console.error("Failed to send dispatch notification email", dispatchResult.status);
    return jsonResponse(
      { ok: false, error: "Couldn't send your request right now. Please call dispatch instead." },
      502,
    );
  }

  const confirmationResult = await sendEmail(env, confirmationEmail(payload));
  if (!confirmationResult.ok) {
    // Dispatch already has the trip; a missing confirmation email is a
    // cosmetic miss, not a failed booking, so don't tell the rider it failed.
    console.error("Dispatch notified, but confirmation email failed", confirmationResult.status);
    return jsonResponse({ ok: true, warning: "confirmation_email_failed" }, 200);
  }

  return jsonResponse({ ok: true }, 200);
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/book") {
      return handleBooking(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
