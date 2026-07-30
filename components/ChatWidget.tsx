"use client";

import { useEffect, useRef, useState } from "react";
import { agentAvailability, GREETING, respond } from "@/lib/chat-script";
import { COMPANY } from "@/lib/demo/data";

type Author = "user" | "ai" | "agent" | "system";

interface Message {
  id: number;
  author: Author;
  text: string;
  suggestions?: string[];
}

/** Named dispatcher so a handoff feels like a person, not a queue position. */
const AGENT = { name: "Yolanda", initials: "YR", role: "Dispatch supervisor" };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"ai" | "agent">("ai");
  const [connecting, setConnecting] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, author: "ai", text: GREETING.text, suggestions: GREETING.suggestions },
  ]);

  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const availability = agentAvailability();

  // Keep the newest message in view without yanking the whole page.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, connecting]);

  // Escape closes, matching every other dismissible surface on the web.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const push = (msg: Omit<Message, "id">) =>
    setMessages((m) => [...m, { ...msg, id: nextId.current++ }]);

  function handoff() {
    if (mode === "agent" || connecting) return;

    if (!availability.available) {
      push({ author: "system", text: availability.reason });
      return;
    }

    setConnecting(true);
    push({ author: "system", text: "Connecting you to a dispatcher…" });

    // Simulated queue wait. A real build would open a websocket to the console.
    window.setTimeout(() => {
      setConnecting(false);
      setMode("agent");
      push({
        author: "agent",
        text: `Hi, this is ${AGENT.name} on the dispatch desk. I've got your chat in front of me. What do you need?`,
      });
    }, 1600);
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    push({ author: "user", text: trimmed });
    setDraft("");

    if (mode === "agent") {
      // Stand-in for a real dispatcher on the other end.
      window.setTimeout(
        () =>
          push({
            author: "agent",
            text: "Got it. Let me pull that up, one moment.",
          }),
        1100,
      );
      return;
    }

    const reply = respond(trimmed);
    window.setTimeout(() => {
      if (reply.escalate) {
        push({ author: "ai", text: reply.text });
        handoff();
      } else {
        push({ author: "ai", text: reply.text, suggestions: reply.suggestions });
      }
    }, 550);
  }

  return (
    <>
      {/* Launcher. 56px square clears the 44px minimum comfortably. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-deep text-white shadow-[0_10px_30px_-8px_rgb(16_34_46/0.6)] transition-transform hover:scale-105"
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
        {!open && availability.available && (
          <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-lime" />
        )}
      </button>

      {open && (
        <div
          id="chat-panel"
          ref={panelRef}
          role="dialog"
          aria-label="Chat with MedCompass"
          className="fixed bottom-24 right-5 z-[60] flex h-[min(34rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_70px_-20px_rgb(16_34_46/0.5)]"
        >
          <header className="flex items-center gap-3 border-b border-line bg-deep px-4 py-3 text-white">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-[0.8rem] font-bold">
              {mode === "agent" ? AGENT.initials : "MC"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.92rem] font-bold">
                {mode === "agent" ? AGENT.name : "MedCompass assistant"}
              </p>
              <p className="truncate text-[0.76rem] text-white/70">
                {mode === "agent"
                  ? AGENT.role
                  : availability.available
                    ? "Automated · dispatcher available"
                    : "Automated · dispatchers offline"}
              </p>
            </div>
            {mode === "ai" && (
              <button
                type="button"
                onClick={handoff}
                disabled={connecting}
                className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-[0.78rem] font-semibold hover:bg-white/25 disabled:opacity-50"
              >
                {connecting ? "Connecting…" : "Get a person"}
              </button>
            )}
          </header>

          <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto bg-bone px-4 py-4" aria-live="polite">
            {messages.map((m) => {
              if (m.author === "system") {
                return (
                  <p key={m.id} className="text-center text-[0.8rem] italic text-slate-soft">
                    {m.text}
                  </p>
                );
              }
              const mine = m.author === "user";
              return (
                <div key={m.id} className={mine ? "flex justify-end" : "flex justify-start"}>
                  <div className="max-w-[85%]">
                    <div
                      className={`whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[0.92rem] leading-relaxed ${
                        mine
                          ? "rounded-br-sm bg-blue text-white"
                          : "rounded-bl-sm border border-line bg-white text-ink"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => send(s)}
                            className="rounded-full border border-blue/40 bg-white px-3 py-1.5 text-[0.8rem] font-medium text-blue hover:bg-mist"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {connecting && (
              <p className="text-center text-[0.8rem] text-slate-soft">
                <span className="inline-block animate-pulse">Dispatcher joining…</span>
              </p>
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
              Type your message
            </label>
            <input
              id="chat-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about rides, pricing, coverage…"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-full border border-line px-4 py-2.5 text-[0.92rem] outline-none placeholder:text-slate-soft/70 focus:border-blue"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green text-white disabled:opacity-40"
            >
              <span className="sr-only">Send message</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>

          <p className="border-t border-line bg-white px-4 pb-3 pt-2 text-[0.72rem] leading-relaxed text-slate-soft">
            Demo assistant. Please don&rsquo;t share medical details here. Call {COMPANY.phone} for
            anything involving a patient record.
          </p>
        </div>
      )}
    </>
  );
}
