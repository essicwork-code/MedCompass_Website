# Site photography

Every photograph on this site was created for MedCompass with Google's
Gemini image models (Nano Banana Pro on Vertex AI), using the company logo, the
van wrap and the crew uniform as references so the fleet and uniforms match.

**They are illustrative.** They do not show identified riders, and the people in
them are not photographs of named MedCompass staff. The site footer says
so. Do not caption them as specific employees, and do not pair them with named
testimonials.

Each file carries Google's invisible SynthID watermark and, where the format
keeps it, C2PA content credentials. Those are left in place deliberately.

Sources for the finished WebP files are the full-size PNGs in
`Assets/generated/`, which is kept out of git (113 MB) and mirrored to
`gs://medcompass-media-926590854262/sources/`. Rebuild the web versions with:

    node scripts/prepare-site-photos.mjs

| File | Scene |
|---|---|
| `home-hero` | Driver guiding a rider up the ramp outside a Chicago two-flat |
| `home-secure` | Rider secured in her wheelchair with her daughter beside her |
| `wheelchair-securement` | Close-up of a tie-down strap being fastened to the floor track |
| `ambulatory-assist` | Driver offering an arm to a rider with a cane on his front steps |
| `stretcher-loading` | Stretcher being loaded onto the van lift at a hospital canopy |
| `stretcher-transport` | Stretcher rolling out of a nursing facility to the van |
| `bariatric-lift` | Bariatric wheelchair on the extra-wide hydraulic lift |
| `courier-handoff` | Sealed specimen cooler handed across a lab counter |
| `clinic-handoff` | Rider handed to the clinic reception desk, not the curb |
| `dialysis-arrival` | Dawn arrival at a dialysis center |
| `discharge-planner` | Crew confirming a pickup with a discharge planner |
| `family-booking` | Daughter watching the ride map from her kitchen table |
| `fleet-lineup` | Three wrapped vans outside the garage at golden hour |
| `crew-team` | Five uniformed crew beside a van |
| `dispatch-desk` | Dispatcher with the live map and the day's schedule |
| `pretrip-check` | Driver inspecting the ramp before the first run |

The video in `public/video/` was made the same way: still frames from these
images animated with Google's Veo model, with an instrumental track from
Google's Lyria model. It is silent street footage with music only.

## Replaced

The four Unsplash placeholders (`assist-to-vehicle`, `rider-waiting`,
`care-handoff`, `companion-ride`) were removed on September 19, 2026. They
showed unrelated models and implied they were riders.
