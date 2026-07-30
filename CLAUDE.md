# MedCompass Website

## Project context

MedCompass is a healthcare-adjacent product. That single fact sets the weighting for
everything below: users may be stressed, older, on poor connections, or using assistive
tech, and **trust reads as competence, not spectacle**. Where a technique would trade
clarity or access for impressiveness, clarity wins.

> If this framing is wrong — if MedCompass is a developer tool, an internal dashboard, or
> a marketing-first brand site — say so and adjust the motion budget in §4 accordingly.

---

## 1. The design skill stack

Three design skills are installed in `.claude/skills/`. They overlap, and in places they
contradict each other. They are **not** peers — each one owns a different stage and yields
outside it.

| Skill | Owns | Yields on |
|---|---|---|
| `ui-ux-pro-max` | Evidence + constraints. Searchable DB of palettes, font pairings, product patterns, stack rules, and the accessibility/perf floor. | Final aesthetic taste — its matches are candidates, not verdicts. |
| `frontend-design` | Aesthetic direction. The palette, type pairing, layout concept, and the one signature element. | Hard a11y/perf numbers; stack-specific implementation. |
| `premium-frontend-ui` | Execution craft for motion, depth, and typographic drama — *once* a direction is chosen. | Whether a given effect is used at all. It is a menu, never a checklist. |

The failure mode to avoid: letting all three fire at once and averaging them. That produces
a site that is simultaneously over-animated and generic. Run them in sequence instead.

---

## 2. The pipeline

**Stage 1 — Gather (`ui-ux-pro-max`).**
Detect the stack, then pull evidence before deciding anything:

```bash
python ".claude/skills/ui-ux-pro-max/scripts/search.py" "<product> <industry> <tone>" --design-system -p "MedCompass"
```

Treat the output as a research brief. Do not implement it directly — a database match is by
definition what similar projects already did.

**Stage 2 — Direct (`frontend-design`).**
Run its two-pass brainstorm → critique using Stage 1 as raw material. Produce the compact
token system it asks for: 4–6 named hex values, 2+ typeface roles, a layout concept, and one
signature element. Apply its self-check: if any part reads like the default answer for "generic
healthcare site" — soft blue, rounded cards, stock smiling clinician, gradient hero — revise it
and say what changed.

`premium-frontend-ui`'s four philosophies enter **here**, as four candidates among many, not as
the menu. Note that Editorial Brutalism and Cyber/Technical are close cousins of two looks
`frontend-design` flags as AI-defaults — choosing either requires a reason specific to this brief.

**Stage 3 — Budget (§4 below).**
Pick the motion moments. One primary, at most two supporting.

**Stage 4 — Build (`premium-frontend-ui` + `ui-ux-pro-max --stack`).**
Now use premium's craft guidance for the effects that survived Stage 3, and pull
stack-specific implementation rules:

```bash
python ".claude/skills/ui-ux-pro-max/scripts/search.py" "<keyword>" --stack <detected-stack>
```

**Stage 5 — Verify.**
Re-check against §3. The floor is not negotiable retroactively.

---

## 3. The floor (non-negotiable, overrides everything)

All three skills agree here, so there is nothing to reconcile — this simply wins over any
aesthetic argument.

- Contrast ≥ 4.5:1 body, ≥ 3:1 large text and UI boundaries.
- Visible keyboard focus. Never remove focus rings; restyle them if they clash.
- Interactive targets ≥ 44×44px with ≥ 8px spacing.
- `prefers-reduced-motion` respected — and it must degrade to a *usable* page, not a frozen one.
- No horizontal scroll; reflow intact down to 320px.
- Animate `transform` and `opacity` only. Never `width`, `height`, `top`, or `margin`.
- Reserve space for media (CLS < 0.1). No layout shift on load.
- Content reachable without JS-driven scroll or hover.

---

## 4. Motion budget — the core conflict resolution

`premium-frontend-ui` prescribes a stack of effects as if each were mandatory. On this project
they are opt-in, and each must earn its place. `frontend-design`'s "spend your boldness in one
place" is the governing rule; `ui-ux-pro-max`'s 150–300ms and reduced-motion rules bound the
execution.

**Allocation: one signature motion moment, at most two quiet supporting ones.** Everything else
is a state change, not an animation.

Specific rulings where the skills contradict:

| Technique | Ruling |
|---|---|
| Preloader | **Default off.** "A blank screen is unacceptable" is a portfolio-site argument. On a health site a preloader delays access to information someone may urgently need. Use only if genuinely heavy assets (3D, video) must resolve first. |
| Scroll hijacking (Lenis) | **Default off.** It overrides native scroll, degrades keyboard paging and find-in-page, and desyncs from assistive tech. Only for a true scroll-narrative section — never site-wide. |
| Custom cursor | Allowed **only** inside `@media (hover: hover) and (pointer: fine)`, and it must never be the sole carrier of state the default cursor already communicates. |
| Magnetic buttons | Allowed. But the 44×44 hit target is measured **at rest** — a control that slides away from the pointer must still be hittable by someone who aimed once and clicked. |
| Sticky hide-on-scroll nav | Allowed and encouraged. Cheap, reversible, genuinely useful on long pages. |
| Parallax | Allowed at low amplitude on decorative layers only. Never on text someone has to read. |
| `12vw` headlines | Allowed via `clamp()` with a sane floor. Body copy stays ≥ 16px, line-height ≥ 1.5, and the page still reflows at 320px. |
| Staggered entrance reveals | Allowed once, on the hero. Content below the fold must not depend on animation to become visible — a failed observer should never leave the page blank. |

---

## 5. Tooling notes

The `ui-ux-pro-max` SKILL.md documents its script path as `${CLAUDE_PLUGIN_ROOT}/...`. That
variable is **not** set here — the skill is installed as a project skill, not a plugin. Use the
project-relative path shown in §2, run from the repo root.

Python 3.12 is installed. If `python` is not found, try `python3`, then `py -3`. A shell opened
before the install may not have it on PATH yet; a new session will.

Persisted design systems (`--persist --output-dir .`) land in `design-system/<slug>/MASTER.md`
and will **not** be overwritten without `--force`. Read that file before regenerating so prior
decisions aren't silently discarded.
