import { COMPANY } from "@/lib/demo/data";

/*
 * The 911 notice, site-wide.
 *
 * This is the one piece of copy on the site where being missed could actually
 * hurt someone. A scheduled van is not an ambulance, and a family watching a
 * parent decline can land on a transportation page and start filling in a
 * booking form instead of dialling. So it appears on every page through the
 * footer, and again as a band directly under the homepage hero, where anyone
 * who arrived mid-panic meets it before the marketing copy.
 *
 * 911 is deliberately plain text rather than a tel: link. This notice is for
 * reading, not tapping, and a stray thumb on a footer that renders on all 39
 * pages is a misdial into a dispatch centre with real calls queued behind it.
 */

/** Warning triangle. Decorative: the sentence carries the meaning on its own. */
function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

/**
 * One definition of the sentence, rendered by both shapes below. Safety copy
 * that exists in two places is safety copy that will eventually disagree with
 * itself.
 *
 * Phrased as an instruction rather than a question: "Medical emergency?" reads
 * like marketing, and this is the register a clinician or a discharge planner
 * expects. It avoids "scheduled" as well, which undersold the same-day
 * discharge work, and says "non-emergency medical transportation" in full
 * because that is the industry term the reader is checking us against.
 */
function Message() {
  return (
    <>
      <strong>In a medical emergency, call 911.</strong> {COMPANY.name} provides non-emergency
      medical transportation only. We are not an ambulance service and cannot respond to
      emergency calls.
    </>
  );
}

export default function EmergencyNotice({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-3 rounded-xl bg-alert-tint px-5 py-4 text-base leading-relaxed text-alert ${className}`}
    >
      <AlertIcon />
      <span>
        <Message />
      </span>
    </p>
  );
}

/**
 * Full-width band for the homepage, where the notice needs to read as part of
 * the page rather than as a footnote inside a column.
 */
export function EmergencyNoticeBand() {
  return (
    <section aria-label="Emergency notice" className="border-b border-line bg-alert-tint">
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-4 text-base leading-relaxed text-alert">
        <AlertIcon />
        <p>
          <Message />
        </p>
      </div>
    </section>
  );
}
