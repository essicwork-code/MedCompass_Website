/*
 * Form email via EmailJS.
 *
 * GitHub Pages has no server, so the browser sends form submissions through
 * EmailJS, which delivers them with the connected Outlook account. The
 * "Contact Us" template (template_9v3h7rr) goes to the dispatch inbox, and
 * its linked Auto-Reply template confirms receipt to {{reply_to}}.
 *
 * These IDs are public by design: EmailJS expects them in client code, and
 * abuse is limited by the allowed-domain list in the EmailJS dashboard. The
 * private key never belongs here. Env vars override the defaults.
 *
 * If sending fails (or the key is blanked out), forms fall back to opening the
 * visitor's email app (lib/mailto.ts) and show the dispatch phone number.
 *
 * Every send passes the spam checks in lib/spam.ts first. The dashboard side
 * matters more, since a script can call EmailJS without this page: keep the
 * allowed-domain list to ridemedcompass.com and turn on rate limiting and
 * CAPTCHA under Account > Security.
 */

import { RateLimitedError, isRateLimited, looksLikeSpam, recordSend, type SpamGuard } from "./spam";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_9v7ommo";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_9v3h7rr";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "KwpUVWgfKBWURmWmM";

export const emailConfigured = PUBLIC_KEY !== "";

export interface FormEmail {
  /** Email subject line, e.g. "Booking request: Wheelchair transport". */
  subject: string;
  /** Reads in the email as "New {form_name}", e.g. "booking request". */
  formName: string;
  fromName: string;
  /** The visitor's address; replies and the auto-reply go here. */
  replyTo: string;
  fields: [label: string, value: string | undefined][];
  guard: SpamGuard;
}

/**
 * Resolves on success, and also when the submission looks like spam (it is
 * dropped silently). Throws RateLimitedError after too many recent sends from
 * this browser, or a plain Error if EmailJS isn't configured or rejects it.
 */
export async function sendFormEmail(email: FormEmail): Promise<void> {
  if (looksLikeSpam(email.guard, [email.subject, email.fromName, email.replyTo, ...email.fields.map(([, v]) => v)])) {
    return;
  }
  if (isRateLimited()) throw new RateLimitedError();
  if (!emailConfigured) throw new Error("Email sending is not configured.");

  const details = email.fields
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value!.trim()}`)
    .join("\n");

  // Loaded on submit so the SDK stays out of every page's initial bundle.
  const { default: emailjs } = await import("@emailjs/browser");
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      subject: email.subject,
      form_name: email.formName,
      from_name: email.fromName.trim(),
      reply_to: email.replyTo.trim(),
      details,
    },
    { publicKey: PUBLIC_KEY },
  );
  recordSend();
}
