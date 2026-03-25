# CLAUDE.md — Mindor 1v9ecom Frontend Rules

> **Self-update rule:** Whenever you learn something that would make future sessions faster, more accurate, or less likely to repeat a mistake — add it here immediately. Keep it concise and actionable.

---

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- **Read `brand_assets/mindor-brand-guidelines_1.html`** before designing any new page or section — it is the canonical brand reference.

---

## Project Layout

This is a **vanilla HTML/CSS/JS** project. No build step, no framework, no TypeScript.

```
1v9ecom-main/                     ← repo root
├── serve.mjs                     ← dev server (port 3000)
├── screenshot.mjs                ← Puppeteer screenshot tool
├── package.json                  ← devDep: puppeteer only
├── vercel.json                   ← root-level Vercel routing
│
└── 1v9ecom/                      ← Git submodule (all source files live here)
    ├── CLAUDE.md                 ← this file
    ├── vercel.json               ← submodule-level routing
    ├── index.html                ← served at / by serve.mjs
    ├── mindor-product-page.html  ← main product page (~3,080 lines)
    ├── mindor-checkout.html      ← Supabase checkout flow
    ├── bundle.html               ← Shopify Storefront bundle builder (reference for checkout pattern)
    ├── squeeze-brain-noise.html  ← Funnel entry: free HVCO (Brain Noise Cheat Sheet)
    ├── upsell-1-deep-work-planner.html  ← Upsell 1: $7.99 digital PDF
    ├── upsell-2-mindor-tub.html  ← Upsell 2: $36.54 tub (15% off via HVCO-STACK code)
    ├── funnel-thankyou.html      ← Thank-you page for free-only subscribers
    ├── protocolcard.html         ← Protocol reference card
    ├── assets/
    │   └── brain-noise-cheat-sheet.pdf  ← Free HVCO PDF delivered after opt-in
    └── brand_assets/
        ├── mindor-brand-guidelines_1.html  ← CANONICAL brand reference (read-only)
        └── *.docx                           ← Business docs (not used by code)
```

---

## Vercel Routes (Production)

Root `vercel.json`:
- `/` → `1v9ecom/mindor-product-page.html`
- `/checkout` → `1v9ecom/mindor-checkout.html`

Submodule `1v9ecom/vercel.json`:
- `/checkout` → `mindor-checkout.html`
- `/bundle` → `bundle.html`

---

## HVCO Funnel Flow

```
squeeze-brain-noise.html
  → (on Klaviyo subscribe) → upsell-1-deep-work-planner.html
      → accept ($7.99)     → upsell-2-mindor-tub.html
      → decline            → funnel-thankyou.html
           → upsell-2: accept ($36.54 tub) → Shopify checkout (digital + tub)
           → upsell-2: decline             → Shopify checkout (digital only)
```

Timer: 5-min countdown starts on upsell-1, persists to upsell-2 via `sessionStorage` key `mindor_upsell1_timer_end`.

---

## Shopify Config (from bundle.html — use as reference for all checkout flows)

```js
SHOPIFY_DOMAIN       = 'mindor-1950.myshopify.com'
STOREFRONT_TOKEN     = 'c1f8ad6a65722ad1a022b7e5f8a8660c'
API_VERSION          = '2024-01'

// Tub variants
Sour Candy           gid://shopify/ProductVariant/48144449568923
Sour Grape           gid://shopify/ProductVariant/48144474931355
Sour Gummy Worms     gid://shopify/ProductVariant/48144477651099

// Digital product
Deep Work Planner    gid://shopify/ProductVariant/8954983907483

// Tub discount (15% off tub only — must be configured in Shopify admin)
Discount code        HVCO-STACK
```

Checkout uses Shopify Storefront API `cartCreate` mutation → redirects to `checkoutUrl`.

---

## Klaviyo Config

```js
KLAVIYO_PUBLIC_KEY = 'S3D76Q'
KLAVIYO_LIST_ID    = 'TUAJJE'
```

**One list, three segments** — profile properties set at each funnel stage:
- `hvco_free: true` — submitted squeeze page
- `hvco_digital: true` — accepted upsell 1
- `hvco_tub: true` — accepted upsell 2

Segments are mutually exclusive via AND/NOT conditions in Klaviyo. Re-calling the subscribe API with the same email updates the profile, never duplicates.

API endpoint: `POST https://a.klaviyo.com/client/subscriptions/?company_id={PUBLIC_KEY}`

---

## Brand Quick Reference

| Token | Value |
|---|---|
| `--execution-green` | `#E2FF47` |
| `--bg` | `#111309` |
| `--surface` | `#161A0E` |
| `--surface2` | `#1E2416` |
| `--text-primary` | `#F0F0E8` |
| `--fog-grey` | `#C8C9B8` |
| `--text-muted` | `#6A7A5A` |
| `--border` | `rgba(235,255,71,0.12)` |

**Fonts:** `Barlow Condensed` 900/800/700 (headlines) · `DM Sans` 300–600 (body)

**Voice:** Performance-focused, anti-hype, direct. Avatar language: "can't lock in", "wired but tired", "brain noise", "execution focus". Target: founders/operators/creators/students, 21–32.

**Never:** hardcode hex values — always use CSS tokens. Never use Tailwind default palette.

---

## Local Server & Screenshot Workflow

```bash
# Start server (background, only if not already running)
node serve.mjs

# Screenshot — always from localhost, never file:///
node screenshot.mjs http://localhost:3000 [optional-label]
node screenshot.mjs http://localhost:3000/1v9ecom/squeeze-brain-noise.html squeeze

# Output: ./temporary screenshots/screenshot-N[-label].png
```

**Puppeteer executable:**
`C:/Users/jomat_nweuhlk/.cache/puppeteer/chrome/win64-146.0.7680.76/chrome-win64/chrome.exe`

Viewport: 1440×900. `fullPage: false` (viewport only).

**Screenshot workflow for frontend edits:**
1. Make the edit
2. `node screenshot.mjs <url> <label>`
3. Read the PNG with the Read tool and analyze visually
4. Fix mismatches, re-screenshot
5. Repeat until clean — minimum 2 rounds before stopping

---

## Output Defaults

- All styles inline in the HTML file — no external stylesheets
- No Tailwind unless already present in the file being edited
- Mobile-first responsive
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`

---

## Anti-Generic Guardrails

- **Colors:** Never use default Tailwind palette. Derive from brand tokens.
- **Shadows:** Layered, color-tinted, low opacity — never flat `shadow-md`.
- **Typography:** Barlow Condensed (display) + DM Sans (body) — never same font for both.
- **Gradients:** Layer multiple radial gradients. SVG noise filter for texture/depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states.
- **Depth:** Surfaces use layering system: base → elevated → floating.
- **Spacing:** Consistent spacing tokens — not arbitrary values.

---

## Hard Rules

- Do not add sections or features not explicitly requested
- Do not "improve" designs beyond what was asked — match intent
- Do not stop after one screenshot pass — minimum 2 rounds
- Do not use `transition-all`
- Do not use `position: sticky` on product visuals or content columns — causes elements to appear pinned while scrolling through taller adjacent columns
- Do not start a second dev server if one is already running on port 3000
- The `1v9ecom/` folder is a Git submodule — it has its own `.git` and must be committed/pushed separately from the parent repo

---

## Known Patterns & Lessons Learned

- **Sticky layout bug:** A two-column grid with `align-items: start` and unequal column heights visually mimics `position: sticky`. Fix by switching to `flex-direction: column` or ensuring columns have similar heights.
- **Klaviyo duplicates:** Calling the subscribe API multiple times with the same email is safe — it updates the profile, it never creates duplicates.
- **Timer persistence across funnel pages:** Use a single shared `sessionStorage` key (`mindor_upsell1_timer_end`) on both upsell pages so the countdown continues without resetting.
- **Shopify discount scoping:** Append `?discount=CODE` to the checkout URL. The discount must be configured in Shopify admin to apply to specific products only (not the whole order).
- **`.docx` files are not readable** by the Read tool — they are binary. Use the brand guidelines HTML (`brand_assets/mindor-brand-guidelines_1.html`) as the design reference instead.
