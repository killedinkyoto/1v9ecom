# Section Blueprint: Social Proof Ticker

## Purpose
A full-bleed, infinitely scrolling strip of short testimonial snippets. High-density social proof. Placed after the hero and again just before the purchase section for a second hit of credibility before checkout. Pauses on hover.

---

## Brand Assets Required

| Asset | Description |
|---|---|
| `ACCENT_COLOR` | Background color of the ticker strip (high-contrast, bold). Stars inside will use a contrasting color. |
| `STAR_COLOR` | Star character color — should contrast with `ACCENT_COLOR`. |
| `TEXT_COLOR` | Snippet text color — should contrast with `ACCENT_COLOR`. |

> The ticker background is typically the brand's primary accent/action color (e.g. a bright green or yellow-green), giving it maximum visual weight between sections.

---

## Copy Slots

Provide 6–10 short review snippets. Each should be:
- First-person, informal
- 8–20 words
- Specific outcome or observation (not generic praise)
- Written as if texted to a friend, not submitted in a form

```
SNIPPET_1 = "shipped that project i'd been putting off for like 2 weeks lol"
SNIPPET_2 = "the 3pm crash is literally just gone?? idk what they put in this"
SNIPPET_3 = "studied 4 hours and didn't check my phone once"
SNIPPET_4 = "still drink my coffee just don't need the second one anymore"
SNIPPET_5 = "doesn't feel like a jolt just kinda... locked in"
SNIPPET_6 = "ok i was skeptical but this actually works"
SNIPPET_7 = "my afternoons are actually useful now which is insane"
SNIPPET_8 = "felt it within like 20 min and just started working"
```

---

## HTML Structure

```html
<div class="proof-ticker-wrap" aria-hidden="true">
  <div class="proof-ticker-track">

    <!-- === Original set === -->
    <div class="proof-ticker-item">
      <span class="proof-ticker-stars">★★★★★</span>
      "[SNIPPET_1]"
    </div>
    <div class="proof-ticker-dot">·</div>

    <div class="proof-ticker-item">
      <span class="proof-ticker-stars">★★★★★</span>
      "[SNIPPET_2]"
    </div>
    <div class="proof-ticker-dot">·</div>

    <!-- ...repeat for all snippets... -->

    <!-- === Duplicate set (identical) for seamless loop === -->
    <div class="proof-ticker-item">
      <span class="proof-ticker-stars">★★★★★</span>
      "[SNIPPET_1]"
    </div>
    <div class="proof-ticker-dot">·</div>

    <!-- ...repeat duplicates... -->

  </div>
</div>
```

> **Seamless loop:** The track contains two identical sets of items. The CSS animation scrolls `translateX(0)` → `translateX(-50%)`, which lands exactly where the duplicate begins — creating a seamless infinite loop with no JS required.

---

## Key CSS

```css
.proof-ticker-wrap {
  overflow: hidden;
  padding: 14px 0;
  background: [ACCENT_COLOR];
}

.proof-ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-scroll 90s linear infinite;
}

/* Pause on hover */
.proof-ticker-track:hover {
  animation-play-state: paused;
}

.proof-ticker-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 44px;
  white-space: nowrap;
  font-size: 13px;
  color: [TEXT_COLOR];
  font-family: [BODY_FONT], sans-serif;
}

.proof-ticker-stars {
  font-size: 10px;
  color: [STAR_COLOR];
  letter-spacing: 2px;
  flex-shrink: 0;
}

.proof-ticker-dot {
  color: rgba([TEXT_COLOR_RGB], 0.4);
  font-size: 16px;
  line-height: 1;
}

@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

### Speed Tuning
- `90s` = slow, comfortable read speed (recommended default)
- `60s` = faster, higher energy
- `120s` = very leisurely — use if you have fewer than 6 snippets

---

## No JavaScript Required
The loop is pure CSS. The only reason you'd add JS is if you want to:
- Detect `prefers-reduced-motion` and disable the animation
- Dynamically inject snippets from a CMS or API

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .proof-ticker-track { animation: none; }
}
```

---

## Placement Notes
- Can appear multiple times on the page — typically once after the hero, and once above the purchase section
- `aria-hidden="true"` on the wrapper — purely decorative, not read by screen readers
- Never put important information inside the ticker (it's supplemental, not navigable)
