---
description: Run the unified design pipeline (gather → direct → budget → build) across all three design skills
---

Run the full design pipeline from `CLAUDE.md` §2 for: **$ARGUMENTS**

Work through the stages in order. Do not skip ahead to code.

**Stage 1 — Gather.** Detect the stack from the repo. Then run `ui-ux-pro-max`:

```
python ".claude/skills/ui-ux-pro-max/scripts/search.py" "<query derived from the request>" --design-system -p "MedCompass"
```

Report what it returned as *evidence*, and flag which parts look like the generic answer.

**Stage 2 — Direct.** Apply `frontend-design`'s brainstorm → critique. Output the compact token
system: 4–6 named hex values, 2+ typeface roles, layout concept (with an ASCII wireframe), and
the one signature element. Then critique it against the brief and revise, stating what changed
and why. Most of this iteration belongs in your thinking — show me the refined result.

**Stage 3 — Budget.** State the motion allocation explicitly: the one signature moment, plus any
supporting ones. For every `premium-frontend-ui` technique you are *declining*, you don't need to
justify it — but for each one you're *using*, give the reason it earns its place.

**Stage 4 — Build.** Implement, pulling stack rules via `--stack`. Follow the Stage 2 plan
exactly; derive every color and type decision from the token system.

**Stage 5 — Verify.** Walk the `CLAUDE.md` §3 floor as a checklist and report the result
honestly — if something doesn't pass, say so rather than asserting it does.

Stop after Stage 3 and show me the plan before writing implementation code, unless I've said to
go straight through.
