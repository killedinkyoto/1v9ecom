# Section Blueprint: Competitor Comparison Table

## Purpose
A transparent, head-to-head comparison between your product and one named (or unnamed/blurred) competitor. Positions your product on specific, verifiable data from both labels rather than vague claims. The product image for the competitor is intentionally blurred — the brand name is generic ("Competitor") — which avoids legal risk while still making the comparison specific enough to be useful.

---

## Brand Assets Required

| Asset | Description |
|---|---|
| `YOUR_PRODUCT_IMAGE` | Clear product photo with transparent or clean background. Displayed at 80% width inside a square container. |
| `COMPETITOR_IMAGE` | Optional. Can be a real competitor image or a placeholder — apply `filter: blur(3px)` via CSS class to obscure brand identity. |
| `ACCENT_COLOR` | Your product's column header color, winning data point highlight color, and product name label. |
| `BG_COLOR` | Page/section background. |
| `SURFACE_COLOR` | Section background (should create a visual break from adjacent sections). |
| `SURFACE2_COLOR` | Table header row background. |
| `TEXT_PRIMARY` | Your column data text — standard weight. |
| `TEXT_MUTED` | Competitor column data, feature column label, table header text. |
| `BORDER_COLOR` | Table border, row dividers (low-opacity). |

---

## Copy Slots

### Section Header
| Slot | Description |
|---|---|
| `SECTION_HEADING` | e.g. "An Honest Comparison" — the word "honest" does a lot of work here. |
| `INTRO_PARAGRAPH` | 2–3 sentences. Frame the comparison as factual and from the label — not an attack. e.g. "We've seen customers compare us to a close competitor. Here's the straight read, from the labels:" |

### Products
| Slot | Description |
|---|---|
| `YOUR_PRODUCT_NAME` | e.g. "Flux", "Zenwave" |
| `COMPETITOR_LABEL` | e.g. "Competitor" (generic is safest). Or a real brand name if you have legal clarity. |

### Table Rows (repeat per feature)
| Slot | Description |
|---|---|
| `FEATURE_NAME` | Label in the first column (e.g. "Format", "Caffeine", "L-Theanine"). |
| `FEATURE_NOTE` | Optional sub-label under the feature name (e.g. "The Steady Base", "one daily"). |
| `YOUR_VALUE` | Your product's data for this row. Wrap winning values in `<span class="td-win">`. |
| `COMPETITOR_VALUE` | Competitor's data. Wrap their wins in `<span class="td-win">` too — honesty matters. |

### Footer Block (optional)
A prose block below the table that acknowledges where the competitor wins and frames your trade-offs as intentional choices.

| Slot | Description |
|---|---|
| `FOOTER_BODY` | 2–3 short paragraphs. Acknowledge real competitor advantages. Explain your differentiated positioning. End with a direct statement of who your product is for. |

---

## HTML Structure

```html
<section id="vs-section">
  <div class="container">
    <h2 class="vs-headline">[SECTION_HEADING]</h2>
    <p class="vs-intro">[INTRO_PARAGRAPH]</p>

    <!-- Product image pair -->
    <div class="vs-products">

      <div class="vs-product vs-product--yours">
        <div class="vs-product-img-wrap">
          <img src="[YOUR_PRODUCT_IMAGE]" alt="[YOUR_PRODUCT_NAME]" loading="lazy">
        </div>
        <span class="vs-product-name">[YOUR_PRODUCT_NAME]</span>
      </div>

      <span class="vs-divider-label">VS</span>

      <div class="vs-product vs-product--competitor">
        <div class="vs-product-img-wrap">
          <!-- Apply blur via CSS class on this image, or use a placeholder -->
          <img src="[COMPETITOR_IMAGE]" alt="Competitor product" loading="lazy">
        </div>
        <span class="vs-product-name">[COMPETITOR_LABEL]</span>
      </div>

    </div>

    <!-- Comparison table -->
    <div class="vs-table-wrap">
      <table class="vs-table">
        <thead>
          <tr>
            <th class="th-feature"></th>
            <th class="th-yours">[YOUR_PRODUCT_NAME]</th>
            <th class="th-competitor">[COMPETITOR_LABEL]</th>
          </tr>
        </thead>
        <tbody>

          <!-- Repeat <tr> for each comparison row -->
          <tr>
            <td class="td-feature">
              [FEATURE_NAME]
              <!-- Optional sub-label: -->
              <em>[FEATURE_NOTE]</em>
            </td>
            <td class="td-yours">
              <!-- Wrap winning value in .td-win -->
              <span class="td-win">[YOUR_VALUE]</span>
            </td>
            <td class="td-competitor">[COMPETITOR_VALUE]</td>
          </tr>

        </tbody>
      </table>
    </div>

    <!-- Optional footer context block -->
    <div class="vs-footer">
      <p>[FOOTER_PARAGRAPH_1]</p>
      <p>[FOOTER_PARAGRAPH_2]</p>
      <p><strong>[CLOSING_STATEMENT]</strong></p>
    </div>

  </div>
</section>
```

---

## Key CSS

```css
#vs-section {
  background: [BG_COLOR];
  padding: 64px 0 72px;
  border-top: 0.5px solid [BORDER_COLOR];
}
@media (min-width: 768px) { #vs-section { padding: 100px 0 108px; } }

/* Headings */
.vs-headline {
  font-family: [DISPLAY_FONT], sans-serif;
  font-weight: 800;
  font-size: clamp(32px, 7vw, 52px);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: [TEXT_PRIMARY];
  margin-bottom: 20px;
  line-height: 1;
}
.vs-intro {
  font-size: 15px;
  color: [FOG_GREY];
  line-height: 1.75;
  margin-bottom: 40px;
}

/* Product image pair */
.vs-products {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 32px;
  margin-bottom: 36px;
}
.vs-product { display: flex; flex-direction: column; align-items: center; gap: 12px; flex: 1; max-width: 180px; }
.vs-product-img-wrap { width: 100%; aspect-ratio: 1/1; display: flex; align-items: flex-end; justify-content: center; position: relative; }
.vs-product-img-wrap img { width: 80%; height: auto; object-fit: contain; display: block; position: relative; z-index: 1; }

/* Your product: subtle glow under the image */
.vs-product--yours .vs-product-img-wrap::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 80%; height: 60%;
  background: radial-gradient(ellipse at 50% 100%, rgba([ACCENT_RGB], 0.13) 0%, transparent 70%);
  pointer-events: none;
}

/* Competitor: blurred image */
.vs-product--competitor .vs-product-img-wrap img { filter: blur(3px); }

.vs-product-name {
  font-family: [DISPLAY_FONT], sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
}
.vs-product--yours .vs-product-name { color: [ACCENT_COLOR]; }
.vs-product--competitor .vs-product-name { color: [TEXT_MUTED]; }

.vs-divider-label {
  flex-shrink: 0;
  font-family: [DISPLAY_FONT], sans-serif;
  font-weight: 900;
  font-size: 22px;
  color: rgba([TEXT_MUTED_RGB], 0.2);
  letter-spacing: 0.06em;
  align-self: center;
  padding-bottom: 24px;
}

/* Table wrapper — horizontal scroll on small screens */
.vs-table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 32px;
  border: 0.5px solid [BORDER_COLOR];
  border-radius: 6px;
}
.vs-table { width: 100%; border-collapse: collapse; }

/* Table header */
.vs-table thead tr { border-bottom: 0.5px solid [BORDER_COLOR]; }
.vs-table th {
  padding: 14px 16px;
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-align: left;
  background: [SURFACE2_COLOR];
}
.vs-table th.th-feature { color: [TEXT_MUTED]; width: 38%; }

/* Your product column header — tinted */
.vs-table th.th-yours {
  color: [ACCENT_COLOR];
  background: rgba([ACCENT_RGB], 0.04);
  border-left: 0.5px solid rgba([ACCENT_RGB], 0.12);
  border-right: 0.5px solid rgba([ACCENT_RGB], 0.12);
}
.vs-table th.th-competitor { color: [TEXT_MUTED]; }

/* Table body rows */
.vs-table tbody tr { border-bottom: 0.5px solid [BORDER_COLOR]; transition: background 0.15s ease; }
.vs-table tbody tr:last-child { border-bottom: none; }
.vs-table tbody tr:hover { background: rgba([TEXT_PRIMARY_RGB], 0.015); }

.vs-table td { padding: 13px 16px; font-size: 13px; line-height: 1.5; vertical-align: top; }
.vs-table td.td-feature { color: [FOG_GREY]; font-size: 12px; }
.vs-table td.td-feature em { display: block; font-style: normal; font-size: 10px; color: [TEXT_MUTED]; margin-top: 2px; }

/* Your column — slight accent tint + winning value highlight */
.vs-table td.td-yours {
  color: [TEXT_PRIMARY];
  font-weight: 500;
  background: rgba([ACCENT_RGB], 0.025);
  border-left: 0.5px solid rgba([ACCENT_RGB], 0.08);
  border-right: 0.5px solid rgba([ACCENT_RGB], 0.08);
}
.vs-table td.td-yours .td-win { color: [ACCENT_COLOR]; font-weight: 600; }

/* Competitor column */
.vs-table td.td-competitor { color: [TEXT_MUTED]; }
.vs-table td.td-competitor .td-win { color: rgba([TEXT_MUTED_RGB], 0.8); font-weight: 600; }

/* Compact on very small screens */
@media (max-width: 480px) {
  .vs-table-wrap { overflow-x: hidden; }
  .vs-table th { padding: 10px 8px; font-size: 8px; letter-spacing: 0.1em; }
  .vs-table td { padding: 10px 8px; font-size: 11px; }
  .vs-table td.td-feature { font-size: 10px; }
}

/* Footer prose block */
.vs-footer {
  background: [SURFACE_COLOR];
  border: 0.5px solid [BORDER_COLOR];
  border-radius: 6px;
  padding: 28px 24px;
}
.vs-footer p { font-size: 14px; color: [FOG_GREY]; line-height: 1.75; margin: 0 0 14px; }
.vs-footer p:last-child { margin-bottom: 0; color: [TEXT_PRIMARY]; font-weight: 500; }
.vs-footer p strong { color: [TEXT_PRIMARY]; font-weight: 500; }
```

---

## Suggested Comparison Row Order

1. **Format** — how the product is delivered/consumed
2. **Customer control** — dosing pace / customization
3. **Stimulant source + dose** — type and amount
4. **Key differentiator ingredient** — your hero ingredient first; mark competitor "None" if they don't have it
5. **Shared ingredients** — where you're comparable (be honest if they have more)
6. **Unique ingredients** — any you have they don't
7. **Servings per unit**
8. **Cost per serving**
9. **Cost per month** (most impactful row — put it last for anchoring)

---

## Design Notes
- **Highlight wins in both columns** — competitor wins should also get `.td-win`. This builds trust; it's not a pure vanity table.
- **Blur the competitor image** — avoids trademark concerns and signals you're not attacking a brand.
- **"Competitor" label** — safer than naming the brand. If you do name them, confirm your legal position first.
- **Footer prose is critical** — it's where you acknowledge real trade-offs and explain your positioning. Skipping it makes the table look one-sided.
- Table is `overflow-x: auto` — don't lock the wrapper width on mobile.

---

## No JavaScript Required
This section is entirely static HTML + CSS. No interactive elements.
