# Mindor Cognitive Worker Lander — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `mindor-cognitive-lander.html` — a full long-form sales lander for Mindor targeting remote cognitive workers (SWEs, cybersecurity analysts, quant traders, AI consultants), mirroring IM8 Health's 13-section structure with Mindor v2 light brand system. Frontend only, no checkout wiring.

**Architecture:** Single vanilla HTML file with all CSS inline in `<style>` and all JS inline in `<script>`. Built section by section — each task appends HTML to `<body>` and CSS to `<style>`. Interactive components (bundle builder, FAQ accordion, nav scroll) wired in the final JS task.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, grid, flexbox), vanilla JS. Google Fonts (Barlow Condensed + DM Sans). Puppeteer screenshots via `node screenshot.mjs`. No framework, no build step.

---

## Pricing Constants (use throughout)

```
BASE_PER_TUB = 44.99
BUNDLE_DISCOUNT = { 1: 0, 2: 0.10, 3: 0.15 }
SUBSCRIBE_DISCOUNT = 0.15

One-time prices:
  1 tub: $44.99 total / $44.99 per tub
  2 tubs: $80.98 total / $40.49 per tub  (10% off)
  3 tubs: $114.72 total / $38.24 per tub (15% off)

Subscribe & Save prices (extra 15% on top):
  1 tub: $38.24 total / $38.24 per tub
  2 tubs: $68.83 total / $34.42 per tub
  3 tubs: $97.51 total / $32.50 per tub
```

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `1v9ecom/mindor-cognitive-lander.html` | Create | Entire page — HTML, CSS, JS |
| `node serve.mjs` | Run (background) | Dev server on port 3000 |
| `node screenshot.mjs` | Run | Visual QA |

---

## Task 1: HTML Scaffold + CSS Foundation

**Files:**
- Create: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Create the file with full head, CSS tokens, base styles**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Mindor Performance Stack — 5 clinically dosed compounds for remote cognitive workers. Calm alertness, no crash.">
  <title>Mindor — 5 Compounds. One Clean Cognitive Window.</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">

  <style>
    /* ── TOKENS ── */
    :root {
      --accent-purple: #9B7FE0;
      --purple-light: #EDE8F8;
      --deep-work-black: #1A2040;
      --sprint-blue: #4A6BD4;
      --fog-grey: #3D5070;
      --bg: #ECF2FB;
      --surface: #E0E9F7;
      --surface2: #D4DEF2;
      --border: rgba(74,107,212,0.14);
      --border-subtle: rgba(74,107,212,0.08);
      --border-accent: rgba(74,107,212,0.30);
      --text-primary: #1A2040;
      --text-muted: #4A587A;
      --text-dim: #8A9CC0;
      --shadow-sm: 0 2px 8px rgba(74,107,212,0.10), 0 1px 3px rgba(74,107,212,0.06);
      --shadow-md: 0 8px 32px rgba(74,107,212,0.14), 0 2px 8px rgba(74,107,212,0.08);
      --shadow-lg: 0 20px 60px rgba(74,107,212,0.18), 0 4px 16px rgba(74,107,212,0.10);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }

    body {
      background: var(--bg);
      color: var(--text-primary);
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.65;
      overflow-x: hidden;
    }

    /* ── SHARED LAYOUT ── */
    .container {
      max-width: 1080px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .container--narrow {
      max-width: 720px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* ── SHARED TYPOGRAPHY ── */
    .eyebrow {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--text-dim);
      display: block;
      margin-bottom: 16px;
    }

    .eyebrow--blue { color: var(--sprint-blue); }

    .section-headline {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 800;
      font-size: clamp(32px, 5vw, 52px);
      color: var(--text-primary);
      line-height: 0.95;
      letter-spacing: -0.01em;
    }

    .section-subhead {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: clamp(18px, 2.5vw, 24px);
      color: var(--fog-grey);
      line-height: 1.1;
      letter-spacing: 0.01em;
      text-transform: uppercase;
    }

    .body-copy {
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 400;
      color: var(--text-muted);
      line-height: 1.7;
    }

    /* ── SHARED COMPONENTS ── */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(74,107,212,0.10);
      border: 0.5px solid rgba(74,107,212,0.25);
      border-radius: 100px;
      padding: 4px 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.12em;
      color: var(--sprint-blue);
      text-transform: uppercase;
    }

    .badge-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--sprint-blue);
      flex-shrink: 0;
    }

    .btn-primary {
      display: inline-block;
      background: var(--sprint-blue);
      color: #fff;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 800;
      font-size: 18px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 16px 40px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: opacity 0.15s, transform 0.15s;
      box-shadow: var(--shadow-md);
      width: 100%;
      text-align: center;
    }

    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); opacity: 1; }

    /* ── DIVIDER ── */
    .section-divider {
      width: 32px;
      height: 2px;
      background: var(--sprint-blue);
      border-radius: 1px;
      margin-bottom: 20px;
    }

    /* ── SECTION SPACING ── */
    .section { padding: 80px 0; }
    .section--sm { padding: 56px 0; }
    .section--dark {
      background: var(--deep-work-black);
      padding: 80px 0;
    }

    /* ── M-WAVE SVG (reused) ── */
    .mwave { display: inline-block; }
  </style>
</head>
<body>

  <!-- sections go here -->

  <script>
    // JS goes here in Task 13
  </script>
</body>
</html>
```

- [ ] **Step 2: Start the dev server (if not already running)**

```bash
node 1v9ecom-main/serve.mjs
```

Expected: `Serving on http://localhost:3000`

- [ ] **Step 3: Take a baseline screenshot**

```bash
node 1v9ecom-main/screenshot.mjs http://localhost:3000/1v9ecom/mindor-cognitive-lander.html scaffold
```

Read the PNG. Expected: blank periwinkle page, no errors in console.

- [ ] **Step 4: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: scaffold mindor cognitive lander"
```

---

## Task 2: Sticky Nav

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add nav CSS inside `<style>` (before closing `</style>`)**

```css
/* ── NAV ── */
.site-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 16px 0;
  transition: background 0.2s, box-shadow 0.2s;
}

.site-nav.scrolled {
  background: rgba(236,242,251,0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 var(--border), var(--shadow-sm);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.nav-wordmark {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 26px;
  color: var(--sprint-blue);
  letter-spacing: 0.04em;
  line-height: 1;
}

.nav-cta {
  display: inline-block;
  background: var(--sprint-blue);
  color: #fff;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 10px 24px;
  border-radius: 3px;
  text-decoration: none;
  transition: opacity 0.15s, transform 0.15s;
  box-shadow: var(--shadow-sm);
}

.nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }
```

- [ ] **Step 2: Add nav HTML inside `<body>`, replacing `<!-- sections go here -->`**

```html
<!-- ── NAV ── -->
<nav class="site-nav" id="site-nav">
  <div class="container">
    <div class="nav-inner">
      <a href="#" class="nav-logo">
        <svg width="24" height="17" viewBox="0 0 40 28" fill="none" aria-hidden="true">
          <path d="M4 22 L10 8 L16 18 L20 10 L24 18 L30 8 L36 22" stroke="#4A6BD4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="nav-wordmark">MINDOR</span>
      </a>
      <a href="#order" class="nav-cta">Get Mindor</a>
    </div>
  </div>
</nav>

<!-- sections go here -->
```

- [ ] **Step 3: Screenshot and verify**

```bash
node 1v9ecom-main/screenshot.mjs http://localhost:3000/1v9ecom/mindor-cognitive-lander.html nav
```

Read PNG. Expected: sprint-blue nav with M-wave + MINDOR wordmark left, "Get Mindor" button right.

- [ ] **Step 4: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add sticky nav to cognitive lander"
```

---

## Task 3: Hero Section

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add hero CSS**

```css
/* ── HERO ── */
.hero {
  padding: 140px 0 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -80px; left: 50%;
  transform: translateX(-50%);
  width: 800px; height: 600px;
  background: radial-gradient(ellipse at 50% 30%, rgba(74,107,212,0.10) 0%, transparent 65%);
  pointer-events: none;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -60px; right: -100px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(155,127,224,0.07) 0%, transparent 70%);
  pointer-events: none;
}

.hero-eyebrow {
  margin-bottom: 20px;
}

.hero-headline {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: clamp(52px, 9vw, 88px);
  color: var(--text-primary);
  line-height: 0.92;
  letter-spacing: -0.01em;
  margin-bottom: 18px;
  position: relative;
}

.hero-headline span { color: var(--sprint-blue); }

.hero-subhead {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: clamp(20px, 3vw, 28px);
  color: var(--fog-grey);
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: 20px;
}

.hero-body {
  max-width: 580px;
  margin: 0 auto 32px;
  font-size: 16px;
  color: var(--text-muted);
  line-height: 1.7;
}

.hero-stars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 36px;
  font-size: 13px;
  color: var(--text-muted);
}

.hero-stars-icons {
  color: #F5A623;
  font-size: 15px;
  letter-spacing: 1px;
}

.hero-img-wrap {
  margin: 0 auto 40px;
  max-width: 420px;
  position: relative;
}

.hero-img-placeholder {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(170deg, #D0DCF0 0%, #C2CDE8 60%, #B8C4E2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  border: 0.5px solid rgba(74,107,212,0.20);
  position: relative;
  overflow: hidden;
}

.hero-img-placeholder::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.25) 0%, transparent 60%);
}

.hero-img-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: rgba(26,32,64,0.4);
  text-transform: uppercase;
  text-align: center;
  padding: 20px;
  line-height: 1.5;
}

.hero-trust-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.hero-trust-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
}

.hero-trust-icon {
  width: 16px;
  height: 16px;
  background: rgba(74,107,212,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hero-trust-icon svg { width: 9px; height: 9px; }
```

- [ ] **Step 2: Add hero HTML (replace `<!-- sections go here -->`)**

```html
<!-- ── HERO ── -->
<section class="hero" id="hero">
  <div class="container--narrow">
    <div class="hero-eyebrow">
      <span class="badge"><span class="badge-dot"></span>Performance Stack · Est. 2026</span>
    </div>

    <h1 class="hero-headline">
      5 Compounds.<br><span>One Clean</span><br>Cognitive Window.
    </h1>

    <p class="hero-subhead">The Focus Stack For People Whose Work Demands Everything From Their Brain.</p>

    <p class="hero-body">
      You're doing the kind of work where mental clarity is the whole job. A threat hunt doesn't pause for brain fog. A code review doesn't care that your second cup wore off. You need focus that holds for a real shift — not a 45-minute caffeine spike.
    </p>

    <div class="hero-stars">
      <span class="hero-stars-icons">★★★★★</span>
      <span>4.9 · 1,200+ cognitive workers</span>
    </div>

    <!-- Product image -->
    <div class="hero-img-wrap">
      <div class="hero-img-placeholder">
        <p class="hero-img-label">[PLACEHOLDER: 420×420<br>Product bag hero shot<br>Periwinkle / light bg]</p>
      </div>
    </div>

    <!-- Bundle builder (Task 13 wires the JS; this is the HTML shell) -->
    <div id="bundle-widget-hero" class="bundle-widget">
      <!-- Injected by Task 13 -->
    </div>

    <!-- Trust badges -->
    <div class="hero-trust-row">
      <div class="hero-trust-item">
        <div class="hero-trust-icon">
          <svg viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#4A6BD4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        3rd-Party Tested
      </div>
      <div class="hero-trust-item">
        <div class="hero-trust-icon">
          <svg viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#4A6BD4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        No Proprietary Blends
      </div>
      <div class="hero-trust-item">
        <div class="hero-trust-icon">
          <svg viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#4A6BD4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        Clean Exit · No Crash
      </div>
    </div>
  </div>
</section>

<!-- sections go here -->
```

- [ ] **Step 3: Screenshot and verify**

```bash
node 1v9ecom-main/screenshot.mjs http://localhost:3000/1v9ecom/mindor-cognitive-lander.html hero
```

Read PNG. Expected: Large headline over product placeholder, stars row, trust badges below. Nav visible at top.

- [ ] **Step 4: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add hero section to cognitive lander"
```

---

## Task 4: Trust Bar

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add trust bar CSS**

```css
/* ── TRUST BAR ── */
.trust-bar {
  background: var(--deep-work-black);
  padding: 28px 0;
  border-top: 0.5px solid rgba(74,107,212,0.20);
  border-bottom: 0.5px solid rgba(74,107,212,0.20);
}

.trust-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.trust-bar-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.30);
  white-space: nowrap;
  flex-shrink: 0;
}

.trust-bar-logos {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
  flex: 1;
}

.trust-bar-logo-placeholder {
  height: 20px;
  background: rgba(255,255,255,0.12);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.25);
  text-transform: uppercase;
  white-space: nowrap;
}

.trust-bar-metric {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.trust-bar-metric-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: var(--sprint-blue);
  line-height: 1;
}

.trust-bar-metric-label {
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  line-height: 1.3;
  max-width: 80px;
}
```

- [ ] **Step 2: Add trust bar HTML (replace `<!-- sections go here -->`)**

```html
<!-- ── TRUST BAR ── -->
<div class="trust-bar">
  <div class="container">
    <div class="trust-bar-inner">
      <span class="trust-bar-label">As seen in</span>
      <div class="trust-bar-logos">
        <div class="trust-bar-logo-placeholder">[PUB LOGO 1]</div>
        <div class="trust-bar-logo-placeholder">[PUB LOGO 2]</div>
        <div class="trust-bar-logo-placeholder">[PUB LOGO 3]</div>
        <div class="trust-bar-logo-placeholder">[PUB LOGO 4]</div>
      </div>
      <div class="trust-bar-metric">
        <span class="trust-bar-metric-num">1,200+</span>
        <span class="trust-bar-metric-label">Orders Shipped</span>
      </div>
    </div>
  </div>
</div>

<!-- sections go here -->
```

- [ ] **Step 3: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add trust bar"
```

---

## Task 5: Problem Section

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add problem section CSS**

```css
/* ── PROBLEM ── */
.problem-section {
  padding: 96px 0;
  background: var(--surface);
  position: relative;
  overflow: hidden;
}

.problem-section::before {
  content: '';
  position: absolute;
  top: -100px; right: -120px;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(155,127,224,0.06) 0%, transparent 70%);
  pointer-events: none;
}

.problem-header { margin-bottom: 56px; }

.problem-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.problem-card {
  background: var(--bg);
  border: 0.5px solid var(--border);
  border-radius: 6px;
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}

.problem-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-2px);
}

.problem-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--sprint-blue), transparent);
  opacity: 0.5;
}

.problem-card-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 48px;
  color: rgba(74,107,212,0.12);
  line-height: 1;
  margin-bottom: 16px;
  display: block;
}

.problem-card-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: var(--text-primary);
  line-height: 1.05;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.problem-card-body {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.65;
}

.problem-pivot {
  margin-top: 56px;
  padding: 28px 32px;
  background: rgba(74,107,212,0.06);
  border: 0.5px solid var(--border-accent);
  border-radius: 6px;
  max-width: 680px;
}

.problem-pivot p {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.7;
}

.problem-pivot p + p { margin-top: 10px; }
```

- [ ] **Step 2: Add problem HTML**

```html
<!-- ── PROBLEM ── -->
<section class="problem-section">
  <div class="container">
    <div class="problem-header">
      <div class="section-divider"></div>
      <span class="eyebrow">The Problem</span>
      <h2 class="section-headline">Your Current Stack Wasn't<br>Designed For This Kind Of Work.</h2>
    </div>

    <div class="problem-grid">
      <div class="problem-card">
        <span class="problem-card-num">01</span>
        <p class="problem-card-title">Caffeine Spikes,<br>Doesn't Sustain</p>
        <p class="problem-card-body">You get 45–60 minutes of sharpness, then the slope starts. By 2pm, you're technically working but producing nothing you'd be proud of. Coffee got you in. It didn't keep you there.</p>
      </div>
      <div class="problem-card">
        <span class="problem-card-num">02</span>
        <p class="problem-card-title">Jitters Are A<br>Liability Here</p>
        <p class="problem-card-body">When you're hunting a threat, reviewing a PR, or building a model — scattered isn't just uncomfortable. It's expensive. The kind of work you do punishes overstimulation.</p>
      </div>
      <div class="problem-card">
        <span class="problem-card-num">03</span>
        <p class="problem-card-title">The Afternoon Drop<br>Doesn't Negotiate</p>
        <p class="problem-card-body">Your 3pm session gets the worst version of your brain. Not because you're lazy or tired. Because your stimulant routine ran out and you're running the second half of the day on fumes.</p>
      </div>
    </div>

    <div class="problem-pivot">
      <p>The standard advice is to drink less coffee, sleep more, or meditate. Those things help. But they don't solve the core problem.</p>
      <p>Your stimulant routine is built from tools designed for physical energy — not sustained cognitive output. There's a difference. And most people in your field feel it every day.</p>
    </div>
  </div>
</section>

<!-- sections go here -->
```

- [ ] **Step 3: Screenshot and verify**

```bash
node 1v9ecom-main/screenshot.mjs http://localhost:3000/1v9ecom/mindor-cognitive-lander.html problem
```

Read PNG. Expected: 3-column card grid on `--surface` background, numbered cards, pivot callout box below.

- [ ] **Step 4: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add problem section"
```

---

## Task 6: Ingredients Section

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add ingredients CSS**

```css
/* ── INGREDIENTS ── */
.ingredients-section { padding: 96px 0; }

.ingredients-header { margin-bottom: 16px; }
.ingredients-intro {
  max-width: 560px;
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 52px;
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.ingredient-card {
  background: var(--surface);
  border: 0.5px solid var(--border);
  border-radius: 6px;
  padding: 28px 24px;
  transition: border-color 0.2s, box-shadow 0.2s;
  position: relative;
}

.ingredient-card:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-md);
}

.ingredient-card:nth-child(4),
.ingredient-card:nth-child(5) {
  grid-column: span 1;
}

.ingredient-icon-placeholder {
  width: 40px;
  height: 40px;
  background: rgba(74,107,212,0.10);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 8px;
  font-weight: 600;
  color: var(--text-dim);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ingredient-dose-badge {
  display: inline-block;
  background: var(--sprint-blue);
  color: #fff;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.06em;
  padding: 3px 10px;
  border-radius: 2px;
  margin-bottom: 10px;
}

.ingredient-role {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 8px;
  display: block;
}

.ingredient-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 20px;
  color: var(--text-primary);
  line-height: 1.05;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.ingredient-body {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
}

.ingredients-label-note {
  margin-top: 32px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--text-dim);
}

.ingredients-label-note svg { flex-shrink: 0; }
```

- [ ] **Step 2: Add ingredients HTML**

```html
<!-- ── INGREDIENTS ── -->
<section class="ingredients-section">
  <div class="container">
    <div class="ingredients-header">
      <div class="section-divider"></div>
      <span class="eyebrow">The Stack</span>
      <h2 class="section-headline">5 Compounds.<br>Clinically Dosed. Nothing Extra.</h2>
    </div>
    <p class="ingredients-intro">Full label. Every dose published. No proprietary blends, no hidden milligrams. You can verify every number on a PubMed search — and we expect you to.</p>

    <div class="ingredients-grid">

      <div class="ingredient-card">
        <div class="ingredient-icon-placeholder">[ICON]</div>
        <span class="ingredient-dose-badge">100mg</span>
        <span class="ingredient-role">Alertness Signal</span>
        <p class="ingredient-name">Green Tea<br>Caffeine</p>
        <p class="ingredient-body">Supports alertness without the spike of synthetic caffeine. The green tea source metabolizes more evenly — so you get a steadier on-ramp, not a jolt.</p>
      </div>

      <div class="ingredient-card">
        <div class="ingredient-icon-placeholder">[ICON]</div>
        <span class="ingredient-dose-badge">200mg</span>
        <span class="ingredient-role">Steadiness Signal</span>
        <p class="ingredient-name">L-Theanine</p>
        <p class="ingredient-body">Paired with caffeine to support smooth, steady alertness. The combination is studied for calm focus during demanding tasks. Caffeine gets you started. L-Theanine keeps you steady.</p>
      </div>

      <div class="ingredient-card">
        <div class="ingredient-icon-placeholder">[ICON]</div>
        <span class="ingredient-dose-badge">300mg</span>
        <span class="ingredient-role">Cognitive Support</span>
        <p class="ingredient-name">Alpha-GPC</p>
        <p class="ingredient-body">A serious cognitive-support ingredient. Supports mental sharpness during demanding work. This is the ingredient that tells skeptical engineers the formula was built with intent, not just caffeine and hope.</p>
      </div>

      <div class="ingredient-card">
        <div class="ingredient-icon-placeholder">[ICON]</div>
        <span class="ingredient-dose-badge"><!-- [CONFIRM DOSE] --></span>
        <span class="ingredient-role">Endurance Layer</span>
        <p class="ingredient-name">Panax Ginseng</p>
        <p class="ingredient-body">Supports mental stamina on long work days. This isn't the focus spike — it's what helps you stay in the session past hour three. The ingredient that makes the 3pm wall optional.</p>
      </div>

      <div class="ingredient-card">
        <div class="ingredient-icon-placeholder">[ICON]</div>
        <span class="ingredient-dose-badge"><!-- [CONFIRM DOSE] --></span>
        <span class="ingredient-role">Infrastructure Layer</span>
        <p class="ingredient-name">B6 + B12</p>
        <p class="ingredient-body">Supports normal energy metabolism — how your body converts food into usable energy. Not a stimulant. A baseline support so the rest of the stack has a solid floor to work from.</p>
      </div>

    </div>

    <div class="ingredients-label-note">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#8A9CC0" stroke-width="1"/><path d="M7 6v4M7 4.5v.5" stroke="#8A9CC0" stroke-width="1.2" stroke-linecap="round"/></svg>
      These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
    </div>
  </div>
</section>

<!-- sections go here -->
```

- [ ] **Step 3: Screenshot and verify**

```bash
node 1v9ecom-main/screenshot.mjs http://localhost:3000/1v9ecom/mindor-cognitive-lander.html ingredients
```

Read PNG. Expected: 3-column card grid (5 cards), dose badges in Sprint Blue, DSHEA note at bottom.

- [ ] **Step 4: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add ingredients section"
```

---

## Task 7: How It Works

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add mechanism CSS**

```css
/* ── MECHANISM ── */
.mechanism-section {
  padding: 96px 0;
  background: var(--surface);
  overflow: hidden;
  position: relative;
}

.mechanism-section::after {
  content: '';
  position: absolute;
  bottom: -80px; left: -80px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(74,107,212,0.06) 0%, transparent 70%);
  pointer-events: none;
}

.mechanism-header { margin-bottom: 56px; }

.mechanism-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  position: relative;
}

.mechanism-steps::before {
  content: '';
  position: absolute;
  top: 28px;
  left: calc(16.66% + 16px);
  right: calc(16.66% + 16px);
  height: 1px;
  background: linear-gradient(90deg, var(--sprint-blue), rgba(74,107,212,0.3));
}

.mechanism-step {
  padding: 0 24px;
  text-align: center;
  position: relative;
}

.mechanism-step-num {
  width: 56px;
  height: 56px;
  background: var(--sprint-blue);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 22px;
  color: #fff;
  position: relative;
  z-index: 1;
  box-shadow: var(--shadow-md);
}

.mechanism-step-time {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sprint-blue);
  margin-bottom: 8px;
}

.mechanism-step-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: var(--text-primary);
  line-height: 1.05;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.mechanism-step-body {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.65;
}

.mechanism-diagram-placeholder {
  margin-top: 56px;
  height: 80px;
  background: rgba(74,107,212,0.06);
  border: 0.5px dashed var(--border-accent);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--text-dim);
  text-transform: uppercase;
}
```

- [ ] **Step 2: Add mechanism HTML**

```html
<!-- ── MECHANISM ── -->
<section class="mechanism-section">
  <div class="container">
    <div class="mechanism-header">
      <div class="section-divider"></div>
      <span class="eyebrow">How It Works</span>
      <h2 class="section-headline">It Doesn't Push You.<br>It Clears The Floor.</h2>
    </div>

    <div class="mechanism-steps">
      <div class="mechanism-step">
        <div class="mechanism-step-num">1</div>
        <p class="mechanism-step-time">20–30 min in</p>
        <p class="mechanism-step-title">You're On.</p>
        <p class="mechanism-step-body">Green tea caffeine and L-Theanine begin working. You feel alert — not anxious, not over-caffeinated. The on-ramp is smooth because the stack was designed that way.</p>
      </div>
      <div class="mechanism-step">
        <div class="mechanism-step-num">2</div>
        <p class="mechanism-step-time">Hours 1–4</p>
        <p class="mechanism-step-title">The Window Holds.</p>
        <p class="mechanism-step-body">Alpha-GPC and Ginseng extend your peak. You get 3–5 hours of usable focus — actual output, not the anxious busyness that passes for productivity. The session feels different.</p>
      </div>
      <div class="mechanism-step">
        <div class="mechanism-step-num">3</div>
        <p class="mechanism-step-time">End of session</p>
        <p class="mechanism-step-title">Clean Exit.</p>
        <p class="mechanism-step-body">No cliff. No rebound. No jitteriness at midnight wondering why you can't sleep. The session ends and you're done — tired the way you're supposed to be tired after real work.</p>
      </div>
    </div>

    <div class="mechanism-diagram-placeholder">[PLACEHOLDER: Focus Arc diagram — on-ramp → plateau → clean exit]</div>
  </div>
</section>

<!-- sections go here -->
```

- [ ] **Step 3: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add mechanism section"
```

---

## Task 8: Comparison Table

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add comparison CSS**

```css
/* ── COMPARISON ── */
.comparison-section { padding: 96px 0; }

.comparison-header { margin-bottom: 52px; }

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 0.5px solid var(--border);
}

.comparison-table th {
  padding: 16px 20px;
  text-align: center;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: var(--surface2);
  color: var(--text-muted);
  border-bottom: 0.5px solid var(--border);
}

.comparison-table th.col-mindor {
  background: var(--sprint-blue);
  color: #fff;
}

.comparison-table th:first-child {
  text-align: left;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--text-dim);
  font-weight: 600;
  background: var(--surface);
}

.comparison-table td {
  padding: 14px 20px;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  border-bottom: 0.5px solid var(--border-subtle);
  background: var(--bg);
}

.comparison-table td:first-child {
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--surface);
}

.comparison-table td.col-mindor {
  background: rgba(74,107,212,0.06);
  font-weight: 600;
  color: var(--sprint-blue);
}

.comparison-table tr:last-child td { border-bottom: none; }

.check { color: var(--sprint-blue); font-size: 16px; }
.cross { color: rgba(180,50,50,0.5); font-size: 14px; }
.neutral { color: var(--text-dim); font-size: 13px; }
```

- [ ] **Step 2: Add comparison HTML**

```html
<!-- ── COMPARISON ── -->
<section class="comparison-section">
  <div class="container">
    <div class="comparison-header">
      <div class="section-divider"></div>
      <span class="eyebrow">The Honest Comparison</span>
      <h2 class="section-headline">Coffee Is A Gamble.<br>This Is A System.</h2>
    </div>

    <table class="comparison-table">
      <thead>
        <tr>
          <th></th>
          <th class="col-mindor">Mindor</th>
          <th>Coffee</th>
          <th>Pre-Workout</th>
          <th>Nothing</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Predictable onset</td>
          <td class="col-mindor"><span class="check">✓</span> Consistent</td>
          <td><span class="neutral">~ </span>Variable</td>
          <td><span class="check">✓</span> Fast</td>
          <td><span class="cross">✕</span></td>
        </tr>
        <tr>
          <td>Sustained focus window</td>
          <td class="col-mindor"><span class="check">✓</span> 3–5 hrs</td>
          <td><span class="cross">✕</span> 45–90 min</td>
          <td><span class="cross">✕</span> 60–90 min</td>
          <td><span class="cross">✕</span></td>
        </tr>
        <tr>
          <td>Jitter / anxiety risk</td>
          <td class="col-mindor"><span class="check">✓</span> Minimal</td>
          <td><span class="cross">✕</span> High</td>
          <td><span class="cross">✕</span> Very high</td>
          <td><span class="neutral">—</span></td>
        </tr>
        <tr>
          <td>Post-session crash</td>
          <td class="col-mindor"><span class="check">✓</span> No cliff</td>
          <td><span class="cross">✕</span> Common</td>
          <td><span class="cross">✕</span> Common</td>
          <td><span class="neutral">—</span></td>
        </tr>
        <tr>
          <td>Sleep impact</td>
          <td class="col-mindor"><span class="check">✓</span> Low</td>
          <td><span class="cross">✕</span> High if late</td>
          <td><span class="cross">✕</span> High</td>
          <td><span class="neutral">—</span></td>
        </tr>
        <tr>
          <td>Full ingredient transparency</td>
          <td class="col-mindor"><span class="check">✓</span> Every dose</td>
          <td><span class="neutral">—</span></td>
          <td><span class="cross">✕</span> Often blended</td>
          <td><span class="neutral">—</span></td>
        </tr>
        <tr>
          <td>Designed for sustained deep work</td>
          <td class="col-mindor"><span class="check">✓</span> Yes</td>
          <td><span class="cross">✕</span> No</td>
          <td><span class="cross">✕</span> No</td>
          <td><span class="cross">✕</span> No</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<!-- sections go here -->
```

- [ ] **Step 3: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add comparison table"
```

---

## Task 9: Testimonials

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add testimonials CSS**

```css
/* ── TESTIMONIALS ── */
.testimonials-section {
  padding: 96px 0;
  background: var(--surface);
  position: relative;
}

.testimonials-header { margin-bottom: 52px; }

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.testimonial-card {
  background: var(--bg);
  border: 0.5px solid var(--border);
  border-radius: 6px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.testimonial-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--border-accent);
}

.testimonial-stars {
  color: #F5A623;
  font-size: 14px;
  letter-spacing: 2px;
}

.testimonial-quote {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.7;
  font-style: italic;
  flex: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 0.5px solid var(--border-subtle);
}

.testimonial-avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface2);
  border: 0.5px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: var(--text-dim);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  flex-shrink: 0;
}

.testimonial-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.2;
}

.testimonial-role {
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.08em;
}
```

- [ ] **Step 2: Add testimonials HTML**

```html
<!-- ── TESTIMONIALS ── -->
<section class="testimonials-section">
  <div class="container">
    <div class="testimonials-header">
      <div class="section-divider"></div>
      <span class="eyebrow">Field Reports</span>
      <h2 class="section-headline">From People Doing<br>The Same Kind Of Work.</h2>
    </div>

    <div class="testimonials-grid">
      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-quote">"I've tried every nootropic stack on the market. Mindor is the first one where I can point to exactly what each ingredient does and why it's in there. The 3-hour focus window is real. I was skeptical. I'm not anymore."</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar-placeholder">[IMG]</div>
          <div>
            <p class="testimonial-name">Marcus T.</p>
            <p class="testimonial-role">Senior Security Engineer</p>
          </div>
        </div>
      </div>

      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-quote">"I do quantitative research. I need to hold a lot of state in my head for hours at a time. The difference with Mindor is I don't feel the friction anymore. The afternoon drop just stopped being a daily problem."</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar-placeholder">[IMG]</div>
          <div>
            <p class="testimonial-name">Leila K.</p>
            <p class="testimonial-role">Quant Analyst</p>
          </div>
        </div>
      </div>

      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-quote">"I was burned by 'focus supplements' before, so I read the label before I bought. No proprietary blends. Every dose is published. That alone got me to try it. Two months in and it's part of the daily pre-work ritual."</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar-placeholder">[IMG]</div>
          <div>
            <p class="testimonial-name">James R.</p>
            <p class="testimonial-role">AI Consultant</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- sections go here -->
```

- [ ] **Step 3: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add testimonials section"
```

---

## Task 10: Science Callout (Dark Inversion)

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add science CSS**

```css
/* ── SCIENCE ── */
.science-section {
  padding: 96px 0;
  background: var(--deep-work-black);
  position: relative;
  overflow: hidden;
}

.science-section::before {
  content: '';
  position: absolute;
  top: -100px; right: -100px;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(74,107,212,0.12) 0%, transparent 65%);
  pointer-events: none;
}

.science-section::after {
  content: '';
  position: absolute;
  bottom: -60px; left: -60px;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(155,127,224,0.08) 0%, transparent 70%);
  pointer-events: none;
}

.science-section .eyebrow { color: rgba(74,107,212,0.7); }
.science-section .section-headline { color: #fff; }

.science-intro {
  max-width: 560px;
  font-size: 15px;
  color: rgba(255,255,255,0.55);
  line-height: 1.7;
  margin: 20px 0 56px;
}

.science-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 56px;
}

.science-stat {
  padding: 28px 24px;
  background: rgba(255,255,255,0.04);
  border: 0.5px solid rgba(74,107,212,0.25);
  border-radius: 6px;
}

.science-stat-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 52px;
  color: var(--sprint-blue);
  line-height: 0.9;
  display: block;
  margin-bottom: 8px;
}

.science-stat-label {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  line-height: 1.5;
}

.science-stat-label strong {
  display: block;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  margin-bottom: 3px;
}

.science-testing-placeholder {
  height: 64px;
  background: rgba(255,255,255,0.04);
  border: 0.5px dashed rgba(74,107,212,0.30);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.20);
  text-transform: uppercase;
}
```

- [ ] **Step 2: Add science HTML**

```html
<!-- ── SCIENCE ── -->
<section class="science-section">
  <div class="container">
    <div class="section-divider"></div>
    <span class="eyebrow">The Science</span>
    <h2 class="section-headline">Every Dose Is On The Label.<br>Nothing Hidden.</h2>
    <p class="science-intro">No proprietary blends. No "focus matrix" with undisclosed milligrams. The formula is published in full because people in your field verify things — and we built this expecting you to.</p>

    <div class="science-stats">
      <div class="science-stat">
        <span class="science-stat-num">200mg</span>
        <p class="science-stat-label"><strong>L-Theanine</strong>The dose used in peer-reviewed calm-alertness research paired with caffeine.</p>
      </div>
      <div class="science-stat">
        <span class="science-stat-num">300mg</span>
        <p class="science-stat-label"><strong>Alpha-GPC</strong>The clinically studied dose for cognitive support in demanding tasks.</p>
      </div>
      <div class="science-stat">
        <span class="science-stat-num">2:1</span>
        <p class="science-stat-label"><strong>Theanine : Caffeine</strong>The ratio studied for calm alertness without the anxiety signal.</p>
      </div>
    </div>

    <div class="science-testing-placeholder">[PLACEHOLDER: 3rd-party testing certification badge / lab seal]</div>
  </div>
</section>

<!-- sections go here -->
```

- [ ] **Step 3: Screenshot and verify**

```bash
node 1v9ecom-main/screenshot.mjs http://localhost:3000/1v9ecom/mindor-cognitive-lander.html science
```

Read PNG. Expected: Dark navy background, 3 white stat cards with Sprint Blue numbers.

- [ ] **Step 4: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add science callout section"
```

---

## Task 11: Guarantee Section

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add guarantee CSS**

```css
/* ── GUARANTEE ── */
.guarantee-section { padding: 96px 0; }

.guarantee-inner {
  display: flex;
  align-items: center;
  gap: 48px;
  background: var(--surface);
  border: 0.5px solid var(--border-accent);
  border-radius: 10px;
  padding: 48px;
  position: relative;
  overflow: hidden;
}

.guarantee-inner::before {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 260px; height: 260px;
  background: radial-gradient(circle, rgba(74,107,212,0.08) 0%, transparent 70%);
  pointer-events: none;
}

.guarantee-badge-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(74,107,212,0.10);
  border: 2px solid rgba(74,107,212,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  text-transform: uppercase;
  text-align: center;
  padding: 12px;
  line-height: 1.4;
}

.guarantee-copy { flex: 1; }

.guarantee-copy .eyebrow { margin-bottom: 12px; }

.guarantee-headline {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: clamp(24px, 3.5vw, 36px);
  color: var(--text-primary);
  line-height: 1.0;
  margin-bottom: 16px;
}

.guarantee-body {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 480px;
}
```

- [ ] **Step 2: Add guarantee HTML**

```html
<!-- ── GUARANTEE ── -->
<section class="guarantee-section">
  <div class="container">
    <div class="guarantee-inner">
      <div class="guarantee-badge-placeholder">[PLACEHOLDER: 30-Day Guarantee Seal]</div>
      <div class="guarantee-copy">
        <span class="eyebrow eyebrow--blue">Risk-Free</span>
        <h2 class="guarantee-headline">If Your Brain Doesn't Notice It,<br>We'll Give You Your Money Back.</h2>
        <p class="guarantee-body">Try Mindor for 30 days. If you don't feel the difference in your work sessions — cleaner focus, better sustained output, no afternoon drop — email us for a full refund. No hoops. No restocking fee. We're confident enough in the formula to make this simple.</p>
      </div>
    </div>
  </div>
</section>

<!-- sections go here -->
```

- [ ] **Step 3: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add guarantee section"
```

---

## Task 12: FAQ Accordion

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add FAQ CSS**

```css
/* ── FAQ ── */
.faq-section {
  padding: 96px 0;
  background: var(--surface);
}

.faq-header { margin-bottom: 48px; }

.faq-list {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-item {
  background: var(--bg);
  border: 0.5px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.faq-item.open { border-color: var(--border-accent); }

.faq-question {
  width: 100%;
  background: none;
  border: none;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  text-align: left;
}

.faq-question-text {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: var(--text-primary);
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.faq-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--surface2);
  border: 0.5px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, transform 0.2s;
}

.faq-item.open .faq-icon {
  background: var(--sprint-blue);
  transform: rotate(45deg);
}

.faq-icon svg { width: 10px; height: 10px; }
.faq-item.open .faq-icon svg { stroke: #fff; }

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.2s;
}

.faq-item.open .faq-answer { max-height: 400px; }

.faq-answer-inner {
  padding: 0 24px 20px;
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.7;
  border-top: 0.5px solid var(--border-subtle);
  padding-top: 16px;
}
```

- [ ] **Step 2: Add FAQ HTML**

```html
<!-- ── FAQ ── -->
<section class="faq-section">
  <div class="container">
    <div class="faq-header">
      <div class="section-divider"></div>
      <span class="eyebrow">Questions</span>
      <h2 class="section-headline">The Ones You're<br>Actually Thinking.</h2>
    </div>

    <div class="faq-list">

      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          <span class="faq-question-text">How is this different from a pre-workout?</span>
          <span class="faq-icon"><svg viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5h6" stroke="#4A587A" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        </button>
        <div class="faq-answer" role="region">
          <p class="faq-answer-inner">Pre-workouts are built for physical output — high stimulants, vasodilators, creatine loading. Mindor is built for cognitive output. The caffeine dose is intentionally lower and cleaner. The co-ingredients — L-Theanine, Alpha-GPC, Ginseng — support the quality of your mental performance, not your ability to lift heavier.</p>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          <span class="faq-question-text">Will I feel jittery?</span>
          <span class="faq-icon"><svg viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5h6" stroke="#4A587A" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        </button>
        <div class="faq-answer" role="region">
          <p class="faq-answer-inner">The 2:1 L-Theanine to caffeine ratio is specifically designed to prevent that. L-Theanine supports a smooth, steady alertness alongside the caffeine signal. Most users describe it as alert but calm — switched on without the edge. If you're particularly sensitive to caffeine, start with half a scoop.</p>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          <span class="faq-question-text">When should I take it?</span>
          <span class="faq-icon"><svg viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5h6" stroke="#4A587A" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        </button>
        <div class="faq-answer" role="region">
          <p class="faq-answer-inner">20–30 minutes before you need to be on. Before a deep work block, before a long debugging session, before a threat hunt. The stack takes about that long to reach steady state, so mixing it before you sit down is the move. Most users take it first thing in the morning, or mid-morning before their primary work block.</p>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          <span class="faq-question-text">Can I take it with my morning coffee?</span>
          <span class="faq-icon"><svg viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5h6" stroke="#4A587A" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        </button>
        <div class="faq-answer" role="region">
          <p class="faq-answer-inner">You can. The caffeine dose in Mindor is 100mg — about the same as a standard cup of coffee. If you're already having coffee, be mindful of your total caffeine intake. A lot of users replace their morning cup with Mindor rather than stacking them, because the Mindor session feels cleaner and lasts longer.</p>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          <span class="faq-question-text">Is there a crash afterward?</span>
          <span class="faq-icon"><svg viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5h6" stroke="#4A587A" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        </button>
        <div class="faq-answer" role="region">
          <p class="faq-answer-inner">The clean exit is a design feature, not an accident. Green tea caffeine metabolizes differently than synthetic caffeine — the drop-off is gradual instead of a cliff. The L-Theanine also smooths the tail end. You'll feel ready to wind down when the session is over, not wired at midnight wondering why you can't sleep.</p>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          <span class="faq-question-text">How long until I notice a difference?</span>
          <span class="faq-icon"><svg viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5h6" stroke="#4A587A" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        </button>
        <div class="faq-answer" role="region">
          <p class="faq-answer-inner">Most people feel a difference in the first session — the on-ramp is noticeably smoother than coffee. The fuller effect builds over 2–3 weeks as Alpha-GPC's cognitive support compounds. If you've been running on energy drinks and synthetic caffeine for years, give it a few days to recalibrate before judging.</p>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- sections go here -->
```

- [ ] **Step 3: Screenshot and verify**

```bash
node 1v9ecom-main/screenshot.mjs http://localhost:3000/1v9ecom/mindor-cognitive-lander.html faq
```

Read PNG. Expected: accordion items closed, clean list on `--surface` background.

- [ ] **Step 4: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add faq accordion section"
```

---

## Task 13: Bundle Builder Widget + Final CTA Section

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add bundle widget CSS**

```css
/* ── BUNDLE WIDGET ── */
.bundle-widget {
  background: var(--bg);
  border: 0.5px solid var(--border-accent);
  border-radius: 10px;
  padding: 32px;
  max-width: 560px;
  margin: 0 auto;
  box-shadow: var(--shadow-lg);
}

.bundle-widget-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: 4px;
}

.bundle-widget-sub {
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 24px;
}

/* Quantity selector */
.qty-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 10px;
  display: block;
}

.qty-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.qty-card {
  padding: 14px 10px;
  border: 0.5px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  background: var(--surface);
  transition: border-color 0.15s, background 0.15s;
  position: relative;
}

.qty-card.selected {
  border-color: var(--sprint-blue);
  background: rgba(74,107,212,0.06);
}

.qty-card-badge {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--sprint-blue);
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 100px;
  white-space: nowrap;
  text-transform: uppercase;
}

.qty-card-servings {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 20px;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 2px;
}

.qty-card-tubs {
  font-size: 11px;
  color: var(--text-dim);
  margin-bottom: 8px;
}

.qty-card-price {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: var(--sprint-blue);
  line-height: 1;
}

.qty-card-price-orig {
  font-size: 11px;
  color: var(--text-dim);
  text-decoration: line-through;
}

/* Flavor selector */
.flavor-row {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.flavor-btn {
  padding: 8px 16px;
  border: 0.5px solid var(--border);
  border-radius: 100px;
  background: var(--surface);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.flavor-btn.selected {
  border-color: var(--sprint-blue);
  background: var(--sprint-blue);
  color: #fff;
}

/* Subscribe toggle */
.subscribe-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(74,107,212,0.06);
  border: 0.5px solid rgba(74,107,212,0.25);
  border-radius: 6px;
  margin-bottom: 20px;
  cursor: pointer;
}

.subscribe-row input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--sprint-blue);
  flex-shrink: 0;
  margin-top: 1px;
  cursor: pointer;
}

.subscribe-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  cursor: pointer;
}

.subscribe-sub {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 3px;
}

/* Order summary */
.order-summary {
  margin-bottom: 20px;
  padding: 16px;
  background: var(--surface2);
  border-radius: 6px;
}

.order-total-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.order-total-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
}

.order-total-price {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 36px;
  color: var(--text-primary);
  line-height: 1;
}

.order-total-per-unit {
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 3px;
  text-align: right;
}

.order-savings {
  display: inline-block;
  background: rgba(74,107,212,0.10);
  color: var(--sprint-blue);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 2px;
  margin-top: 6px;
}

/* Trust below button */
.widget-trust-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.widget-trust-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-dim);
}

/* ── ORDER CTA SECTION ── */
.order-section {
  padding: 96px 0;
  position: relative;
  overflow: hidden;
}

.order-section::before {
  content: '';
  position: absolute;
  top: -80px; left: 50%;
  transform: translateX(-50%);
  width: 800px; height: 500px;
  background: radial-gradient(ellipse at 50% 40%, rgba(74,107,212,0.08) 0%, transparent 65%);
  pointer-events: none;
}

.order-header {
  text-align: center;
  margin-bottom: 48px;
}

.order-header .section-headline { margin-bottom: 12px; }
.order-header .body-copy { max-width: 480px; margin: 0 auto; }
```

- [ ] **Step 2: Add order section HTML (replaces `<!-- sections go here -->`)**

```html
<!-- ── ORDER / FINAL CTA ── -->
<section class="order-section" id="order">
  <div class="container">
    <div class="order-header">
      <div class="section-divider" style="margin: 0 auto 20px;"></div>
      <span class="eyebrow" style="text-align:center; display:block;">Build Your Stack</span>
      <h2 class="section-headline">Your Brain Does The Work.<br>Let The Stack Hold The Window.</h2>
      <p class="body-copy" style="margin-top:16px;">Try Mindor for 30 days. If it doesn't change what your work sessions feel like, we'll refund you in full.</p>
    </div>

    <!-- Bundle widget HTML (cloned for hero + order section via JS in Step 3) -->
    <div id="bundle-widget-order" class="bundle-widget">
      <!-- Injected by JS -->
    </div>
  </div>
</section>

<!-- sections go here -->
```

- [ ] **Step 3: Add bundle widget JS + all interactive JS (replace `// JS goes here in Task 13` in `<script>`)**

```javascript
/* ── PRICING CONSTANTS ── */
const BASE = 44.99;
const BUNDLE_DISC = { 1: 0, 2: 0.10, 3: 0.15 };
const SUB_DISC = 0.15;
const TUBS_LABEL = { 1: '1 tub', 2: '2 tubs', 3: '3 tubs' };
const SERVINGS = { 1: 20, 2: 40, 3: 60 };

function calcTotal(qty, subscribe) {
  const afterBundle = BASE * qty * (1 - BUNDLE_DISC[qty]);
  return subscribe ? afterBundle * (1 - SUB_DISC) : afterBundle;
}

function fmt(n) { return '$' + n.toFixed(2); }

function buildWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <p class="bundle-widget-title">Select Your Supply</p>
    <p class="bundle-widget-sub">Subscribe & Save is pre-selected — cancel any time.</p>

    <span class="qty-label">Choose Quantity</span>
    <div class="qty-row">
      <div class="qty-card" data-qty="1">
        <p class="qty-card-servings">20</p>
        <p class="qty-card-tubs">Servings · 1 tub</p>
        <p class="qty-card-price" data-price-unit="1"></p>
        <p class="qty-card-price-orig" data-orig="1"></p>
      </div>
      <div class="qty-card" data-qty="2">
        <div class="qty-card-badge">Save 10%</div>
        <p class="qty-card-servings">40</p>
        <p class="qty-card-tubs">Servings · 2 tubs</p>
        <p class="qty-card-price" data-price-unit="2"></p>
        <p class="qty-card-price-orig" data-orig="2"></p>
      </div>
      <div class="qty-card selected" data-qty="3">
        <div class="qty-card-badge">Most Popular</div>
        <p class="qty-card-servings">60</p>
        <p class="qty-card-tubs">Servings · 3 tubs</p>
        <p class="qty-card-price" data-price-unit="3"></p>
        <p class="qty-card-price-orig" data-orig="3"></p>
      </div>
    </div>

    <span class="qty-label">Choose Flavor</span>
    <div class="flavor-row">
      <button class="flavor-btn selected" data-flavor="violet-frost">Violet Frost</button>
      <button class="flavor-btn" data-flavor="glacier-blue">Glacier Blue</button>
      <button class="flavor-btn" data-flavor="solar-orange">Solar Orange</button>
    </div>

    <label class="subscribe-row">
      <input type="checkbox" class="subscribe-checkbox" checked>
      <div>
        <p class="subscribe-label">Subscribe &amp; Save — 15% off every order</p>
        <p class="subscribe-sub">Cancel anytime · Ships every 30 days</p>
      </div>
    </label>

    <div class="order-summary">
      <div class="order-total-row">
        <span class="order-total-label">Total</span>
        <span class="order-total-price widget-total-price"></span>
      </div>
      <p class="order-total-per-unit widget-per-unit"></p>
      <span class="order-savings widget-savings"></span>
    </div>

    <button class="btn-primary widget-cta-btn" type="button">Start Your Stack</button>

    <div class="widget-trust-row">
      <span class="widget-trust-item">✓ Free Shipping</span>
      <span class="widget-trust-item">✓ 30-Day Guarantee</span>
      <span class="widget-trust-item">✓ Secure Checkout</span>
    </div>
  `;

  initWidget(container);
}

function initWidget(container) {
  let qty = 3;
  let subscribe = true;

  function updatePrices() {
    // Per-unit prices on each qty card
    [1, 2, 3].forEach(q => {
      const priceEl = container.querySelector(`[data-price-unit="${q}"]`);
      const origEl = container.querySelector(`[data-orig="${q}"]`);
      if (!priceEl) return;
      const unitPrice = calcTotal(q, subscribe) / q;
      priceEl.textContent = fmt(unitPrice) + '/tub';
      if (subscribe || BUNDLE_DISC[q] > 0) {
        origEl.textContent = fmt(BASE) + ' reg.';
      } else {
        origEl.textContent = '';
      }
    });

    // Order summary
    const total = calcTotal(qty, subscribe);
    const perUnit = total / qty;
    const baseTotal = BASE * qty;
    const saved = baseTotal - total;

    container.querySelector('.widget-total-price').textContent = fmt(total);
    container.querySelector('.widget-per-unit').textContent = fmt(perUnit) + ' per tub';
    container.querySelector('.widget-savings').textContent = saved > 0 ? 'You save ' + fmt(saved) : '';

    // CTA label
    const cta = container.querySelector('.widget-cta-btn');
    cta.textContent = subscribe ? 'Start Your Stack' : 'Buy Once';

    // Subscribe sub-label
    const subEl = container.querySelector('.subscribe-sub');
    if (subscribe) {
      subEl.textContent = 'Cancel anytime · Ships every 30 days';
    } else {
      subEl.textContent = 'One-time purchase · No commitment';
    }
  }

  // Qty cards
  container.querySelectorAll('.qty-card').forEach(card => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.qty-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      qty = parseInt(card.dataset.qty);
      updatePrices();
    });
  });

  // Flavor buttons
  container.querySelectorAll('.flavor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.flavor-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Subscribe checkbox
  container.querySelector('.subscribe-checkbox').addEventListener('change', function() {
    subscribe = this.checked;
    updatePrices();
  });

  updatePrices();
}

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── NAV SCROLL ── */
const nav = document.getElementById('site-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── INIT WIDGETS ── */
buildWidget('bundle-widget-hero');
buildWidget('bundle-widget-order');
```

- [ ] **Step 4: Screenshot and verify the bundle widget**

```bash
node 1v9ecom-main/screenshot.mjs http://localhost:3000/1v9ecom/mindor-cognitive-lander.html bundle
```

Read PNG. Expected: 3 quantity cards (60 servings selected), flavor pills, S&S checkbox checked, total price displayed, "Start Your Stack" button.

- [ ] **Step 5: Manually verify pricing math in browser console**

Open browser console at `http://localhost:3000/1v9ecom/mindor-cognitive-lander.html`. Run:

```javascript
// Expected: 97.51 (3 tubs, 15% bundle + 15% S&S)
console.assert(Math.abs(calcTotal(3, true) - 97.51) < 0.02, '3 tub S&S price wrong');

// Expected: 114.72 (3 tubs, 15% bundle, no S&S)
console.assert(Math.abs(calcTotal(3, false) - 114.72) < 0.02, '3 tub one-time price wrong');

// Expected: 80.98 (2 tubs, 10% bundle, no S&S)
console.assert(Math.abs(calcTotal(2, false) - 80.98) < 0.02, '2 tub one-time price wrong');

// Expected: 68.83 (2 tubs, 10% bundle + 15% S&S)
console.assert(Math.abs(calcTotal(2, true) - 68.83) < 0.02, '2 tub S&S price wrong');

// Expected: 38.24 (1 tub S&S)
console.assert(Math.abs(calcTotal(1, true) - 38.24) < 0.02, '1 tub S&S price wrong');

console.log('All pricing assertions passed');
```

Expected output: `All pricing assertions passed`

- [ ] **Step 6: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add bundle builder widget and order section with pricing JS"
```

---

## Task 14: Footer

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add footer CSS**

```css
/* ── FOOTER ── */
.site-footer {
  background: var(--deep-work-black);
  padding: 56px 0 32px;
  border-top: 0.5px solid rgba(74,107,212,0.20);
}

.footer-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 40px;
  padding-bottom: 40px;
  border-bottom: 0.5px solid rgba(255,255,255,0.08);
  flex-wrap: wrap;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.footer-wordmark {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 28px;
  color: var(--sprint-blue);
  letter-spacing: 0.04em;
}

.footer-tagline {
  font-size: 11px;
  color: rgba(255,255,255,0.30);
  letter-spacing: 0.12em;
  margin-top: 8px;
  text-transform: uppercase;
}

.footer-nav {
  display: flex;
  gap: 28px;
  list-style: none;
  flex-wrap: wrap;
}

.footer-nav a {
  font-size: 13px;
  color: rgba(255,255,255,0.45);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-nav a:hover { color: rgba(255,255,255,0.8); }

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 28px;
  flex-wrap: wrap;
}

.footer-copy {
  font-size: 11px;
  color: rgba(255,255,255,0.20);
  letter-spacing: 0.06em;
}

.footer-legal-links {
  display: flex;
  gap: 20px;
  list-style: none;
}

.footer-legal-links a {
  font-size: 11px;
  color: rgba(255,255,255,0.20);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-legal-links a:hover { color: rgba(255,255,255,0.5); }

.footer-dshea {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 0.5px solid rgba(255,255,255,0.06);
  font-size: 10px;
  color: rgba(255,255,255,0.18);
  line-height: 1.7;
  letter-spacing: 0.02em;
}
```

- [ ] **Step 2: Add footer HTML (replace `<!-- sections go here -->`)**

```html
<!-- ── FOOTER ── -->
<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div>
        <a href="#" class="footer-brand">
          <svg width="20" height="14" viewBox="0 0 40 28" fill="none" aria-hidden="true">
            <path d="M4 22 L10 8 L16 18 L20 10 L24 18 L30 8 L36 22" stroke="#4A6BD4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="footer-wordmark">MINDOR</span>
        </a>
        <p class="footer-tagline">Performance Stack · Est. 2026</p>
      </div>
      <nav>
        <ul class="footer-nav">
          <li><a href="#">About</a></li>
          <li><a href="#">Ingredients</a></li>
          <li><a href="#">Reviews</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>

    <div class="footer-bottom">
      <p class="footer-copy">© 2026 Mindor Performance Stack</p>
      <ul class="footer-legal-links">
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Service</a></li>
        <li><a href="#">Refund Policy</a></li>
      </ul>
    </div>

    <p class="footer-dshea">
      * These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Results may vary. Consult your healthcare provider before use if you are pregnant, nursing, taking medication, or have a medical condition. Contains caffeine — avoid use if sensitive to caffeine or in combination with other stimulant-containing products.
    </p>
  </div>
</footer>
```

- [ ] **Step 3: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add footer"
```

---

## Task 15: Mobile Responsiveness Pass

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html`

- [ ] **Step 1: Add all mobile media queries to `<style>` (before closing `</style>`)**

```css
/* ── MOBILE ── */
@media (max-width: 768px) {
  .section { padding: 64px 0; }
  .section--dark { padding: 64px 0; }
  .order-section { padding: 64px 0; }
  .ingredients-section { padding: 64px 0; }
  .mechanism-section { padding: 64px 0; }
  .comparison-section { padding: 64px 0; }
  .testimonials-section { padding: 64px 0; }
  .science-section { padding: 64px 0; }
  .guarantee-section { padding: 64px 0; }
  .faq-section { padding: 64px 0; }
  .problem-section { padding: 64px 0; }

  /* Hero */
  .hero { padding: 110px 0 60px; }
  .hero-img-wrap { max-width: 300px; }

  /* Trust bar */
  .trust-bar-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
  .trust-bar-logos { gap: 12px; }

  /* Problem */
  .problem-grid { grid-template-columns: 1fr; }
  .problem-card { padding: 24px 20px; }

  /* Ingredients */
  .ingredients-grid { grid-template-columns: 1fr 1fr; }
  .ingredient-card:nth-child(5) { grid-column: 1 / -1; }

  /* Mechanism */
  .mechanism-steps { grid-template-columns: 1fr; gap: 32px; }
  .mechanism-steps::before { display: none; }

  /* Comparison */
  .comparison-table { font-size: 11px; }
  .comparison-table th,
  .comparison-table td { padding: 10px 8px; }

  /* Testimonials */
  .testimonials-grid { grid-template-columns: 1fr; }

  /* Science */
  .science-stats { grid-template-columns: 1fr; gap: 16px; }

  /* Guarantee */
  .guarantee-inner { flex-direction: column; align-items: center; text-align: center; padding: 32px 24px; }
  .guarantee-body { max-width: 100%; }

  /* Bundle widget */
  .bundle-widget { padding: 24px 20px; }
  .qty-row { grid-template-columns: 1fr; gap: 10px; }
  .qty-card-badge { top: auto; bottom: -8px; }

  /* Order section header */
  .order-header .section-headline { font-size: 32px; }

  /* Footer */
  .footer-top { flex-direction: column; gap: 24px; }
  .footer-bottom { flex-direction: column; gap: 12px; align-items: flex-start; }
}

@media (max-width: 480px) {
  .ingredients-grid { grid-template-columns: 1fr; }
  .flavor-row { gap: 6px; }
  .hero-trust-row { gap: 12px; }
  .hero-trust-item { font-size: 11px; }
  .comparison-table th:nth-child(4),
  .comparison-table td:nth-child(4) { display: none; } /* hide Pre-Workout on very small screens */
}
```

- [ ] **Step 2: Screenshot mobile viewport**

```bash
node 1v9ecom-main/screenshot.mjs http://localhost:3000/1v9ecom/mindor-cognitive-lander.html mobile
```

Read PNG. Expected: Single-column layout, stacked sections, nav visible, no horizontal overflow.

If any section is broken on mobile, fix the CSS before proceeding.

- [ ] **Step 3: Take a full desktop screenshot**

```bash
node 1v9ecom-main/screenshot.mjs http://localhost:3000/1v9ecom/mindor-cognitive-lander.html desktop-final
```

Read PNG. Verify every section renders correctly.

- [ ] **Step 4: Commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: add mobile responsiveness"
```

---

## Task 16: Final Visual QA Pass

**Files:**
- Modify: `1v9ecom/mindor-cognitive-lander.html` (fixes only)

- [ ] **Step 1: Screenshot top of page**

```bash
node 1v9ecom-main/screenshot.mjs http://localhost:3000/1v9ecom/mindor-cognitive-lander.html qa-top
```

Read PNG. Check: nav renders correctly, hero headline is large Barlow Condensed, product placeholder is visible, stars and trust badges present.

- [ ] **Step 2: Screenshot mid-page sections**

Temporarily add `#ingredients` anchor to URL and screenshot, then `#mechanism`, then `#order`.

```bash
node 1v9ecom-main/screenshot.mjs "http://localhost:3000/1v9ecom/mindor-cognitive-lander.html#ingredients" qa-ingredients
node 1v9ecom-main/screenshot.mjs "http://localhost:3000/1v9ecom/mindor-cognitive-lander.html#order" qa-order
```

Read each PNG. Fix any visual issues found.

- [ ] **Step 3: Verify copy voice — self-check**

Scan all copy in the file against voice-rules checklist:
- [ ] No "Not X. Not Y. Just Z." patterns
- [ ] No em-dash overuse (max 1 per paragraph)
- [ ] No synonym stacks of 3+
- [ ] No "Imagine this" / "Picture this"
- [ ] No "Here's the thing" section openers
- [ ] No exclamation marks in body copy
- [ ] Sentences vary in length within each paragraph
- [ ] No "landscape," "game-changer," "revolutionize," "supercharge"

Fix any violations found.

- [ ] **Step 4: Verify brand compliance**
- [ ] All color values use CSS tokens (no hardcoded hex except inside token definitions)
- [ ] Shadows are color-tinted with `rgba(74,107,212,x)` — no flat `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`
- [ ] Only `transform` and `opacity` in transitions — no `transition-all` or `transition: color`
- [ ] No `position: sticky` on content in unequal grids
- [ ] Fonts: Barlow Condensed for all display/headlines, DM Sans for all body/labels

- [ ] **Step 5: Final commit**

```bash
git -C 1v9ecom-main/1v9ecom add mindor-cognitive-lander.html
git -C 1v9ecom-main/1v9ecom commit -m "feat: final QA pass — mindor cognitive lander complete"
```

---

## Build Flags (confirm before launch)

Add these as HTML comments at top of `<body>` before publishing:

```html
<!--
  MINDOR COGNITIVE LANDER — BUILD FLAGS
  ======================================
  [CONFIRM PRICING] Base price $44.99/tub is a placeholder — confirm before launch.
  [CONFIRM DOSE] Panax Ginseng and B6+B12 doses need confirmation from formulation sheet.
  [CONFIRM CTA] CTA buttons are placeholder <button> — wire to Stripe checkout URL before launch.
  [CONFIRM IMAGES] All image placeholders need real product assets.
  [CONFIRM LOGOS] Trust bar publication logos need real assets.
  [CONFIRM AVATAR IMAGES] Testimonial avatar placeholders need real images.
  [CONFIRM TESTING BADGE] Science section testing placeholder needs real certification badge.
  [CONFIRM ROUTE] Add to vercel.json when ready to deploy.
-->
```
