"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CHIP_ACTIONS, GREETING, respond, type ChatAction } from "@/lib/chat-script";
import { COMPANY } from "@/lib/demo/data";
import { sendFormEmail } from "@/lib/emailjs";
import { dispatchMailto } from "@/lib/mailto";
import { useFormTimer } from "@/lib/spam";
import Honeypot from "./Honeypot";
import { useBookingModal } from "./BookingModalProvider";
import { CompassMark } from "./Logo";

/*
 * Website chat.
 *
 * Scripted answers for the common questions (lib/chat-script.ts), and an
 * honest route to a person for everything else: a short form inside the chat
 * that emails dispatch through EmailJS, plus a one-tap call. There is no live
 * agent behind this, so the widget never pretends one has joined.
 */

type Author = "user" | "bot" | "system";

interface Message {
  id: number;
  author: Author;
  text: string;
  suggestions?: string[];
}

type ContactStatus = "closed" | "open" | "sending" | "failed";

/** Long enough to read as "typing", short enough not to feel like waiting. */
const TYPING_MS = 650;

export default function ChatWidget() {
  const router = useRouter();
  const { open: openBooking } = useBookingModal();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, author: "bot", text: GREETING.text, suggestions: GREETING.suggestions },
  ]);
  const [contact, setContact] = useState<ContactStatus>("closed");
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const contactTimer = useFormTimer();
  const [contactError, setContactError] = useState<string | null>(null);

  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const contactNameRef = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(false);

  // Keep the newest message in view without yanking the whole page.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, contact]);

  // Focus the input on open; hand focus back to the launcher on close.
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else if (wasOpen.current) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  // Escape closes, matching every other dismissible surface on the web.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (contact === "open") contactNameRef.current?.focus();
  }, [contact]);

  const push = (msg: Omit<Message, "id">) =>
    setMessages((m) => [...m, { ...msg, id: nextId.current++ }]);

  function botReply(msg: Omit<Message, "id" | "author">, then?: () => void) {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      push({ author: "bot", ...msg });
      then?.();
    }, TYPING_MS);
  }

  function openContact() {
    if (contact === "open" || contact === "sending") return;
    setContactError(null);
    contactTimer.restart();
    setContact("open");
  }

  function runAction(label: string, action: ChatAction) {
    switch (action.kind) {
      case "book":
        setOpen(false);
        openBooking(action.service ? { serviceSlug: action.service } : undefined);
        return;
      case "call":
        window.location.href = `tel:${COMPANY.phoneHref}`;
        return;
      case "link":
        setOpen(false);
        router.push(action.href);
        return;
      case "message":
        push({ author: "user", text: label });
        botReply(
          {
            text:
              label === "Set up a standing order"
                ? "Happy to set that up. Tell dispatch the days, times and addresses, and they'll call you to confirm the schedule."
                : "Sure. Leave your details and a dispatcher will get back to you by phone or email.",
          },
          openContact,
        );
        return;
    }
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const action = CHIP_ACTIONS[trimmed];
    if (action) {
      runAction(trimmed, action);
      setDraft("");
      return;
    }

    push({ author: "user", text: trimmed });
    setDraft("");

    const reply = respond(trimmed);
    botReply({ text: reply.text, suggestions: reply.suggestions }, reply.escalate ? openContact : undefined);
  }

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    const { name, phone, email, message } = contactForm;
    if (!name.trim()) return setContactError("Enter your name.");
    if ((phone.match(/\d/g)?.length ?? 0) < 7) return setContactError("Enter a phone number we can call back.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setContactError("Enter a valid email address.");
    setContactError(null);
    setContact("sending");

    // What the visitor typed in the chat gives dispatch the context.
    const asked = messages
      .filter((m) => m.author === "user")
      .map((m) => `- ${m.text}`)
      .join("\n");

    try {
      await sendFormEmail({
        subject: `Chat message from ${name.trim()}`,
        formName: "chat message",
        fromName: name,
        replyTo: email,
        fields: [
          ["Name", name],
          ["Phone", phone],
          ["Email", email],
          ["Message", message],
          ["Asked in chat", asked ? `\n${asked}` : undefined],
        ],
        guard: { honeypot, startedAt: contactTimer.startedAt.current },
      });
      setContact("closed");
      setContactForm({ name: "", phone: "", email: "", message: "" });
      push({ author: "system", text: "Message sent to dispatch" });
      botReply({
        text: `Thanks, ${name.trim().split(/\s+/)[0]}. Dispatch has your message and will call or email you back. We've also sent a confirmation to ${email.trim()}.\n\nFor anything happening today, calling is fastest.`,
        suggestions: ["Call dispatch", "Book a ride"],
      });
    } catch {
      setContact("failed");
    }
  }

  const updateContact = (key: keyof typeof contactForm, value: string) => {
    setContactForm((f) => ({ ...f, [key]: value }));
    setContactError(null);
  };

  return (
    <>
      {/*
        Launcher. 56px square clears the 44px minimum comfortably.
        bottom/right add the safe-area inset on top of the base offset so the
        button clears an iPhone home indicator or a landscape notch instead of
        sitting flush against it.
      */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        style={{
          bottom: "max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))",
          right: "max(1.25rem, calc(env(safe-area-inset-right) + 0.75rem))",
        }}
        className="fixed z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-deep text-white shadow-[0_10px_30px_-8px_rgb(16_34_46/0.6)] transition-transform hover:scale-105 hover:bg-[#0c3e60]"
      >
        <span className="sr-only">{open ? "Close chat" : "Open chat with MedCompass"}</span>
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div
          id="chat-panel"
          role="dialog"
          aria-label="Chat with MedCompass"
          style={{
            bottom: "max(6rem, calc(env(safe-area-inset-bottom) + 5.5rem))",
            right: "max(1.25rem, calc(env(safe-area-inset-right) + 0.75rem))",
          }}
          // dvh (dynamic viewport height) tracks the visible area as the mobile
          // browser's address bar collapses/expands, so the panel never
          // measures itself against a taller viewport than what's on screen.
          className="chat-panel-in fixed z-[60] flex h-[min(36rem,calc(100dvh-8rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_70px_-20px_rgb(16_34_46/0.5)]"
        >
          <header className="relative flex items-center gap-3 overflow-hidden bg-deep px-4 py-3 text-white">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 route-gradient opacity-20" />
            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white">
              <CompassMark size={26} className="h-5 w-auto" />
            </span>
            <div className="relative min-w-0 flex-1">
              <p className="truncate text-[0.95rem] font-bold">MedCompass</p>
              <p className="truncate text-[0.76rem] text-white/80">Instant answers · Dispatch 24/7 by phone</p>
            </div>
            <a
              href={`tel:${COMPANY.phoneHref}`}
              className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 hover:bg-white/25"
            >
              <span className="sr-only">Call dispatch at {COMPANY.phone}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </header>

          <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto bg-bone px-4 py-4" aria-live="polite">
            {messages.map((m) => {
              if (m.author === "system") {
                return (
                  <p
                    key={m.id}
                    className="chat-msg-in mx-auto flex w-fit items-center gap-1.5 rounded-full bg-moss px-3 py-1 text-[0.78rem] font-semibold text-moss-ink"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {m.text}
                  </p>
                );
              }
              const mine = m.author === "user";
              return (
                <div key={m.id} className={`chat-msg-in flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%]">
                    <div
                      className={`whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[0.92rem] leading-relaxed ${
                        mine
                          ? "rounded-br-sm bg-blue-ink text-white"
                          : "rounded-bl-sm border border-line bg-white text-ink shadow-[0_1px_2px_rgb(16_34_46/0.05)]"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.suggestions.map((s) => {
                          const action = CHIP_ACTIONS[s];
                          const strong = action && action.kind !== "link";
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => send(s)}
                              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors ${
                                strong
                                  ? "bg-deep text-white hover:bg-[#0c3e60]"
                                  : "border border-blue/40 bg-white text-blue-ink hover:bg-mist"
                              }`}
                            >
                              {action?.kind === "call" && (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                  <path
                                    d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
                                    stroke="currentColor"
                                    strokeWidth="2.4"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="chat-msg-in flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-3.5">
                  <span className="sr-only">Assistant is typing</span>
                  <span aria-hidden="true" className="chat-typing-dot h-2 w-2 rounded-full bg-slate-soft" />
                  <span aria-hidden="true" className="chat-typing-dot h-2 w-2 rounded-full bg-slate-soft" />
                  <span aria-hidden="true" className="chat-typing-dot h-2 w-2 rounded-full bg-slate-soft" />
                </div>
              </div>
            )}

            {(contact === "open" || contact === "sending") && (
              <form
                onSubmit={submitContact}
                noValidate
                className="chat-msg-in rounded-2xl border-2 border-green/40 bg-white p-4"
                aria-label="Message dispatch"
              >
                <Honeypot id="chat-website" value={honeypot} onChange={setHoneypot} />
                <p className="font-display text-[1rem] font-bold text-deep">Message dispatch</p>
                <p className="mt-0.5 text-[0.8rem] leading-relaxed text-slate-soft">
                  A dispatcher will call or email you back.
                </p>

                <div className="mt-3 space-y-2.5">
                  {(
                    [
                      ["name", "Your name", "text", "name"],
                      ["phone", "Phone", "tel", "tel"],
                      ["email", "Email", "email", "email"],
                    ] as const
                  ).map(([key, label, type, autoComplete]) => (
                    <div key={key}>
                      <label htmlFor={`chat-${key}`} className="block text-[0.8rem] font-semibold text-deep">
                        {label}
                      </label>
                      <input
                        ref={key === "name" ? contactNameRef : undefined}
                        id={`chat-${key}`}
                        type={type}
                        autoComplete={autoComplete}
                        value={contactForm[key]}
                        onChange={(e) => updateContact(key, e.target.value)}
                        className="mt-1 w-full rounded-lg border-2 border-line px-3 py-2 text-base focus:border-blue"
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="chat-message" className="block text-[0.8rem] font-semibold text-deep">
                      How can we help? <span className="font-normal text-slate-soft">(optional)</span>
                    </label>
                    <textarea
                      id="chat-message"
                      rows={2}
                      value={contactForm.message}
                      onChange={(e) => updateContact("message", e.target.value)}
                      placeholder="Trip date, pickup area, questions…"
                      className="mt-1 w-full rounded-lg border-2 border-line px-3 py-2 text-base focus:border-blue"
                    />
                    <p className="mt-1 text-[0.72rem] text-slate-soft">No diagnoses or medical records, please.</p>
                  </div>
                </div>

                {contactError && (
                  <p role="alert" className="mt-3 rounded-lg bg-alert-tint px-3 py-2 text-[0.8rem] text-alert">
                    {contactError}
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    type="submit"
                    disabled={contact === "sending"}
                    className="min-h-11 flex-1 rounded-full bg-green px-4 font-bold text-white hover:bg-[#4d8f28] disabled:cursor-wait disabled:opacity-70"
                  >
                    {contact === "sending" ? "Sending…" : "Send to dispatch"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setContact("closed")}
                    disabled={contact === "sending"}
                    className="min-h-11 rounded-full border-2 border-line px-4 text-[0.85rem] font-semibold text-slate-soft hover:border-deep hover:text-deep"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {contact === "failed" && (
              <div role="alert" className="chat-msg-in rounded-2xl border-2 border-alert/30 bg-white p-4">
                <p className="font-display text-[1rem] font-bold text-deep">Couldn&rsquo;t send that online</p>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-slate-soft">
                  Your details are still here. Email them in one tap, or call dispatch.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={dispatchMailto(`Chat message from ${contactForm.name.trim()}`, [
                      ["Name", contactForm.name],
                      ["Phone", contactForm.phone],
                      ["Email", contactForm.email],
                      ["Message", contactForm.message],
                    ])}
                    className="inline-flex min-h-11 items-center rounded-full bg-green px-4 text-[0.85rem] font-bold text-white hover:bg-[#4d8f28]"
                  >
                    Email it instead
                  </a>
                  <a
                    href={`tel:${COMPANY.phoneHref}`}
                    className="inline-flex min-h-11 items-center rounded-full border-2 border-line px-4 text-[0.85rem] font-semibold text-deep hover:border-deep"
                  >
                    Call {COMPANY.phone}
                  </a>
                  <button
                    type="button"
                    onClick={() => setContact("open")}
                    className="inline-flex min-h-11 items-center px-2 text-[0.85rem] font-semibold text-blue-ink hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex items-center gap-2 border-t border-line bg-white px-3 py-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              Type your question
            </label>
            <input
              ref={inputRef}
              id="chat-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about rides, pricing, coverage…"
              autoComplete="off"
              enterKeyHint="send"
              className="min-w-0 flex-1 rounded-full border border-line px-4 py-2.5 text-base placeholder:text-slate-soft focus:border-blue"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green text-white transition-opacity disabled:opacity-40"
            >
              <span className="sr-only">Send question</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>

          <p className="border-t border-line bg-white px-4 pb-3 pt-2 text-[0.72rem] leading-relaxed text-slate-soft">
            Automated assistant. Please don&rsquo;t share medical details here. Emergency? Call 911.
          </p>
        </div>
      )}
    </>
  );
}
