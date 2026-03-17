# WD-01 RESEARCHER MODE — Complete Skill Instructions
**Skill:** researcher-mode
**Triggered by:** `MODE: RESEARCHER` followed by URLs
**Output:** Completed blueprint saved to `blueprints/[client-name]-blueprint.md`

---

## ACTIVATION

When the user types `MODE: RESEARCHER`, immediately state:

```
MODE: RESEARCHER — Active
I will analyze the provided sites and produce a Blueprint document.
```

Then proceed to INPUT PARSING.

---

## PHASE 1: INPUT PARSING

### 1.1 — Accepted Input Formats

Accept any of these formats:

**Format A — Categorized inline:**
```
MODE: RESEARCHER branding: site1.com, site2.com seo: site3.com, site4.com
```

**Format B — Labeled lists:**
```
MODE: RESEARCHER
BRANDING: https://site1.com, https://site2.com
SEO: https://site3.com
```

**Format C — Mixed with context:**
```
MODE: RESEARCHER
Client is a law firm. Look at these for design inspiration:
- https://site1.com
- https://site2.com
For SEO structure look at:
- https://site3.com
```

**Format D — Uncategorized (requires clarification):**
```
MODE: RESEARCHER https://site1.com https://site2.com https://site3.com
```

### 1.2 — URL Normalization

For every URL received:
- If missing `https://`, prepend it
- Strip trailing slashes for consistency
- If a bare domain is given (e.g. `example.com`), treat as `https://example.com`

### 1.3 — Handling Uncategorized URLs

If the user provides URLs without BRANDING/SEO categorization, **stop and ask before proceeding**:

```
I have [N] URLs to analyze. Please categorize them so I analyze each correctly:

1. https://url1.com — BRANDING or SEO?
2. https://url2.com — BRANDING or SEO?
3. https://url3.com — BRANDING or SEO?

BRANDING = analyze for design, colors, typography, components, animations
SEO = analyze for keyword strategy, content structure, schema, technical setup
A site can be both — just tell me.
```

Wait for the user's response before continuing.

### 1.4 — Client Name Extraction

Ask the user for the client name if not already provided — it determines the output filename:

```
What is the client/project name? (used for the blueprint filename)
```

If the user has already mentioned a client name in the conversation, use it without asking.

Sanitize the client name for use as a filename:
- Lowercase
- Replace spaces with hyphens
- Remove special characters
- Example: "Smith & Jones Law" → `smith-jones-law`

### 1.5 — Pre-Analysis Summary

Before starting, confirm what you're about to do:

```
Starting analysis:
BRANDING sites (design patterns): [list]
SEO sites (content/ranking structure): [list]
Blueprint will be saved as: blueprints/[client-name]-blueprint.md

Beginning scraping now...
```

---

## PHASE 2: BRANDING ANALYSIS

Perform this process for **each BRANDING URL**. If multiple branding URLs, run them all and synthesize a unified result.

### 2.1 — Scraping with Firecrawl

**Pages to scrape:**
Scrape ONLY the exact URLs provided by the user. Do not discover or visit any additional pages (no About, Services, Contact, or any other sub-pages).

**Firecrawl instructions:**
- Use the `firecrawl` MCP tool to scrape each page
- Request both the rendered HTML and extracted markdown
- Enable JavaScript rendering to capture dynamically loaded content
- Capture CSS-in-JS values if present

**If Firecrawl fails or the site blocks scraping:**
→ See PHASE 6: ERROR HANDLING

### 2.2 — Color Extraction

From the scraped HTML/CSS, extract colors systematically:

**Sources to check (in order of priority):**
1. CSS custom properties (`:root { --color-primary: ... }`)
2. Inline `style` attributes on major elements
3. Tailwind config if detectable in `<script>` tags
4. CSS class names that imply color (e.g. `bg-blue-600`, `text-gray-900`)
5. Computed styles on: `<header>`, `<nav>`, `<h1>`, `<button>`, `<footer>`, `.hero`, `.cta`

**Classification rules:**
- **Primary:** The dominant brand color — most frequently used on CTAs, buttons, active nav items, key headings
- **Secondary:** Supporting color — used in secondary buttons, icon backgrounds, hover states
- **Accent:** High-contrast pop color — used for highlights, badges, underlines, small decorative elements
- **Neutral Light:** The light background or surface color
- **Neutral Dark:** The dark text or dark background color
- **Background:** Page background color
- **Surface:** Card, panel, modal background color

**Output format:**
```
Color Palette:
- Primary: #1E3A5F (deep navy — CTAs, active nav, headings)
- Secondary: #2D7DD2 (medium blue — secondary buttons, icons)
- Accent: #F4A261 (amber — highlights, badges, underlines)
- Neutral Light: #F8F9FA
- Neutral Dark: #1A1A2E
- Background: #FFFFFF
- Surface: #F1F5F9
```

If you identify dark mode variants, note them separately.

### 2.3 — Typography Extraction

**Sources to check:**
1. `<link>` tags pointing to Google Fonts or Adobe Fonts — extract the font family names
2. `@import` rules in CSS for font sources
3. CSS `font-family` declarations on `body`, `h1`, `h2`, `p`, `.hero`, `.nav`
4. `<style>` tags in `<head>`
5. Tailwind `fontFamily` config if exposed

**Extract for each font role:**

| Role | CSS selector | Extract: family, size, weight, line-height, letter-spacing |
|------|--------------|------------------------------------------------------------|
| H1 | `h1`, `.h1`, `[class*="heading-1"]` | All properties |
| H2 | `h2`, `.h2` | All properties |
| H3 | `h3`, `.h3` | All properties |
| Body | `body`, `p`, `.body-text` | All properties |
| Nav | `nav a`, `.nav-link` | Family, size, weight |
| Button | `button`, `.btn`, `[class*="button"]` | Family, size, weight, letter-spacing |
| Small/Caption | `small`, `.caption`, `.label` | Family, size |

**Identify the font pairing pattern:**
- Serif heading + sans-serif body (classic editorial)
- Same font family throughout (modern minimal)
- Display font heading + system font body (impactful)
- Monospace accent + sans-serif body (tech/dev)

**Output format:**
```
Typography:
- Heading Font: "Playfair Display", serif — weights 400, 700
- Body Font: "Inter", sans-serif — weights 400, 500, 600
- Scale: H1 72px/80px, H2 48px/56px, H3 32px/40px, Body 18px/28px
- Letter Spacing: Headings -0.02em, Body 0em, Caps/Labels 0.08em
- Font Rendering: antialiased (webkit-font-smoothing detected)
```

### 2.4 — Spacing System Extraction

**Extract from:**
- `padding` and `margin` on sections (`<section>`, `<article>`, `.container`, `.wrapper`)
- `gap` values in flexbox/grid layouts
- Recurring patterns — if you see `32px`, `64px`, `96px` repeatedly, note the base unit

**Identify:**
- Base spacing unit (usually 4px or 8px)
- Section vertical padding (above/below hero, feature sections, etc.)
- Content container max-width
- Column gaps in grids

**Output format:**
```
Spacing:
- Base Unit: 8px
- Scale: 8, 16, 24, 32, 48, 64, 96, 128px
- Section Padding: 96px top/bottom (desktop), 64px (tablet), 48px (mobile)
- Container Max Width: 1280px
- Column Gap: 32px
```

### 2.5 — Border Radius & Shadows

**Border radius — extract from:**
- Buttons, cards, inputs, images, modals, badges
- Classify as: sharp (0), subtle (2-4px), rounded (8-16px), pill (9999px), full circle (50%)

**Shadows — extract from:**
- Cards, modals, dropdowns, hover states
- Classify as: none, subtle (low opacity, small blur), medium, dramatic (dark, large spread)

**Output format:**
```
Border Radius:
- Buttons: 8px (rounded)
- Cards: 12px
- Badges/Pills: 9999px
- Images: 4px

Shadows:
- Card: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)
- Card Hover: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)
- Modal: 0 25px 50px -12px rgba(0,0,0,0.25)
```

### 2.6 — Visual Style Classification

After extracting all technical data, make a judgment call on overall visual style. Use these definitions:

| Style | Characteristics |
|-------|----------------|
| **Minimal** | White space heavy, few colors, thin typography, subtle shadows, no gradients |
| **Bold** | High contrast, large type, strong colors, thick strokes, dramatic shadows |
| **Corporate** | Conservative colors (navy, grey), structured grids, professional photography |
| **Playful** | Bright colors, rounded shapes, illustrations, irregular layouts |
| **Luxury** | Dark backgrounds, gold/cream accents, serif fonts, refined spacing |
| **Tech-forward** | Dark mode, monospace accents, gradient glows, geometric patterns |
| **Editorial** | Typography-led, serif headings, long-form layout, magazine feel |
| **Startup** | Purple/blue gradients, modern sans-serif, feature grids, social proof heavy |

Also identify:
- **Animation library** — Framer Motion, GSAP, AOS, CSS-only, Lottie, none
- **Illustration style** — Line art, 3D renders, flat vector, isometric, photography-only, none
- **Image style** — Professional photography, stock photos, illustrations, screenshots, none
- **Gradient usage** — None / subtle (text gradients only) / moderate (hero backgrounds) / heavy (most surfaces)

### 2.7 — Component Inventory

List every distinct UI section/block found across all scraped pages:

For each component record:

```
Component: [Name]
Location: [page(s) it appears on]
Layout: [grid cols / flex row / stacked / asymmetric]
Content: [what's inside it — text, image, icon, video, etc.]
Notable: [anything distinctive — animation, hover effect, unusual pattern]
```

**Common components to look for:**
- Hero (full-width, split, video, animated)
- Navigation (sticky, transparent-to-solid, mega menu, hamburger)
- Feature grid (2-col, 3-col, icon+text, image+text)
- Social proof (logos bar, testimonial cards, review stars)
- Stats/Counters (number highlights, animated counters)
- CTA block (centered, split, gradient background, full-bleed)
- Pricing table (tiered cards, toggle, comparison)
- Team grid (photo cards, hover bio)
- Process/Steps (numbered, timeline, horizontal)
- FAQ (accordion, grouped)
- Blog/Content grid (card layout)
- Footer (mega footer, minimal, columns)
- Cookie banner, chat widget, announcement bar

---

## PHASE 3: SEO ANALYSIS

Perform this process for **each SEO URL**.

### 3.1 — Scraping with Firecrawl

**Pages to scrape:**
Scrape ONLY the exact URLs provided by the user. Do not discover or visit any additional pages, sub-pages, sitemaps, or robots.txt.

**For each page, extract the raw HTML** — you need to read `<head>` contents and `<body>` structure.

### 3.2 — Title Tag Analysis

For each page scraped:
- Extract exact `<title>` text
- Count characters (including spaces)
- Identify the formula pattern used

**Common title formulas:**
- `[Primary Keyword] | [Brand]`
- `[Primary Keyword] — [Secondary Keyword] | [Brand]`
- `[Brand] — [Value Proposition]` (homepage only)
- `[Keyword] in [Location] | [Brand]` (local SEO)
- `[Number] [Keyword] [Power Word] | [Brand]` (blog posts)

Note whether titles are within the 50-60 character ideal range, and flag any that are too long (>60) or too short (<40).

### 3.3 — Meta Description Analysis

For each page:
- Extract `<meta name="description" content="...">` value
- Count characters
- Note the formula pattern (does it include a CTA? Does it restate the title? Does it mention benefits?)
- Flag if missing or duplicate across pages

### 3.4 — Heading Hierarchy Analysis

For each page, extract all heading tags in DOM order:

```
H1: [exact text]
  H2: [exact text]
    H3: [exact text]
    H3: [exact text]
  H2: [exact text]
    H3: [exact text]
```

**Analyze:**
- Is there exactly one H1? (if multiple, note as issue)
- Does the H1 contain the primary keyword?
- Do H2s logically subdivide the H1 topic?
- Are H3s used consistently as sub-items under H2s, or randomly?
- Is there any heading level skipping (H1 → H3 without H2)?

**Identify the H1 formula:**
- `[Primary Keyword] [Modifier] in [Location]` → local
- `[Action] [Outcome] with [Product/Service]` → benefit-led
- `[Number] [Keyword]` → list format
- `[Brand Claim] — [Supporting Statement]` → brand-led

### 3.5 — Schema Markup Extraction

Search the HTML for `<script type="application/ld+json">` tags.

For each found:
- Extract and parse the JSON
- Identify the `@type` value
- Note which properties are populated
- Check if it's valid JSON (no syntax errors)

**Schema types to look for:**
- `Organization` / `LocalBusiness`
- `WebSite` (with `SearchAction` potentialAction)
- `WebPage` / `AboutPage` / `ContactPage`
- `Service` / `Product`
- `FAQPage` (with `mainEntity` questions)
- `Article` / `BlogPosting`
- `BreadcrumbList`
- `Review` / `AggregateRating`
- `Person` (for author pages)

### 3.6 — URL Structure Analysis

From all pages scraped and from the sitemap (if available):

- Note the URL slug pattern: `/[category]/[slug]` vs `/[slug]` vs `/[slug].html`
- Are slugs keyword-rich or branded/numeric?
- Are there subfolders that indicate site sections (`/blog/`, `/services/`, `/products/`)?
- Is there a consistent slug naming convention (hyphens vs underscores, lowercase)?

### 3.7 — Internal Linking Analysis

From each page's HTML:
- Count total internal links (same-domain `<a href>` tags)
- Identify anchor text patterns: exact-match keyword, partial-match, branded, generic ("click here", "learn more")
- Note whether navigation links are counted or if there are contextual in-body links
- Check for footer link clusters (these are often topic-based)

### 3.8 — Image Alt Text Analysis

From each page:
- Count images total
- Count images with non-empty alt text
- Note the alt text pattern: descriptive ("Red running shoes for women"), keyword-stuffed, generic ("image"), or empty
- Note whether images are lazy-loaded (`loading="lazy"` attribute)

### 3.9 — Technical SEO Signals

Check for these on each page:

| Signal | Where to Look | Pass / Fail / Note |
|--------|--------------|-------------------|
| Canonical URL | `<link rel="canonical" href="...">` | Present / Missing |
| Open Graph tags | `<meta property="og:...">` | Which tags present |
| Twitter Card | `<meta name="twitter:...">` | Which tags present |
| hreflang | `<link rel="alternate" hreflang="...">` | Present / Missing |
| Viewport meta | `<meta name="viewport">` | Present / Missing |
| Robots meta | `<meta name="robots">` | Value if present |
| Structured data errors | Malformed JSON-LD | Note if found |

**robots.txt check:**
- Does it exist at `/robots.txt`?
- Does it reference the sitemap?
- Are any important paths disallowed?

**Sitemap check:**
- Does `/sitemap.xml` exist and return valid XML?
- How many URLs are included?
- Is there a sitemap index (multiple sitemaps)?

### 3.10 — Content Depth Assessment

For each page type scraped, estimate:
- Approximate word count (count text nodes, estimate)
- Number of distinct sections/blocks
- Content formats used (text only, text+image, video embed, interactive elements, tools/calculators)
- Presence of: FAQ section, testimonials/reviews, case studies, author bio, date published/updated
- Whether the content would qualify for a Featured Snippet (has a direct answer to a query in the first 300 words, uses a list or table)

### 3.11 — Performance Signals

From the HTML, note:
- Are images using `loading="lazy"`?
- Are `<link rel="preload">` tags used for fonts, CSS, or LCP images?
- Are scripts tagged with `defer` or `async`?
- Is CSS in `<head>` (blocking) or loaded asynchronously?
- Are there excessive third-party scripts (chat widgets, analytics, A/B testing, ads)?
- Is a CDN detectable in asset URLs?
- Are images in modern formats (WebP, AVIF) or legacy (JPG, PNG)?

---

## PHASE 4: KEYWORD RESEARCH SYNTHESIS

Based on the SEO analysis, synthesize a keyword strategy for the client's site:

### 4.1 — Keyword Extraction

From competitor title tags, H1s, H2s, and URL slugs, identify:
- **Primary keywords** — exact-match terms in H1s and title tags
- **Secondary keywords** — terms appearing in H2s and meta descriptions
- **Long-tail variations** — phrase patterns used in body content and H3s
- **Location modifiers** — geographic qualifiers if present

### 4.2 — Intent Classification

For each keyword identified, classify search intent:
- **Informational** — "how to", "what is", "guide", "tutorial" → blog/resource content
- **Navigational** — brand name + qualifier → about/homepage
- **Commercial Investigation** — "best", "vs", "review", "top", "compare" → comparison/landing pages
- **Transactional** — "hire", "buy", "book", "get", "pricing" → service/pricing pages

### 4.3 — Target Page Mapping

Map each primary keyword to its logical target page on the client's future site.

---

## PHASE 5: BLUEPRINT GENERATION

### 5.1 — Synthesize Across Multiple Sites

If multiple BRANDING sites were analyzed:
- Where colors differ, note the range and choose the approach that best serves the client
- Where typography patterns align, use the consensus as a strong signal
- Where they conflict, note both options and flag for client decision

If multiple SEO sites were analyzed:
- Find the common formula used across sites (this is the industry-proven pattern)
- Note any differentiators that could be a competitive advantage

### 5.2 — Fill the Blueprint Template

Open `blueprints/templates/blueprint-template.md` and populate **every field** with extracted data.

**Required fields — never leave as `[placeholder]`:**
- All color hex values
- All font families
- H1 formula
- Title tag formula
- Meta description formula
- At least 5 rows in the Component List table
- At least 3 rows in the Target Keywords table

**Fields that may be estimated — mark clearly:**
If a field couldn't be extracted (site blocked scraping, data not found), fill it with your best inference based on industry standards and mark it:

```
- Primary: #1A2E5A [ESTIMATED — site blocked color extraction]
```

### 5.3 — Save the Blueprint

Save the completed blueprint to:
```
blueprints/[client-name]-blueprint.md
```

Where `[client-name]` is the sanitized client name from Phase 1.4.

### 5.4 — Present the Blueprint

After saving, output the full blueprint contents in the chat for review.

Then append:

```
---
RESEARCHER MODE — Complete

Blueprint saved to: blueprints/[client-name]-blueprint.md

Sites analyzed:
- BRANDING: [list]
- SEO: [list]

Fields extracted vs estimated:
- Extracted: [N] fields
- Estimated: [N] fields (marked in blueprint)

Open items requiring client input:
- [any fields where you need more information]

Ready to proceed?
→ Type "APPROVE BLUEPRINT" to move to MODE: ARCHITECT
→ Or request changes: "Update [section] to [change]"
```

---

## PHASE 6: ERROR HANDLING

### 6.1 — Firecrawl MCP Not Available

If the `firecrawl` MCP tool is not accessible:

```
Firecrawl MCP is not currently available. This could mean:
1. The MCP server failed to start (check your API key in .claude/settings.json)
2. The MCP is not yet restarted after configuration

Options:
A) Fix Firecrawl and re-run
B) Provide screenshots of the sites — I will analyze them visually
C) Describe the sites manually and I will build the blueprint from your description
D) I will analyze publicly available information (Google cache, schema.org, PageSpeed data) without scraping

Which would you prefer?
```

### 6.2 — Site Blocks Scraping

If Firecrawl returns a 403, Cloudflare block, or empty content:

```
[URL] is blocking automated scraping.
Extracting available data from: page metadata, cached content, and public SEO signals.
Fields that cannot be extracted will be marked [ESTIMATED].
```

Continue with what's available. Do not halt the entire analysis — produce partial data and mark estimated fields.

### 6.3 — Site Returns Errors

If a URL returns 404, 500, or is unreachable:

```
[URL] returned [error code] and could not be scraped.
Removing from analysis. Please verify the URL is correct and accessible.
```

Remove that URL from the analysis and continue with the remaining sites.

If only one URL was provided and it fails, notify the user and ask for a replacement or to proceed without it.

### 6.4 — Partial Data

Always produce a blueprint even with incomplete data. A blueprint with 60% extracted data and 40% estimated is more useful than no blueprint.

Use this notation system:
- `[EXTRACTED]` — confirmed from scraped data
- `[ESTIMATED]` — inferred from industry standards or partial data
- `[REQUIRED: client input]` — cannot be estimated, client must provide

### 6.5 — Invalid URLs

If a URL cannot be parsed or is obviously wrong (e.g. missing TLD, contains typos):

```
The following URLs appear to be invalid and will be skipped:
- [URL] — [reason]

Continuing with valid URLs: [list]
```

---

## QUALITY STANDARDS

Before submitting the blueprint for approval, verify:

- [ ] All color values are valid hex codes
- [ ] All font families are real, identified fonts (not invented names)
- [ ] H1 formula follows the pattern `"[keyword] [modifier]"` — not generic
- [ ] Title tag formula produces a string 50-60 characters when filled in
- [ ] At least one schema type is specified per page type
- [ ] Component list has at minimum: Hero, Navigation, Footer, one feature section, one CTA
- [ ] Keyword table has at minimum 5 keywords with intent classified
- [ ] Blueprint STATUS is set to "Awaiting approval"
- [ ] File is saved at the correct path: `blueprints/[client-name]-blueprint.md`
