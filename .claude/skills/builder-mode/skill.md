# WD-01 BUILDER MODE — Complete Skill Instructions
**Skill:** builder-mode
**Triggered by:** `MODE: BUILDER [architecture-path]` OR user approves an architecture from ARCHITECT mode
**Input:** Approved architecture document
**Output:** Complete working website at `builds/[client-name]/`

---

## ACTIVATION

When the user triggers BUILDER mode:

1. Identify the architecture path from the trigger
2. Read the architecture file in full before doing anything else
3. Confirm activation:

```
MODE: BUILDER — Active
Reading architecture for [Client Name]...

Architecture loaded:
- Pages to build: [N]
- Components to build: [N]
- Dependencies to install: [list]
- SEO schemas to implement: [N]

Starting build. I will work through 12 steps systematically.
Current step will be reported as I go.
```

4. Extract and store these values for use throughout the build:
   - `CLIENT_NAME`: sanitized client name (lowercase, hyphens)
   - `BUILD_DIR`: `builds/[client-name]`
   - `DOMAIN`: from architecture deployment plan (or placeholder `https://example.com`)
   - All design tokens from architecture Section 2 (colors, fonts, spacing, radius, shadows)
   - All per-page SEO data from architecture Section 3

---

## STEP 1: PROJECT SETUP

### 1.1 — Copy site-builder to builds/[client-name]/

```bash
cp -r site-builder/ builds/[client-name]/
```

Then clean out the template's demo content:
- Delete `src/App.css`
- Empty `src/App.tsx` (replace with Router setup later in Step 8)
- Empty `src/index.css` (replace with global styles in Step 2)
- Delete `src/assets/react.svg` and any other template SVGs
- Replace `index.html` title tag with the client's brand name

Verify the copy succeeded and the folder structure matches `site-builder/`.

### 1.2 — Install dependencies

Navigate into the build directory and install all dependencies from the architecture document.

**Always install:**
```bash
npm install react-router-dom react-helmet-async lucide-react clsx tailwind-merge
```

**Form handling (based on architecture decision):**
```bash
# If Formspree or custom API:
npm install react-hook-form zod @hookform/resolvers

# If EmailJS:
npm install @emailjs/browser react-hook-form zod @hookform/resolvers
```

**Animations (based on blueprint):**
```bash
# Only if architecture specifies Framer Motion:
npm install framer-motion
```

**Additional deps from architecture Section 4 Dependencies table:**
Install exactly what the architecture specifies — nothing more.

### 1.3 — Verify clean install

Run:
```bash
npm run build
```

The base template must build successfully before any code is written. If it fails, fix the issue before proceeding. Do not write a single component until the base build passes.

### 1.4 — Update index.html

Replace the `<title>` tag with the client brand name.
Add the Google Fonts `<link>` tags from the architecture font loading spec.
Add the GA4 `gtag.js` script with `async` if analytics is in the architecture.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="[Google Fonts URL from architecture]" rel="stylesheet">

    <title>[Client Brand Name]</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## STEP 2: TAILWIND CONFIGURATION

### 2.1 — tailwind.config.ts

Create a complete Tailwind config using the design tokens from the architecture document.

**Color shade generation:**
For each base brand color (primary, secondary, accent), generate a full 50-950 shade scale. Use this formula:
- 50: lightest tint (base color mixed 95% white)
- 100: very light (90% white)
- 200: light (80% white)
- 300: medium light (65% white)
- 400: light-medium (45% white)
- 500: base color itself (or nearest)
- 600: medium dark (15% black mixed in)
- 700: dark (30% black)
- 800: very dark (45% black)
- 900: darkest (60% black)
- 950: near black (75% black)

If you cannot precisely calculate hex shades, provide the base color as 500 and generate reasonable approximations for the rest. Mark the config with a comment: `// Shade scale — review against brand guidelines`.

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '[calculated]',
          100: '[calculated]',
          200: '[calculated]',
          300: '[calculated]',
          400: '[calculated]',
          500: '[base color from blueprint]',
          600: '[calculated]',
          700: '[calculated]',
          800: '[calculated]',
          900: '[calculated]',
          950: '[calculated]',
        },
        secondary: { /* same pattern */ },
        accent: { /* same pattern */ },
        // Neutral colors from blueprint:
        neutral: {
          light: '[hex]',
          dark: '[hex]',
        },
        surface: '[hex]',
        // Brand-specific named colors:
        brand: {
          bg: '[background hex]',
          text: '[primary text hex]',
          'text-muted': '[secondary text hex]',
          border: '[border hex]',
        },
      },
      fontFamily: {
        heading: ['[Heading Font]', '[fallback]', '[fallback]'],
        body: ['[Body Font]', 'system-ui', 'sans-serif'],
        // mono only if used:
        mono: ['[Mono Font]', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Custom type scale from blueprint — only if non-standard:
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg':  ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md':  ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-sm':  ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        // Only add if blueprint uses non-default spacing values:
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        // From blueprint border-radius values:
        'sm': '[value]',
        'md': '[value]',
        'lg': '[value]',
        'xl': '[value]',
        '2xl': '[value]',
      },
      boxShadow: {
        // From blueprint shadow values:
        'card': '[box-shadow value]',
        'card-hover': '[elevated box-shadow value]',
        'modal': '[dramatic box-shadow value]',
        'nav': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-down':  'fadeDown 0.6s ease-out forwards',
        'slide-in-left':  'slideInLeft 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'scale-in':   'scaleIn 0.4s ease-out forwards',
        'count-up':   'countUp 2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%':   { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      screens: {
        // Default Tailwind breakpoints unless blueprint specifies custom ones:
        // sm: '640px', md: '768px', lg: '1024px', xl: '1280px', 2xl: '1536px'
      },
    },
  },
  plugins: [],
}

export default config
```

### 2.2 — src/styles/globals.css

```css
@import "tailwindcss";

/* ── Font imports (if not in index.html) ──────────────────────────── */
/* @import url('https://fonts.googleapis.com/...'); */

/* ── CSS Custom Properties ───────────────────────────────────────── */
:root {
  --color-primary: [hex from blueprint];
  --color-secondary: [hex from blueprint];
  --color-accent: [hex from blueprint];
  --font-heading: '[Heading Font]', [fallback];
  --font-body: '[Body Font]', system-ui, sans-serif;
  --radius: [base border radius from blueprint];
  --shadow-card: [card shadow from blueprint];
}

/* ── Base styles ─────────────────────────────────────────────────── */
html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--font-body);
  background-color: [background color from blueprint];
  color: [primary text color from blueprint];
}

/* ── Selection color ────────────────────────────────────────────── */
::selection {
  background-color: [primary color at 20% opacity];
  color: [primary dark shade];
}

/* ── Focus ring (global accessible focus state) ─────────────────── */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

/* ── Headings use heading font ───────────────────────────────────── */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

/* ── Scroll-triggered animation base states ─────────────────────── */
/* Elements start invisible; JS adds 'animate-fade-up' class on intersection */
.animate-on-scroll {
  opacity: 0;
}
.animate-on-scroll.is-visible {
  animation: fadeUp 0.6s ease-out forwards;
}

/* ── Animation delay utilities ───────────────────────────────────── */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }

/* ── Gradient text utility ───────────────────────────────────────── */
.gradient-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Image aspect ratios ─────────────────────────────────────────── */
.aspect-hero   { aspect-ratio: 16/9; }
.aspect-card   { aspect-ratio: 4/3; }
.aspect-square { aspect-ratio: 1/1; }
.aspect-portrait { aspect-ratio: 3/4; }
```

### 2.3 — src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// cn() — merges Tailwind classes correctly, resolves conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// formatDate — for blog posts and case studies
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// truncate — for card descriptions
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '…';
}
```

### 2.4 — src/lib/constants.ts

```typescript
// Site-wide constants — update these for every project
export const SITE = {
  name: '[Company Name]',
  url: '[https://domain.com]',
  description: '[One-line brand description]',
  email: '[contact@domain.com]',
  phone: '[phone number]',
  address: '[full address]',
  social: {
    linkedin: '[url or empty string]',
    twitter: '[url or empty string]',
    instagram: '[url or empty string]',
    facebook: '[url or empty string]',
  },
  ogImage: '/og-default.jpg', // 1200x630px — create this asset
} as const;

export const NAV_LINKS = [
  // Populated from architecture navigation structure
  // { label: 'Services', href: '/services' },
] as const;
```

---

## STEP 3: BASE UI COMPONENTS

Build these in `src/components/ui/`. Build them all before touching any page or section.

### Button.tsx

```typescript
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const variantClasses = {
  primary:     'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md',
  secondary:   'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800',
  outline:     'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
  ghost:       'text-primary-600 hover:bg-primary-50 active:bg-primary-100',
  destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-5 text-base gap-2',
  lg: 'h-12 px-7 text-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, leftIcon, rightIcon, children, className, ...props }, ref) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-[var(--radius)] transition-all duration-200',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

### Card.tsx

```typescript
import { cn } from '@/lib/utils';

interface CardImage { src: string; alt: string; }
interface CardCTA   { text: string; href: string; }

interface CardProps {
  variant?: 'default' | 'bordered' | 'flat' | 'interactive';
  image?: CardImage;
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: CardCTA;
  children?: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default:     'bg-white shadow-card rounded-[var(--radius)]',
  bordered:    'bg-white border border-brand-border rounded-[var(--radius)]',
  flat:        'bg-surface rounded-[var(--radius)]',
  interactive: 'bg-white shadow-card rounded-[var(--radius)] hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 cursor-pointer',
};

export function Card({ variant = 'default', image, eyebrow, title, description, cta, children, className }: CardProps) {
  return (
    <div className={cn('overflow-hidden', variantClasses[variant], className)}>
      {image && (
        <div className="aspect-card overflow-hidden">
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            width={800}
            height={600}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-2">{eyebrow}</p>
        )}
        <h3 className="font-heading text-xl font-semibold text-brand-text mb-2">{title}</h3>
        {description && <p className="text-brand-text-muted leading-relaxed">{description}</p>}
        {children}
        {cta && (
          <a href={cta.href} className="inline-flex items-center mt-4 text-primary-600 font-medium hover:text-primary-700 transition-colors">
            {cta.text}
            <span className="ml-1" aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </div>
  );
}
```

### SectionWrapper.tsx

```typescript
import { cn } from '@/lib/utils';

type Background = 'white' | 'surface' | 'primary' | 'dark' | 'gradient' | 'none';
type PaddingY   = 'sm' | 'md' | 'lg' | 'xl';
type MaxWidth   = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  background?: Background;
  paddingY?: PaddingY;
  maxWidth?: MaxWidth;
}

const bgClasses: Record<Background, string> = {
  white:    'bg-white',
  surface:  'bg-surface',
  primary:  'bg-primary-600 text-white',
  dark:     'bg-brand-text text-white',
  gradient: 'bg-gradient-to-br from-primary-600 to-primary-800 text-white',
  none:     '',
};

const pyClasses: Record<PaddingY, string> = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
};

const mwClasses: Record<MaxWidth, string> = {
  sm:   'max-w-xl',
  md:   'max-w-3xl',
  lg:   'max-w-5xl',
  xl:   'max-w-7xl',
  full: 'max-w-full',
};

export function SectionWrapper({ children, id, className, background = 'white', paddingY = 'lg', maxWidth = 'xl' }: SectionWrapperProps) {
  return (
    <section id={id} className={cn(bgClasses[background], className)}>
      <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', mwClasses[maxWidth], pyClasses[paddingY])}>
        {children}
      </div>
    </section>
  );
}
```

### Badge.tsx

```typescript
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  primary:   'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  accent:    'bg-accent-100 text-accent-700',
  neutral:   'bg-neutral-100 text-neutral-700',
  success:   'bg-green-100 text-green-700',
  warning:   'bg-yellow-100 text-yellow-700',
  error:     'bg-red-100 text-red-700',
};

export function Badge({ variant = 'primary', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      variantClasses[variant],
      className,
    )}>
      {children}
    </span>
  );
}
```

### Input.tsx

```typescript
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, required, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId  = hint  ? `${inputId}-hint`  : undefined;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-brand-text">
            {label}{required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'h-10 w-full rounded-[var(--radius)] border border-brand-border bg-white px-3 text-brand-text',
            'placeholder:text-brand-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-surface disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-500 focus:ring-red-500',
            className,
          )}
          {...props}
        />
        {hint  && <p id={hintId}  className="text-xs text-brand-text-muted">{hint}</p>}
        {error && <p id={errorId} className="text-xs text-red-600" role="alert">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
```

### Textarea.tsx

Same pattern as Input.tsx but renders `<textarea>` with `rows` prop defaulting to 4, and `resize-none` class.

### src/components/ui/index.ts — barrel export

```typescript
export { Button }         from './Button';
export { Card }           from './Card';
export { SectionWrapper } from './SectionWrapper';
export { Badge }          from './Badge';
export { Input }          from './Input';
export { Textarea }       from './Textarea';
```

---

## STEP 4: LAYOUT COMPONENTS

Build in `src/components/layout/`.

### Navigation.tsx

**Data-driven approach:** Import `NAV_LINKS` from `src/lib/constants.ts`. Never hardcode nav items inside the component.

**Key implementation requirements:**

1. **Transparency + scroll effect:**
```typescript
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);
```
Apply `bg-white/90 backdrop-blur-md shadow-nav` when `scrolled`, otherwise `bg-transparent` (if `transparent` prop is true).

2. **Mobile menu state:**
```typescript
const [mobileOpen, setMobileOpen] = useState(false);

// Close on route change:
const location = useLocation();
useEffect(() => setMobileOpen(false), [location]);

// Prevent body scroll when menu open:
useEffect(() => {
  document.body.style.overflow = mobileOpen ? 'hidden' : '';
  return () => { document.body.style.overflow = ''; };
}, [mobileOpen]);
```

3. **Active link detection:**
```typescript
const { pathname } = useLocation();
const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);
```

4. **Accessibility requirements:**
```html
<nav role="navigation" aria-label="Main navigation">
  <!-- Skip link — MUST be first focusable element on page -->
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-4 py-2 rounded z-50">
    Skip to content
  </a>

  <!-- Hamburger button -->
  <button
    aria-expanded={mobileOpen}
    aria-controls="mobile-menu"
    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
    onClick={() => setMobileOpen(!mobileOpen)}
  >

  <!-- Mobile menu -->
  <div id="mobile-menu" aria-hidden={!mobileOpen} ...>
```

5. **Dropdown menus (if architecture specifies):**
- Use `onMouseEnter`/`onMouseLeave` with a 150ms delay to prevent accidental opens
- Dropdown must close on Escape key press
- Dropdown items must be keyboard-navigable with Tab

### Footer.tsx

**Requirements:**
- Import `SITE` and `NAV_LINKS` from constants
- Dynamic copyright year: `new Date().getFullYear()`
- Social icons from `lucide-react` (LinkedIn, Twitter, Instagram — only those in `SITE.social`)
- External links use `target="_blank" rel="noopener noreferrer"` with `aria-label="[Name] (opens in new tab)"`
- Grid layout from architecture spec (3-5 columns desktop, 2-col tablet, 1-col mobile)

### Layout.tsx

```typescript
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface LayoutProps {
  transparentNav?: boolean;
}

export function Layout({ transparentNav = false }: LayoutProps) {
  return (
    <>
      <Navigation transparent={transparentNav} />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
```

Note: `id="main-content"` and `tabIndex={-1}` are required — the skip link in Navigation targets `#main-content`.

### src/hooks/useScrollPosition.ts

```typescript
import { useState, useEffect } from 'react';

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return scrollY;
}
```

### src/hooks/useIntersection.ts

```typescript
import { useEffect, useRef, useState } from 'react';

export function useIntersection(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(el); // Animate once only
      }
    }, { threshold: 0.1, ...options });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
```

### src/hooks/useCountUp.ts

```typescript
import { useEffect, useState } from 'react';

export function useCountUp(target: number, duration = 2000, startOnMount = false) {
  const [count, setCount] = useState(startOnMount ? 0 : target);
  const [started, setStarted] = useState(startOnMount);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return { count, start: () => setStarted(true) };
}
```

---

## STEP 5: SEO COMPONENTS

### src/components/seo/SEOHead.tsx

```typescript
import { Helmet } from 'react-helmet-async';
import { SITE } from '@/lib/constants';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  schema?: object | object[];
  lcpImage?: string; // Path to preload as LCP image
}

export function SEOHead({
  title, description, canonical, ogImage, ogType = 'website', noindex = false, schema, lcpImage,
}: SEOHeadProps) {
  const fullTitle    = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : SITE.url);
  const image        = ogImage || `${SITE.url}${SITE.ogImage}`;
  const schemas      = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* LCP image preload */}
      {lcpImage && <link rel="preload" as="image" href={lcpImage} />}

      {/* Open Graph */}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:type"        content={ogType} />
      <meta property="og:image"       content={image} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name"   content={SITE.name} />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />

      {/* JSON-LD */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
```

### src/components/seo/schemas/

Create one file per schema type. Each exports a function that accepts data and returns a valid JSON-LD object.

**OrganizationSchema.ts:**
```typescript
import { SITE } from '@/lib/constants';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      email: SITE.email,
      contactType: 'customer service',
    },
    sameAs: Object.values(SITE.social).filter(Boolean),
  };
}
```

**WebSiteSchema.ts:** includes `SearchAction` potentialAction with `query-input`.

**WebPageSchema.ts:** accepts `{ name, description, url, breadcrumbs? }`.

**ServiceSchema.ts:** accepts `{ name, description, url, provider?, areaServed? }`.

**FAQSchema.ts:** accepts `questions: Array<{ question: string; answer: string }>`.

**BreadcrumbSchema.ts:** accepts `items: Array<{ name: string; url: string }>`.

**ArticleSchema.ts:** accepts `{ headline, description, url, datePublished, dateModified, author, image }`.

---

## STEP 6: SECTION COMPONENTS

Build in `src/components/sections/`. Follow the architecture's Component Specifications exactly.

**Universal rules for ALL section components:**

1. **Content via props, never hardcoded.** Every text string, image, link, and label must come through a prop. The component is a template; the page provides the content.

2. **Scroll animation pattern:**
```typescript
const { ref, isVisible } = useIntersection();

<div
  ref={ref as React.RefObject<HTMLDivElement>}
  className={cn('transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
>
```

3. **Stagger children:** When a section has repeating items (feature cards, testimonials, team members), stagger their animation delays:
```typescript
items.map((item, i) => (
  <div key={i} style={{ transitionDelay: `${i * 100}ms` }} className={...}>
```

4. **Semantic HTML:**
- Hero: `<section>` with `role="banner"` if it's the primary hero
- Feature sections: `<section>` with a descriptive `aria-labelledby` pointing to the section heading
- Lists of cards: `<ul>` / `<li>` for screen reader list navigation

5. **Heading levels as props where needed:**
- When a section has a heading, accept a `headingLevel?: 'h1' | 'h2' | 'h3'` prop (default `h2`)
- This prevents heading hierarchy violations when sections are reused

---

### Hero.tsx

Variants based on blueprint (always implement the one specified, stub the others):

**Variant: Centered Text + Background**
```typescript
interface HeroProps {
  eyebrow?: string;        // Small label above heading
  heading: string;         // H1 — contains primary keyword
  subheading?: string;     // Supporting description
  primaryCTA: { text: string; href: string; };
  secondaryCTA?: { text: string; href: string; };
  backgroundImage?: string; // Optional: URL for bg image
  gradient?: boolean;       // Optional: use brand gradient background
  lcpImage?: string;        // If hero has an image — pass to SEOHead for preload
}
```

The heading renders as `<h1>` — there must be exactly one h1 per page and it lives in the Hero for most pages.

Entrance animations: heading fades in at 0ms, subheading at 150ms, CTAs at 300ms.

**Variant: Split (text left, image right):**
- Desktop: 2-column grid, content left col, image right col
- Tablet: same with reduced padding
- Mobile: stacked, image below text

---

### Features.tsx

```typescript
interface Feature {
  icon?: React.ReactNode; // lucide-react icon
  title: string;
  description: string;
  link?: { text: string; href: string; };
}

interface FeaturesProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;      // Grid columns on desktop
  variant?: 'cards' | 'list' | 'alternating';
}
```

Desktop: `columns` prop controls grid. Mobile: always 1 column.

---

### Testimonials.tsx

```typescript
interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;  // URL or initials fallback
  rating?: 1 | 2 | 3 | 4 | 5;
}

interface TestimonialsProps {
  heading?: string;
  testimonials: Testimonial[];
  variant?: 'grid' | 'carousel' | 'featured';
}
```

For `carousel` variant: use CSS scroll snapping (no library needed) with prev/next buttons. Add `role="region"`, `aria-roledescription="carousel"`, `aria-live="polite"`.

Avatar: if `avatar` URL provided, render `<img>`. If not, generate initials from `author` name in a colored circle.

---

### Stats.tsx

```typescript
interface Stat {
  value: number;
  suffix?: string;   // e.g., '+', '%', 'k'
  prefix?: string;   // e.g., '£', '$'
  label: string;
  description?: string;
}

interface StatsProps {
  heading?: string;
  stats: Stat[];
  background?: 'white' | 'primary' | 'dark';
}
```

Use `useCountUp` hook + `useIntersection` to trigger counting when section enters viewport.

---

### CTA.tsx

```typescript
interface CTAProps {
  heading: string;
  subheading?: string;
  primaryCTA: { text: string; href: string; };
  secondaryCTA?: { text: string; href: string; };
  variant?: 'centered' | 'split' | 'banner';
  background?: 'primary' | 'gradient' | 'dark';
}
```

---

### FAQ.tsx

```typescript
interface FAQItem { question: string; answer: string; }

interface FAQProps {
  heading?: string;
  items: FAQItem[];
  columns?: 1 | 2;
}
```

Implement without a library using CSS grid animation:
```typescript
// Each item:
const [open, setOpen] = useState(false);

<div style={{ gridTemplateRows: open ? '1fr' : '0fr' }} className="grid transition-all duration-300">
  <div className="overflow-hidden">
    {answer}
  </div>
</div>
```

Keyboard: Enter/Space to toggle, arrow keys to navigate between items.
Include `aria-expanded`, `aria-controls` on the trigger button.

---

### ContactForm.tsx

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email address'),
  phone:   z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;
```

States: idle → submitting (button shows spinner) → success (form replaced with confirmation) → error (error message shown, form remains).

Never clear the form on error — preserve the user's input.

---

### Additional sections from architecture:

For each additional section in the architecture Component List, build it following the same patterns:
- Props-driven content
- `useIntersection` for scroll animation
- Semantic HTML
- Mobile-first responsive with Tailwind

Use the `@21st-dev/magic` MCP if available for complex section layouts — it generates high-quality, styled components. Prompt it with: `"Create a [section type] component using React + TypeScript + Tailwind CSS with [specific requirements from architecture]"`. Adapt the output to use the project's design tokens.

If `@21st-dev/magic` is unavailable, build manually following the spec.

---

## STEP 7: BUILD PAGES

For each page in the architecture sitemap:

### Page file structure:

```typescript
// src/pages/[PageName].tsx
import { SEOHead } from '@/components/seo/SEOHead';
import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/sections/Hero';
// ... import all sections for this page
import { buildWebPageSchema, buildServiceSchema } from '@/components/seo/schemas';
import { SEO_DATA } from '@/data/seo';  // All page SEO from architecture

const PAGE = SEO_DATA.home; // (or .about, .services, etc.)

export default function Home() {
  return (
    <>
      <SEOHead
        title={PAGE.title}
        description={PAGE.description}
        canonical={PAGE.canonical}
        schema={[buildOrganizationSchema(), buildWebSiteSchema()]}
        lcpImage="/images/hero.webp"
      />
      <Hero
        eyebrow="[from architecture content spec]"
        heading="[exact H1 from architecture SEO plan]"
        subheading="[from architecture content spec]"
        primaryCTA={{ text: '[CTA text]', href: '/contact' }}
        gradient
      />
      {/* ... all sections for this page in order */}
    </>
  );
}
```

### Content rules:

**Use architecture content specs.** Every page in the architecture has content requirements. Use them.

**If real content isn't available**, generate realistic placeholder copy following these rules:
- Match the tone of voice from the blueprint (professional/friendly/authoritative/etc.)
- Match the word count targets from the blueprint
- Use realistic company names, person names, job titles, statistics — never "Company Name", "John Doe", "50%"
- Mark every placeholder with a TODO comment:
  ```typescript
  // TODO: Replace with real client testimonial
  const testimonials = [...]
  ```
- Never use "Lorem ipsum" — it signals unprofessionalism and breaks SEO review

**Heading hierarchy per page — strict rule:**
- H1: exactly one, from the architecture SEO plan, inside Hero component
- H2: major section headings (Features heading, Testimonials heading, etc.)
- H3: sub-items within sections (individual feature titles, FAQ questions, team member names)
- H4: rarely needed — only for nested content like blog post sidebars
- Never skip a level (H1 → H3 without H2)

**Internal links:** Add every internal link specified in the architecture SEO plan. Use descriptive anchor text, never "click here" or "read more" alone.

---

## STEP 8: ROUTING (App.tsx)

```typescript
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';

// Lazy load all pages for code splitting
const Home        = lazy(() => import('@/pages/Home'));
const About       = lazy(() => import('@/pages/About'));
// ... one import per page from architecture sitemap
const NotFound    = lazy(() => import('@/pages/NotFound'));
const Privacy     = lazy(() => import('@/pages/PrivacyPolicy'));
const Terms       = lazy(() => import('@/pages/Terms'));

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Loading fallback — match brand background color
function PageLoader() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout transparentNav />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route element={<Layout />}>
              <Route path="/about"   element={<About />} />
              {/* All other routes from architecture sitemap */}
              <Route path="*"        element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
```

Note: Homepage uses `<Layout transparentNav>` only if the blueprint specifies a transparent hero nav. All other pages use `<Layout>` (solid nav).

### vite.config.ts — add path alias:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          seo:    ['react-helmet-async'],
        },
      },
    },
  },
});
```

Also add `"paths": { "@/*": ["./src/*"] }` to `tsconfig.json` under `compilerOptions`.

---

## STEP 9: SITE-WIDE SEO FILES (public/)

### public/sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- One <url> block per page from the architecture sitemap -->
  <url>
    <loc>https://[domain]/</loc>
    <lastmod>[build date YYYY-MM-DD]</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... all other pages -->
</urlset>
```

### public/robots.txt

```
User-agent: *
Allow: /
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://[domain]/sitemap.xml
```

### public/llms.txt

```markdown
# [Company Name]

> [One-sentence description from architecture]

[2-3 sentence expanded description]

## Services
[list from architecture]

## Key Pages
- [Homepage](https://[domain]/)
- [About](https://[domain]/about)
[... all main pages]

## Contact
- Email: [from SITE constants]
- Phone: [from SITE constants]
```

### public/manifest.json

```json
{
  "name": "[Company Name]",
  "short_name": "[Brand]",
  "description": "[SITE.description]",
  "start_url": "/",
  "display": "standalone",
  "background_color": "[background hex from blueprint]",
  "theme_color": "[primary color hex from blueprint]",
  "icons": [
    { "src": "/favicon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/favicon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Add `<link rel="manifest" href="/manifest.json">` to `index.html`.

---

## STEP 10: CONTENT POPULATION

### src/data/ files

Create one file per content type. Export typed arrays/objects.

**src/data/seo.ts** — the most important data file:
```typescript
// All per-page SEO data from architecture Section 3
// Never define SEO inline in page components
export const SEO_DATA = {
  home: {
    title: '[exact title from architecture — verified 50-60 chars]',
    description: '[exact description from architecture — verified 150-160 chars]',
    canonical: 'https://[domain]/',
    h1: '[H1 from architecture]',
  },
  about: { ... },
  // ... all pages
} as const;
```

**src/data/navigation.ts:**
```typescript
// Matches architecture navigation structure exactly
export const NAV_LINKS = [...] as const;
export const FOOTER_LINKS = { col1: [...], col2: [...], ... } as const;
```

**src/data/services.ts, testimonials.ts, faqs.ts, etc.:**
Each exports typed data matching the props expected by the relevant section component.

### Content quality rules:

- All headings: check they match the architecture spec
- All body copy: check it sounds human and matches the brand tone from the blueprint
- All CTAs: action verbs ("Get Started", "Book a Call", "Learn More", "Download Guide")
- Statistics: if placeholder stats are used, make them realistic for the industry and mark TODO
- Testimonials: if placeholder, generate realistic full names, job titles, company names — mark TODO
- Images: use placeholder service (`/placeholder.svg?height=X&width=Y`) with correct aspect ratio, mark TODO

---

## STEP 11: PRODUCTION BUILD & VERIFICATION

### 11.1 — Build

```bash
cd builds/[client-name]
npm run build
```

**TypeScript errors:** Fix every TypeScript error before proceeding. Acceptable to use `// @ts-expect-error` with a clear explanation on genuinely unresolvable cases. Never use broad `any` types — use `unknown` with type narrowing if the shape is uncertain.

**Build warnings to fix:**
- Chunk size warnings: add manual chunks to `vite.config.ts`
- Missing module warnings: add the missing import
- Unused variable warnings: remove the variable

### 11.2 — Local preview

```bash
npm run preview
```

Then verify each of the following:

**Functionality checklist:**
- [ ] Homepage loads at `/`
- [ ] All nav links work (no 404s)
- [ ] Mobile hamburger menu opens and closes
- [ ] Skip-to-content link works (Tab on page load)
- [ ] Contact form validates client-side (submit with empty fields)
- [ ] Contact form shows loading state on submit
- [ ] All `<a>` tags with `href="#..."` scroll smoothly
- [ ] Browser back/forward navigation works correctly

**SEO checklist:**
- [ ] `<title>` is correct on every page (view-source or DevTools)
- [ ] `<meta description>` is present and unique per page
- [ ] `<link rel="canonical">` is present per page
- [ ] JSON-LD script exists on every page
- [ ] `<h1>` exists and is unique per page
- [ ] `sitemap.xml` is accessible at `/sitemap.xml`
- [ ] `robots.txt` is accessible at `/robots.txt`
- [ ] `llms.txt` is accessible at `/llms.txt`

**Responsive checklist (test in Chrome DevTools):**
- [ ] Mobile 375px: no horizontal scroll, text readable, CTA buttons tappable
- [ ] Tablet 768px: layout transitions correctly
- [ ] Desktop 1280px: full layout, no overflow

**Performance (in preview mode):**
- [ ] No console errors (red) in browser DevTools
- [ ] Images load correctly
- [ ] Fonts load correctly (no FOIT — flash of invisible text)
- [ ] Page transitions are smooth (no white flash)

---

## STEP 12: BUILD REPORT

Create `builds/[client-name]/BUILD-REPORT.md`:

```markdown
# BUILD REPORT — [Client Name]
**Generated by:** WD-01
**Build Date:** [YYYY-MM-DD]
**Build Directory:** builds/[client-name]/

---

## Pages Built

| Page | URL | Components | SEO Title ✓ | Meta ✓ | Schema ✓ | H1 ✓ | Status |
|------|-----|-----------|-------------|--------|---------|------|--------|
| Homepage | / | Hero, Features, Stats, Testimonials, CTA | ✓ | ✓ | ✓ | ✓ | Complete |
| ... | | | | | | | |

---

## Components Created

### UI Components (src/components/ui/)
- Button.tsx — 5 variants, 3 sizes, all states
- Card.tsx — 4 variants
- SectionWrapper.tsx
- Badge.tsx
- Input.tsx
- Textarea.tsx

### Layout Components (src/components/layout/)
- Navigation.tsx — sticky, transparent-to-solid, mobile hamburger
- Footer.tsx — [N]-column layout
- Layout.tsx

### SEO Components (src/components/seo/)
- SEOHead.tsx
- schemas/ — [list all schema files built]

### Section Components (src/components/sections/)
- [list all section files]

---

## SEO Implementation

| Page | Title (chars) | Description (chars) | H1 | Schema Types |
|------|--------------|--------------------|----|-------------|
| Homepage | [title] (XX) | [desc] (XXX) | ✓ | Organization, WebSite, WebPage |
| ... | | | | |

Site-wide:
- sitemap.xml: [N] URLs — ✓
- robots.txt: configured — ✓
- llms.txt: created — ✓
- Canonical URLs: ✓ on all pages

---

## Performance Notes
- Code splitting: ✓ — [N] lazy-loaded page chunks
- LCP image preloaded: ✓ — /images/hero.webp
- Font loading: ✓ — font-display:swap + preconnect
- Image lazy loading: ✓ — all below-fold images

---

## Known Issues & TODOs

### Content to replace (marked TODO in code):
- [ ] `src/data/testimonials.ts` — 3 placeholder testimonials need real client testimonials
- [ ] `src/data/services.ts` — descriptions need client review
- [ ] Hero image `/images/hero.webp` — placeholder, replace with client image
- [list all TODOs found in the code]

### Open issues:
- [any known bugs or incomplete items]

---

## Post-Build QA

1. Run Lighthouse check: `./scripts/lighthouse-check.sh https://[domain]`
2. Complete QA checklist: `qa/checklists/qa-checklist.md`
3. Submit sitemap in Google Search Console
4. Verify GA4 data flowing

---

**BUILD STATUS:** Complete — Ready for client review
```

---

## ERROR HANDLING

### Architecture Not Found
```
Architecture file not found at: [path]

Available architectures:
[list files in blueprints/architectures/]

Please specify the correct path or run MODE: ARCHITECT first.
```

### Build Fails (TypeScript / Vite errors)
Do not move on. Fix every error before proceeding to the next step. Report:
```
Build error encountered in Step [N]:
[error message]

Diagnosing...
[diagnosis]

Fix applied:
[description of fix]

Retrying build...
```

### Missing Component Specification
If the architecture lists a component but the spec is unclear:
```
Component "[name]" is listed in the architecture but the specification is incomplete.
Making the following implementation decision: [decision]
This is noted in the BUILD REPORT under Known Issues.
```

Always build *something* for every component. Never skip.

### 21st.dev MCP Unavailable
If the `@21st-dev/magic` MCP is not accessible during a complex component build:
- Build the component manually
- Note in BUILD REPORT: `[ComponentName] — built manually (21st.dev MCP unavailable)`
- Do not block the build or ask the user

### Form Handler Not Configured
If form submission endpoint (Formspree ID, EmailJS keys, etc.) is not yet set:
- Build the complete form UI with all validation
- Add a `// TODO: Add form endpoint` comment on the submit handler
- Log form data to console as a placeholder
- Note in BUILD REPORT

---

## QUALITY GATES

Before generating the Build Report, verify all of the following:

**Code quality:**
- [ ] Zero TypeScript errors (`tsc --noEmit` passes)
- [ ] No `any` types except those explicitly annotated with a justification comment
- [ ] All component props are typed with interfaces
- [ ] No hardcoded content in component files (all in data/ files)
- [ ] `cn()` used for all conditional class merging (no string concatenation)
- [ ] All images have `alt`, `width`, and `height` attributes
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] No `console.log` statements (except form submission placeholder)

**Accessibility:**
- [ ] Skip-to-content link present
- [ ] All interactive elements reachable via keyboard Tab
- [ ] All buttons have accessible labels
- [ ] All form fields have associated labels
- [ ] Images with meaningful content have descriptive alt text
- [ ] Color contrast meets 4.5:1 on all text (verify against blueprint colors)
- [ ] `aria-expanded` on hamburger and accordion triggers
- [ ] `role="navigation"` and `aria-label` on `<nav>`
- [ ] `role="contentinfo"` on `<footer>`

**SEO:**
- [ ] Exactly one H1 per page
- [ ] No heading levels skipped
- [ ] All pages have unique title tags within 50-60 characters
- [ ] All pages have unique meta descriptions within 150-160 characters
- [ ] All pages have canonical URLs
- [ ] JSON-LD is valid JSON (no syntax errors)
- [ ] sitemap.xml is valid XML
- [ ] llms.txt exists at public/llms.txt

**Build:**
- [ ] `npm run build` exits with code 0
- [ ] No build warnings
- [ ] All page routes return content (not blank)
- [ ] `npm run preview` runs without errors
