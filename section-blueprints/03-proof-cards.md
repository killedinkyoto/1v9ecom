# Section Blueprint: Social Proof Cards

## Purpose
A horizontally scrollable row of testimonial cards with star ratings, quotes, and author attribution. Drag-to-scroll on desktop, swipe on mobile. Supports any number of cards — 4–8 is the sweet spot. Acts as a social proof anchor mid-page.

---

## Brand Assets Required

| Asset | Description |
|---|---|
| `ACCENT_COLOR` | Star color and section-label color. |
| `SURFACE_COLOR` | Card background color. |
| `SURFACE2_COLOR` | Section/page background (cards sit on top of this). |
| `BORDER_COLOR` | Card border — typically brand border token at low opacity. |
| `TEXT_PRIMARY` | Author name color. |
| `TEXT_MUTED` | Author role and "scroll for more" hint color. |
| `FOG_GREY` | Quote body text color. |

---

## Copy Slots

### Section Header
| Slot | Description |
|---|---|
| `REVIEW_COUNT` | Number (e.g. "500+"). Displayed in the heading. |
| `SECTION_HEADING` | e.g. "Reviewed by 500+ High Performers" |
| `SECTION_SUBHEAD` | e.g. "Founders, students, and builders who stopped crashing at 2pm." |

### Per Card (repeat for each testimonial)
| Slot | Description |
|---|---|
| `QUOTE` | The testimonial body. First person, informal, specific outcome. 20–80 words. |
| `AUTHOR_NAME` | First name + last initial (e.g. "Patel S.") |
| `AUTHOR_ROLE` | Short descriptor — job title, student type, etc. (e.g. "Product Designer") |

---

## HTML Structure

```html
<section id="s-proof">
  <div class="container">

    <!-- Section header -->
    <div class="proof-header">
      <div class="proof-header-stars">★★★★★</div>
      <h2 class="proof-heading">[SECTION_HEADING]</h2>
      <p class="proof-sub">[SECTION_SUBHEAD]</p>
    </div>

    <!-- Scrollable card row -->
    <div class="proof-grid" id="proofGrid">

      <div class="proof-card">
        <div class="proof-card-stars">★★★★★</div>
        <p class="proof-quote">[QUOTE_1]</p>
        <div class="proof-attr">
          <div>
            <div class="proof-name">[AUTHOR_NAME_1]</div>
            <div class="proof-role">[AUTHOR_ROLE_1]</div>
          </div>
        </div>
      </div>

      <!-- Repeat .proof-card for each testimonial -->

    </div>

    <!-- Scroll hint (hidden on desktop via CSS if desired) -->
    <div class="proof-scroll-hint">
      <span class="proof-scroll-hint-arrow">›</span>
      <span>Scroll for more</span>
      <span class="proof-scroll-hint-arrow">›</span>
    </div>

  </div>
</section>
```

---

## Key CSS

```css
#s-proof {
  padding: 80px 0;
  background: [SURFACE2_COLOR];
  border-top: 0.5px solid [BORDER_COLOR];
  border-bottom: 0.5px solid [BORDER_COLOR];
}

/* Header */
.proof-header { text-align: center; margin-bottom: 48px; }
.proof-header-stars { font-size: 18px; color: [ACCENT_COLOR]; letter-spacing: 4px; margin-bottom: 14px; }
.proof-heading {
  font-family: [DISPLAY_FONT], sans-serif;
  font-weight: 800;
  font-size: clamp(24px, 4vw, 36px);
  color: [TEXT_PRIMARY];
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: 8px;
}
.proof-sub { font-size: 14px; color: [TEXT_MUTED]; }

/* Scrollable row */
.proof-grid {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 20px;
  padding-bottom: 20px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;    /* Firefox */
  cursor: grab;
  user-select: none;
}
.proof-grid::-webkit-scrollbar { display: none; }
.proof-grid.is-dragging { cursor: grabbing; }

/* Individual card */
.proof-card {
  background: [SURFACE_COLOR];
  border: 0.5px solid [BORDER_COLOR];
  border-radius: 6px;
  padding: 28px 26px;
  flex: 0 0 300px;
  scroll-snap-align: start;
}
.proof-card-stars { font-size: 11px; color: [ACCENT_COLOR]; letter-spacing: 2.5px; margin-bottom: 14px; }

/* Quote with decorative opening mark */
.proof-quote {
  font-size: 14px;
  color: [FOG_GREY];
  line-height: 1.72;
  margin-bottom: 22px;
}
.proof-quote::before {
  content: '\201C';
  font-size: 26px;
  color: rgba([ACCENT_COLOR_RGB], 0.22);
  line-height: 0;
  vertical-align: -8px;
  margin-right: 2px;
  font-family: Georgia, serif;
}

/* Attribution */
.proof-attr { display: flex; align-items: center; gap: 12px; }
.proof-name { font-size: 13px; font-weight: 600; color: [TEXT_PRIMARY]; line-height: 1.2; }
.proof-role { font-size: 11px; color: [TEXT_MUTED]; margin-top: 2px; }

/* Scroll hint */
.proof-scroll-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
}
.proof-scroll-hint span { font-size: 11px; color: [TEXT_MUTED]; letter-spacing: 0.08em; text-transform: uppercase; }
.proof-scroll-hint-arrow {
  color: [ACCENT_COLOR];
  font-size: 14px;
  animation: hint-pulse 1.8s ease-in-out infinite;
}

@keyframes hint-pulse {
  0%, 100% { opacity: 0.4; transform: translateX(0); }
  50%       { opacity: 1;   transform: translateX(4px); }
}

@media (max-width: 640px) {
  #s-proof { padding: 60px 0; }
  .proof-card { flex: 0 0 280px; }
}
```

---

## JavaScript: Drag-to-Scroll

```js
(function() {
  var grid = document.getElementById('proofGrid');
  if (!grid) return;
  var isDown = false, startX, scrollLeft;

  grid.addEventListener('mousedown', function(e) {
    isDown = true;
    grid.classList.add('is-dragging');
    startX = e.pageX - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
    e.preventDefault();
  });
  document.addEventListener('mouseup', function() {
    isDown = false;
    grid.classList.remove('is-dragging');
  });
  grid.addEventListener('mousemove', function(e) {
    if (!isDown) return;
    var x = e.pageX - grid.offsetLeft;
    var walk = (x - startX) * 1.5;
    grid.scrollLeft = scrollLeft - walk;
  });
})();
```

Touch scrolling is handled natively by the browser via `overflow-x: auto` and `-webkit-overflow-scrolling: touch`.

---

## Design Notes
- Card width is fixed (`flex: 0 0 300px`) so partial cards always peek at the right edge — signals scrollability
- Keep quotes unedited and informal — polished testimonials convert less than real ones
- Author role should be just specific enough to identify the customer archetype without being verifiable
- The decorative `::before` quote mark uses the brand accent at very low opacity — adjust `rgba` to suit

---

## Accessibility
- `proof-grid` is `overflow-x: auto` so keyboard users can scroll with arrow keys (native)
- Cards have no interactive elements — no extra ARIA needed
- `proof-scroll-hint` animation respects `prefers-reduced-motion` if you add the media query
