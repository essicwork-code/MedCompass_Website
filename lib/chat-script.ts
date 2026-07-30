/*
 * Scripted assistant for the demo.
 *
 * Deliberately not an LLM call: the brief asked for a demo, and a scripted
 * responder is deterministic, costs nothing, and never invents a price or a
 * coverage claim the business would have to honour. The routing shell around it
 * (AI vs. live agent) is real, so swapping this for a model call later means
 * replacing `respond()` and nothing else.
 */

import { COMPANY } from "./demo/data";
import { SERVICES } from "./content";

export interface ScriptedReply {
  text: string;
  /** Quick-reply chips offered after this answer. */
  suggestions?: string[];
  /** Set when the question is better handled by a person. */
  escalate?: boolean;
}

interface Rule {
  match: RegExp;
  reply: () => ScriptedReply;
}

const RULES: Rule[] = [
  {
    match: /\b(price|cost|rate|quote|how much|expensive|fee|charge)\b/i,
    reply: () => ({
      text:
        "Rates are published up front, so there are no surprises at the curb:\n\n" +
        SERVICES.map((s) => `• ${s.name}: $${s.fromPrice} base + $${s.perMile.toFixed(2)}/mile`).join("\n") +
        "\n\nA typical 8-mile wheelchair trip runs about $81. Want an exact figure for your pickup and destination?",
      suggestions: ["Get an exact quote", "Do you take Medicaid?", "Talk to a person"],
    }),
  },
  {
    match: /\b(medicaid|medicare|insurance|broker|modivcare|mtm|covered|pay)\b/i,
    reply: () => ({
      text:
        "We bill Illinois Medicaid managed care plans and the major NEMT brokers directly, and we're in-network with several Medicare Advantage plans. We verify your eligibility before the trip rather than billing you after it.\n\nIf you have your member ID handy, a dispatcher can confirm coverage in a couple of minutes.",
      suggestions: ["Talk to a person", "Book a ride", "What areas do you cover?"],
      escalate: false,
    }),
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
    match: /\b(stretcher|gurney|bed|lying down|recline)\b/i,
    reply: () => ({
      text:
        "Stretcher transport comes with two trained attendants on every trip, a full-recline cot with rail restraints, and stair carries where building access allows. It's what we use most often for hospital-to-facility discharges.\n\nBase rate is $165 plus $5.50/mile.",
      suggestions: ["Book a stretcher trip", "Talk to a person"],
    }),
  },
  {
    match: /\b(bariatric|weight|heavy|750|large)\b/i,
    reply: () => ({
      text:
        "Our bariatric vans carry a lift and chair rated to 750 lb with reinforced securement. We schedule extra time so nobody feels rushed, and we confirm building access ahead of the trip rather than discovering a problem at the door.",
      suggestions: ["Book bariatric transport", "Talk to a person"],
    }),
  },
  {
    match: /\b(dialysis|standing order|recurring|three times|weekly)\b/i,
    reply: () => ({
      text:
        "Standing dialysis orders are our largest service line. We lock the same driver and the same van to your schedule wherever possible, so your rider sees a familiar face each session.\n\nWe're running 98.6% on-time arrival on standing orders. Give us about a week's notice to set one up.",
      suggestions: ["Set up a standing order", "Talk to a person"],
    }),
  },
  {
    match: /\b(track|tracking|where|link|gps|eta|arrive)\b/i,
    reply: () => ({
      text:
        "Every trip gets a live tracking link by text. It opens in any browser, with no app and no account, and you can forward it to family anywhere.\n\nIt shows the van's position, the ETA, and the driver's first name. It deliberately doesn't show the rider's name or where they're going, so forwarding it to a group chat doesn't leak anything private.",
      suggestions: ["See a live demo", "Book a ride"],
    }),
  },
  {
    match: /\b(area|cover|zip|city|suburb|far|wisconsin|chicago|distance)\b/i,
    reply: () => ({
      text:
        "We cover Chicago proper plus the western and northern suburbs, about 40 municipalities in all, with scheduled longer runs into southeastern Wisconsin.\n\nIf you're outside that, call dispatch. We quote out-of-area trips individually instead of turning them down.",
      suggestions: ["Check my address", "Talk to a person"],
    }),
  },
  {
    match: /\b(book|schedule|reserve|need a ride|pickup|appointment)\b/i,
    reply: () => ({
      text:
        "I can start that. Booking takes about a minute and you'll see the price before you confirm. No card is needed until the trip is locked in.\n\nFor routine appointments we ask for 24 hours' notice. Hospital discharges we handle same-day; we hold capacity specifically for those.",
      suggestions: ["Start booking", "It's a discharge today", "Talk to a person"],
    }),
  },
  {
    match: /\b(discharge|hospital|today|urgent|asap|now|emergency)\b/i,
    reply: () => ({
      text:
        "Same day discharges are a priority for us. Median pickup is 42 minutes from the call. A dispatcher should handle this directly rather than me.\n\nIf this is a medical emergency, please call 911. We're non-emergency transport only.",
      suggestions: ["Connect me to dispatch"],
      escalate: true,
    }),
  },
  {
    match: /\b(escort|family|come with|ride along|companion|caregiver)\b/i,
    reply: () => ({
      text:
        "One escort rides free on every service type. Just mention it when booking so we assign a van with the seat free.",
      suggestions: ["Book a ride", "What does it cost?"],
    }),
  },
  {
    match: /\b(cancel|change|reschedule|late|complaint|refund|problem|wrong)\b/i,
    reply: () => ({
      text: "Let me get you to a dispatcher. Changes and service issues should be handled by a person who can actually act on your booking.",
      suggestions: ["Connect me to dispatch"],
      escalate: true,
    }),
  },
  {
    match: /\b(human|person|agent|representative|someone|real|talk|speak|call)\b/i,
    reply: () => ({
      text: "Of course. Connecting you to a dispatcher now.",
      escalate: true,
    }),
  },
  {
    match: /\b(hours|open|when|24|night|weekend|sunday|saturday)\b/i,
    reply: () => ({
      text: `Dispatch is staffed 24/7. Scheduled rides run 4:00 AM to 11:00 PM daily, including weekends.\n\nYou can reach dispatch any time at ${COMPANY.phone}.`,
      suggestions: ["Book a ride", "Talk to a person"],
    }),
  },
];

const FALLBACK: ScriptedReply = {
  text:
    "I'm not certain I follow, and I'd rather hand you to a dispatcher than guess at something that affects a real trip.\n\nI can help with pricing, service types, coverage areas, insurance, and tracking. What would be most useful?",
  suggestions: ["Pricing", "Service areas", "Talk to a person"],
};

export function respond(input: string): ScriptedReply {
  for (const rule of RULES) {
    if (rule.match.test(input)) return rule.reply();
  }
  return FALLBACK;
}

export const GREETING: ScriptedReply = {
  text:
    "Hi. I can answer questions about rides, pricing, coverage and insurance. If you'd rather talk to a dispatcher, just say so and I'll connect you.",
  suggestions: ["What does a ride cost?", "Do you take Medicaid?", "Track my ride", "Talk to a person"],
};

/**
 * Whether a live dispatcher is free to take the chat.
 *
 * Real deployments would read this from the agent console. The demo models the
 * honest case: overnight the desk is on phones only, so the widget says so
 * rather than queueing someone into silence.
 */
export function agentAvailability(now = new Date()): { available: boolean; reason: string } {
  const hour = now.getHours();
  if (hour >= 7 && hour < 21) {
    return { available: true, reason: "Dispatchers are online now, usually replying within 2 minutes." };
  }
  return {
    available: false,
    reason: `Chat dispatchers are offline until 7:00 AM. Phones are staffed all night at ${COMPANY.phone}.`,
  };
}
