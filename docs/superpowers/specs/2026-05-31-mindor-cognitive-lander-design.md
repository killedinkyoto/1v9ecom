# Mindor Cognitive Worker Lander — Design Spec
**Date:** 2026-05-31  
**File:** `1v9ecom/mindor-cognitive-lander.html`  
**Status:** Approved for implementation

---

## Overview

Long-form sales lander for Mindor Performance Stack targeting **remote cognitive workers** — cybersecurity analysts, software engineers, quant/finance professionals, AI consultants, data scientists. Explicitly not founder/operator framing. Mirrors IM8 Health's long-form lander structure adapted to Mindor v2 brand (light theme). Frontend only — no checkout wiring.

---

## Target Avatar

- Senior SWE, threat analyst, quant trader, AI consultant, data scientist
- Age 24–38, remote or hybrid
- Works in high-stakes, high-attention technical domains
- Pain: brain fog during crunch, caffeine jitters during incident response, afternoon cognitive drop mid-sprint
- Skeptical of supplements — needs ingredient proof, not hype
- Responds to specificity, clinical dosages, and identity ("built for your kind of work")

---

## Brand System (v2 Light Theme)

All styles derive from `mindor-brand-guidelines_v2.html`. CSS tokens:

```
--accent-purple: #9B7FE0
--purple-light: #EDE8F8
--deep-work-black: #1A2040
--sprint-green: #4A6BD4   (Sprint Blue — primary interactive accent)
--clean-cream: #EEF3FB
--fog-grey: #3D5070
--bg: #ECF2FB
--surface: #E0E9F7
--surface2: #D4DEF2
--border: rgba(74,107,212,0.14)
--border-subtle: rgba(74,107,212,0.08)
--border-accent: rgba(74,107,212,0.30)
--text-primary: #1A2040
--text-muted: #4A587A
--text-dim: #8A9CC0
```

**Fonts:** Barlow Condensed 900/800/700 (all display/headline) · DM Sans 300–600 (all body/labels)  
**Shadows:** Layered, color-tinted with `rgba(74,107,212,x)` — never flat  
**Gradients:** Radial overlays on surfaces for depth per brand guidelines  
**Animations:** `transform` and `opacity` only — no `transition-all`

---

## Page Architecture — 13 Sections

### 1. Sticky Nav
- Left: M-Wave SVG icon + "MINDOR" wordmark (Barlow Condensed 900, `--sprint-green`)
- Right: "Get Mindor" CTA button (Sprint Blue fill, white text)
- Background: `--bg` at 95% opacity with backdrop-filter blur on scroll
- Mobile: same, hamburger hidden (nav is minimal enough)

### 2. Hero
Full-width section. Centered single column (mirrors IM8 pattern): headline → product image → bundle widget. No side-by-side split. Image constrained to 480px on desktop, full-width on mobile.

**Eyebrow tag:** `PERFORMANCE STACK · EST. 2026`

**Headline (Barlow Condensed 900, large):**
> "5 Compounds. One Clean Cognitive Window."

**Subhead (Barlow Condensed 700):**
> "The Focus Stack For People Who Have To Perform."

**Body (DM Sans):** 2–3 sentences. Speaks to the technical worker's specific pain — extended focus sessions, demanding mental work, no margin for a bad brain day. No founder language.

**Hero image:** `[PLACEHOLDER: 480×480 — product bag, hero shot, centered, periwinkle/light bg]`

**Social proof micro-line:** ★★★★★ · "4.9 from 1,200+ cognitive workers"

**Bundle builder widget** (see Section 12 for full spec) — appears here as primary CTA

**Trust badges row:** 3rd-party tested · No proprietary blends · Clean exit (no crash)

### 3. Trust Bar
Single horizontal row. Dark navy background (`--deep-work-black`) for contrast contrast against the light page.

- Left: "AS SEEN IN" label (DM Sans 500, uppercase, muted)
- Logo placeholders: `[PLACEHOLDER: pub logo 1]` × 4–5 slots
- Right: metric pill — "1,200+ orders shipped"

### 4. Problem Section
Background: `--surface` with layered radial gradient

**Section eyebrow:** `THE PROBLEM`

**Headline:** Direct, specific. Example direction:
> "You Can't Afford A Low-Focus Day. Your Stack Isn't Helping."

**3-column problem cards** (icon + title + 1-sentence body):
1. **Caffeine Spike & Crash** — You hit your peak 45 minutes in, then stall. Coffee doesn't sustain; it front-loads and drops.
2. **Brain Noise at Crunch** — When the work demands everything, that's when background static gets loudest. You can't silence it with more caffeine.
3. **Afternoon Cognitive Drop** — The second half of your session shouldn't feel like debugging through fog. But it does.

`[PLACEHOLDER: section illustration or abstract graphic]`

### 5. Product Introduction / "What's In It"
**Section eyebrow:** `THE STACK`

**Headline:** 
> "5 Compounds. Clinically Dosed. Nothing Extra."

**Subhead:** Short credibility statement — no proprietary blends, every dose published.

**5 Ingredient Cards** (grid, 2–3 per row responsive). Each card:
- Compound name (Barlow Condensed 800)
- Dosage badge (Sprint Blue pill)
- Role label (uppercase DM Sans)
- 2-sentence mechanism explanation (DM Sans body)
- `[PLACEHOLDER: compound icon or molecular illustration]`

Compounds:
1. **Green Tea Caffeine** — 100mg · Sustained alertness without the spike of synthetic caffeine. Binds more slowly, releases more evenly.
2. **L-Theanine** — 200mg · Pairs with caffeine to smooth the edge. The combo produces what researchers call "calm alertness."
3. **Alpha-GPC** — 300mg · Precursor to acetylcholine — the neurotransmitter tied to focus, memory encoding, and task switching. Clinical dose.
4. **Panax Ginseng** — [CONFIRM DOSE]mg · Reduces mental fatigue under sustained cognitive load. Studied specifically in knowledge-work contexts.
5. **Vitamin B6 + B12** — [CONFIRM DOSE] · Energy metabolism at the cellular level. Not a stimulant — a baseline support so your brain isn't running on empty.

### 6. How It Works
**Section eyebrow:** `MECHANISM`

**Headline:**
> "It Doesn't Push You. It Clears the Floor."

**3-step mechanism** (numbered, horizontal on desktop / stacked on mobile):
1. **Absorbs in 20–30 min** — The stack enters clean. Green tea caffeine + L-Theanine begin smoothing your baseline.
2. **Stabilizes your window** — Alpha-GPC and Ginseng extend the window. You get 3–5 hours of usable focus, not a 45-minute sprint.
3. **Exits clean** — No crash. No rebound. No cortisol spike. The session ends; you're not wired at midnight.

`[PLACEHOLDER: mechanism diagram / timeline graphic]`

### 7. Comparison Table
**Section eyebrow:** `THE HONEST COMPARISON`

**Headline:**
> "Coffee Is a Gamble. This Is a System."

**Table columns:** Mindor · Coffee · Pre-Workout · Nothing

**Rows:**
- Onset predictability
- Duration of focus window
- Crash / rebound
- Sleep impact
- Jitter / anxiety risk
- Ingredient transparency
- Designed for sustained deep work

Mindor cells: ✓ checkmark, Sprint Blue. Others: ✗ or neutral (honest — not all-negative on competitors).

### 8. Testimonials
**Section eyebrow:** `FIELD REPORTS`

**Headline:**
> "From People Doing The Same Kind of Work."

**3 testimonial cards.** Each: quote, name, role. Avatar placeholder.

1. `[PLACEHOLDER: avatar]` — "I've tried every nootropic stack on the market. Mindor is the first one where I can point to exactly what each ingredient does and why. The 3-hour focus window is real." — **Marcus T., Senior Security Engineer**

2. `[PLACEHOLDER: avatar]` — "I do quantitative research. I need to hold a lot of state in my head for hours at a time. The difference with Mindor is I don't feel the friction anymore." — **Leila K., Quant Analyst**

3. `[PLACEHOLDER: avatar]` — "I was skeptical — I've been burned by 'focus supplements' before. But there are no proprietary blends here. Every dose is on the label. That alone got me to try it." — **James R., AI Consultant**

### 9. Science / Clinical Callout
Background: `--deep-work-black` (dark inversion section for contrast/pacing)

**Section eyebrow:** `THE SCIENCE`

**Headline (white):**
> "Every Dose Is Published. No Hiding Behind 'Blends.'"

**3 callout stats** (large Barlow Condensed numbers, white):
- `200mg` L-Theanine — the dose used in peer-reviewed calm-alertness research
- `300mg` Alpha-GPC — clinically studied dose for cognitive function
- `2:1` Theanine-to-Caffeine ratio — the ratio studied for optimal focus without anxiety

**Body:** Short paragraph on no proprietary blends, full label transparency, third-party testing.

`[PLACEHOLDER: lab/testing certification badge or imagery]`

### 10. Guarantee
**Section eyebrow:** `RISK-FREE`

**Headline:**
> "If Your Brain Doesn't Notice It, We'll Give You Your Money Back."

**30-day guarantee details:** Plain language, no asterisks. Try it for a full month. If it doesn't work for you, email for a full refund.

`[PLACEHOLDER: guarantee badge / seal icon]`

### 11. FAQ
**Section eyebrow:** `QUESTIONS`

**6 accordion items** (open/close on click, animated with `transform`):

1. **How is this different from a pre-workout?** — Pre-workouts are built for physical output — high stimulants, vasodilators, creatine. Mindor is built for cognitive output. Lower, cleaner caffeine. Compounds that support memory encoding and sustained attention.
2. **Will I feel jittery?** — The 2:1 L-Theanine to caffeine ratio is specifically formulated to prevent that. L-Theanine smooths the caffeine response. Most users describe it as "alert but calm."
3. **When should I take it?** — 20–30 minutes before you need to be on. Morning sessions, pre-deep-work blocks, before a long debugging session or threat hunt.
4. **Can I take it with coffee?** — You can, but you won't need to after a few days. The caffeine dose (100mg) is intentionally moderate — about the same as a strong cup.
5. **Is there a crash?** — No. The clean exit is a design feature. Green tea caffeine metabolizes differently than synthetic caffeine — the drop-off is gradual, not a cliff.
6. **How long until I notice a difference?** — Most users feel it the first session. The compounding effect (Alpha-GPC's acetylcholine support) builds over 2–3 weeks.

### 12. Bundle Builder (CTA Widget) — Full Spec
Appears in Hero (§2) and as a standalone full-width section here.

**Widget structure:**

**Step 1 — Quantity (serves as "how many tubs"):**
3 selector cards in a row:
- `20 Servings` / 1 tub / $[PRICE_1] per tub
- `40 Servings` / 2 tubs / $[PRICE_2] per tub · "Save 10%" badge
- `60 Servings` / 3 tubs / $[PRICE_3] per tub · "Most Popular" badge · "Save 15%" badge

Selected card: Sprint Blue border + background tint. Default: 60 Servings selected.

**Step 2 — Flavor selector:**
3 flavor pills (horizontal): Violet Frost · Glacier Blue · Solar Orange  
Selected: Sprint Blue fill. Default: Violet Frost.

**Step 3 — Subscribe & Save toggle:**
Pre-checked checkbox. Label: "Subscribe & Save — 15% off every order"  
Sub-label (when checked): "Cancel anytime · Ships every 30 days"  
When unchecked: label changes to "One-Time Purchase" · prices revert to base.

**Pricing logic (JS):**
```
BASE prices: [PRICE_1, PRICE_2, PRICE_3] per tub (1/2/3 tubs)
Bundle discount: 1 tub = 0%, 2 tubs = 10%, 3 tubs = 15%
S&S discount: additional 15% on top of bundle price

displayPrice = basePricePerTub × qty × (1 - bundleDiscount) × (1 - subscribeDiscount)
```
Prices shown: per-tub price (large) + total order price (smaller, below)  
Crossed-out original price shown when discount applies.

**CTA button:** "Get Mindor" · Sprint Blue fill · full width · Barlow Condensed 800 · 18px

**Below button:** Free shipping badge · 30-day guarantee badge · Secure payment badge

### 13. Footer
- Left: M-Wave + MINDOR wordmark
- Center: nav links (placeholder) — About · Ingredients · Contact
- Right: "Performance Stack · Est. 2026"
- Bottom bar: © 2026 Mindor · Privacy · Terms
- Background: `--deep-work-black`

---

## Pricing Placeholder Values
Actual prices TBD. Build with these placeholder values (clearly flagged with `<!-- [CONFIRM PRICING] -->` comments):
- 1 tub base: $44.99
- 2 tubs base: $44.99 × 2 = $89.98 → 10% off → $80.98 total / $40.49 per tub
- 3 tubs base: $44.99 × 3 = $134.97 → 15% off → $114.72 total / $38.24 per tub
- S&S applied on top of those totals

---

## Technical Notes

- **Vanilla HTML/CSS/JS only** — no framework, no build step
- **All styles inline** in the HTML file
- **Mobile-first** — breakpoint at 768px
- **Animations:** `transform` + `opacity` only — no `transition-all`
- No `position: sticky` on content in unequal grids
- Shadows always color-tinted with Sprint Blue rgba
- `[PLACEHOLDER: ...]` comments everywhere an image/asset is needed
- No checkout wiring — CTA button is a placeholder `<button>` or `<a href="#">`
- JS limited to: bundle builder pricing logic + FAQ accordion + nav scroll behavior

---

## Copy Rules

All copy must pass through `human-copy-voice` + `mindor-dr-copy` skills before finalizing:
- No founder/operator framing — cognitive worker identity only
- Avatar language: "brain fog," "sustained focus," "crunch session," "deep work block," "can't hold state," "mental fatigue"
- No wellness softness — clinical, direct, credible
- No hustle-culture — the work matters, not the grind
- No bro-science — every claim tied to a compound and mechanism
