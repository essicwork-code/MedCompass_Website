# Demo login credentials

This is a prototype with **no real authentication**. Every credential below is
readable in the client-side source (`lib/auth/accounts.ts`) and is also listed
directly on each sign-in screen, so nothing here is secret — this file exists
purely so you don't have to go hunting for them.

Do not reuse any of these passwords anywhere real. Do not treat this feature
set as a security model: there is no server, no hashing, and no per-request
verification. See the "Not real security" note on the sign-in screens for what
a production build would need instead.

## Client & facility portal — `/portal`

| Name | Email | Password | Role | Sees |
|---|---|---|---|---|
| Denise Alvarez | `denise@example.com` | `ride1234` | Client | Trips for her mother, Eleanor Vance (dialysis standing order) |
| Harold Kimura | `harold@example.com` | `ride1234` | Client | His own cardiology appointment trip |
| Marguerite Okonkwo | `marguerite@example.com` | `ride1234` | Client | Trips for her mother-in-law, Beatrice Okonkwo (hospital discharge) |
| Ray Mitchell, RN | `ray@westsidekidney.example.com` | `clinic1234` | Facility partner | Every rider booked against Westside Kidney Center |

## Dispatch console — `/admin`

| Name | Email | Password | Role | Can also do |
|---|---|---|---|---|
| Tomas Rivera | `tomas@medcompass.com` | `dispatch1234` | Dispatcher | View the board and fleet (read-only on fleet) |
| Yolanda Reyes | `yolanda@medcompass.com` | `dispatch1234` | Dispatch supervisor | Everything above, plus manage the fleet |
| Angela Boyd | `angela@medcompass.com` | `admin1234` | Administrator | Everything above, plus the Accounts tab |

## How signing in actually works here

- Click any account card on the sign-in screen to log in instantly, or type
  the email/password into the form — both paths call the same
  `authenticate()` check.
- The session is a plain `localStorage` entry (`medcompass.demo.session`)
  holding the account id. Clearing site data signs you out; there is no
  expiry.
- A client account visiting `/admin` is refused and sent back to `/portal`.
  A staff account visiting `/portal` is redirected to `/admin`. Both checks
  run in the browser, not on a server, so they're UX guardrails, not access
  control.

## Where this lives in the code

- `lib/auth/accounts.ts` — the account list and the role → permission map
- `lib/auth/useSession.ts` — the localStorage-backed session hook
- `components/auth/SignInCard.tsx` — the shared sign-in screen both portals use
