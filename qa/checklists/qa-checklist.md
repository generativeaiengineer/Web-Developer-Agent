# WD-01 QA Checklist
**Project:** [Project Name]
**Build Date:** [YYYY-MM-DD]
**Reviewed By:** WD-01
**Live URL:** [URL]

Complete all 25 points before delivery. Mark each ✅ PASS or ❌ FAIL with notes.

---

## PERFORMANCE (5 points)

- [ ] **P1 — Lighthouse Performance ≥ 90**
  - Score: ___
  - Run: `./scripts/lighthouse-check.sh <url>`

- [ ] **P2 — Lighthouse SEO ≥ 95**
  - Score: ___

- [ ] **P3 — Lighthouse Accessibility ≥ 90**
  - Score: ___

- [ ] **P4 — Lighthouse Best Practices ≥ 90**
  - Score: ___

- [ ] **P5 — Core Web Vitals within thresholds**
  - LCP: ___ (must be < 2.5s)
  - CLS: ___ (must be < 0.1)
  - INP: ___ (must be < 200ms)

---

## SEO (8 points)

- [ ] **S1 — Every page has a unique title tag (50–60 chars)**
  - Verify in browser DevTools or via `<title>` in page source
  - Check all pages — no duplicates

- [ ] **S2 — Every page has a meta description (150–160 chars)**
  - Verify via `<meta name="description">` in page source
  - Check all pages — no duplicates

- [ ] **S3 — Every page has exactly one H1 containing the primary keyword**
  - Use DevTools or axe to confirm single H1 per page
  - Confirm keyword presence in H1 text

- [ ] **S4 — Schema markup present on all pages**
  - Minimum: `Organization` + `WebPage` on all pages
  - Validate with Google Rich Results Test
  - Additional schemas per page type (Service, FAQPage, etc.)

- [ ] **S5 — XML sitemap exists and is valid**
  - Accessible at `/sitemap.xml`
  - All pages included
  - No broken URLs in sitemap
  - Validate at: https://www.xml-sitemaps.com/validate-xml-sitemap.html

- [ ] **S6 — robots.txt exists and is correct**
  - Accessible at `/robots.txt`
  - Sitemap URL referenced
  - No important pages blocked

- [ ] **S7 — All images have descriptive alt text**
  - No empty `alt=""` on informational images (decorative images OK with empty alt)
  - Alt text describes image content, includes keyword where natural

- [ ] **S8 — Canonical URLs set on all pages**
  - `<link rel="canonical" href="...">` present in `<head>` of every page
  - Self-referencing canonicals are correct

---

## DESIGN & UX (6 points)

- [ ] **D1 — Responsive at all three breakpoints**
  - Mobile 375px: layout intact, text readable, no overflow
  - Tablet 768px: layout transitions correctly
  - Desktop 1280px+: full layout displays as designed
  - Test in Chrome DevTools Device Mode

- [ ] **D2 — No horizontal scrolling on any device**
  - Test at 375px, 768px, 1024px, 1280px
  - Check with `document.documentElement.scrollWidth > window.innerWidth` in console

- [ ] **D3 — All interactive elements have hover and focus states**
  - Buttons, links, inputs — all have visible `:hover` styles
  - All focusable elements have visible `:focus` / `:focus-visible` outlines
  - Tab through entire page to verify

- [ ] **D4 — Loading states implemented where needed**
  - Async content shows skeleton or spinner
  - Form submission shows loading feedback
  - No blank flashes during navigation

- [ ] **D5 — Consistent spacing and typography throughout**
  - No rogue margin/padding deviating from design system
  - Font sizes, weights, and line heights match blueprint tokens
  - Visual rhythm is consistent section to section

- [ ] **D6 — No broken images or placeholder content**
  - All images load correctly
  - No `[placeholder]`, `Lorem ipsum`, or `TODO` text in production
  - No broken image icons (alt text visible in place of missing src)

---

## TECHNICAL (4 points)

- [ ] **T1 — TypeScript passes with no errors**
  - Run: `cd site-builder && npx tsc --noEmit`
  - Zero errors — warnings acceptable if intentional

- [ ] **T2 — No console errors in browser**
  - Open DevTools console on every page
  - Zero errors (red) allowed — warnings (yellow) reviewed and accepted
  - Test in Chrome and Safari

- [ ] **T3 — All links work (zero 404s)**
  - Click through all navigation links
  - Check footer links, CTAs, and internal links
  - Run a link checker: `npx broken-link-checker <url> --recursive`

- [ ] **T4 — Production build succeeds with no warnings**
  - Run: `cd site-builder && npm run build`
  - Exit code 0
  - No Vite build warnings about chunk size, missing modules, etc.

---

## DEPLOYMENT (2 points)

- [ ] **DEP1 — HTTPS/SSL configured and working**
  - Site loads on `https://` without browser security warning
  - HTTP redirects to HTTPS (301)
  - SSL certificate is valid and not expiring within 30 days

- [ ] **DEP2 — Site loads correctly on the live domain**
  - Visit live URL — no 502/503/404 on homepage
  - All assets load (no mixed content warnings)
  - Test from a private/incognito window with no cache

---

## SIGN-OFF

| Section | Points Passed | Points Failed |
|---------|--------------|--------------|
| Performance | /5 | |
| SEO | /8 | |
| Design & UX | /6 | |
| Technical | /4 | |
| Deployment | /2 | |
| **Total** | **/25** | |

**Failed items (must resolve before delivery):**
- [ ] [item] — [description of issue]

**Deferred items (accepted with client sign-off):**
- [ ] [item] — [reason for deferral]

**QA Status:** ⬜ IN PROGRESS / ✅ PASSED / ❌ BLOCKED

**Sign-off:** WD-01 | [Date]
