# Section Blueprint: Hero

## Purpose
The opening section. Sets the pain-aware positioning, shows the product, and drives scroll-down or CTA clicks. Should work on any performance/wellness/consumable product.

---

## Brand Assets Required

| Asset | Description |
|---|---|
| `PRODUCT_IMAGE` | Hero product shot (recommended: 380px wide, transparent or clean background). Displayed above the headline on mobile, centered on desktop. |
| `BRAND_LOGO_SVG` | Small SVG icon used in the nav wordmark alongside the brand name text. |
| `BRAND_NAME` | The brand wordmark text (e.g. "Flux", "Zenwave"). |
| `ACCENT_COLOR` | Primary accent/highlight color (used for headline accent span, badge stars, CTA arrow). |
| `BG_COLOR` | Page background color. |
| `TEXT_PRIMARY` | Main text color. |
| `TEXT_MUTED` | Secondary / supporting text color. |

---

## Copy Slots

| Slot | Description |
|---|---|
| `EYEBROW` | Tiny label above product image. Category + est. year, or mission statement. ~5–7 words. |
| `HEADLINE` | 6–12 word hook. Frames the problem the product solves. One `<span>` accent fragment at the end. |
| `SUBHEAD` | 1–2 sentence expansion of the headline. Names the real cause of the problem. ~25–40 words. |
| `SUPPORTING_COPY` | 1–2 sentences that complete the empathy loop — validates the reader's past behaviour before pitching. ~25–35 words. |
| `BADGE_TEXT` | Social proof phrase next to stars (e.g. "Loved by founders & operators"). |
| `CTA_LABEL` | Primary button text. Action-oriented, no price. (e.g. "Reveal The Solution"). |
| `TRUST_TAGLINE` | Italic micro-copy below CTA (e.g. "Made for people who can't afford a low-focus day."). |
| `NAV_CTA_LABEL` | Nav bar button text (e.g. "GET YOURS →"). |
| `NAV_CTA_HREF` | Anchor link or URL for the nav CTA (e.g. "#offer"). |
| `CTA_HREF` | Anchor link or URL for the hero CTA (e.g. "#steady-base"). |

---

## HTML Structure

```html
<!-- NAV -->
<nav id="nav">
  <div class="nav-inner">
    <a href="#hero" class="nav-logo">
      <!-- BRAND_LOGO_SVG goes here -->
      <span class="nav-wordmark">[BRAND_NAME]</span>
    </a>
    <a href="[NAV_CTA_HREF]" class="btn-primary nav-cta">[NAV_CTA_LABEL]</a>
  </div>
</nav>

<!-- HERO -->
<section id="hero">
  <canvas id="heroBeams" aria-hidden="true"></canvas>
  <!-- Mobile-only CSS beam fallback — no JS needed -->
  <div class="hero-mobile-fx" aria-hidden="true"></div>

  <div class="container">
    <div class="hero-inner">
      <p class="hero-eyebrow">[EYEBROW]</p>

      <div class="hero-product-wrap">
        <img src="[PRODUCT_IMAGE]" alt="[BRAND_NAME] product" loading="eager" fetchpriority="high" decoding="async">
      </div>

      <h1 class="hero-headline">
        [HEADLINE — plain text]<br><span class="h-accent">[HEADLINE_ACCENT — accent fragment]</span>
      </h1>

      <p class="hero-subhead">[SUBHEAD]</p>
      <p class="hero-copy">[SUPPORTING_COPY]</p>

      <div class="hero-cta-wrap">
        <!-- Social proof badge -->
        <div class="hero-badge">
          <span class="hero-badge-stars">★★★★★</span>
          <div class="hero-badge-row">
            <span class="hero-badge-laurel">&#10023;</span>
            <span class="hero-badge-text">[BADGE_TEXT]</span>
            <span class="hero-badge-laurel">&#10023;</span>
          </div>
        </div>

        <!-- Primary CTA — glass/frosted button with hover trail effect -->
        <a href="[CTA_HREF]" class="btn-hover">
          <span class="btn-hover-label">[CTA_LABEL]</span>
          <svg class="btn-hover-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>

      <p class="hero-trust"><em>[TRUST_TAGLINE]</em></p>
    </div>
  </div>
</section>
```

---

## Key CSS Classes

| Class | Role |
|---|---|
| `#nav` | Sticky nav, `backdrop-filter: blur`, solid brand background at 96% opacity. Height: 56px. |
| `.nav-inner` | Flex row, space-between. Max-width 960px, 0 auto. |
| `.nav-wordmark` | Brand name — condensed display font, uppercase, weight 900. |
| `.nav-cta` | Small variant of `.btn-primary` — 11px font, 10px/24px padding. |
| `#hero` | Full-bleed section, `min-height: 92vh`, flex center, relative position for canvas overlay. |
| `#heroBeams` | Canvas element positioned absolute, full inset, `pointer-events: none`. Holds animated light beams (JS draws on desktop only). |
| `.hero-mobile-fx` | CSS-only pseudo-element beams for mobile. `display:none` on desktop, shown on `max-width: 767px`. Animates only `opacity` and `transform` — no layout properties. |
| `.hero-inner` | `text-align: center; width: 100%; position: relative; z-index: 1;` |
| `.hero-eyebrow` | DM Sans 500, 10px, 0.2em letter-spacing, uppercase, muted color. `margin-bottom: 28px`. |
| `.hero-product-wrap` | `width: min(380px, 88vw); margin: 0 auto 36px;` |
| `.hero-headline` | Condensed display font, weight 900, `font-size: clamp(38px, 9vw, 72px)`, `line-height: 0.95`. `.h-accent` span applies accent color. |
| `.hero-subhead` | DM Sans 500, 16px, max-width 460px, fog-grey color, 1.6 line-height. |
| `.hero-copy` | DM Sans 500, 15px, max-width 440px, fog-grey, `margin-bottom: 32px`. |
| `.hero-cta-wrap` | `max-width: 300px; margin: 0 auto 14px;` |
| `.hero-badge` | Inline-flex column, centered, gap 4px, `margin-bottom: 16px`. |
| `.hero-badge-stars` | 12px, accent color, `letter-spacing: 3px`. |
| `.hero-badge-laurel` | Decorative character, 18px, 35% opacity. |
| `.hero-badge-text` | DM Sans 500, 11px, 65% opacity. |
| `.hero-trust` | DM Sans, 11px, muted color, italic. |

### `.btn-hover` — Frosted Glass CTA Button

- `position: relative; isolation: isolate; overflow: hidden`
- `backdrop-filter: blur(12px)`
- Background: `rgba(208,222,242,0.5)` — adjust to suit brand bg
- Border radius: 32px (pill)
- `::before` pseudo creates inset border + inner glow box-shadows — update shadow colors to match brand accent
- `.btn-hover-circle` — div injected by JS, follows mouse pointer with a blur glow effect
- Hover: `translateY(-1px)` on the button itself
- Arrow icon shifts `translate(2px, -2px)` on hover

---

## JavaScript

### Animated Hero Beams (Desktop Canvas)
Draw diagonal animated light beam stripes on the `#heroBeams` canvas. Only runs on desktop (`window.innerWidth > 767`). Uses `requestAnimationFrame`. Only `transform` and `opacity` animated — no layout recalculation.

```js
// Core canvas beam animation — customize beam count, angle, speed, color
const canvas = document.getElementById('heroBeams');
const ctx = canvas.getContext('2d');
let beams = []; // array of { x, y, width, speed, opacity, color }

function initBeams() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  // Create N beams with randomized properties
  // Color: use brand accent at very low opacity (0.03–0.08)
}

function drawBeams() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  beams.forEach(b => {
    ctx.save();
    ctx.translate(b.x, 0);
    ctx.rotate(-32 * Math.PI / 180); // ~32° diagonal
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.3, b.color);
    grad.addColorStop(0.7, b.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(-b.width / 2, -100, b.width, canvas.height + 200);
    ctx.restore();
    b.x += b.speed;
    if (b.x > canvas.width + 200) b.x = -200;
  });
  requestAnimationFrame(drawBeams);
}
```

### Hover Trail on `.btn-hover`
Inject a `.btn-hover-circle` div inside each `.btn-hover` element. On `mousemove`, position it at cursor coordinates relative to the button. Toggle `.visible` class on mouseenter, `.fading` on mouseleave.

```js
document.querySelectorAll('.btn-hover').forEach(btn => {
  const circle = document.createElement('div');
  circle.className = 'btn-hover-circle';
  circle.style.background = '[ACCENT_COLOR]'; // brand accent color
  btn.appendChild(circle);

  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    circle.style.left = (e.clientX - r.left) + 'px';
    circle.style.top = (e.clientY - r.top) + 'px';
  });
  btn.addEventListener('mouseenter', () => {
    circle.classList.remove('fading');
    circle.classList.add('visible');
  });
  btn.addEventListener('mouseleave', () => {
    circle.classList.remove('visible');
    circle.classList.add('fading');
  });
});
```

---

## Mobile Behavior
- Canvas (`#heroBeams`) hidden at `max-width: 767px`
- CSS-only `.hero-mobile-fx` shown instead — two pseudo-elements with `animation: mobileBeamA/B` (opacity + transform only)
- Product image scales with `min(380px, 88vw)` — always fits viewport
- Section stacks vertically, text centered

---

## Accessibility
- `<h1>` for headline — one per page
- Hero image: descriptive `alt` text required
- `.btn-hover` elements: keyboard-accessible via `<a>` tag + `focus-visible` outline
- Canvas: `aria-hidden="true"` — purely decorative
- Nav logo: `aria-label="[Brand] home"`
