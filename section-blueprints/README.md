# Section Blueprints

Reusable build specs for product landing page sections. Each file is brand-agnostic — all brand-specific values (colors, fonts, copy, images, API keys) are marked as `[PLACEHOLDER]` or listed in the "Brand Assets Required" table at the top of each file.

To use: provide your brand tokens, copy, and assets wherever you see a `[BRACKETED]` placeholder.

---

## Index

| File | Section | Requires JS | Requires External API |
|---|---|---|---|
| [01-hero.md](01-hero.md) | Hero — product image, headline, animated CTA, nav | Yes (canvas beams + hover trail) | No |
| [02-proof-ticker.md](02-proof-ticker.md) | Scrolling testimonial ticker strip | No (pure CSS) | No |
| [03-proof-cards.md](03-proof-cards.md) | Draggable testimonial card row | Yes (drag-to-scroll) | No |
| [04-ingredients.md](04-ingredients.md) | Ingredients list with hero card + expand/collapse grid | Yes (toggle) | No |
| [05-offer-purchase-wizard.md](05-offer-purchase-wizard.md) | Full purchase wizard: carousel + bundle + flavors + gifts + order review | Yes (wizard, carousel, checkout) | Shopify Storefront API |
| [06-reviews.md](06-reviews.md) | Verified reviews: score block, bars, flat list, write-a-review popup | Yes (popup, star picker) | No (static data) |
| [07-faq.md](07-faq.md) | FAQ accordion | Yes (expand/collapse) | No |
| [08-comparison-table.md](08-comparison-table.md) | Head-to-head competitor comparison table | No (pure HTML/CSS) | No |

---

## Typical Page Order

```
Nav (sticky)
  ↓
Hero (01)
  ↓
Proof Ticker (02)
  ↓
[Problem/Mirror/Reframe sections — not yet templated]
  ↓
Proof Cards (03)
  ↓
Ingredients (04)
  ↓
Proof Ticker (02) — second instance above offer
  ↓
Offer / Purchase Wizard (05)
  ↓
Reviews (06)
  ↓
FAQ (07)
  ↓
Comparison Table (08)
  ↓
Final CTA
  ↓
Footer
```

---

## Global Brand Token Reference

Every blueprint references these tokens. Define them once in `:root {}` and apply throughout.

```css
:root {
  --accent:         [primary action color];
  --bg:             [page background];
  --surface:        [slightly elevated surface];
  --surface2:       [further elevated surface / card bg];
  --border:         rgba([accent-rgb], 0.14);
  --border-subtle:  rgba([accent-rgb], 0.08);
  --border-accent:  rgba([accent-rgb], 0.30);
  --text-primary:   [main text];
  --text-muted:     [secondary text];
  --text-dim:       [tertiary / placeholder text];
  --fog-grey:       [body copy color];
}
```

---

## Font Requirements

All blueprints assume two font roles:

| Role | Used for | CSS variable reference |
|---|---|---|
| `[DISPLAY_FONT]` | Headlines, product names, prices, section labels | Replace with your condensed/display typeface |
| `[BODY_FONT]` | Body copy, labels, buttons, metadata | Replace with your reading typeface |

Load both via `<link>` in the `<head>` before using any section.
