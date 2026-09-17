"use client";

import { useEffect, useRef, useState } from "react";
import { COURIER_STAT_FEE, SERVICES } from "@/lib/content";
import { COMPANY } from "@/lib/demo/data";
import { sendFormEmail } from "@/lib/emailjs";
import { dispatchMailto } from "@/lib/mailto";
import type { BookingModalPrefill } from "./BookingModalProvider";

/*
 * Fast-path booking form, opened from every "Book a ride" / "Get a quote"
 * CTA site-wide instead of navigating to the full self-serve quote wizard at
 * /book (left untouched — it's still reachable by direct URL). This is
 * lead capture, not a quote engine: free-text pickup/dropoff, no geocoding.
 *
 * Built on the native <dialog> element on purpose: showModal() gives real
 * focus-trapping, Escape-to-close, and exclusion from the tab order while
 * closed for free, matching the accessibility floor the rest of the site
 * holds itself to (app/globals.css §3) without reimplementing a focus trap
 * by hand. Motion follows the same convention as .reveal in globals.css —
 * transform/opacity only, and the blanket `prefers-reduced-motion: reduce`
 * rule at the bottom of that file already neutralizes every animation here.
 */

type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  phone: string;
  email: string;
  service: string;
  pickup: string;
  dropoff: string;
  when: string;
  roundTrip: boolean;
  escort: boolean;
  /** Courier only: dispatch within 30 minutes for the published rush fee. */
  stat: boolean;
  notes: string;
  /** Honeypot — must stay empty. Bots that fill every input trip it. */
  website: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  service: "",
  pickup: "",
  dropoff: "",
  when: "",
  roundTrip: false,
  escort: false,
  stat: false,
  notes: "",
  website: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_RE = /\d/g;

export default function BookingModal({
  isOpen,
  onClose,
  serviceSlug,
  trip,
}: {
  isOpen: boolean;
  onClose: () => void;
  serviceSlug?: string;
  trip?: BookingModalPrefill["trip"];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  // Open/close the native dialog in response to the isOpen prop, and reset
  // to a clean form (with any service prefill) each time it's opened.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      setForm({ ...EMPTY_FORM, ...trip, service: serviceSlug ?? "" });
      setStatus("idle");
      setErrorMessage("");
      setFieldError(null);
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
    // trip is only read at the moment the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, serviceSlug]);

  // Escape and other native dismissals fire "close" on the dialog itself —
  // sync that back into the parent's isOpen state either way.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    // A validation message is stale as soon as the rider starts fixing it.
    setFieldError(null);
  }

  const selectedService = SERVICES.find((s) => s.slug === form.service);
  const isCourier = form.service === "courier";
  // Only the option that applies: couriers carry no escort, rides have no STAT.
  const bookingFields: [string, string | undefined][] = [
    ["Name", form.name],
    ["Phone", form.phone],
    ["Email", form.email],
    ["Service", selectedService?.name],
    ["Pickup", form.pickup],
    ["Destination", form.dropoff],
    ["Pickup time", form.when],
    ["Round trip", form.roundTrip ? "Yes" : "No"],
    isCourier
      ? ["STAT", form.stat ? `Yes, within 30 min (+$${COURIER_STAT_FEE})` : "No, routine"]
      : ["Escort", form.escort ? "Yes (one, free)" : "No"],
    ["Notes", form.notes],
  ];

  function validate(): string | null {
    if (!form.name.trim()) return "Enter your name.";
    if ((form.phone.match(PHONE_DIGITS_RE)?.length ?? 0) < 7) return "Enter a phone number we can call back.";
    if (!EMAIL_RE.test(form.email.trim())) return "Enter a valid email address.";
    if (!form.service) return "Choose a service type.";
    if (!form.pickup.trim()) return "Enter a pickup address.";
    if (!form.dropoff.trim()) return "Enter a destination address.";
    if (!form.when) return "Choose a pickup date and time.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const problem = validate();
    if (problem) {
      setFieldError(problem);
      return;
    }
    setFieldError(null);

    // Honeypot filled: a bot. Show success and send nothing.
    if (form.website.trim()) {
      setStatus("success");
      return;
    }
    setStatus("submitting");

    try {
      await sendFormEmail({
        subject: `Booking request: ${selectedService?.name ?? "transport"}`,
        formName: "booking request",
        fromName: form.name,
        replyTo: form.email,
        fields: bookingFields,
      });
      setStatus("success");
    } catch {
      // Covers EmailJS being unreachable, rejecting the send, or its monthly
      // quota running out. The error state keeps the details and offers email
      // and phone instead.
      setStatus("error");
      setErrorMessage("We couldn't reach dispatch online right now.");
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  }


  return (
    <dialog
      ref={dialogRef}
      className="booking-dialog"
      aria-labelledby="booking-modal-title"
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <div className="flex max-h-[calc(100dvh-3rem)] flex-col bg-white">
        {/* ---- Header ---- */}
        <div className="relative shrink-0 overflow-hidden bg-deep px-6 py-5 sm:px-7 sm:py-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 route-gradient opacity-20"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.78rem] font-bold uppercase tracking-widest text-lime">
                {COMPANY.name}
              </p>
              <h2
                id="booking-modal-title"
                className="mt-1 font-display text-[1.5rem] font-extrabold leading-tight text-white sm:text-[1.7rem]"
              >
                {status === "success" ? "Request received" : isCourier ? "Book a courier pickup" : "Book a ride"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="shrink-0 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <span className="sr-only">Close</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {status !== "success" && (
            <p className="relative mt-2 max-w-sm text-[0.92rem] text-white/75">
              Tell us the trip. Dispatch calls you back to confirm the price and pickup window.
            </p>
          )}
        </div>

        {/* ---- Body ---- */}
        <div className="overflow-y-auto px-6 py-6 sm:px-7">
          {status === "success" ? (
            <div className="flex flex-col items-center py-4 text-center">
              <svg
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
                aria-hidden="true"
                className="booking-check"
              >
                <circle
                  className="booking-check-circle"
                  cx="36"
                  cy="36"
                  r="33"
                  fill="var(--color-moss)"
                  stroke="var(--color-green)"
                  strokeWidth="3"
                />
                <path
                  d="M22 37l10 10 18-20"
                  stroke="var(--color-green)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-5 text-[1.05rem] leading-relaxed text-ink">
                Thanks{form.name.trim() ? `, ${form.name.trim().split(/\s+/)[0]}` : ""}. Dispatch has
                your trip and will call <span className="font-semibold text-deep">{form.phone}</span>{" "}
                shortly to confirm your price and pickup window.
              </p>
              <p className="mt-3 text-[0.9rem] text-slate-soft">
                Need it sooner? Call dispatch at{" "}
                <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-blue-ink hover:underline">
                  {COMPANY.phone}
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="mt-7 rounded-full bg-green px-7 py-3 font-bold text-white hover:bg-[#4d8f28]"
              >
                Done
              </button>
            </div>
          ) : status === "error" ? (
            <div className="flex flex-col items-center py-4 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-alert-tint text-alert">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 8v5M12 16.5h.01M10.29 3.86l-8.2 14.2A1.5 1.5 0 0 0 3.36 20.5h17.28a1.5 1.5 0 0 0 1.27-2.44l-8.2-14.2a1.5 1.5 0 0 0-2.6 0z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="mt-5 text-[1.05rem] font-semibold text-deep">Couldn&rsquo;t send that online</p>
              <p className="mt-2 max-w-sm text-[0.95rem] leading-relaxed text-slate-soft">{errorMessage}</p>
              <p className="mt-4 max-w-sm text-[0.95rem] text-ink">
                Your details are still here. Email them to dispatch in one tap, or call{" "}
                <a href={`tel:${COMPANY.phoneHref}`} className="font-bold text-blue-ink hover:underline">
                  {COMPANY.phone}
                </a>{" "}
                and we&rsquo;ll book it right now.
              </p>
              <a
                href={dispatchMailto(`Booking request: ${selectedService?.name ?? "transport"}`, bookingFields)}
                className="mt-6 inline-flex min-h-11 items-center rounded-full bg-green px-7 py-3 font-bold text-white hover:bg-[#4d8f28]"
              >
                Email this request
              </a>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-3 rounded-full border-2 border-line px-6 py-2.5 font-bold text-slate-soft hover:border-deep hover:text-deep"
              >
                Try again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot — hidden from sighted and AT users, visible to bots that fill every field. */}
              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="booking-website">Leave this field blank</label>
                <input
                  id="booking-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="bm-name" className="block text-[0.9rem] font-semibold text-deep">
                    Full name
                  </label>
                  <input
                    id="bm-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-white px-3.5 py-2.5 text-[0.95rem] focus:border-blue"
                  />
                </div>

                <div>
                  <label htmlFor="bm-phone" className="block text-[0.9rem] font-semibold text-deep">
                    Phone
                  </label>
                  <input
                    id="bm-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-white px-3.5 py-2.5 text-[0.95rem] focus:border-blue"
                  />
                </div>

                <div>
                  <label htmlFor="bm-email" className="block text-[0.9rem] font-semibold text-deep">
                    Email
                  </label>
                  <input
                    id="bm-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-white px-3.5 py-2.5 text-[0.95rem] focus:border-blue"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bm-service" className="block text-[0.9rem] font-semibold text-deep">
                    Service type
                  </label>
                  <select
                    id="bm-service"
                    required
                    value={form.service}
                    onChange={(e) => update("service", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-white px-3.5 py-2.5 text-[0.95rem] focus:border-blue"
                  >
                    <option value="">Select a service…</option>
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {selectedService && (
                    <p className="tabular mt-1.5 text-[0.82rem] text-slate-soft">
                      From ${selectedService.fromPrice} + ${selectedService.perMile.toFixed(2)}/mi
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="bm-pickup" className="block text-[0.9rem] font-semibold text-deep">
                    Pickup address
                  </label>
                  <input
                    id="bm-pickup"
                    type="text"
                    required
                    placeholder="Street address, city"
                    value={form.pickup}
                    onChange={(e) => update("pickup", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-white px-3.5 py-2.5 text-[0.95rem] focus:border-blue"
                  />
                </div>

                <div>
                  <label htmlFor="bm-dropoff" className="block text-[0.9rem] font-semibold text-deep">
                    Destination
                  </label>
                  <input
                    id="bm-dropoff"
                    type="text"
                    required
                    placeholder="Street address, city"
                    value={form.dropoff}
                    onChange={(e) => update("dropoff", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-white px-3.5 py-2.5 text-[0.95rem] focus:border-blue"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bm-when" className="block text-[0.9rem] font-semibold text-deep">
                    Preferred pickup time
                  </label>
                  <input
                    id="bm-when"
                    type="datetime-local"
                    required
                    value={form.when}
                    onChange={(e) => update("when", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-white px-3.5 py-2.5 text-[0.95rem] focus:border-blue"
                  />
                </div>

                <label className="flex items-center gap-2.5 text-[0.92rem] text-ink">
                  <input
                    type="checkbox"
                    checked={form.roundTrip}
                    onChange={(e) => update("roundTrip", e.target.checked)}
                    className="h-5 w-5 rounded border-line"
                  />
                  Round trip
                </label>
                {isCourier ? (
                  <label className="flex items-center gap-2.5 text-[0.92rem] text-ink">
                    <input
                      type="checkbox"
                      checked={form.stat}
                      onChange={(e) => update("stat", e.target.checked)}
                      className="h-5 w-5 rounded border-line"
                    />
                    STAT, within 30 min (+${COURIER_STAT_FEE})
                  </label>
                ) : (
                  <label className="flex items-center gap-2.5 text-[0.92rem] text-ink">
                    <input
                      type="checkbox"
                      checked={form.escort}
                      onChange={(e) => update("escort", e.target.checked)}
                      className="h-5 w-5 rounded border-line"
                    />
                    One escort riding along (free)
                  </label>
                )}

                <div className="sm:col-span-2">
                  <label htmlFor="bm-notes" className="block text-[0.9rem] font-semibold text-deep">
                    {isCourier ? "Handling notes" : "Anything the driver should know?"}
                  </label>
                  <textarea
                    id="bm-notes"
                    rows={3}
                    placeholder={
                      isCourier
                        ? "Refrigerated tote, loading dock entrance, who signs at drop-off…"
                        : "Stairs at the entrance, oxygen tank, preferred door…"
                    }
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-white px-3.5 py-2.5 text-[0.95rem] focus:border-blue"
                  />
                  <p className="mt-1.5 text-[0.8rem] text-slate-soft">
                    {isCourier
                      ? "Use an order or specimen ID. Don’t include patient names or diagnoses."
                      : "Access and equipment notes only. Don’t include diagnoses here."}
                  </p>
                </div>
              </div>

              {fieldError && (
                <p role="alert" className="mt-4 rounded-lg bg-alert-tint px-3.5 py-2.5 text-[0.85rem] text-alert">
                  {fieldError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="lift-on-hover mt-6 w-full rounded-full bg-green px-6 py-3.5 font-bold text-white hover:bg-[#4d8f28] disabled:cursor-wait disabled:opacity-70"
              >
                {status === "submitting" ? "Sending…" : isCourier ? "Request this pickup" : "Request this ride"}
              </button>
              <p className="mt-3 text-center text-[0.82rem] text-slate-soft">
                No card needed. Dispatch confirms price before the trip.
              </p>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
