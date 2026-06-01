# Section Blueprint: Ingredients / What's In The Scoop

## Purpose
Builds ingredient-level trust by listing every compound with its dose and purpose — no proprietary blends, full transparency. One "hero" ingredient gets a featured card treatment; all others are in a collapsible grid. On desktop all ingredients are fully visible; on mobile they're collapsed by default with an expand toggle.

---

## Brand Assets Required

| Asset | Description |
|---|---|
| `CREAM_BG` | Background color for this section — typically lighter/warmer than the main background to create a visual break and contrast. |
| `CARD_BG` | Background for the hero ingredient card and ingredient grid cards. |
| `ACCENT_COLOR` | Badge color, dose label color, expand toggle icon color. |
| `TEXT_PRIMARY` | Ingredient names and card title. |
| `TEXT_MUTED` | Section label, footnote. |
| `FOG_GREY` | Body text color for ingredient descriptions. |
| `BORDER_COLOR` | Card border — low-opacity accent. |

---

## Copy Slots

### Section Header
| Slot | Description |
|---|---|
| `SECTION_LABEL` | Tiny uppercase label (e.g. "What's In The Scoop"). |
| `SECTION_INTRO` | 1–2 sentences. Establish transparency positioning. e.g. "Every ingredient has a job. Every dose is printed on the label. No proprietary blends." |

### Hero Ingredient Card
| Slot | Description |
|---|---|
| `HERO_BADGE_TEXT` | Positioning badge text (e.g. "The Steady Base", "The Core Driver"). |
| `HERO_NAME` | Ingredient name + dose (e.g. "Inositol — 600mg"). |
| `HERO_BODY` | 2–4 sentences explaining what this ingredient does mechanically and why the dose matters. Lead with mechanism, not just benefit. |

### Ingredient Grid (repeat per ingredient)
| Slot | Description |
|---|---|
| `DOSE` | Amount (e.g. "200mg", "Complex", "5mg"). |
| `NAME` | Ingredient name (e.g. "Caffeine, from green tea"). |
| `PREVIEW` | 3–8 word teaser shown on mobile collapsed state (e.g. "The alertness signal."). |
| `FULL_DESCRIPTION` | 1–3 sentences shown when expanded / always on desktop. Explains mechanism. |

### Footer Note
| Slot | Description |
|---|---|
| `FOOTER_NOTE` | One sentence (italic). Credibility reinforcement. e.g. "Every dose is on the label. No proprietary blends. Third-party tested." |

---

## HTML Structure

```html
<section id="scoop">
  <div class="container">
    <span class="section-label">[SECTION_LABEL]</span>
    <p class="scoop-intro">[SECTION_INTRO]</p>

    <!-- Hero Ingredient Card -->
    <div class="inositol-card">
      <span class="inositol-badge">[HERO_BADGE_TEXT]</span>
      <h3 class="inositol-title">[HERO_NAME]</h3>
      <p class="inositol-body">[HERO_BODY]</p>
    </div>

    <!-- Ingredient Grid -->
    <div class="ingredient-grid">

      <!-- Repeat this block for each ingredient -->
      <div class="ingredient-card" id="ing-[slug]">
        <div class="ing-header">
          <span class="ing-dose">[DOSE]</span>
          <span class="ing-name">[NAME]</span>
          <button class="ing-toggle"
            aria-expanded="false"
            data-card="ing-[slug]"
            aria-label="Expand [NAME] details">+</button>
        </div>
        <p class="ing-preview">[PREVIEW]</p>
        <div class="ing-full"><p>[FULL_DESCRIPTION]</p></div>
      </div>

    </div>

    <p class="scoop-footer-note"><em>[FOOTER_NOTE]</em></p>
  </div>
</section>
```

---

## Key CSS

```css
#scoop {
  background: [CREAM_BG];
  padding: 64px 0;
}
@media (min-width: 768px) { #scoop { padding: 100px 0; } }

.scoop-intro {
  font-size: 15px;
  color: [TEXT_MUTED];
  margin-bottom: 32px;
  line-height: 1.65;
  max-width: 580px;
}

/* Hero card */
.inositol-card {
  background: [CARD_BG];
  border: 0.5px solid [ACCENT_COLOR];
  border-radius: 6px;
  padding: 28px 24px;
  box-shadow: 0 4px 24px rgba([ACCENT_RGB], 0.10), 0 1px 4px rgba(0,0,0,0.04);
  margin-bottom: 20px;
}
.inositol-badge {
  display: inline-block;
  background: [ACCENT_COLOR];
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 2px;
  margin-bottom: 14px;
}
.inositol-title {
  font-family: [DISPLAY_FONT], sans-serif;
  font-weight: 800;
  font-size: clamp(26px, 6vw, 36px);
  color: [TEXT_PRIMARY];
  line-height: 1.0;
  margin-bottom: 14px;
}
.inositol-body {
  font-size: 15px;
  color: [FOG_GREY];
  line-height: 1.65;
}

/* Ingredient grid — 1 col mobile, 2 col desktop */
.ingredient-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
@media (min-width: 600px) {
  .ingredient-grid { grid-template-columns: 1fr 1fr; }
}

.ingredient-card {
  background: [CARD_BG];
  border: 0.5px solid rgba([ACCENT_RGB], 0.15);
  border-radius: 4px;
  padding: 14px 16px;
}

.ing-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.ing-dose {
  font-family: [DISPLAY_FONT], sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: [ACCENT_COLOR];
  text-transform: uppercase;
  flex-shrink: 0;
}
.ing-name {
  font-family: [DISPLAY_FONT], sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: [TEXT_PRIMARY];
  text-transform: uppercase;
  flex: 1;
  line-height: 1.15;
}
.ing-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: [ACCENT_COLOR];
  font-size: 20px;
  line-height: 1;
  padding: 0 0 0 6px;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}
.ingredient-card.expanded .ing-toggle { transform: rotate(45deg); }
.ingredient-card.expanded .ing-preview { display: none; }

.ing-preview {
  font-size: 12px;
  color: [FOG_GREY];
  line-height: 1.5;
}
.ing-full {
  font-size: 12px;
  color: [FOG_GREY];
  line-height: 1.55;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.ingredient-card.expanded .ing-full { max-height: 200px; }

/* Desktop: always show full, hide toggle and preview */
@media (min-width: 768px) {
  .ing-full { max-height: none !important; overflow: visible; }
  .ing-preview { display: none; }
  .ing-toggle { display: none; }
}

.scoop-footer-note {
  font-size: 12px;
  color: [FOG_GREY];
  text-align: center;
  margin-top: 24px;
  font-style: italic;
  opacity: 0.7;
}
```

---

## JavaScript: Expand/Collapse Toggle (Mobile)

```js
document.querySelectorAll('.ing-toggle').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var cardId = btn.getAttribute('data-card');
    var card = document.getElementById(cardId);
    if (!card) return;
    var isExpanded = card.classList.toggle('expanded');
    btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  });
});
```

---

## Design Notes
- The hero ingredient card gets full-color accent border + box-shadow — it's the key differentiator ingredient
- Remaining ingredients use the lighter grid treatment
- On mobile, users tap `+` to reveal the full description — the toggle rotates to `×`
- On desktop (≥768px), all full descriptions are always visible and toggles are hidden
- `DOSE` label uses the accent color — draws the eye to the numbers (transparency signal)
- Keep `FULL_DESCRIPTION` mechanistic ("supports X by doing Y"), not just benefit-claim ("helps you focus")

---

## Accessibility
- Each toggle button has `aria-expanded` updated by JS
- Each toggle has a unique `aria-label` referencing the ingredient name
- The expand/collapse is purely visual — content is in the DOM regardless
