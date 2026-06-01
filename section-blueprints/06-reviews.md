# Section Blueprint: Reviews

## Purpose
A full verified-reviews section with: (1) aggregate star score + rating distribution bars, (2) tabs for Reviews vs. Questions, (3) search + filter controls, (4) flat review list with per-item star rating, title, author, verified badge, and body. Includes a "Write a Review" popup modal triggered by button click.

---

## Brand Assets Required

| Asset | Description |
|---|---|
| `ACCENT_COLOR` | Stars, active tab underline, verified badge background, submit button background. |
| `SURFACE_COLOR` | Section background. |
| `SURFACE2_COLOR` | Review popup panel background. |
| `TEXT_PRIMARY` | Review titles, author names in popup. |
| `TEXT_MUTED` | Tab text (inactive), label text. |
| `FOG_GREY` | Review body text, secondary metadata. |
| `BORDER_COLOR` | Dividers between reviews, bar track. |
| `PRODUCT_IMAGE` | Used in the Write a Review popup's product thumbnail. |
| `BRAND_NAME` | Displayed as heading in the Write a Review popup. |

---

## Data Slots

### Aggregate Score Block
| Slot | Description |
|---|---|
| `OVERALL_SCORE` | e.g. "4.9" |
| `TOTAL_REVIEWS` | e.g. "247" |
| `STAR_DISTRIBUTION` | `{ 5: 92, 4: 8, 3: 0, 2: 0, 1: 0 }` — percentages per star level |

### Per Review Item
| Slot | Description |
|---|---|
| `STAR_COUNT` | 1–5, displayed as ★ characters |
| `REVIEW_TITLE` | Short headline (e.g. "Finally stopped cycling through alternatives") |
| `AUTHOR_NAME` | First name + last initial (e.g. "Harry D.") |
| `IS_VERIFIED` | Boolean — shows "Verified buyer" badge if true |
| `REVIEW_BODY` | Full review text. 30–120 words. First-person. |

---

## HTML Structure

```html
<section id="reviews-section">
  <div class="container">
    <span class="section-label">Verified Reviews</span>

    <!-- Aggregate score + bar chart -->
    <div class="reviews-summary">

      <div class="reviews-score-block">
        <span class="reviews-big-score">[OVERALL_SCORE]</span>
        <div class="reviews-score-meta">
          <div class="reviews-stars-row">★★★★★</div>
          <span class="reviews-out-of">out of 5</span>
          <span class="reviews-total-count">[TOTAL_REVIEWS] verified reviews</span>
        </div>
      </div>

      <div class="reviews-bars">
        <div class="rb-row">
          <span class="rb-label">5★</span>
          <div class="rb-track"><div class="rb-fill" style="width:[PCT_5]%"></div></div>
          <span class="rb-pct">[PCT_5]%</span>
        </div>
        <div class="rb-row">
          <span class="rb-label">4★</span>
          <div class="rb-track"><div class="rb-fill" style="width:[PCT_4]%;opacity:0.5"></div></div>
          <span class="rb-pct">[PCT_4]%</span>
        </div>
        <div class="rb-row">
          <span class="rb-label">3★</span>
          <div class="rb-track"><div class="rb-fill" style="width:[PCT_3]%"></div></div>
          <span class="rb-pct">[PCT_3]%</span>
        </div>
        <div class="rb-row">
          <span class="rb-label">2★</span>
          <div class="rb-track"><div class="rb-fill" style="width:[PCT_2]%"></div></div>
          <span class="rb-pct">[PCT_2]%</span>
        </div>
        <div class="rb-row">
          <span class="rb-label">1★</span>
          <div class="rb-track"><div class="rb-fill" style="width:[PCT_1]%"></div></div>
          <span class="rb-pct">[PCT_1]%</span>
        </div>
      </div>

    </div>

    <!-- Tab bar + action buttons -->
    <div class="reviews-meta-bar">
      <div class="reviews-tabs">
        <button class="reviews-tab active" id="reviewsTabReviews">
          Reviews <span class="reviews-tab-count">[TOTAL_REVIEWS]</span>
        </button>
        <button class="reviews-tab" id="reviewsTabQuestions">
          Questions <span class="reviews-tab-count">0</span>
        </button>
      </div>
      <div class="reviews-actions">
        <button class="reviews-action-btn reviews-action-btn--outline" id="reviewsAskBtn">Ask a question</button>
        <button class="reviews-action-btn reviews-action-btn--filled" id="reviewsWriteBtn">Write a review</button>
      </div>
    </div>

    <!-- Search + sort/filter controls -->
    <div class="reviews-controls">
      <div class="reviews-search-wrap">
        <svg width="13" height="13" fill="none" viewBox="0 0 13 13">
          <circle cx="5.5" cy="5.5" r="4.5" stroke="[TEXT_MUTED]" stroke-width="1.3"/>
          <path d="M9 9l2.5 2.5" stroke="[TEXT_MUTED]" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <input type="text" class="reviews-search" placeholder="Search reviews" aria-label="Search reviews">
      </div>
      <select class="reviews-filter" aria-label="Sort reviews">
        <option>Most relevant</option>
        <option>Most recent</option>
        <option>Highest rated</option>
        <option>Lowest rated</option>
      </select>
      <select class="reviews-filter" aria-label="Filter by rating">
        <option>All ratings</option>
        <option>5 stars</option>
        <option>4 stars</option>
        <option>3 stars</option>
        <option>2 stars</option>
        <option>1 star</option>
      </select>
    </div>

    <!-- Flat review list -->
    <div class="review-list">

      <!-- Repeat for each review -->
      <div class="review-item">
        <div class="review-item-stars">★★★★★</div>
        <p class="review-item-title">[REVIEW_TITLE]</p>
        <div class="review-item-author">
          <span class="review-item-name">[AUTHOR_NAME]</span>
          <!-- Only include if IS_VERIFIED = true -->
          <span class="review-item-verified">
            <span class="review-item-verified-icon">✓</span>
            Verified buyer
          </span>
        </div>
        <p class="review-item-body">[REVIEW_BODY]</p>
      </div>

    </div>
  </div>
</section>
```

---

## Key CSS

```css
#reviews-section {
  background: [SURFACE_COLOR];
  padding: 64px 0 72px;
  border-top: 0.5px solid [BORDER_COLOR];
}
@media (min-width: 768px) { #reviews-section { padding: 100px 0 108px; } }

/* Score block + bars — responsive grid */
.reviews-summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px 56px;
  align-items: center;
  margin-bottom: 36px;
  padding-bottom: 32px;
  border-bottom: 0.5px solid [BORDER_COLOR];
}
@media (max-width: 600px) { .reviews-summary { grid-template-columns: 1fr; gap: 24px; } }

.reviews-big-score {
  font-family: [DISPLAY_FONT], sans-serif;
  font-weight: 900;
  font-size: 88px;
  color: [ACCENT_COLOR];
  line-height: 1;
  letter-spacing: -0.02em;
}
.reviews-stars-row { font-size: 18px; color: [ACCENT_COLOR]; letter-spacing: 1px; }
.reviews-out-of { font-size: 11px; color: [TEXT_MUTED]; letter-spacing: 0.08em; text-transform: uppercase; }
.reviews-total-count { font-size: 12px; color: [FOG_GREY]; font-weight: 500; }

/* Rating bars */
.reviews-bars { display: flex; flex-direction: column; gap: 9px; max-width: 360px; }
.rb-row { display: flex; align-items: center; gap: 10px; }
.rb-label { font-size: 10.5px; color: [TEXT_MUTED]; width: 22px; text-align: right; flex-shrink: 0; }
.rb-track { flex: 1; height: 3px; background: rgba([TEXT_MUTED_RGB], 0.12); border-radius: 2px; overflow: hidden; }
.rb-fill { height: 100%; background: [ACCENT_COLOR]; border-radius: 2px; }
.rb-pct { font-size: 10.5px; color: [TEXT_MUTED]; width: 30px; flex-shrink: 0; }

/* Tab bar */
.reviews-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 0.5px solid [BORDER_COLOR];
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.reviews-tab {
  font-weight: 600;
  font-size: 15px;
  color: [TEXT_MUTED];
  padding: 8px 0;
  margin-right: 28px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s ease, border-color 0.15s ease;
}
.reviews-tab.active { color: [TEXT_PRIMARY]; border-bottom-color: [ACCENT_COLOR]; }
.reviews-tab-count { font-size: 13px; font-weight: 400; color: [TEXT_MUTED]; }
.reviews-tab.active .reviews-tab-count { color: [FOG_GREY]; }

.reviews-action-btn {
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.04em;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}
.reviews-action-btn--outline {
  background: transparent;
  border: 1px solid rgba([ACCENT_RGB], 0.35);
  color: [ACCENT_COLOR];
}
.reviews-action-btn--outline:hover { background: rgba([ACCENT_RGB], 0.06); }
.reviews-action-btn--filled {
  background: [ACCENT_COLOR];
  border: 1px solid [ACCENT_COLOR];
  color: #fff;
}

/* Search + filter */
.reviews-controls { display: flex; gap: 10px; align-items: center; margin-bottom: 4px; flex-wrap: wrap; }
.reviews-search-wrap { position: relative; flex: 1; min-width: 180px; }
.reviews-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.reviews-search {
  width: 100%;
  background: [SURFACE2_COLOR];
  border: 0.5px solid [BORDER_COLOR];
  border-radius: 100px;
  padding: 9px 16px 9px 36px;
  font-size: 13px;
  color: [TEXT_PRIMARY];
  outline: none;
  transition: border-color 0.15s ease;
}
.reviews-search:focus { border-color: rgba([ACCENT_RGB], 0.3); }
.reviews-filter {
  background: [SURFACE2_COLOR];
  border: 0.5px solid [BORDER_COLOR];
  border-radius: 100px;
  padding: 9px 30px 9px 14px;
  font-size: 13px;
  color: [FOG_GREY];
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  /* Custom chevron via background-image SVG data URI */
}

/* Review list */
.review-list { display: flex; flex-direction: column; }
.review-item { padding: 30px 0; border-bottom: 0.5px solid [BORDER_COLOR]; }
.review-item:last-child { border-bottom: none; }
.review-item-stars { font-size: 15px; color: [ACCENT_COLOR]; letter-spacing: 2px; margin-bottom: 10px; }
.review-item-title { font-weight: 600; font-size: 15px; color: [TEXT_PRIMARY]; margin: 0 0 8px; line-height: 1.4; }
.review-item-author { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.review-item-name { font-size: 13px; font-weight: 500; color: [ACCENT_COLOR]; }
.review-item-verified { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: [FOG_GREY]; }
.review-item-verified-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 15px; height: 15px;
  background: [ACCENT_COLOR]; color: [BG_COLOR];
  border-radius: 50%; font-size: 8px; font-weight: 700;
}
.review-item-body { font-size: 14px; color: [FOG_GREY]; line-height: 1.75; margin: 0; max-width: 700px; }
```

---

## Write a Review Popup

### HTML

```html
<div class="rp-overlay" id="rpOverlay" role="dialog" aria-modal="true" aria-labelledby="rpTitle">
  <div class="rp-panel">
    <button class="rp-close" id="rpClose" aria-label="Close">×</button>

    <!-- Step 1: Star rating picker -->
    <div id="rpStep1">
      <span class="rp-brand" id="rpTitle">[BRAND_NAME]</span>
      <div class="rp-product-row">
        <img class="rp-product-img" src="[PRODUCT_IMAGE]" alt="[PRODUCT_NAME]">
        <div>
          <div class="rp-product-name">[PRODUCT_NAME]</div>
          <div class="rp-product-sub">[PRODUCT_SUBTITLE]</div>
        </div>
      </div>
      <p class="rp-star-prompt">Select your rating</p>
      <div class="rp-star-picker" id="rpStarPicker">
        <button class="rp-star-btn" data-star="1" aria-label="1 star">★</button>
        <button class="rp-star-btn" data-star="2" aria-label="2 stars">★</button>
        <button class="rp-star-btn" data-star="3" aria-label="3 stars">★</button>
        <button class="rp-star-btn" data-star="4" aria-label="4 stars">★</button>
        <button class="rp-star-btn" data-star="5" aria-label="5 stars">★</button>
      </div>
    </div>

    <!-- Step 2: Review form -->
    <div id="rpStep2" style="display:none">
      <div class="rp-chosen-stars" id="rpChosenStars">★★★★★</div>
      <form id="rpForm" novalidate>
        <div class="rp-field">
          <label class="rp-label" for="rpEmail">Your email <span class="req">*</span></label>
          <input type="email" class="rp-input" id="rpEmail" placeholder="you@example.com" required>
        </div>
        <div class="rp-field">
          <label class="rp-label" for="rpName">Display name <span class="req">*</span></label>
          <input type="text" class="rp-input" id="rpName" placeholder="Jane D" required>
        </div>
        <div class="rp-field">
          <label class="rp-label" for="rpHeadline">Review headline <span class="req">*</span></label>
          <input type="text" class="rp-input" id="rpHeadline" placeholder="Title your experience" required>
        </div>
        <div class="rp-field">
          <label class="rp-label" for="rpReview">Review</label>
          <textarea class="rp-textarea" id="rpReview" placeholder="What would you tell a friend?"></textarea>
        </div>
        <div class="rp-field">
          <span class="rp-label">Media</span>
          <p class="rp-media-hint">Reviews with photos are more helpful</p>
          <div class="rp-upload-btn" role="button" tabindex="0" aria-label="Upload photo">+</div>
        </div>
        <button type="submit" class="rp-submit">Done</button>
      </form>
    </div>

  </div>
</div>
```

### JavaScript

```js
// Open/close
document.getElementById('reviewsWriteBtn').addEventListener('click', function() {
  document.getElementById('rpOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
});
document.getElementById('rpClose').addEventListener('click', function() {
  document.getElementById('rpOverlay').classList.remove('open');
  document.body.style.overflow = '';
});
document.getElementById('rpOverlay').addEventListener('click', function(e) {
  if (e.target === this) { this.classList.remove('open'); document.body.style.overflow = ''; }
});

// Star selection — hover lighting + click to confirm
var rpSelectedStar = 0;
document.querySelectorAll('.rp-star-btn').forEach(function(btn, i) {
  btn.addEventListener('mouseenter', function() {
    document.querySelectorAll('.rp-star-btn').forEach(function(b, j) {
      b.classList.toggle('lit', j <= i);
    });
  });
  btn.addEventListener('mouseleave', function() {
    document.querySelectorAll('.rp-star-btn').forEach(function(b, j) {
      b.classList.toggle('lit', j < rpSelectedStar);
    });
  });
  btn.addEventListener('click', function() {
    rpSelectedStar = i + 1;
    document.getElementById('rpChosenStars').textContent = '★'.repeat(rpSelectedStar) + '☆'.repeat(5 - rpSelectedStar);
    document.getElementById('rpStep1').style.display = 'none';
    document.getElementById('rpStep2').style.display = '';
  });
});

// Form submit (wire to your review backend or Klaviyo)
document.getElementById('rpForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Send data to your review platform
  // Close modal on success
});
```

---

## Accessibility
- Modal has `role="dialog" aria-modal="true" aria-labelledby="rpTitle"`
- Close button has `aria-label="Close"`
- Star picker buttons have `aria-label` per star count
- Review list is plain HTML — no interactive elements, no extra ARIA needed
- Search input has `aria-label="Search reviews"`
- Filter selects have `aria-label`
