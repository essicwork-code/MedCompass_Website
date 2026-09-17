/*
 * Marketing copy and service definitions.
 *
 * Written to be specific rather than reassuring — the competitor sites lean on
 * "compassionate, caring, reliable" and say nothing checkable. Numbers here are
 * illustrative for the demo, but they are the *kind* of claim a real operator
 * can substantiate.
 */

export type ServiceSlug = "wheelchair" | "ambulatory" | "stretcher" | "bariatric" | "courier";

/** Published rush fee for courier pickups dispatched within 30 minutes. */
export const COURIER_STAT_FEE = 25;

export interface Service {
  slug: ServiceSlug;
  name: string;
  short: string;
  description: string;
  /** What the rider actually gets, in plain terms. */
  includes: string[];
  fromPrice: number;
  perMile: number;
  icon: "wheelchair" | "walk" | "stretcher" | "bariatric" | "courier";
}

export const SERVICES: Service[] = [
  {
    slug: "wheelchair",
    name: "Wheelchair transport",
    short: "Hydraulic lift, four-point securement, door-through-door.",
    description:
      "Our wheelchair vans carry manual and power chairs up to 800 lb combined on a hydraulic lift. No transferring out of your chair, no lifting, and nobody folding it into a trunk. Every chair is secured at four points, and the rider gets their own lap and shoulder belt.",
    includes: [
      "Hydraulic lift rated to 800 lb",
      "Four-point wheelchair securement",
      "Door-through-door assistance",
      "Up to one escort rides free",
    ],
    fromPrice: 68,
    perMile: 3.85,
    icon: "wheelchair",
  },
  {
    slug: "ambulatory",
    name: "Ambulatory transport",
    short: "For riders who can walk and transfer with a steadying arm.",
    description:
      "For riders who can walk short distances and transfer into a seat, with or without a cane or walker. The driver meets you at your door, walks you to the van, and hands you off at the clinic desk rather than the curb.",
    includes: [
      "Driver escort from door to vehicle",
      "Walker and cane stowed and returned",
      "Hand-off at the reception desk",
      "Up to one escort rides free",
    ],
    fromPrice: 42,
    perMile: 2.75,
    icon: "walk",
  },
  {
    slug: "stretcher",
    name: "Stretcher transport",
    short: "Two attendants, full recline, for discharges and transfers.",
    description:
      "For riders who cannot sit upright for the length of the trip. Two trained attendants handle every stretcher move, including stair carries where the building allows it. Common for hospital-to-facility discharges and inter-facility transfers.",
    includes: [
      "Two attendants on every trip",
      "Full-recline cot with rail restraints",
      "Stair carry where access permits",
      "Oxygen tank securement",
    ],
    fromPrice: 325,
    perMile: 6.5,
    icon: "stretcher",
  },
  {
    slug: "bariatric",
    name: "Bariatric transport",
    short: "Equipment rated to 750 lb, booked with the room it needs.",
    description:
      "Riders over standard equipment limits get a van built for it, with a wider lift, reinforced securement, and a bariatric chair rated to 750 lb. We schedule extra time so nobody feels rushed, and we confirm building access before the day of the trip rather than finding out at the door.",
    includes: [
      "Lift and chair rated to 750 lb",
      "Reinforced securement points",
      "Extended appointment window",
      "Access confirmed in advance",
    ],
    fromPrice: 175,
    perMile: 6.0,
    icon: "bariatric",
  },
  {
    slug: "courier",
    name: "Medical courier",
    short: "Specimens, records and pharmacy runs, direct and chain-of-custody logged.",
    description:
      "Direct, single-stop dispatch for lab specimens, medical records, pharmaceuticals and equipment moving between facilities. No shared routes and no waiting behind other stops. Routine runs are scheduled same day; STAT pickups dispatch within 30 minutes for a $25 rush fee. Every driver is OSHA bloodborne-pathogen trained, and a signed Business Associate Agreement is available for any account handling PHI.",
    includes: [
      "Chain-of-custody log, signed at every pickup and drop-off",
      "HIPAA Business Associate Agreement available for facility accounts",
      "Ambient, refrigerated and frozen totes, plus dry ice on request",
      "STAT dispatch within 30 minutes, or scheduled routine runs",
      "Dispatch staffed 24/7, including weekends and holidays",
    ],
    fromPrice: 32,
    perMile: 2.0,
    icon: "courier",
  },
];

export const SERVICE_BY_SLUG = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));

export interface Segment {
  id: string;
  name: string;
  pain: string;
  answer: string;
  proof: string;
}

export const SEGMENTS: Segment[] = [
  {
    id: "families",
    name: "Patients & families",
    pain: "You put your mother in a van and then hear nothing for an hour.",
    answer:
      "Every Ride MedCompass trip gets a confirmed pickup window and a driver who calls when they're close. You get a text when your parent is picked up and another when they're delivered.",
    proof: "One escort always rides free, so someone can go along.",
  },
  {
    id: "hospitals",
    name: "Hospitals & discharge planning",
    pain: "A bed stays occupied because transport is three hours out.",
    answer:
      "Facility accounts get a dispatch line that skips the queue, guaranteed discharge windows, and a named dispatcher who already has every trip your unit has booked today.",
    proof: "Median discharge pickup: 42 minutes from call.",
  },
  {
    id: "dialysis",
    name: "Dialysis centers",
    pain: "A missed ride means a missed session and a hospital admission.",
    answer:
      "Standing orders are locked to the same driver and the same van wherever possible, so your patients see a familiar face three times a week and your chairs turn on schedule.",
    proof: "98.6% on-time arrival on standing dialysis orders.",
  },
  {
    id: "snf",
    name: "Skilled nursing & assisted living",
    pain: "Staff spend the morning on hold confirming pickups.",
    answer:
      "Book the whole week in one pass, then let it run. Your coordinator gets a single dispatch contact for every resident's trip and is only called when something actually needs a decision.",
    proof: "Bulk scheduling for up to 40 recurring trips at once.",
  },
  {
    id: "labs",
    name: "Labs, pharmacies & facilities",
    pain: "A delayed specimen run means a redraw, a rerun, or a result the physician needed yesterday.",
    answer:
      "Medical courier runs are dispatched directly, not shared with other stops, with a signed chain-of-custody log at every handoff and a Business Associate Agreement on file. STAT pickups move within 30 minutes.",
    proof: "OSHA-trained drivers, temperature-controlled totes on every run.",
  },
];

export const STATS = [
  { value: "50,000+", label: "trips completed" },
  { value: "98.6%", label: "on-time arrival" },
  { value: "42 min", label: "median discharge pickup" },
  { value: "24/7", label: "dispatch staffed" },
];

/** Municipalities in the primary service radius. */
export const SERVICE_AREA = [
  "Chicago", "Cicero", "Berwyn", "Oak Park", "Forest Park", "Maywood",
  "Melrose Park", "Elmwood Park", "River Forest", "Broadview", "Bellwood",
  "Westchester", "La Grange", "Brookfield", "Riverside", "Lyons",
  "Summit", "Bedford Park", "Burbank", "Oak Lawn", "Evergreen Park",
  "Blue Island", "Alsip", "Palos Heights", "Orland Park", "Tinley Park",
  "Evanston", "Skokie", "Niles", "Morton Grove", "Lincolnwood", "Wilmette",
  "Des Plaines", "Park Ridge", "Elmhurst", "Villa Park", "Lombard",
  "Downers Grove", "Naperville", "Aurora",
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I live in Phoenix and my father is in Berwyn. Knowing dispatch will call me if a pickup runs even ten minutes late is the only reason I sleep on dialysis days.",
    name: "Denise A.",
    role: "Daughter · Phoenix, AZ",
  },
  {
    quote:
      "We moved our standing orders over after the third no-show from our last provider. Nine months, one late pickup. Their dispatcher calls us before we have to call them.",
    name: "Ray Mitchell, RN",
    role: "Charge Nurse · Westside Kidney Center",
  },
  {
    quote:
      "The stretcher crew carried my husband down two flights because the elevator was out, and they did it without making him feel like a problem. That is the whole job, really.",
    name: "Marguerite O.",
    role: "Oak Park",
  },
];

export interface ComparisonRow {
  feature: string;
  us: string;
  them: string;
}

/**
 * What most Chicagoland NEMT operators actually publish versus what we do —
 * per CLAUDE.md's competitive-position note, the two reference competitors
 * both lack pricing transparency, a coverage map, and a customer portal.
 * Framed generically ("most providers") rather than naming a real company.
 */
export const COMPARISON: ComparisonRow[] = [
  {
    feature: "Price before you book",
    us: "Base rate + per-mile rate published for all five services",
    them: "“Call for a quote”",
  },
  {
    feature: "Pickup window",
    us: "Confirmed window, driver calls when close",
    them: "A day, sometimes a four-hour block",
  },
  {
    feature: "Standing dialysis orders",
    us: "Same driver, same van, 98.6% on time",
    them: "Whoever's on the board that day",
  },
  {
    feature: "Hospital discharge dispatch",
    us: "Dedicated line, 42 min median pickup",
    them: "General queue, same as a routine ride",
  },
  {
    feature: "Escort policy",
    us: "One escort rides free, every trip",
    them: "Seat availability, ask at pickup",
  },
];

export const FAQS = [
  {
    q: "Do you accept Medicaid or insurance?",
    a: "We bill Illinois Medicaid managed care plans and the major NEMT brokers, and we are in-network with several Medicare Advantage plans. Bring your member ID when you book and we will verify eligibility before the trip rather than after it.",
  },
  {
    q: "How far in advance should I book?",
    a: "Routine appointments: 24 hours. Standing orders like dialysis: about a week, so we can lock in the same driver. Hospital discharges: call as soon as the order is written. We hold back same-day capacity specifically for those.",
  },
  {
    q: "Can someone ride with the patient?",
    a: "Yes. One escort rides free on every service type. Tell us when you book so we assign a van with the seat available.",
  },
  {
    q: "What if the appointment runs long?",
    a: "Return trips are open ended by default. Call dispatch when you are finished and we send the nearest available van. In our core service area that is usually 20 to 35 minutes.",
  },
  {
    q: "What areas do you cover?",
    a: "Chicago proper plus the western and northern suburbs, with regular longer runs into southeastern Wisconsin. If you are outside the map, call dispatch anyway. We quote trips outside the area one at a time rather than turning them away.",
  },
  {
    q: "Is your medical courier service HIPAA compliant?",
    a: "Yes. Drivers are OSHA bloodborne-pathogen trained, every pickup and drop-off is signed into a chain-of-custody log, and we sign a Business Associate Agreement for any lab, pharmacy or facility account that hands us protected health information.",
  },
];
