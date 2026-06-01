# Section Blueprint: Offer / Purchase Wizard

## Purpose
The main purchase section. Combines a full-bleed product image carousel with a stepped wizard that walks the customer through: bundle selection → flavor/variant selection → free gifts → upsell add-ons → order review + CTA. Handles Shopify Storefront API checkout and optional discount code application.

This is the most complex section on the page. It contains multiple subsystems documented separately below.

---

## Brand Assets Required

| Asset | Description |
|---|---|
| `CAROUSEL_IMAGES[]` | 3–6 product/lifestyle images. First image is LCP-critical — use `loading="eager"`. Remainder `loading="lazy"`. |
| `CAROUSEL_THUMB_IMAGES[]` | Same images at thumbnail size for the thumb row (60×60px display, same source is fine). |
| `FLAVOR_IMAGES{}` | One image per product variant — displayed in bundle cards, flavor picker, and thumb row. Square crop, transparent or light bg, 56×56px display. |
| `ACCENT_COLOR` | Active state color: selected bundle card border, wizard progress bar fill, CTA button, stars. |
| `SURFACE_COLOR` | Section background. |
| `SURFACE2_COLOR` | Card and inner component background. |
| `TEXT_PRIMARY` | Heading and label text. |
| `TEXT_MUTED` | Supporting labels. |
| `FOG_GREY` | Body text. |
| `BORDER_COLOR` | Low-opacity card borders. |

---

## Shopify Config (required per brand)

```js
var SHOPIFY_DOMAIN    = '[your-store].myshopify.com';
var STOREFRONT_TOKEN  = '[storefront_api_token]';       // public, safe in frontend
var API_VERSION       = '2024-01';

// Map flavor/variant slug → Shopify Product gid
var PRODUCT_IDS = {
  '[flavor-slug-1]': 'gid://shopify/Product/[ID]',
  '[flavor-slug-2]': 'gid://shopify/Product/[ID]',
  // ...
};

// Optional: Free gift variant IDs (price $0 in Shopify, unlocked by a discount code)
var BONUS_VARIANT_IDS = {
  shaker:  'gid://shopify/ProductVariant/[ID]',
  tracker: 'gid://shopify/ProductVariant/[ID]',
};

// Optional: Bundle discount codes
var DISCOUNT_2TUB = 'BUNDLE2';
var DISCOUNT_3TUB = 'HVCO-STACK';
```

---

## Pricing Config

```js
var BUNDLE_FULL_PRICES = { 1: 36.99, 2: 64.99, 3: 81.99 };  // display prices per qty
var BUNDLE_DISC_PRICES = { 1: 31.44, 2: 55.24, 3: 69.69 };  // post-popup-discount prices
var BUNDLE_PER_SCOOP   = { 1: '$0.90', 2: '$0.81', 3: '$0.68' };
var BUNDLE_DISC_SCOOP  = { 1: '$0.79', 2: '$0.69', 3: '$0.58' };
var BUNDLE_SAVE_TEXT   = { 1: '', 2: 'Save $9', 3: 'Save $29' };
```

---

## Flavor Config

```js
var FLAVOR_COLORS = {
  '[slug]': '[hex color for active state border/bg]',
  // one per variant
};
var FLAVOR_NAMES = {
  '[slug]': '[Display Name]',
};
var FLAVOR_THUMBS = {
  '[slug]': '[path to flavor image]',
};
```

---

## HTML Structure

### Subsystem 1: Social Proof Ticker (above carousel)
Identical to the standalone proof ticker. See `02-proof-ticker.md`.

### Subsystem 2: Product Image Carousel

```html
<div class="offer-product-wrap">
  <!-- Full-bleed carousel — outside .container so it touches both edges -->
  <div class="flavor-carousel" id="flavorCarousel">
    <div class="flavor-carousel-track" id="flavorCarouselTrack">
      <div class="carousel-slide">
        <img src="[IMAGE_1]" alt="[BRAND_NAME]" loading="eager" decoding="async">
      </div>
      <div class="carousel-slide">
        <img src="[IMAGE_2]" alt="[BRAND_NAME]" loading="lazy" decoding="async">
      </div>
      <!-- ...more slides -->
    </div>
  </div>

  <!-- Thumbnail row -->
  <div class="carousel-thumbs-wrap">
    <div class="carousel-thumbs" id="flavorCarouselThumbs">
      <button class="carousel-thumb active" onclick="goCarousel(0)" aria-label="Image 1">
        <img src="[IMAGE_1]" alt="" loading="lazy" decoding="async">
      </button>
      <!-- ...more thumbs -->
    </div>
  </div>
</div>
```

**Carousel CSS:**
```css
.flavor-carousel { position: relative; overflow: hidden; background: [SURFACE2_COLOR]; user-select: none; touch-action: pan-y; }
.flavor-carousel-track { display: flex; transition: transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94); will-change: transform; }
.carousel-slide { flex: 0 0 100%; min-width: 100%; }
.carousel-slide img { width: 100%; height: auto; display: block; object-fit: cover; }

.carousel-thumbs-wrap { padding: 8px 12px 4px; overflow-x: auto; scrollbar-width: none; }
.carousel-thumbs { display: flex; gap: 7px; justify-content: center; }
.carousel-thumb {
  flex: 0 0 auto; width: 60px; height: 60px;
  border-radius: 4px; border: 1.5px solid transparent;
  overflow: hidden; cursor: pointer; opacity: 0.5;
  transition: border-color 0.15s ease, opacity 0.15s ease;
}
.carousel-thumb.active { border-color: [ACCENT_COLOR]; opacity: 1; }
.carousel-thumb img { width: 100%; height: 100%; object-fit: cover; }
```

**Carousel JavaScript:**
```js
var carouselIndex = 0;

function goCarousel(idx) {
  var track = document.getElementById('flavorCarouselTrack');
  if (!track) return;
  var count = track.querySelectorAll('.carousel-slide').length;
  carouselIndex = ((idx % count) + count) % count;
  track.style.transform = 'translateX(-' + (carouselIndex * 100) + '%)';
  document.querySelectorAll('.carousel-thumb').forEach(function(t, i) {
    t.classList.toggle('active', i === carouselIndex);
  });
}

// Touch swipe
(function() {
  var el = document.getElementById('flavorCarousel');
  if (!el) return;
  var startX = 0, startY = 0;
  el.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) goCarousel(carouselIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
```

---

### Subsystem 3: Product Info Block

```html
<div class="product-info-block">
  <div class="pib-rating">
    <span class="pib-stars">★★★★★</span>
    <span class="pib-rating-text">[RATING] from [COUNT]+ reviews</span>
  </div>
  <h2 class="pib-name">[PRODUCT_NAME] — [VARIANT_DISPLAY]</h2>
  <p class="pib-tagline"><span class="pib-accent">[ACCENT_WORD]</span> [TAGLINE_REST]</p>

  <div class="pib-price-row">
    <span class="pib-price-from">From</span>
    <span class="pib-price-main" id="pibPriceMain">$[BASE_PRICE]</span>
    <span class="pib-price-per"><strong>$[PRICE_PER_UNIT]</strong> per [UNIT]</span>
  </div>

  <div class="pib-meta">
    <span class="pib-meta-item">[SERVING_COUNT] servings</span>
    <span class="pib-meta-item">[FORMAT]</span>
    <span class="pib-meta-item">[USAGE_INSTRUCTION]</span>
  </div>

  <!-- 4 benefit icons in a 2×2 grid -->
  <div class="pib-benefits">
    <div class="pib-benefit">
      <div class="pib-benefit-icon"><!-- SVG icon --></div>
      <span>[BENEFIT_1]*</span>
    </div>
    <!-- ...3 more -->
  </div>

  <p class="pib-desc">[SHORT_PRODUCT_DESCRIPTION]</p>
</div>
```

---

### Subsystem 4: Multi-Step Purchase Wizard

The wizard is a 4–6 step flow. All panels exist in the DOM simultaneously; only the `.active` panel is shown. The progress bar and step label update on each transition.

```html
<!-- Progress bar -->
<div class="wizard-progress" id="wizardProgress">
  <div class="wizard-progress-meta">
    <span class="wizard-step-num" id="wizardStepNum">Step 1 of [TOTAL]</span>
    <span class="wizard-step-name" id="wizardStepName">[STEP_1_NAME]</span>
  </div>
  <div class="wizard-bar"><div class="wizard-bar-fill" id="wizardBarFill"></div></div>
</div>

<!-- Step 1: Bundle Selection -->
<div class="wizard-panel active" id="wizardPanel1">
  <h3 class="wizard-step-title">Pick Your Bundle</h3>
  <div class="bundle-cards" id="bundleCards" role="radiogroup" aria-label="Choose bundle size">

    <!-- 1-tub card -->
    <div class="bundle-card" data-qty="1" role="radio" aria-checked="false" tabindex="0">
      <div class="bundle-flavor-icons">
        <img class="bundle-flavor-icon" src="[FLAVOR_1_IMG]" alt="[FLAVOR_1_NAME]" loading="lazy">
      </div>
      <div class="bundle-tubs"><span class="tub-dot"></span></div>
      <p class="bundle-qty-text">1 Tub</p>
      <p class="bundle-price-big" data-disc="$[DISC_PRICE_1]">$[FULL_PRICE_1]</p>
      <p class="bundle-per-tub" data-disc="[DISC_SCOOP_1]">[SCOOP_PRICE_1]</p>
      <span class="bundle-save">&nbsp;</span>
    </div>

    <!-- 2-tub card (default active, has "Most Popular" badge) -->
    <div class="bundle-card active" data-qty="2" role="radio" aria-checked="true" tabindex="0">
      <div class="bundle-badge">Most Popular<br>Save $[SAVE_AMOUNT_2]</div>
      <!-- 2 flavor icons -->
      <div class="bundle-tubs"><span class="tub-dot"></span><span class="tub-dot"></span></div>
      <p class="bundle-qty-text">2 Tubs</p>
      <p class="bundle-price-big" data-disc="$[DISC_PRICE_2]">$[FULL_PRICE_2]</p>
      <p class="bundle-per-tub" data-disc="[DISC_SCOOP_2]">[SCOOP_PRICE_2]</p>
      <span class="bundle-save">Save $[SAVE_AMOUNT_2]</span>
    </div>

    <!-- 3-tub card (spans full width, "Best Value" badge) -->
    <div class="bundle-card" data-qty="3" role="radio" aria-checked="false" tabindex="0">
      <div class="bundle-badge" style="background:[TEXT_PRIMARY];color:[BG_COLOR];">
        Best Value · Save $[SAVE_AMOUNT_3]
      </div>
      <!-- 3 flavor icons -->
      <div class="bundle-tubs"><span class="tub-dot"></span><span class="tub-dot"></span><span class="tub-dot"></span></div>
      <p class="bundle-qty-text">3 Tubs</p>
      <p class="bundle-price-big" data-disc="$[DISC_PRICE_3]">$[FULL_PRICE_3]</p>
      <p class="bundle-per-tub" data-disc="[DISC_SCOOP_3]">[SCOOP_PRICE_3]</p>
      <span class="bundle-save">Save $[SAVE_AMOUNT_3]</span>
    </div>

  </div>
  <div class="wizard-nav">
    <button class="btn-primary btn-full" onclick="wizardGo(2, false)">Choose Your Flavor →</button>
  </div>
</div>

<!-- Step 2: Flavor Picker (generated by JS) -->
<div class="wizard-panel" id="wizardPanel2">
  <h3 class="wizard-step-title" id="wizardFlavorTitle">Pick Your Flavor</h3>
  <div id="flavorRow" class="flavor-row">
    <!-- JS generates one flavor-picker-group per required tub -->
  </div>
  <div class="wizard-nav">
    <button class="wizard-back-btn" onclick="wizardGo(1, true)">← Back</button>
    <button class="btn-primary" id="step2NextBtn" style="flex:1" onclick="nextStepFromFlavor()">
      Add Free Gifts →
    </button>
  </div>
</div>

<!-- Step 3: Free Gifts (optional — lock if qty < 2) -->
<div class="wizard-panel" id="wizardPanel3">
  <h3 class="wizard-step-title">Add Free Gifts</h3>
  <p class="gifts-lock-msg" id="giftsLockMsg">Minimum 2 tubs required to unlock free gifts</p>
  <div class="bonus-list" id="bonusList">

    <div class="bonus-card" id="bonusCard[GIFT_1_ID]">
      <span class="bonus-icon">[GIFT_1_EMOJI]</span>
      <div class="bonus-text">
        <span class="bonus-title">FREE [GIFT_1_NAME]</span>
        <span class="bonus-value"><s>$[GIFT_1_VALUE]</s> <strong>FREE</strong></span>
      </div>
      <button class="bonus-add-btn" id="bonusBtn[GIFT_1_ID]" onclick="toggleBonus('[GIFT_1_ID]')">
        + Add
      </button>
    </div>

    <!-- Repeat for each gift -->
  </div>
  <div class="wizard-nav">
    <button class="wizard-back-btn" onclick="wizardGo(2, true)">← Back</button>
    <button class="btn-primary" style="flex:1" onclick="wizardGo(4, false)">Continue →</button>
  </div>
</div>

<!-- Step 4+: Upsell steps (optional) — add-on product cards generated by JS -->
<!-- See "Add-On Cards" CSS/JS section below -->

<!-- Final Step: Order Review -->
<div class="wizard-panel" id="wizardPanel[LAST]">
  <h3 class="wizard-step-title">Review Your Order</h3>

  <!-- Optional: subscription order bump -->
  <div class="order-bump" id="subscriptionBumpCard">
    <label class="order-bump-inner">
      <input type="checkbox" id="subscriptionBump" class="order-bump-check" checked>
      <div class="order-bump-body">
        <p class="order-bump-eyebrow">✓ Special Add-On</p>
        <p class="order-bump-title">Subscribe & Save 15% — Every Month</p>
        <p class="order-bump-desc" id="bumpDesc">[SUBSCRIPTION_DESCRIPTION]</p>
        <p class="order-bump-price" id="bumpPrice"><s>$[RETAIL_MONTHLY]</s> → <strong>$[DISC_MONTHLY]</strong></p>
      </div>
    </label>
  </div>

  <!-- Order line items + total -->
  <div class="order-summary" id="orderSummary">
    <div id="orderLineItems" class="order-line-items">
      <!-- Populated by JS: updateOrderSummary() -->
    </div>
    <div class="order-summary-line">
      <span class="order-summary-label">Total before discounts</span>
      <span class="order-summary-was" id="orderRetailValue">$[RETAIL_TOTAL]</span>
    </div>
    <div class="order-summary-savings" id="orderSavingsRow" style="display:none;">
      <span id="orderSavingsText"></span>
    </div>
    <div class="order-summary-line order-summary-pay-line">
      <span class="order-summary-label">You pay today</span>
      <span class="order-summary-pay" id="orderYouPay">$[BUNDLE_PRICE]</span>
    </div>
  </div>

  <div class="offer-cta-wrap">
    <button id="bundleCta" class="btn-primary btn-full" onclick="handleCheckout()">
      GET [QTY] TUBS — $[PRICE] →
    </button>
  </div>

  <div class="wizard-nav" style="margin-top:8px; justify-content:center;">
    <button class="wizard-back-btn" onclick="wizardGo([PREV_STEP], true)">← Back</button>
  </div>
</div>

<!-- Trust strip below all wizard steps -->
<div class="trust-strip">
  <span>[TRUST_1]</span>
  <span class="trust-dot">·</span>
  <span>[TRUST_2]</span>
  <span class="trust-dot">·</span>
  <span>[TRUST_3]</span>
</div>
```

---

## Wizard JavaScript Logic

```js
var wizardStep = 1;
var WIZARD_STEPS = [TOTAL_STEP_COUNT];
var WIZARD_NAMES = ['', '[Step 1 Name]', '[Step 2 Name]', ...];

function wizardGo(step, isBack) {
  var prev = document.getElementById('wizardPanel' + wizardStep);
  wizardStep = step;
  var next = document.getElementById('wizardPanel' + wizardStep);

  if (prev) prev.classList.remove('active');
  if (next) {
    next.classList.remove('wback');
    void next.offsetWidth;             // force reflow for animation replay
    if (isBack) next.classList.add('wback');
    next.classList.add('active');
  }

  // Update progress UI
  document.getElementById('wizardStepNum').textContent = 'Step ' + wizardStep + ' of ' + WIZARD_STEPS;
  document.getElementById('wizardStepName').textContent = WIZARD_NAMES[wizardStep];
  document.getElementById('wizardBarFill').style.width = Math.round((wizardStep / WIZARD_STEPS) * 100) + '%';

  // Smooth-scroll to wizard progress bar
  var wizProg = document.getElementById('wizardProgress');
  if (wizProg) {
    var y = wizProg.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }
}

// Panel enter/exit animations
// .wizard-panel.active → animation: wIn (slide in from right)
// .wizard-panel.wback  → animation: wBack (slide in from left)
// Mobile: animations disabled (instant show/hide)
```

---

## Checkout: Shopify Storefront API

```js
async function handleCheckout() {
  // 1. Resolve variant IDs for each selected flavor via Storefront API
  // 2. Build line items array (each flavor slug → variant gid + qty)
  // 3. Add bonus variant IDs if toggled (priced at $0 in Shopify)
  // 4. Call cartCreate mutation → returns checkoutUrl
  // 5. Append ?discount=[CODE] to checkoutUrl if applicable
  // 6. window.location.href = checkoutUrl

  var lines = [];
  // selectedFlavors = ['sour-candy', 'sour-grape'] for a 2-tub selection

  for (var i = 0; i < selectedFlavors.length; i++) {
    var productId = PRODUCT_IDS[selectedFlavors[i]];
    var variantId = await resolveVariantId(productId);  // cached
    lines.push({ merchandiseId: variantId, quantity: 1 });
  }

  // Add bonuses
  Object.keys(addedBonuses).forEach(function(key) {
    if (addedBonuses[key] && BONUS_VARIANT_IDS[key]) {
      lines.push({ merchandiseId: BONUS_VARIANT_IDS[key], quantity: 1 });
    }
  });

  var resp = await fetch('https://' + SHOPIFY_DOMAIN + '/api/' + API_VERSION + '/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN
    },
    body: JSON.stringify({ query: `
      mutation cartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart { checkoutUrl }
          userErrors { field message }
        }
      }
    `, variables: { lines } })
  });

  var data = await resp.json();
  var url = data.data.cartCreate.cart.checkoutUrl;
  if (discountCode) url += '?discount=' + discountCode;
  window.location.href = url;
}
```

---

## Discount / Popup Integration
- A popup (see `popup-overlay`) captures email and returns a discount code
- On success: `discountUnlocked = true` + update all `data-disc` price elements
- `data-disc` attribute on `.bundle-price-big` and `.bundle-per-tub` holds the discounted value
- When unlocked: swap `textContent` of price elements to `data-disc` value, apply `.price-now` class for animation

```js
function applyDiscount() {
  discountUnlocked = true;
  document.querySelectorAll('[data-disc]').forEach(function(el) {
    el.innerHTML = '<span class="price-was">' + el.textContent + '</span>'
                 + '<span class="price-now">' + el.getAttribute('data-disc') + '</span>';
  });
}
```

---

## Bundle Card Interaction

```js
var selectedQty = 2; // default

document.querySelectorAll('.bundle-card').forEach(function(card) {
  card.addEventListener('click', function() {
    document.querySelectorAll('.bundle-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    selectedQty = parseInt(card.getAttribute('data-qty'));
    // Update CTA text, order summary, subscription bump pricing
    updateOrderSummary();
    updateBumpPricing();
    buildFlavorPicker();
  });
  // Keyboard: Enter/Space
  card.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });
});
```

---

## Flavor Picker (Step 2) — JS Generated

```js
function buildFlavorPicker() {
  var container = document.getElementById('flavorRow');
  container.innerHTML = '';

  for (var i = 0; i < selectedQty; i++) {
    var group = document.createElement('div');
    group.className = 'flavor-picker-group';

    var label = document.createElement('span');
    label.className = 'flavor-picker-label';
    label.textContent = selectedQty > 1 ? 'Tub ' + (i + 1) : 'Your Flavor';
    group.appendChild(label);

    var opts = document.createElement('div');
    opts.className = 'flavor-opts';

    Object.keys(FLAVOR_NAMES).forEach(function(slug) {
      var btn = document.createElement('button');
      btn.className = 'flavor-opt';
      btn.setAttribute('data-flavor', slug);
      btn.setAttribute('data-group', i);
      btn.innerHTML = '<img class="flavor-opt-img" src="' + FLAVOR_THUMBS[slug] + '" alt="' + FLAVOR_NAMES[slug] + '">'
                    + '<span class="flavor-opt-label">' + FLAVOR_NAMES[slug] + '</span>';

      btn.addEventListener('click', function() {
        opts.querySelectorAll('.flavor-opt').forEach(o => o.classList.remove('active'));
        btn.classList.add('active');
        btn.style.borderColor = FLAVOR_COLORS[slug];
        btn.style.background = hexToRgba(FLAVOR_COLORS[slug], 0.08);
        selectedFlavors[i] = slug;
        updateOrderSummary();
      });
      opts.appendChild(btn);
    });

    // Auto-select first flavor
    if (opts.firstChild) opts.firstChild.click();
    group.appendChild(opts);
    container.appendChild(group);
  }
}
```

---

## Bonus Gift Toggle

```js
var addedBonuses = { shaker: false, tracker: false };

function toggleBonus(key) {
  addedBonuses[key] = !addedBonuses[key];
  var btn = document.getElementById('bonusBtn' + key.charAt(0).toUpperCase() + key.slice(1));
  var card = document.getElementById('bonusCard' + key.charAt(0).toUpperCase() + key.slice(1));
  if (addedBonuses[key]) {
    btn.classList.add('added');
    btn.innerHTML = '<svg ...><!-- checkmark SVG --></svg> Added';
    card.classList.add('added');
  } else {
    btn.classList.remove('added');
    btn.textContent = '+ Add';
    card.classList.remove('added');
  }
  updateOrderSummary();
}
```

Lock bonuses when qty = 1:
```js
function updateBonusLock() {
  var list = document.getElementById('bonusList');
  var msg = document.getElementById('giftsLockMsg');
  var locked = selectedQty < 2;
  list.classList.toggle('locked', locked);
  if (msg) msg.style.display = locked ? 'block' : 'none';
}
```

---

## Trust Strip Copy Slots

| Slot | Example |
|---|---|
| `TRUST_1` | "30-Day Guarantee" |
| `TRUST_2` | "Ships in 24 Hours" |
| `TRUST_3` | "Third-Party Tested" |

---

## Mobile Sticky Bar (accompanies this section)

```html
<div id="sticky-bar" class="sb-hidden">
  <div class="sticky-bar-inner">
    <div class="sticky-bar-left">
      <img class="sticky-bar-thumb" src="[PRODUCT_THUMB]" alt="" aria-hidden="true">
      <div>
        <span class="sticky-bar-brand">[BRAND_NAME]</span>
        <span class="sticky-bar-price" id="stickyPrice">from $[BASE_PRICE]</span>
      </div>
    </div>
    <a href="#offer" class="btn-primary sticky-cta">GET YOURS →</a>
  </div>
</div>
```

Show/hide: appears only on mobile (`display:none` until `max-width:767px`), hidden while the offer section is in viewport, shown while scrolled past it.

```js
var stickyBar = document.getElementById('sticky-bar');
var offerSection = document.getElementById('offer');

var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    stickyBar.classList.toggle('sb-hidden', e.isIntersecting);
  });
}, { threshold: 0.05 });

if (offerSection) io.observe(offerSection);
```
