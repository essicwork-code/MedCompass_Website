"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "./Analytics";
import { COURIER_STAT_FEE, SERVICES } from "@/lib/content";
import { COMPANY } from "@/lib/demo/data";
import { nowForDateTimeInput } from "@/lib/datetime";
import { sendFormEmail } from "@/lib/emailjs";
import { RateLimitedError, useFormTimer } from "@/lib/spam";
import Honeypot from "./Honeypot";
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

/** The one field standing between the rider and a submitted request. */
type BookingField = "name" | "phone" | "email" | "service" | "pickup" | "dropoff" | "when";
type BookingFieldError = { field: BookingField; message: string } | null;

/*
 * The message sits with its field and carries an icon, because colour alone
 * does not carry meaning (WCAG 1.4.1) and a red border says "wrong" without
 * ever saying what to do about it.
 */
function FieldMessage({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[0.85rem] font-semibold text-alert">
      <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 16.5h.01" />
      </svg>
      {message}
    </p>
  );
}

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
  const [fieldError, setFieldError] = useState<BookingFieldError>(null);
  const timer = useFormTimer();

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
      timer.restart();
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
    // trip is only read at the moment the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, serviceSlug]);

  /*
   * showModal() makes the rest of the page inert but does not stop it
   * scrolling, so on a phone a swipe that starts outside the form still drags
   * the page behind the dialog and you close it somewhere else entirely.
   * The padding compensates for the scrollbar the lock removes on desktop,
   * which would otherwise shift the whole layout sideways.
   */
  useEffect(() => {
    if (!isOpen) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [isOpen]);

  // Escape and other native dismissals fire "close" on the dialog itself —
  // sync that back into the parent's isOpen state either way.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const invalid = (field: BookingField) => fieldError?.field === field;

  /** aria-invalid plus the link from control to message, for every field. */
  const fieldProps = (field: BookingField) =>
    invalid(field) ? { "aria-invalid": true as const, "aria-describedby": `bm-${field}-error` } : {};

  const fieldClass = (field: BookingField) =>
    `mt-1.5 w-full rounded-lg border-2 bg-white px-3.5 py-2.5 text-base focus:border-blue ${
      invalid(field) ? "border-alert" : "border-line"
    }`;

  const errorFor = (field: BookingField) =>
    invalid(field) ? <FieldMessage id={`bm-${field}-error`} message={fieldError!.message} /> : null;

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

  /*
   * Returns the field at fault, not just a sentence. WCAG 3.3.1 wants the
   * error tied to the control that caused it; knowing only that "something"
   * failed leaves a screen reader user hunting, and leaves everyone else
   * scrolling to the bottom of the form to find out what.
   */
  function validate(): BookingFieldError {
    if (!form.name.trim()) return { field: "name", message: "Enter your name." };
    if ((form.phone.match(PHONE_DIGITS_RE)?.length ?? 0) < 7)
      return { field: "phone", message: "Enter a phone number we can call back." };
    if (!EMAIL_RE.test(form.email.trim()))
      return { field: "email", message: "Enter a valid email address, like name@example.com." };
    if (!form.service) return { field: "service", message: "Choose a service type." };
    if (!form.pickup.trim()) return { field: "pickup", message: "Enter a pickup address." };
    if (!form.dropoff.trim()) return { field: "dropoff", message: "Enter a destination address." };
    if (!form.when) return { field: "when", message: "Choose a pickup date and time." };
    if (form.when < nowForDateTimeInput())
      return { field: "when", message: "Choose a pickup time that hasn't passed yet." };
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const problem = validate();
    if (problem) {
      setFieldError(problem);
      // Announcing the error is not enough if the person cannot find it.
      document.getElementById(`bm-${problem.field}`)?.focus();
      return;
    }
    setFieldError(null);
    setStatus("submitting");

    try {
      await sendFormEmail({
        subject: `Booking request: ${selectedService?.name ?? "transport"}`,
        formName: "booking request",
        fromName: form.name,
        replyTo: form.email,
        fields: bookingFields,
        guard: { honeypot: form.website, startedAt: timer.startedAt.current },
      });
      setStatus("success");
      // The event name only; the trip itself never leaves this page.
      track("Booking submitted");
    } catch (err) {
      // Covers EmailJS being unreachable, rejecting the send, its monthly
      // quota running out, or this browser's send limit. The error state keeps
      // the details and offers email and phone instead.
      setStatus("error");
      setErrorMessage(
        err instanceof RateLimitedError
          ? "You've sent several requests in the last few minutes, so we've paused online sending."
          : "We couldn't reach dispatch online right now.",
      );
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
              <p className="text-[0.82rem] font-bold uppercase tracking-widest text-lime-on-deep">
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
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
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
                className="mt-7 rounded-full bg-green-ink px-7 py-3 font-bold text-white hover:bg-green-ink-hover"
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
                className="mt-6 inline-flex min-h-11 items-center rounded-full bg-green-ink px-7 py-3 font-bold text-white hover:bg-green-ink-hover"
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
              <Honeypot id="booking-website" value={form.website} onChange={(v) => update("website", v)} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="bm-name" className="block text-[0.9rem] font-semibold text-deep">
                    Full name
                  </label>
                  <input
                    id="bm-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    {...fieldProps("name")}
                    className={fieldClass("name")}
                  />
                  {errorFor("name")}
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
                    {...fieldProps("phone")}
                    className={fieldClass("phone")}
                  />
                  {errorFor("phone")}
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
                    {...fieldProps("email")}
                    className={fieldClass("email")}
                  />
                  {errorFor("email")}
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
                    {...fieldProps("service")}
                    className={fieldClass("service")}
                  >
                    <option value="">Select a service…</option>
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errorFor("service")}
                  {selectedService && (
                    <p className="tabular mt-1.5 text-[0.85rem] text-slate-soft">
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
                    {...fieldProps("pickup")}
                    className={fieldClass("pickup")}
                  />
                  {errorFor("pickup")}
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
                    {...fieldProps("dropoff")}
                    className={fieldClass("dropoff")}
                  />
                  {errorFor("dropoff")}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bm-when" className="block text-[0.9rem] font-semibold text-deep">
                    Preferred pickup time
                  </label>
                  <input
                    id="bm-when"
                    type="datetime-local"
                    required
                    min={isOpen ? nowForDateTimeInput() : undefined}
                    value={form.when}
                    onChange={(e) => update("when", e.target.value)}
                    {...fieldProps("when")}
                    className={fieldClass("when")}
                  />
                  {errorFor("when")}
                </div>

                <label className="flex min-h-11 items-center gap-2.5 text-[0.95rem] text-ink">
                  <input
                    type="checkbox"
                    checked={form.roundTrip}
                    onChange={(e) => update("roundTrip", e.target.checked)}
                    className="h-5 w-5 rounded border-line"
                  />
                  Round trip
                </label>
                {isCourier ? (
                  <label className="flex min-h-11 items-center gap-2.5 text-[0.95rem] text-ink">
                    <input
                      type="checkbox"
                      checked={form.stat}
                      onChange={(e) => update("stat", e.target.checked)}
                      className="h-5 w-5 rounded border-line"
                    />
                    STAT, within 30 min (+${COURIER_STAT_FEE})
                  </label>
                ) : (
                  <label className="flex min-h-11 items-center gap-2.5 text-[0.95rem] text-ink">
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
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-white px-3.5 py-2.5 text-base focus:border-blue"
                  />
                  <p className="mt-1.5 text-[0.8rem] text-slate-soft">
                    {isCourier
                      ? "Use an order or specimen ID. Don’t include patient names or diagnoses."
                      : "Access and equipment notes only. Don’t include diagnoses here."}
                  </p>
                </div>
              </div>

              {/*
                The message also appears beside its field; this summary is what
                a screen reader announces on submit, so it stays.
              */}
              {fieldError && (
                <p role="alert" className="mt-4 rounded-lg bg-alert-tint px-3.5 py-2.5 text-[0.85rem] text-alert">
                  {fieldError.message}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="lift-on-hover mt-6 w-full rounded-full bg-green-ink px-6 py-3.5 font-bold text-white hover:bg-green-ink-hover disabled:cursor-wait disabled:opacity-70"
              >
                {status === "submitting" ? "Sending…" : isCourier ? "Request this pickup" : "Request this ride"}
              </button>
              <p className="mt-3 text-center text-[0.85rem] text-slate-soft">
                No card needed. Dispatch confirms price before the trip.
              </p>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
