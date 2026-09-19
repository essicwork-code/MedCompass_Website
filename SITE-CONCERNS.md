# Ride MedCompass: open concerns and confirmations

Site: https://ridemedcompass.com. Last reviewed September 19, 2026.

The site began as a demo with invented content. The invented statistics and testimonials were removed on September 19, 2026. What remains below are claims only you can confirm, plus setup tasks that are yours to do. Everything below is either a claim that must be true before real customers rely on it, or a setup task only the owner can do.

Tick each box once it's confirmed or fixed. For anything that turns out to be untrue, note the correct fact and the site will be updated to match.

---

## 1. Business identity (highest priority)

Google compares these details against your Google Business Profile and other directory listings. If they don't match, local rankings suffer.

- [x] **Office address.** Updated September 19, 2026 to **10735 S Western Ave, Ste 6 #373, Chicago, IL 60643**. Make sure the Google Business Profile uses the exact same format. Note: Google doesn't allow mailbox or virtual-office addresses ("#373" looks like one) as a storefront; if it is one, set the profile as a service-area business and hide the address.
  Where it appears: footer on every page, the business data Google reads (`components/StructuredData.tsx`), `lib/demo/data.ts`.
- [ ] **Phone number.** (773) 839-4474. Is it real, and is it answered 24/7 as the site says?
- [ ] **Email.** dispatch@ridemedcompass.com. Is the mailbox set up and monitored?
- [ ] **Hours.** "Dispatch staffed 24/7 · Scheduled rides 4:00 AM to 11:00 PM daily." Are both true?
- [ ] **Business name.** "Ride MedCompass". The logo reads "MedCompass". Use one name consistently everywhere (site, Google profile, directories).
- [ ] **Removed credentials.** The USDOT, MC and NPI numbers and the "Licensed, bonded and insured in Illinois" line were taken off the site at your request, along with "ADA-compliant vehicles inspected under IDOT requirements". If you hold real registrations, you can add them back; listing them builds trust.

## 2. Performance numbers  — REMOVED September 19, 2026

All invented performance figures were deleted from the site. The homepage
statistics now count real things: the number of services with published rates,
the number of communities in the service area, 24/7 dispatch, and the free
escort policy.

- [x] "50,000+ trips completed" — removed
- [x] "98.6% on-time arrival" — removed from the homepage, hero badge, comparison table and chat
- [x] "42 min median discharge pickup" — removed from the homepage, facilities page, service-area page, discharge guide and comparison table
- [x] "6 vans in the fleet" / "6 drivers on staff" — removed
- [ ] **When you have real numbers** out of dispatch records, they can go back up. Keep the source so you can show anyone who asks.

## 3. Testimonials — REMOVED September 19, 2026

- [x] "Denise A.", "Ray Mitchell, RN" and "Marguerite O." — the whole homepage testimonial section is gone
- [x] The two invented driver quotes on Careers ("Marcus Whitfield", "Rosa Delgado") — replaced with a plain description of the work and an offer to put candidates on the phone with a real driver
- [ ] **To add real ones:** get the customer's words and their written permission. Never add review stars or ratings to the Google-readable data unless the reviews are genuine.

## 4. Insurance and billing claims

- [ ] **"We bill Illinois Medicaid managed care plans and the major NEMT brokers directly."** Is Ride MedCompass enrolled as an Illinois Medicaid (IMPACT) transportation provider and contracted with the brokers (e.g. MTM, ModivCare)?
- [x] **"In-network with several Medicare Advantage plans."** Removed September 19, 2026 from the FAQ and the chat assistant. Add it back only for plans you are actually contracted with, naming them.
- [ ] **"Most riders pay nothing."**
- [ ] **"We verify eligibility before the trip."**
- [ ] **"We take assignments from the major brokers."** (Pricing page)

Where: homepage hero, Pricing page, FAQ, chat assistant (`lib/chat-script.ts`), service pages, booking quote step.

## 5. Service and compliance claims

- [ ] **Drivers are W-2 employees, background-checked, CPR/AED certified**, with paid PASS and securement training (About, Careers, homepage)
- [ ] **Health benefits after 90 days** (Careers)
- [ ] **Pay ranges.** Wheelchair driver $19–$23/hr, stretcher attendant $21–$26/hr, dispatcher $20–$25/hr (Careers)
- [x] **"Based out of our Cicero facility"** (Careers job listing); changed to the South Side Chicago office to match the new address
- [ ] **Bariatric equipment rated to 750 lb**
- [ ] **Stretcher trips always have two attendants; stair carries offered**
- [ ] **Courier.** OSHA bloodborne-pathogen trained drivers; chain-of-custody log; ambient, refrigerated and frozen totes; "temperature-controlled totes on every run"; STAT pickup within 30 minutes
- [ ] **HIPAA.** "HIPAA compliant" courier service and a signed Business Associate Agreement available. Only claim this if you have HIPAA policies and a BAA ready to sign.
- [ ] **Operations promises.** Text confirmation the night before, status texts during the trip, driver calls when close. Do these systems actually exist?
- [ ] **Service area.** "Scheduled long-distance runs into southeastern Wisconsin and downstate Illinois"
- [ ] **Facility accounts.** "Setup takes about a week", monthly invoicing, dedicated dispatch line with a named dispatcher (Facilities page)

## 6. Prices

- [ ] Confirm the published rates in `lib/content.ts`:

  | Service | Base | Per mile |
  |---|---|---|
  | Wheelchair | $68 | $3.85 |
  | Ambulatory | $42 | $2.75 |
  | Stretcher | $325 | $6.50 |
  | Bariatric | $175 | $6.00 |
  | Medical courier | $32 | $2.00 |

- [ ] **Courier STAT fee.** $25
- [ ] **Wait time.** Billed at $18/hour after 20 minutes, in 15-minute increments
- [ ] **No evening, weekend or late-booking surcharge**
- [ ] **One escort rides free on every trip**
- [ ] **Estimate formula.** Straight-line distance × 1.25. The town pages and calculator publish exact dollar amounts from this formula, so real invoices must match it.

## 7. Photos and brand assets

- [x] **Photos.** All four Unsplash stock photos were deleted September 19, 2026 and replaced with 17 images made for the site.
- [x] **AI-generated images.** Every photo and the video are now AI-generated from your logo, van wrap and uniform. The footer says so in plain language, and `public/photos/CREDITS.md` records it. Replace the crew and dispatch shots with real photos of your team when you can — that builds more trust than anything else on the page.
- [x] **Van photo.** The placeholder "USDOT 1234567 / MC 1234567" and the wrong "MedCompass.com" are gone; vans now show (773) 839-4474 and ridemedcompass.com.
- [ ] **Logo.** Confirm you own the rights to it (the source is `Assets/IMG_1092.JPEG`).

## 8. Public GitHub repository

The repository https://github.com/essicwork-code/MedCompass_Website is **public**.

- [x] **Competitor screenshot.** The BriteLift website screenshot was removed from the repo (commit `535a991`). It still exists in the git history.
- [ ] **Personal photos.** `Assets/IMG_1092.JPEG` and `Assets/IMG_1560.JPEG` are personal photo files. Confirm you're fine with them being public.
- [ ] **Repository visibility.** Consider making the repo private. GitHub Pages on a private repo requires a paid GitHub plan.
- [ ] **This file.** It hasn't been committed. Keep it out of the public repo, or commit it only if the repo becomes private.

## 9. Email forms (EmailJS)

- [ ] **Real test.** Send one real submission from each form on ridemedcompass.com (booking, contact, careers, chat) and confirm it arrives in the dispatch inbox.
- [ ] **Allowed domains.** In the EmailJS dashboard, restrict sending to `ridemedcompass.com`.
- [ ] **Auto-reply wording.** Job applicants and booking requests all get the same auto-reply as the Contact form. Check that its wording makes sense for each.
- [ ] **Monthly limit.** Check the EmailJS monthly send limit on your plan. When it's used up, forms fall back to opening the visitor's email app.
- [ ] **Patient information.** Booking requests travel through EmailJS and Outlook, and include names, phone numbers and pickup and destination addresses. For real patients, that information is protected health information (PHI). Confirm EmailJS and your email provider are acceptable for it, or move bookings to a HIPAA-covered system.

## 10. Third-party services and patient privacy

- [ ] **Address lookup.** Address search uses OpenStreetMap's free Nominatim service. Its usage policy limits requests (about 1 per second) and it has no privacy agreement (BAA). Real rider addresses are sent to it. Before heavy use, switch to a paid geocoder covered by a BAA (see the note in `lib/geo.ts`).
- [ ] **Map tiles.** The map uses OpenStreetMap's public tile servers, which aren't meant for high-traffic commercial sites. Plan a paid tile provider if traffic grows.
- [ ] **Hospital shortcuts.** 13 major Chicagoland hospitals are listed as pickup and destination shortcuts and shown on the map as "Major hospital". The site states this doesn't imply a partnership. Confirm you're comfortable listing them.

## 11. Search and local ranking tasks (owner only)

- [ ] **Google Business Profile.** Create or claim it, verify it, and use the exact name, address, phone and hours from section 1. This is the biggest factor for the map results.
- [ ] **Search Console sitemap.** Submit `https://ridemedcompass.com/sitemap.xml`.
- [ ] **Search Console indexing.** Use URL Inspection to request indexing for the homepage, `/areas/`, and the main service pages.
- [ ] **Bing.** Add the site to Bing Webmaster Tools, which also feeds DuckDuckGo and Yahoo.
- [ ] **Reviews.** Ask real customers for Google reviews.
- [ ] **Directory listings.** List the business with identical details on Yelp, BBB, Apple Maps, Healthgrades and local chambers of commerce.
- [ ] **Local links.** Ask partner facilities, senior centers and discharge planners to link to the site.
- [ ] **Medicaid guide.** Review the Illinois Medicaid guide (`/resources/illinois-medicaid-transportation/`) against current HFS rules every few months, and update its "Last reviewed" date.

## 12. Code cleanup (low priority)

- [ ] **Unused weather code.** The weather widget files aren't used anywhere: `components/WeatherWidget.tsx`, `components/WeatherIcon.tsx`, `lib/useWeather.ts`, `lib/weather.ts`.
- [ ] **Cloudflare leftovers.** `wrangler.jsonc` and `worker/index.ts` are for a Cloudflare deployment that's no longer used. The site now deploys through GitHub Pages. Remove them if Cloudflare isn't coming back.
- [ ] **Outdated project notes.** `CLAUDE.md` still describes the site as "a demo — fake data". Update it once the facts above are settled.

---

## Already fixed (for reference)

- **Custom domain:** the site wasn't rendering on ridemedcompass.com (wrong asset paths); a duplicate deploy workflow was also removed.
- **Phone keyboards:** form fields caused iPhone zoom-on-focus.
- **Wrong page titles:** Book, Careers, Contact, Cost calculator and Service area used the homepage title.
- **Hidden sections:** some homepage sections could stay invisible on phones or when scripts failed.
- **Stats:** they appeared as "0" to search engines, and "24/7" animated as "0/7".
- **Past times:** pickup times in the past were accepted.
- **Accessibility:** missing keyboard focus outline on the service cards, and several tap targets under 44px.
- **Careers form:** it sent the wrong role to EmailJS.
- **Fake places:** made-up dialysis centers, nursing homes and residences were removed from the booking list and map, and Mount Sinai's address was corrected.
- **Credential numbers:** USDOT, MC and NPI numbers removed at your request.
- **Search setup added:** favicon, sitemap, robots.txt, canonical URLs, link-preview image, Google-readable business data, 16 town pages, the Medicaid guide, the FAQ page and breadcrumbs.
