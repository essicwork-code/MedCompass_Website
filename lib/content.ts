/*
 * Marketing copy and service definitions.
 *
 * Written to be specific rather than reassuring — the competitor sites lean on
 * "compassionate, caring, reliable" and say nothing checkable. Numbers here are
 * illustrative for the demo, but they are the *kind* of claim a real operator
 * can substantiate.
 */

export interface Service {
  slug: string;
  name: string;
  short: string;
  description: string;
  /** What the rider actually gets, in plain terms. */
  includes: string[];
  fromPrice: number;
  perMile: number;
  icon: "wheelchair" | "walk" | "stretcher" | "bariatric";
}

export const SERVICES: Service[] = [
  {
    slug: "wheelchair",
    name: "Wheelchair transport",
    short: "Hydraulic lift, four-point securement, door-through-door.",
    description:
      "Our wheelchair vans carry manual and power chairs up to 800 lb combined on a hydraulic lift — no transfers, no lifting, no folding your chair into a trunk. Every chair is secured at four points and the rider gets a separate lap-and-shoulder belt.",
    includes: [
      "Hydraulic lift rated to 800 lb",
      "Four-point wheelchair securement",
      "Door-through-door assistance",
      "Up to one escort rides free",
    ],
    fromPrice: 55,
    perMile: 3.25,
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
    fromPrice: 38,
    perMile: 2.5,
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
    fromPrice: 165,
    perMile: 5.5,
    icon: "stretcher",
  },
  {
    slug: "bariatric",
    name: "Bariatric transport",
    short: "Equipment rated to 750 lb, booked with the room it needs.",
    description:
      "Riders over standard equipment limits get a van built for it — wider lift, reinforced securement, and a bariatric chair rated to 750 lb. We schedule extra time so nobody is rushed, and we confirm building access before the day of the trip.",
    includes: [
      "Lift and chair rated to 750 lb",
      "Reinforced securement points",
      "Extended appointment window",
      "Access confirmed in advance",
    ],
    fromPrice: 185,
    perMile: 5.75,
    icon: "bariatric",
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
      "Every MedCompass trip gets a live tracking link. Watch the van approach, see the driver's name before they knock, and get a notification the moment your parent is inside the building.",
    proof: "Share the link with anyone — no account, no app install.",
  },
  {
    id: "hospitals",
    name: "Hospitals & discharge planning",
    pain: "A bed stays occupied because transport is three hours out.",
    answer:
      "Facility accounts get a dispatch line that skips the queue, guaranteed discharge windows, and a portal showing every trip your unit has booked today with its current status.",
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
      "Book the whole week in one pass, then watch it run. Your coordinator sees every resident's trip on one board and gets alerted only when something actually needs a decision.",
    proof: "Bulk scheduling for up to 40 recurring trips at once.",
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
      "I live in Phoenix and my father is in Berwyn. The tracking link is the only reason I sleep on dialysis days. I can see he got there and I can see he got home.",
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

export const FAQS = [
  {
    q: "Do you accept Medicaid or insurance?",
    a: "We bill Illinois Medicaid managed care plans and the major NEMT brokers, and we are in-network with several Medicare Advantage plans. Bring your member ID when you book and we will verify eligibility before the trip rather than after it.",
  },
  {
    q: "How far in advance should I book?",
    a: "Routine appointments: 24 hours. Standing orders like dialysis: one week to lock the same driver. Hospital discharges: call when the order is written — we hold same-day capacity specifically for discharges.",
  },
  {
    q: "Can someone ride with the patient?",
    a: "Yes. One escort rides free on every service type. Tell us when you book so we assign a van with the seat available.",
  },
  {
    q: "What if the appointment runs long?",
    a: "Return trips are open-ended by default. Call or tap 'Ready for pickup' in the portal when you are done, and we dispatch the nearest available van — typically 20 to 35 minutes in our core service area.",
  },
  {
    q: "How is the tracking link private?",
    a: "The link carries a single-use token that expires when the trip ends. It shows the vehicle position, ETA and trip status only — never the rider's name, condition, or the name of the facility they are visiting.",
  },
  {
    q: "What areas do you cover?",
    a: "Chicago proper plus the western and northern suburbs, with regular long-distance runs to southeastern Wisconsin. If you are outside the map, call dispatch — we quote out-of-area trips individually.",
  },
];
