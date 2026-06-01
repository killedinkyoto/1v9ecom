# Section Blueprint: FAQ Accordion

## Purpose
Handles pre-purchase objections and common questions. Each item has a question as the trigger and an answer that expands on click. Closing one item does not automatically close others — all items can be open simultaneously. The `+` icon rotates to `×` when open.

---

## Brand Assets Required

| Asset | Description |
|---|---|
| `BG_COLOR` | Section background. |
| `ACCENT_COLOR` | Expand icon (`+`) color. |
| `TEXT_PRIMARY` | Question text color. |
| `FOG_GREY` | Answer body text color. |
| `BORDER_COLOR` | Top/bottom divider between items (low-opacity). |

---

## Copy Slots

### Section Label
| Slot | Description |
|---|---|
| `SECTION_LABEL` | Short uppercase label. Suggested: "Stuff People Ask Before They Buy" (more conversational than "FAQ"). |

### Per FAQ Item (repeat for each question)
| Slot | Description |
|---|---|
| `QUESTION` | Written as a first-person quote in quotation marks — sounds like the customer is asking it (e.g. `"What is inositol, and why is it the main thing?"`). |
| `ANSWER` | Direct, honest answer. 2–6 sentences. Address the real concern, including things that might disqualify the product. Avoid marketing fluff. |

**Recommended question categories to cover:**
- What is the key/novel ingredient, and why
- Does it replace existing habits (coffee, etc.)
- Common skepticism ("I've tried things before and felt nothing")
- Side effects / jitters
- Crash / wear-off
- Ingredient transparency concern (sweeteners, blends, etc.)
- Guarantee / return policy

---

## HTML Structure

```html
<section id="faq">
  <div class="container">
    <span class="section-label">[SECTION_LABEL]</span>

    <div class="faq-list" id="faqList">

      <!-- Repeat this block for each FAQ item -->
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">
          "[QUESTION]"
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-a" role="region">
          <div class="faq-a-inner">[ANSWER]</div>
        </div>
      </div>

    </div>
  </div>
</section>
```

---

## Key CSS

```css
#faq {
  background: [BG_COLOR];
  padding: 64px 0;
}
@media (min-width: 768px) { #faq { padding: 100px 0; } }

.faq-list { margin-top: 8px; }

/* Dividers */
.faq-item { border-bottom: 0.5px solid [BORDER_COLOR]; }
.faq-item:first-child { border-top: 0.5px solid [BORDER_COLOR]; }

/* Question button */
.faq-q {
  width: 100%;
  background: none;
  border: none;
  color: [TEXT_PRIMARY];
  font-family: [DISPLAY_FONT], sans-serif;
  font-weight: 700;
  font-size: 17px;
  text-align: left;
  padding: 18px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  line-height: 1.3;
}
.faq-q:focus-visible {
  outline: 2px solid [ACCENT_COLOR];
  outline-offset: 2px;
  border-radius: 2px;
}

/* Expand icon — rotates on open */
.faq-icon {
  font-size: 22px;
  color: [ACCENT_COLOR];
  font-family: [BODY_FONT], sans-serif;
  font-weight: 300;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  line-height: 1;
}
.faq-item.open .faq-icon { transform: rotate(45deg); }

/* Answer — collapsed by default, expands to max-height */
.faq-a {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease;
}
.faq-item.open .faq-a { max-height: 400px; }

.faq-a-inner {
  padding: 0 0 20px;
  font-family: [BODY_FONT], sans-serif;
  font-size: 14px;
  color: [FOG_GREY];
  line-height: 1.7;
  max-width: 640px;
}
```

---

## JavaScript

```js
document.getElementById('faqList').addEventListener('click', function(e) {
  var btn = e.target.closest('.faq-q');
  if (!btn) return;
  var item = btn.closest('.faq-item');
  var isOpen = item.classList.contains('open');

  // Toggle clicked item
  item.classList.toggle('open', !isOpen);
  btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
});
```

**Accordion mode** (only one open at a time) — alternative:
```js
document.getElementById('faqList').addEventListener('click', function(e) {
  var btn = e.target.closest('.faq-q');
  if (!btn) return;
  var item = btn.closest('.faq-item');
  var isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item').forEach(function(i) {
    i.classList.remove('open');
    i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
  });

  // Open clicked (unless it was already open)
  if (!isOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
});
```

The default (non-accordion) behavior allows multiple items open simultaneously, which is generally better for UX since users may want to read several answers without hunting through each one.

---

## Design Notes
- Questions written in first-person quotes convert better than third-person ("How does X work?")
- Answers should acknowledge valid concerns directly — including things that might disqualify the product (e.g., "Yes, it contains sucralose"). This builds trust rather than eroding it.
- Max 8–10 items recommended. Beyond that, break into categories.
- `max-height: 400px` on `.faq-item.open .faq-a` — increase to `600px` or more if any answers are very long.

---

## Accessibility
- Each `.faq-q` is a `<button>` with `aria-expanded` updated by JS
- The answer div has `role="region"` — semantically associates it with the button
- Keyboard: Tab to navigate, Enter/Space to toggle (native button behavior)
- `.faq-icon` is `aria-hidden="true"` — decorative
