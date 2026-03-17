# WD-01 ARCHITECT MODE — Complete Skill Instructions
**Skill:** architect-mode
**Triggered by:** `MODE: ARCHITECT [blueprint-path]` OR user approves a blueprint from RESEARCHER mode
**Input:** Approved blueprint file
**Output:** Completed architecture saved to `architectures/[client-name]-architecture.md`

---

## ACTIVATION

When the user triggers ARCHITECT mode, immediately:

1. Identify the blueprint path from the trigger:
   - From direct trigger: `MODE: ARCHITECT blueprints/client-name-blueprint.md`
   - From Researcher approval: use the blueprint path from the previous mode session

2. Read the blueprint file in full before doing anything else.

3. Confirm activation:
```
MODE: ARCHITECT — Active
Reading blueprint for [Client Name]...

Blueprint loaded:
- Visual Style: [extracted from blueprint]
- Primary Color: [hex]
- Heading Font: [font]
- Components identified: [N]
- Target Keywords: [N]

Starting Architecture phase. This will produce:
- Complete sitemap with URL slugs
- Component specifications for every UI block
- Per-page SEO plan (title, description, H1, schema)
- Full technical implementation plan
- Performance strategy

Working...
```

---

## PHASE 1: SITEMAP DESIGN

### 1.1 — Page Determination Logic

Read the blueprint's Component List and Target Keywords tables. Use this logic to determine which pages are needed:

**Rule 1 — One page per primary keyword cluster.**
Group the blueprint's target keywords by topic. Each distinct topic cluster becomes a page or major section. Keywords with high commercial intent (transactional) get dedicated pages. Keywords with informational intent get blog posts or resource pages.

**Rule 2 — One page per distinct service or product.**
If the blueprint lists multiple services, each gets its own page (not just sections on one page). This enables individual ranking and targeted SEO.

**Rule 3 — Every business site needs these minimum pages:**

| Page | URL | Priority | Notes |
|------|-----|----------|-------|
| Homepage | `/` | P0 | Primary brand + top keyword |
| About | `/about` | P0 | E-E-A-T trust builder |
| Contact | `/contact` | P0 | Conversion page |
| Privacy Policy | `/privacy-policy` | P1 | Legal requirement |
| Terms of Service | `/terms` | P1 | Legal requirement |
| 404 Error | `/404` | P1 | User retention |

**Rule 4 — Niche-specific pages.**

For **recruitment / staffing agencies**, add:
- `/services` (parent) + `/services/[each-service]` (sub-pages)
- `/industries` (parent) + `/industries/[each-industry]`
- `/for-employers` — employer-facing landing page
- `/for-candidates` — candidate-facing landing page
- `/jobs` — job listings index
- `/case-studies` (parent) + `/case-studies/[slug]` (individual)
- `/resources` or `/blog` (parent) + `/resources/[slug]` (articles)
- `/team` — for E-E-A-T

For **SaaS / software products**, add:
- `/features` (parent) + `/features/[feature-slug]`
- `/pricing`
- `/integrations`
- `/docs` or `/help`
- `/changelog`
- `/customers` or `/case-studies`
- `/blog`

For **local service businesses**, add:
- `/services/[service-slug]` (one per service)
- `/[city]` or `/areas-served` (local SEO pages)
- `/reviews` or `/testimonials`
- `/gallery` or `/portfolio`
- `/faq`

For **e-commerce / product sites**, add:
- `/products` (catalog)
- `/products/[category]/[slug]`
- `/cart` and `/checkout`
- `/account`
- `/shipping-returns`

For **portfolio / agency sites**, add:
- `/work` (portfolio index)
- `/work/[project-slug]` (case studies)
- `/services/[service-slug]`
- `/process`

**Rule 5 — Blog/Resources requires at minimum 3 article stubs.**
Never plan a blog with 0 articles. Architecture must include at least 3 initial post stubs based on the informational keywords from the blueprint.

### 1.2 — Page Hierarchy Documentation

Document every page in this format:

```
Homepage (/)
├── About (/about)
├── Services (/services)
│   ├── [Service 1] (/services/[slug])
│   ├── [Service 2] (/services/[slug])
│   └── [Service 3] (/services/[slug])
├── [Niche pages as determined above]
├── Blog (/blog)
│   ├── [Article 1] (/blog/[slug])
│   ├── [Article 2] (/blog/[slug])
│   └── [Article 3] (/blog/[slug])
├── Contact (/contact)
├── Privacy Policy (/privacy-policy)
└── Terms (/terms)
```

### 1.3 — URL Slug Rules

Apply these rules to all slugs:
- Lowercase only: `/executive-search` not `/Executive-Search`
- Hyphens as separators: `/talent-acquisition` not `/talent_acquisition`
- Keyword-rich: `/staffing-solutions-london` not `/service-1`
- No unnecessary words: `/about` not `/about-us-page`
- Maximum 4 words in a slug: `/permanent-recruitment-services` (good) vs `/our-comprehensive-permanent-recruitment-solutions-page` (bad)
- Consistent depth: services max 2 levels deep, blog posts max 2 levels deep

---

## PHASE 2: NAVIGATION ARCHITECTURE

### 2.1 — Primary Navigation

**Rules:**
- Maximum 7 nav items (cognitive load limit)
- Item labels should be 1-2 words (never more than 3)
- Order by user journey priority: most important / highest traffic first
- The final item before the CTA button is always Contact or equivalent
- Include one CTA button (not just a link) — style it with the primary color

**Dropdown menus:**
- Only use dropdowns for pages with 3+ sub-pages
- Maximum 8 items in a dropdown
- Dropdowns must work on keyboard navigation (Tab, Enter, Escape)
- On mobile, dropdowns become expandable accordion items

**Standard primary nav structure:**
```
[Logo] | Home | [Main Section] | [Main Section] | [Main Section] | About | Contact | [CTA Button]
```

Remove "Home" from nav if the logo links home (it always should). Replace with a high-value page.

### 2.2 — Mobile Navigation

**Implementation requirements:**
- Hamburger icon (3 lines) on the right side of the mobile header
- Menu slides in from the left OR slides down from the top (never a full-page takeover unless the blueprint specifically calls for it)
- Touch targets minimum 44×44px (WCAG 2.1 requirement)
- Backdrop overlay behind open menu (semi-transparent, closes menu on tap)
- Close button (×) clearly visible
- Active page highlighted in the menu
- CTA button visible at the bottom of the mobile menu
- Menu closes on navigation (clicking a link)

**Mobile nav item order:**
Same as desktop primary nav, but sub-pages are revealed with an expand arrow (+/−).

### 2.3 — Footer Navigation

Organize into columns based on the site's page count:

**3-column footer (small sites, <15 pages):**
- Column 1: Services (list all service pages)
- Column 2: Company (About, Team, Case Studies, Careers)
- Column 3: Contact (address, phone, email, social icons)

**4-column footer (medium sites, 15-30 pages):**
- Column 1: Services
- Column 2: Company
- Column 3: Resources (Blog, Guides, FAQ)
- Column 4: Contact + Social

**5-column footer (large sites, 30+ pages):**
- Column 1: Services (primary)
- Column 2: Services (secondary / industries)
- Column 3: Company
- Column 4: Resources
- Column 5: Contact + Social + Newsletter signup

**Footer must also include:**
- Logo (top-left of footer)
- One-line brand description under logo
- Copyright line at the very bottom: `© [Year] [Company Name]. All rights reserved.`
- Privacy Policy and Terms links in the copyright bar

### 2.4 — Breadcrumb Structure

Implement breadcrumbs on all pages except Homepage.

Format: `Home > [Section] > [Current Page]`

Breadcrumbs must:
- Be implemented as `BreadcrumbList` schema markup (JSON-LD)
- Be visually present on the page (not just in schema)
- Link all items except the current page
- Use `aria-label="breadcrumb"` and `aria-current="page"` on the last item

---

## PHASE 3: COMPONENT SPECIFICATIONS

### 3.1 — Universal Components (every site)

Document each of these with full specs:

---

#### SEOHead
- **Type:** Utility component (renders into `<head>` via React Helmet or react-router meta)
- **Used on:** Every page
- **Props:**
  ```typescript
  interface SEOHeadProps {
    title: string;           // 50-60 chars
    description: string;     // 150-160 chars
    canonical: string;       // Full URL
    ogImage?: string;        // Absolute URL, 1200x630px
    ogType?: string;         // Default: "website"
    noindex?: boolean;       // Default: false
    schema?: object | object[]; // JSON-LD structured data
  }
  ```
- **Renders:** `<title>`, `<meta description>`, `<link canonical>`, all OG tags, Twitter Card tags, JSON-LD `<script>` tags
- **Accessibility:** N/A (head component)
- **Notes:** Schema prop accepts a single schema object or array of schema objects for pages with multiple schema types

---

#### Navigation
- **Type:** Layout component
- **Used on:** Every page (via Layout wrapper)
- **Props:**
  ```typescript
  interface NavigationProps {
    transparent?: boolean; // True = transparent on homepage hero, becomes solid on scroll
  }
  ```
- **Desktop behavior:**
  - Fixed/sticky to top
  - Logo left, nav links center-right, CTA button far right
  - If `transparent=true`: starts transparent with white text, transitions to white background + dark text on scroll (threshold: 80px)
  - Dropdowns on hover with 200ms delay (prevents accidental opens)
  - Underline animation on active/hover links
- **Mobile behavior (< 768px):**
  - Logo left, hamburger right
  - Hamburger toggles slide-down or slide-in menu
  - Menu backdrop closes on click
  - CTA button full-width at bottom of menu
- **Animation:** Backdrop blur effect on scroll (`backdrop-blur-md bg-white/90`)
- **Accessibility:**
  - `role="navigation"` and `aria-label="Main navigation"`
  - Hamburger button: `aria-expanded`, `aria-controls`, `aria-label="Open menu"`
  - Dropdown: `aria-haspopup="true"`, keyboard navigable with Tab/Enter/Escape
  - Skip-to-content link as first focusable element

---

#### Footer
- **Type:** Layout component
- **Used on:** Every page (via Layout wrapper)
- **Responsive behavior:**
  - Desktop: multi-column grid as specified in Phase 2.3
  - Tablet: 2-column grid
  - Mobile: single column, stacked
- **Accessibility:**
  - `role="contentinfo"`
  - Social icon links: `aria-label="[Platform] (opens in new tab)"` + `target="_blank" rel="noopener noreferrer"`

---

#### Layout
- **Type:** Wrapper component
- **Props:**
  ```typescript
  interface LayoutProps {
    children: React.ReactNode;
    transparentNav?: boolean;
  }
  ```
- **Structure:** `<Navigation>` + `<main>{children}</main>` + `<Footer>`
- **Notes:** Every page component is wrapped in this

---

#### SectionWrapper
- **Type:** Layout primitive
- **Props:**
  ```typescript
  interface SectionWrapperProps {
    children: React.ReactNode;
    id?: string;
    className?: string;
    background?: 'white' | 'surface' | 'primary' | 'dark' | 'gradient';
    paddingY?: 'sm' | 'md' | 'lg' | 'xl'; // Default: 'lg'
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; // Default: 'xl'
  }
  ```
- **Responsive padding:**
  - `sm`: py-8 md:py-12
  - `md`: py-12 md:py-16
  - `lg`: py-16 md:py-24 (default)
  - `xl`: py-24 md:py-32
- **Max widths:** sm=640px, md=768px, lg=1024px, xl=1280px, full=100%

---

#### Button
- **Type:** UI primitive
- **Variants:** `primary`, `secondary`, `outline`, `ghost`, `destructive`
- **Sizes:** `sm`, `md` (default), `lg`
- **States:** default, hover, active, focus, disabled, loading
- **Props:**
  ```typescript
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    href?: string; // renders as <a> if provided
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
  }
  ```
- **Hover states:** `primary` lifts with shadow + 10% darker bg; `outline` fills with primary color
- **Loading state:** Spinner replaces left icon or prepends to text
- **Focus state:** 2px offset ring in primary color
- **Disabled state:** 50% opacity, `cursor-not-allowed`
- **Accessibility:** `aria-disabled`, `aria-busy` when loading; if `href` provided, renders as `<a>` with correct semantics

---

#### Card
- **Type:** UI component
- **Variants:** `default`, `bordered`, `flat`, `interactive` (hover lift)
- **Props:**
  ```typescript
  interface CardProps {
    variant?: 'default' | 'bordered' | 'flat' | 'interactive';
    image?: { src: string; alt: string; };
    eyebrow?: string;   // Small label above title
    title: string;
    description?: string;
    cta?: { text: string; href: string; };
    children?: React.ReactNode;
  }
  ```
- **`interactive` variant hover:** `translate-y-[-4px]` + enhanced shadow, `transition-all duration-300`
- **Image:** 16:9 or 4:3 aspect ratio, `object-cover`, lazy loaded

---

### 3.2 — Page-Specific Section Components

For EVERY section listed in the blueprint's Component List, write a spec following this format:

---

#### [ComponentName]
- **Type:** [Hero Section / Feature Grid / Testimonial Section / CTA Block / etc.]
- **Used on:** [list of pages]
- **Props:**
  ```typescript
  interface [ComponentName]Props {
    // List every content field as a typed prop
    // Strings for text, objects for images, arrays for lists
  }
  ```
- **Layout — Desktop (1280px):** [describe the layout — grid columns, positioning, sizing]
- **Layout — Tablet (768px):** [describe changes from desktop]
- **Layout — Mobile (375px):** [describe changes from tablet]
- **Animation:**
  - Entrance: [e.g., `fade-up` on scroll — opacity 0→1, translateY 24px→0, duration 600ms, staggered if multiple items]
  - Hover: [describe hover interactions]
- **Content requirements:** [list every piece of content that needs to be written/provided]
- **Accessibility:** [ARIA roles, keyboard behavior, screen reader considerations]

---

**Reference specs for common section types:**

**Hero Section:**
- Desktop: Full-width, min-height 100vh (or 80vh for inner pages), content centered or split 50/50
- Tablet: Content stacks if split layout, reduce font sizes 20%
- Mobile: Full-width, min-height 100svh, text left-aligned, image below or as background
- Animation: Heading fades in (600ms), subheading fades in (800ms, 150ms delay), CTAs fade in (1000ms, 300ms delay)
- Accessibility: Ensure sufficient contrast on text over images (4.5:1 minimum), `role="banner"` on hero `<section>`

**Feature Grid:**
- Desktop: 3-column grid (or 4-column for 8+ features)
- Tablet: 2-column grid
- Mobile: 1-column stack
- Animation: Each card fades up with 100ms stagger between cards
- Accessibility: Icon containers get `aria-hidden="true"`, surrounding text provides meaning

**Testimonial Section:**
- Desktop: 3-column card grid OR centered carousel with prev/next
- Tablet: 2-column or single carousel
- Mobile: Single card, swipeable (touch events)
- Carousel accessibility: `role="region"`, `aria-roledescription="carousel"`, prev/next buttons with `aria-label`

**Stats/Counter Section:**
- Numbers animate on scroll entry: count up from 0 to final value over 2000ms
- Use `IntersectionObserver` to trigger
- Accessibility: `aria-live="polite"` during animation, or provide static value as `aria-label` and animate visually only

**FAQ Accordion:**
- Each item is a `<details>`/`<summary>` pair OR custom with `aria-expanded`, `aria-controls`
- Keyboard: Enter/Space toggles, arrows navigate between items
- Animation: Content height animates open/close (use CSS `grid-template-rows: 0fr → 1fr` technique for smooth animation)

**Pricing Table:**
- Highlight the recommended tier (border, badge, slightly larger)
- Include annual/monthly toggle if needed: state in parent, passed as prop
- Mobile: Cards stack vertically, all features visible (no feature hiding)
- Accessibility: Use `<table>` for comparison layouts, not divs

---

## PHASE 4: SEO IMPLEMENTATION PLAN

### 4.1 — Per-Page SEO Specifications

For EVERY page in the sitemap, define:

**Title Tag Rules:**
- Formula from blueprint — apply it exactly
- Must contain primary keyword
- Brand name at the end, separated by ` | ` or ` — `
- 50-60 characters (count carefully, include spaces)
- Homepage gets the most brand-forward title
- Service pages lead with the service keyword

**Meta Description Rules:**
- 150-160 characters (count carefully)
- Must include primary keyword naturally
- Include a soft CTA ("Learn more", "Contact us today", "Get started")
- Unique per page — never duplicate
- Describe what the visitor will find on the page

**H1 Rules:**
- Exactly one per page
- Contains primary keyword (ideally near the start)
- Different from the title tag (can overlap but should not be identical)
- Reads naturally — not keyword-stuffed
- Under 60 characters where possible

**Schema Rules:**
- Every page gets `WebPage` schema minimum
- Homepage gets `Organization` + `WebSite` (with `SearchAction`)
- Service pages get `Service` schema
- Blog posts get `Article` + `BreadcrumbList`
- Contact page gets `ContactPage` + `LocalBusiness` (if applicable)
- FAQ content gets `FAQPage` schema if there's a visible FAQ section
- If testimonials include ratings, use `AggregateRating`

Present the per-page SEO plan as a table:

| Page | URL | Title Tag (chars) | Meta Description (chars) | H1 | Primary Schema |
|------|-----|-------------------|--------------------------|-----|---------------|
| Homepage | / | [title] (XX) | [desc] (XXX) | [h1] | Organization, WebSite |
| ... | | | | | |

Then document full JSON-LD templates for each schema type used.

### 4.2 — Site-Wide SEO Configuration

**XML Sitemap (`/sitemap.xml`):**
List all public pages to include. Exclude:
- `/privacy-policy` and `/terms` (low value, include only if desired)
- `/404`
- `/admin` or any private routes
- Paginated pages beyond page 1 (use `rel="canonical"` pagination instead)

Set `<changefreq>` and `<priority>` per page type:
- Homepage: `weekly`, `1.0`
- Service pages: `monthly`, `0.8`
- Blog posts: `monthly`, `0.7`
- About/Contact: `yearly`, `0.5`

**robots.txt:**
```
User-agent: *
Allow: /

# Block admin/private paths if they exist
Disallow: /admin/
Disallow: /api/

# AI crawlers — allow for GEO visibility
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://[domain]/sitemap.xml
```

**llms.txt (`/llms.txt`):**
Format for AI search engines (Perplexity, ChatGPT, Claude):
```
# [Company Name]

> [One-sentence description of what the company does and who it serves]

[Company Name] is [expanded description — 2-3 sentences covering: what they do,
who they serve, what makes them different, where they operate]

## Services
- [Service 1]: [one-line description]
- [Service 2]: [one-line description]

## Key Information
- Founded: [year if known]
- Location: [city/region]
- Contact: [email or contact page URL]

## Pages
- [Homepage](https://[domain]/)
- [About](https://[domain]/about)
- [Services](https://[domain]/services)
- [Contact](https://[domain]/contact)
```

**Open Graph defaults:**
- `og:site_name`: Company name
- `og:type`: `website` (pages), `article` (blog posts)
- `og:image`: Default OG image at 1200×630px (create this as a design asset)
- `og:image:width`: `1200`
- `og:image:height`: `630`
- `og:locale`: `en_GB` or `en_US` based on client location

**Canonical URL strategy:**
- Every page self-references its canonical
- Trailing slash consistency: pick one (`/about` OR `/about/`) and stick to it — use no trailing slash
- WWW vs non-WWW: configured at the Nginx level (redirect www → non-www or vice versa), canonical reflects the chosen version

### 4.3 — Keyword → Page Mapping Table

| Primary Keyword | Monthly Volume | Intent | Target Page | Supporting Keywords |
|----------------|---------------|--------|-------------|-------------------|
| [from blueprint] | [from blueprint] | [classified] | [URL] | [2-3 related] |

---

## PHASE 5: TECHNICAL IMPLEMENTATION PLAN

### 5.1 — File/Folder Structure

Define the complete `src/` structure:

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   └── index.ts          ← barrel export
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── SectionWrapper.tsx
│   │   └── index.ts
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Stats.tsx
│   │   ├── CTA.tsx
│   │   ├── FAQ.tsx
│   │   ├── [all other sections from blueprint]
│   │   └── index.ts
│   └── seo/
│       ├── SEOHead.tsx
│       ├── schemas/
│       │   ├── OrganizationSchema.ts
│       │   ├── WebPageSchema.ts
│       │   ├── ServiceSchema.ts
│       │   ├── ArticleSchema.ts
│       │   ├── FAQSchema.ts
│       │   └── BreadcrumbSchema.ts
│       └── index.ts
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── [ServiceName].tsx     ← one per service sub-page
│   ├── Contact.tsx
│   ├── Blog.tsx
│   ├── BlogPost.tsx          ← template for all blog posts
│   ├── NotFound.tsx
│   ├── PrivacyPolicy.tsx
│   └── Terms.tsx
├── data/
│   ├── navigation.ts         ← nav links config
│   ├── services.ts           ← services content
│   ├── testimonials.ts       ← testimonials content
│   ├── faqs.ts               ← FAQ content
│   ├── blog-posts.ts         ← blog post stubs
│   └── seo.ts                ← per-page SEO data (titles, descriptions, schemas)
├── hooks/
│   ├── useScrollPosition.ts  ← for nav transparency effect
│   ├── useCountUp.ts         ← for stat counter animation
│   └── useIntersection.ts    ← for scroll-triggered animations
├── lib/
│   ├── utils.ts              ← cn() utility, formatters, helpers
│   └── constants.ts          ← site URL, company name, contact info, social links
├── styles/
│   ├── animations.css        ← keyframe animations
│   └── globals.css           ← @import "tailwindcss" + base resets
├── types/
│   └── index.ts              ← shared TypeScript interfaces
├── assets/
│   ├── images/
│   └── icons/
├── App.tsx                   ← Router setup
└── main.tsx                  ← Entry point
```

**Content data pattern:**
All site content (copy, testimonials, FAQs, nav links, SEO metadata) lives in `src/data/` — never hardcoded inside components. This makes it easy to update content without touching component files.

### 5.2 — npm Dependencies

**Base (already in site-builder):**
- `react` + `react-dom`
- `vite` + `@vitejs/plugin-react`
- `tailwindcss` + `@tailwindcss/vite`
- `typescript`

**Always add:**
```
react-router-dom     — client-side routing
react-helmet-async   — SEO head management
```

**Add if needed (based on blueprint):**
```
# Form handling
react-hook-form      — form state management
zod                  — form validation schema

# Animation (if blueprint specifies animations beyond CSS)
framer-motion        — animation library (only if needed — adds ~50KB)

# Icons
lucide-react         — icon library (tree-shakeable, ~1KB per icon)

# Utilities
clsx                 — className utility
tailwind-merge       — merge Tailwind classes without conflicts
```

**Do NOT add without specific need:**
- Redux, Zustand (not needed for brochure sites)
- Axios (native fetch is fine)
- Moment.js or Day.js (only if dates are displayed)
- Any UI kit (shadcn/ui, Radix) unless the blueprint calls for complex UI

Document exact install command:
```bash
npm install react-router-dom react-helmet-async react-hook-form zod lucide-react clsx tailwind-merge
```
Plus any animation or additional deps from blueprint analysis.

### 5.3 — React Router Setup

Define all routes in `App.tsx`:

```typescript
// All routes with lazy loading
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
// ... one import per page

const App = () => (
  <HelmetProvider>
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          // ... all routes from sitemap
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
```

Note: Homepage uses `<Layout transparentNav>` if the blueprint calls for a transparent hero nav.

### 5.4 — State Management

For brochure/marketing sites: **React built-in state only** (useState, useContext).

No Redux, Zustand, or external state library needed unless:
- The site has a shopping cart
- The site has user authentication
- The site has complex filter/search UI

If the blueprint includes a job board or complex filtering: use URL search params + React state.

### 5.5 — Form Handling Strategy

Based on client requirements, choose ONE:

| Option | When to Use | Setup |
|--------|------------|-------|
| **Formspree** | Static site, simple contact form, no backend | `npm install @formspree/react`, free tier 50 submissions/month |
| **Netlify Forms** | Deploying to Netlify, simple forms | HTML `data-netlify="true"` attribute, no npm needed |
| **EmailJS** | Client-side email sending, no backend | `npm install @emailjs/browser` |
| **Custom API** | Complex forms, file uploads, CRM integration | Custom fetch to backend endpoint |

Document which option is selected and provide the integration pattern.

**All forms must:**
- Use `react-hook-form` for field state management
- Use `zod` for validation schema
- Show field-level error messages
- Show loading state during submission
- Show success/error state after submission
- Prevent double submission
- Have `aria-required`, `aria-invalid`, `aria-describedby` on all fields

### 5.6 — Analytics Plan

**Google Analytics 4:**
- Install via `gtag.js` in `index.html` (not npm — simpler, correct for Vite)
- Load with `async` attribute
- Track: page views (automatic), CTA button clicks (custom events), form submissions (custom events)

**Google Search Console:**
- Verify with HTML tag method — add verification meta tag to `SEOHead` for homepage only
- Submit `sitemap.xml` after deployment

**Core Web Vitals monitoring:**
- GA4 automatically reports CWV
- Alternatively: `web-vitals` npm package for custom reporting

### 5.7 — Image Strategy

**Formats:**
- Hero images and large backgrounds: WebP (provide JPG fallback with `<picture>`)
- Thumbnails and small images: WebP
- Logos and icons: SVG (never raster)
- Photography: WebP at 80% quality (significant size reduction)

**Sizing:**
- Generate responsive variants: 400w, 800w, 1200w, 1600w
- Use `srcset` and `sizes` attributes on all `<img>` tags
- Never scale up images — always serve at or near display size

**Loading strategy:**
- Hero image (LCP element): `loading="eager"` + `<link rel="preload">` in SEOHead
- All other images: `loading="lazy"`
- All images: explicit `width` and `height` attributes (prevents CLS)

**Placeholder strategy:**
- Low-Quality Image Placeholder (LQIP): blurred, tiny version loads first
- Or: background color placeholder matching the image's dominant color
- Blur-up animation: CSS transition from blurred placeholder to sharp image

### 5.8 — Font Loading Strategy

**Google Fonts (recommended approach):**
```html
<!-- In index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=[FontName]:wght@[weights]&display=swap" rel="stylesheet">
```

**Performance requirements:**
- `font-display: swap` — text shows immediately in fallback font, swaps when loaded
- Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`
- Only load the weights actually used (e.g., `400;500;600;700` — no `100;200;300` if unused)
- Maximum 2 font families — heading font and body font

**Fallback stack:**
Match the blueprint font with the closest system font fallback to minimize layout shift (CLS):
- Serif → `Georgia, 'Times New Roman', serif`
- Sans-serif → `system-ui, -apple-system, 'Segoe UI', sans-serif`
- Monospace → `ui-monospace, 'SF Mono', Consolas, monospace`

---

## PHASE 6: PERFORMANCE PLAN

Document specific implementation decisions to achieve Lighthouse 90+ on all categories.

### 6.1 — Code Splitting

Every page route uses `React.lazy()` + `Suspense` (already specified in Phase 5.3).

**Chunk budget:**
- Main bundle (shared): < 100KB gzipped
- Per-page chunk: < 50KB gzipped each
- Vendor chunks: React + React DOM split from app code

Add to `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
      }
    }
  }
}
```

### 6.2 — LCP Optimization

The hero section contains the LCP element in most cases. For it:
- Preload the hero image: `<link rel="preload" as="image" href="/hero.webp">`
- Add this to the `SEOHead` component via a prop: `lcpImage?: string`
- Use `loading="eager"` on the hero `<img>`
- Ensure the hero section is in the initial HTML (not lazy loaded)

### 6.3 — CLS Prevention

Cumulative Layout Shift causes:
- Images without explicit width/height
- Fonts that cause text reflow on load
- Dynamically injected content above existing content

Mitigate:
- All `<img>` tags have explicit `width` and `height` attributes
- Font fallback stacks chosen to minimize metric shift
- No banner/alert injected above the nav after load
- Skeleton loaders for any async content (match dimensions of loaded content)

### 6.4 — INP Optimization

Interaction to Next Paint:
- No long tasks (>50ms) on the main thread
- Event handlers are lightweight — no synchronous loops or heavy DOM queries
- Debounce scroll event listeners (use Intersection Observer instead)
- Animation uses CSS transforms and opacity only (GPU-accelerated — never top/left/width/height)

### 6.5 — Bundle Size Budget

| Item | Budget |
|------|--------|
| Total JS (gzipped) | < 200KB |
| Total CSS (gzipped) | < 20KB |
| Per-page chunk | < 50KB |
| Hero image | < 200KB |
| Total page weight | < 1MB |

Flag any dependency that would exceed the JS budget before adding it.

### 6.6 — Nginx Gzip / Caching

(Handled by `scripts/deploy.sh` — confirm it's applied)
- gzip all text assets (JS, CSS, HTML, SVG, JSON)
- 1-year cache on hashed static assets
- No-cache on `index.html`
- Security headers applied

---

## PHASE 7: ARCHITECTURE DOCUMENT OUTPUT

### 7.1 — Fill the Architecture Template

Open `blueprints/architectures/templates/architecture-template.md` and populate every section:

**Section 1: SITEMAP** — filled from Phase 1 (full page table + navigation structure)
**Section 2: COMPONENT ARCHITECTURE** — filled from Phase 3 (design tokens from blueprint + all component specs)
**Section 3: SEO IMPLEMENTATION PLAN** — filled from Phase 4 (per-page table + technical SEO config)
**Section 4: TECHNICAL IMPLEMENTATION** — filled from Phase 5 (folder structure + dependencies + performance)
**Section 5: DEPLOYMENT PLAN** — Digital Ocean + Nginx (standard config, domain from blueprint)
**Section 6: TIMELINE ESTIMATE** — calculate based on component count and page count:
  - Design System: 2-4 hours
  - Shared Components (Nav, Footer, SEOHead, Layout): 3-5 hours
  - Per page: 2-4 hours depending on complexity
  - SEO Implementation: 2-3 hours
  - QA & Lighthouse: 2-4 hours
  - **Total:** sum of above

### 7.2 — Save the Architecture

Save to:
```
blueprints/architectures/[client-name]-architecture.md
```

Where `[client-name]` matches the blueprint filename (e.g., `blueprints/smith-law-blueprint.md` → `blueprints/architectures/smith-law-architecture.md`).

### 7.3 — Present and Request Approval

After saving, output the complete architecture in the chat, then append:

```
---
ARCHITECT MODE — Complete

Architecture saved to: architectures/[client-name]-architecture.md

Summary:
- Pages planned: [N]
- Components specified: [N]
- SEO schemas defined: [N schema types across N pages]
- Dependencies to install: [list key additions]
- Estimated build time: [N] hours

Open items requiring decision before build:
- [ ] Form handling: [recommended option + reason] — confirm or override
- [ ] [Any other decision points from blueprint that need client input]

Ready to proceed?
→ Type "APPROVE ARCHITECTURE" to begin MODE: BUILDER
→ Or request changes: "Update [section] to [change]"
```

---

## ERROR HANDLING

### Blueprint Not Found
If the specified blueprint file doesn't exist:
```
Blueprint file not found at: [path]

Available blueprints:
[list files in blueprints/ directory]

Please specify the correct path or run MODE: RESEARCHER first to generate a blueprint.
```

### Incomplete Blueprint
If the blueprint is missing critical sections (no colors, no keywords, no components):
```
The blueprint at [path] appears incomplete. Missing:
- [list missing sections]

I can proceed with estimated values for missing fields, but the architecture will be less precise.
Options:
A) Proceed with estimates (I will mark all estimated fields clearly)
B) Go back to RESEARCHER mode to complete the blueprint first
C) Provide the missing information now and I will update the blueprint before proceeding
```

### Ambiguous Niche
If the business type isn't clear from the blueprint (affects sitemap decisions):
```
The blueprint doesn't clearly indicate the business type. This affects the sitemap structure.

Is this a:
A) Recruitment / Staffing agency
B) SaaS / Software product
C) Local service business
D) E-commerce / Product store
E) Portfolio / Creative agency
F) Other: [describe]
```

Wait for answer before continuing to Phase 1.

---

## QUALITY GATES

Before outputting the architecture, verify all of the following:

- [ ] Every page in the sitemap has a URL slug, priority, and parent defined
- [ ] Primary nav has 5-7 items maximum
- [ ] `SEOHead`, `Navigation`, `Footer`, `Layout`, `SectionWrapper`, `Button`, and `Card` components are all specified
- [ ] Every page has a title tag that is 50-60 characters (count them)
- [ ] Every page has a meta description that is 150-160 characters (count them)
- [ ] Every page has exactly one H1 defined
- [ ] Homepage has `Organization` + `WebSite` schema
- [ ] At least one service/inner page has `Service` schema
- [ ] XML sitemap lists all public pages
- [ ] robots.txt is configured with sitemap URL
- [ ] llms.txt content is defined
- [ ] `src/` folder structure is fully mapped
- [ ] Install command lists all required dependencies
- [ ] React Router has a route for every page in the sitemap
- [ ] Form handling strategy is chosen with rationale
- [ ] Font loading uses `font-display: swap` and preconnect
- [ ] Architecture STATUS is "Awaiting approval"
- [ ] File is saved at the correct path
