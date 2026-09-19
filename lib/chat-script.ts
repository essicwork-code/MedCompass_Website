/*
 * Scripted website chat assistant.
 *
 * Deliberately not an LLM call: a scripted responder is deterministic, costs
 * nothing, and never invents a price or a coverage claim the business would
 * have to honour. Anything it can't answer goes to a real person, either by
 * phone or as a message emailed to dispatch (see ChatWidget).
 */

import { COMPANY } from "./demo/data";
import { COURIER_STAT_FEE, SERVICES, type ServiceSlug } from "./content";

export interface ScriptedReply {
  text: string;
  /** Quick-reply chips offered after this answer. */
  suggestions?: string[];
  /** Set when the question is better handled by a person: the widget offers the message form. */
  escalate?: boolean;
}

/**
 * Quick-reply chips that do something instead of sending their label as a
 * question. Any chip not listed here is sent as text.
 */
export type ChatAction =
  | { kind: "book"; service?: ServiceSlug }
  | { kind: "message" }
  | { kind: "call" }
  | { kind: "link"; href: string };

export const CHIP_ACTIONS: Record<string, ChatAction> = {
  "Book a ride": { kind: "book" },
  "Start booking": { kind: "book" },
  "Get an exact quote": { kind: "book" },
  "Book a wheelchair ride": { kind: "book", service: "wheelchair" },
  "Book a stretcher trip": { kind: "book", service: "stretcher" },
  "Book bariatric transport": { kind: "book", service: "bariatric" },
  "Book a courier pickup": { kind: "book", service: "courier" },
  "Message dispatch": { kind: "message" },
  "Set up a standing order": { kind: "message" },
  "Call dispatch": { kind: "call" },
  "Check my address": { kind: "link", href: "/service-area/" },
};

interface Rule {
  match: RegExp;
  reply: () => ScriptedReply;
}

const RULES: Rule[] = [
  {
    match: /\b(pric(e|es|ing)|costs?|rates?|quotes?|how much|expensive|fees?|charges?)\b/i,
    reply: () => ({
      text:
        "Rates are published up front, so there are no surprises at the curb:\n\n" +
        SERVICES.map((s) => `• ${s.name}: $${s.fromPrice} base + $${s.perMile.toFixed(2)}/mile`).join("\n") +
        `\n\nA typical 8-mile wheelchair trip runs about $${(SERVICES.find((s) => s.slug === "wheelchair")!.fromPrice + 8 * SERVICES.find((s) => s.slug === "wheelchair")!.perMile).toFixed(0)}. Want an exact figure for your pickup and destination?`,
      suggestions: ["Get an exact quote", "Do you take Medicaid?", "Message dispatch"],
    }),
  },
  {
    match: /\b(medicaid|medicare|insurance|broker|modivcare|mtm|covered|pay)\b/i,
    reply: () => ({
      text:
        "We bill Illinois Medicaid managed care plans and the major NEMT brokers directly. We verify your eligibility before the trip rather than billing you after it.\n\nIf you have your member ID handy, a dispatcher can confirm coverage in a couple of minutes.",
      suggestions: ["Message dispatch", "Book a ride", "What areas do you cover?"],
    }),
  },
  {
    match: /\b(courier|specimens?|labs?|pharmacy|prescriptions?|records|deliver(y|ies)?|packages?|stat)\b/i,
    reply: () => {
      const courier = SERVICES.find((s) => s.slug === "courier")!;
      return {
        text:
          `Our medical courier runs are dispatched direct, never shared with other stops: lab specimens, records, pharmacy orders and equipment between facilities. Every handoff is signed on a chain-of-custody log, and we carry ambient, refrigerated and frozen totes.\n\nRates are $${courier.fromPrice} base plus $${courier.perMile.toFixed(2)}/mile. STAT pickups dispatch within 30 minutes for a $${COURIER_STAT_FEE} rush fee, and facility accounts can sign a Business Associate Agreement.`,
        suggestions: ["Book a courier pickup", "Set up a standing order", "Message dispatch"],
      };
    },
  },
  {
    match: /\b(wheelchair|chair|power chair|lift|ramp)\b/i,
    reply: () => ({
      text:
        "Our wheelchair vans use a hydraulic lift rated to 800 lb, so there's no transferring out of your chair and no folding it into a trunk. Every chair gets four-point securement plus a separate lap-and-shoulder belt for the rider.\n\nDoor-through-door assistance is standard, and one escort rides free.",
      suggestions: ["Book a wheelchair ride", "What does it cost?", "Do you handle stairs?"],
    }),
  },
  {
    match: /\b(stretcher|gurney|bed|lying down|recline|stairs?)\b/i,
    reply: () => ({
      text:
        `Stretcher transport comes with two trained attendants on every trip, a full-recline cot with rail restraints, and stair carries where building access allows. It's what we use most often for hospital-to-facility discharges.\n\nBase rate is $${SERVICES.find((s) => s.slug === "stretcher")!.fromPrice} plus $${SERVICES.find((s) => s.slug === "stretcher")!.perMile.toFixed(2)}/mile.`,
      suggestions: ["Book a stretcher trip", "Message dispatch"],
    }),
  },
  {
    match: /\b(bariatric|weight|heavy|750|large)\b/i,
    reply: () => ({
      text:
        "Our bariatric vans carry a lift and chair rated to 750 lb with reinforced securement. We schedule extra time so nobody feels rushed, and we confirm building access ahead of the trip rather than discovering a problem at the door.",
      suggestions: ["Book bariatric transport", "Message dispatch"],
    }),
  },
  {
    match: /\b(dialysis|standing order|recurring|three times|weekly)\b/i,
    reply: () => ({
      text:
        "Standing dialysis orders are a core service line. We lock the same driver and the same van to your schedule wherever possible, so your rider sees a familiar face each session.\n\nGive us about a week's notice to set one up.",
      suggestions: ["Set up a standing order", "Book a ride"],
    }),
  },
  {
    match: /\b(where|eta|arrive)\b/i,
    reply: () => ({
      text:
        "You'll get a text confirming the driver and van assigned to your pickup, and the driver calls when they're a few minutes out. If a pickup is running early or late, dispatch will call the contact on file directly.",
      suggestions: ["Book a ride", "Call dispatch"],
    }),
  },
  {
    match: /\b(areas?|cover(age)?|zip|city|suburbs?|far|wisconsin|chicago|distance|address)\b/i,
    reply: () => ({
      text:
        "We cover Chicago proper plus the western and northern suburbs, about 40 municipalities in all, with scheduled longer runs into southeastern Wisconsin.\n\nIf you're outside that, call dispatch. We quote out-of-area trips individually instead of turning them down.",
      suggestions: ["Check my address", "Message dispatch"],
    }),
  },
  {
    match: /\b(book(ing)?|schedule|reserve|need a ride|pickup|appointment)\b/i,
    reply: () => ({
      text:
        "I can start that. Booking takes about a minute and you'll see the price before you confirm. No card is needed until the trip is locked in.\n\nFor routine appointments we ask for 24 hours' notice. Hospital discharges we handle same-day; we hold capacity specifically for those.",
      suggestions: ["Start booking", "It's a discharge today", "Message dispatch"],
    }),
  },
  {
    match: /\b(discharge|hospital|today|urgent|asap|now|emergency)\b/i,
    reply: () => ({
      text:
        `Same-day discharges are a priority, and the fastest way to get one moving is a phone call: dispatch is staffed 24/7 at ${COMPANY.phone}.\n\nIf this is a medical emergency, please call 911. We're non-emergency transport only.`,
      suggestions: ["Call dispatch", "Message dispatch"],
    }),
  },
  {
    match: /\b(escort|family|come with|ride along|companion|caregiver)\b/i,
    reply: () => ({
      text:
        "One escort rides free on every patient ride. Just mention it when booking so we assign a van with the seat free.",
      suggestions: ["Book a ride", "What does it cost?"],
    }),
  },
  {
    match: /\b(cancel|change|reschedule|late|complaint|refund|problem|wrong)\b/i,
    reply: () => ({
      text: `Changes and service issues need a person who can act on your booking. For a trip today, call ${COMPANY.phone}. Otherwise, leave a message below and dispatch will get back to you.`,
      suggestions: ["Call dispatch"],
      escalate: true,
    }),
  },
  {
    match: /\b(human|person|agent|representative|someone|real|talk|speak|call)\b/i,
    reply: () => ({
      text: "Of course. Leave your details below and a dispatcher will get back to you by phone or email.",
      suggestions: ["Call dispatch"],
      escalate: true,
    }),
  },
  {
    match: /\b(hours|open|when|24|night|weekend|sunday|saturday)\b/i,
    reply: () => ({
      text: `Dispatch is staffed 24/7. Scheduled rides run 4:00 AM to 11:00 PM daily, including weekends.\n\nYou can reach dispatch any time at ${COMPANY.phone}.`,
      suggestions: ["Book a ride", "Call dispatch"],
    }),
  },
];

const FALLBACK: ScriptedReply = {
  text:
    "I'm not certain I follow, and I'd rather pass this to a dispatcher than guess at something that affects a real trip.\n\nI can help with pricing, service types, coverage areas and insurance, or you can message dispatch directly.",
  suggestions: ["Pricing", "Service areas", "Message dispatch"],
};

export function respond(input: string): ScriptedReply {
  for (const rule of RULES) {
    if (rule.match.test(input)) return rule.reply();
  }
  return FALLBACK;
}

export const GREETING: ScriptedReply = {
  text:
    "Hi! I'm the Ride MedCompass assistant. Ask me about rides, medical courier pickups, pricing, coverage or insurance, or send a message straight to dispatch.",
  suggestions: ["What does a ride cost?", "Do you take Medicaid?", "Book a ride", "Message dispatch"],
};
