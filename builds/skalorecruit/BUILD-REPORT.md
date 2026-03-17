# SkaloRecruit — Build Report

**Build Date:** 2026-03-17
**Status:** COMPLETE — Production build successful

---

## Summary

Full 3-page website for SkaloRecruit, a premium London-based executive recruitment agency specialising in finance and technology. Built with React 18 + Vite 7 + TypeScript (strict) + Tailwind CSS v4.

---

## Pages Built

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Full-page hero, stats bar, service cards, features grid, testimonials, CTA block |
| For Employers / Services | `/services` | Service offerings, process steps, sector expertise, FAQ accordion, CTA |
| Contact | `/contact` | Contact form (react-hook-form + zod), contact details, LinkedIn link |
| 404 Not Found | `*` | Custom 404 with back navigation |

---

## Component Architecture

### UI Components (`src/components/ui/`)
- `Button` — 5 variants (primary, secondary, outline, ghost, accent), 3 sizes, loading state
- `Badge` — 5 variants
- `Card` — 4 variants including interactive hover state
- `SectionWrapper` — Configurable background, padding, and max-width
- `Input` — Accessible label, error, hint, aria-invalid
- `Textarea` — Accessible with resize-none

### Layout Components (`src/components/layout/`)
- `Navigation` — Transparent/scrolled state, active link detection, mobile menu with backdrop
- `Footer` — 4-column responsive grid, social links, contact info
- `Layout` — Outlet wrapper with optional transparent nav

### Section Components (`src/components/sections/`)
- `Hero` — Full-screen gradient hero with animated eyebrow, heading, subheading, CTAs, scroll indicator
- `StatsBar` — Animated count-up stats on intersection
- `FeaturesGrid` — 2/3/4 column responsive grid with scroll animations
- `ServiceCards` — Cards with accent variant for featured service
- `Testimonials` — 3-column testimonial cards with staggered animation
- `CTABlock` — Full-width CTA with gradient backgrounds
- `FAQAccordion` — Accessible accordion with CSS grid animation (no height JS)
- `ContactForm` — react-hook-form + zod validation, success/error states

### SEO Components (`src/components/seo/`)
- `SEOHead` — Helmet-async wrapper for title, meta, OG, Twitter, canonical, JSON-LD
- Schema builders: Organization, WebSite, WebPage, Service, FAQ

---

## SEO Implementation

| Item | Value |
|------|-------|
| Homepage title | "Executive Recruitment Agency London | SkaloRecruit" (52 chars) |
| Homepage meta | 152 chars |
| Services title | "Recruitment Services for Employers | SkaloRecruit" (50 chars) |
| Contact title | "Contact SkaloRecruit | Talk to Our Team Today" (46 chars) |
| Canonical URLs | Set per page |
| JSON-LD schemas | Organization, WebSite, WebPage, Service, FAQPage |
| robots.txt | AI crawlers explicitly allowed (GPTBot, Claude-Web, PerplexityBot) |
| sitemap.xml | 3 URLs with priority and changefreq |
| llms.txt | GEO-ready AI visibility file |
| Skip link | "Skip to content" focus skip for accessibility |

---

## Tech Stack

- React 19 + Vite 7 + TypeScript 5.9 (strict mode)
- Tailwind CSS v4 (CSS @theme directive)
- react-router-dom v7 (code-split lazy loading)
- react-helmet-async (SEO head management)
- react-hook-form + zod + @hookform/resolvers (contact form)
- lucide-react (icons)
- clsx + tailwind-merge (className utilities)

---

## Build Output

| Chunk | Size | Gzipped |
|-------|------|---------|
| vendor (react, react-dom, react-router-dom) | 47.04 kB | 16.64 kB |
| Contact (form libs) | 93.24 kB | 28.18 kB |
| index (shared) | 223.07 kB | 70.33 kB |
| CSS | 39.65 kB | 7.34 kB |

---

## Brand Tokens

- Primary: #0D2137 (deep navy)
- Secondary: #1B63EA (vibrant blue)
- Accent: #FF6B35 (orange)
- Fonts: Sora (headings) + Inter (body) via Google Fonts
- Full Tailwind v4 `@theme` token scale (primary/secondary/accent 50–950)

---

## Known TODOs

- [ ] Replace placeholder testimonials with real client quotes
- [ ] Add Formspree (or backend) endpoint to ContactForm — currently logs to console
- [ ] Create favicon.ico, favicon-192.png, favicon-512.png in /public
- [ ] Create og-default.jpg (1200×630) in /public for Open Graph previews
- [ ] Deploy with `scripts/deploy.sh` and run Lighthouse audit
- [ ] Pages not yet built: `/candidates`, `/industries`, `/about`, `/jobs`, `/blog`, `/privacy-policy`, `/terms`

---

## Deployment

```bash
scripts/deploy.sh --server [IP] --domain skalorecruit.com --build-dir builds/skalorecruit/dist --ssl
scripts/lighthouse-check.sh https://skalorecruit.com
```
