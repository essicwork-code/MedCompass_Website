/*
 * Demo accounts.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  THIS IS NOT AUTHENTICATION. Credentials are hardcoded in the client
 *  bundle and printed on the sign-in screen on purpose, because this is a
 *  prototype with no server and nothing real behind it.
 *
 *  A production build needs server-side sessions, hashed credentials, and
 *  one account per human. Under HIPAA a shared login is an accountability
 *  violation (45 CFR 164.312(b)), which is why the roles below are split
 *  by person rather than by desk.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type Role = "client" | "facility" | "dispatcher" | "supervisor" | "admin";

/** Capabilities checked in the UI. Kept coarse; a real system would be finer. */
export type Permission =
  | "view.own_trips"
  | "view.facility_trips"
  | "view.all_trips"
  | "view.rider_identity"
  | "manage.dispatch"
  | "manage.fleet"
  | "manage.staff"
  | "view.billing";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  client: ["view.own_trips"],
  facility: ["view.facility_trips", "view.rider_identity", "view.billing"],
  dispatcher: ["view.all_trips", "view.rider_identity", "manage.dispatch"],
  supervisor: ["view.all_trips", "view.rider_identity", "manage.dispatch", "manage.fleet"],
  admin: [
    "view.all_trips",
    "view.rider_identity",
    "manage.dispatch",
    "manage.fleet",
    "manage.staff",
    "view.billing",
  ],
};

export interface Account {
  id: string;
  email: string;
  /** Demo only. Never do this. */
  password: string;
  name: string;
  initials: string;
  role: Role;

  /** Client accounts: who they book for, and which trips are theirs. */
  ridersManaged?: string[];
  tripIds?: string[];
  memberId?: string;
  plan?: string;
  relationship?: string;

  /** Facility accounts. */
  facilityName?: string;
  facilityPlaceId?: string;

  /** Staff accounts. */
  title?: string;
  shift?: string;
}

export const ACCOUNTS: Account[] = [
  // ---- Clients ---------------------------------------------------------
  {
    id: "acc-denise",
    email: "denise@example.com",
    password: "ride1234",
    name: "Denise Alvarez",
    initials: "DA",
    role: "client",
    ridersManaged: ["Eleanor Vance"],
    tripIds: ["t1", "t8"],
    memberId: "IL-MCO-4417832",
    plan: "Illinois Medicaid managed care",
    relationship: "Daughter and authorized representative",
  },
  {
    id: "acc-harold",
    email: "harold@example.com",
    password: "ride1234",
    name: "Harold Kimura",
    initials: "HK",
    role: "client",
    ridersManaged: ["Harold Kimura"],
    tripIds: ["t2"],
    memberId: "IL-MCO-2290514",
    plan: "Medicare Advantage",
    relationship: "Booking for himself",
  },
  {
    id: "acc-marguerite",
    email: "marguerite@example.com",
    password: "ride1234",
    name: "Marguerite Okonkwo",
    initials: "MO",
    role: "client",
    ridersManaged: ["Beatrice Okonkwo"],
    tripIds: ["t3"],
    memberId: "IL-MCO-8813077",
    plan: "Illinois Medicaid managed care",
    relationship: "Daughter-in-law and authorized representative",
  },

  // ---- Facility --------------------------------------------------------
  {
    id: "acc-ray",
    email: "ray@westsidekidney.example.com",
    password: "clinic1234",
    name: "Ray Mitchell, RN",
    initials: "RM",
    role: "facility",
    facilityName: "Westside Kidney Center",
    facilityPlaceId: "westsideDialysis",
    tripIds: ["t1", "t5", "t8"],
    title: "Charge nurse and transport coordinator",
  },

  // ---- Staff -----------------------------------------------------------
  {
    id: "acc-tomas",
    email: "tomas@medcompass.com",
    password: "dispatch1234",
    name: "Tomas Rivera",
    initials: "TR",
    role: "dispatcher",
    title: "Dispatcher",
    shift: "18:00 to 06:00",
  },
  {
    id: "acc-yolanda",
    email: "yolanda@medcompass.com",
    password: "dispatch1234",
    name: "Yolanda Reyes",
    initials: "YR",
    role: "supervisor",
    title: "Dispatch supervisor",
    shift: "06:00 to 18:00",
  },
  {
    id: "acc-angela",
    email: "angela@medcompass.com",
    password: "admin1234",
    name: "Angela Boyd",
    initials: "AB",
    role: "admin",
    title: "Operations director",
    shift: "Business hours",
  },
];

export const CLIENT_ACCOUNTS = ACCOUNTS.filter(
  (a) => a.role === "client" || a.role === "facility",
);
export const STAFF_ACCOUNTS = ACCOUNTS.filter(
  (a) => a.role === "dispatcher" || a.role === "supervisor" || a.role === "admin",
);

export function can(account: Account | null, permission: Permission): boolean {
  if (!account) return false;
  return ROLE_PERMISSIONS[account.role].includes(permission);
}

export const ROLE_LABEL: Record<Role, string> = {
  client: "Client",
  facility: "Facility partner",
  dispatcher: "Dispatcher",
  supervisor: "Dispatch supervisor",
  admin: "Administrator",
};

/**
 * Looks up an account by credentials.
 *
 * Case-insensitive on email and trims both fields, because a demo that
 * rejects "Denise@Example.com " teaches nothing except frustration.
 */
export function authenticate(email: string, password: string): Account | null {
  const e = email.trim().toLowerCase();
  const p = password.trim();
  return ACCOUNTS.find((a) => a.email.toLowerCase() === e && a.password === p) ?? null;
}

export function accountById(id: string): Account | null {
  return ACCOUNTS.find((a) => a.id === id) ?? null;
}

/** Staff see the whole board; everyone else sees only what is theirs. */
export function visibleTripIds(account: Account, allTripIds: string[]): string[] {
  if (can(account, "view.all_trips")) return allTripIds;
  return account.tripIds ?? [];
}
