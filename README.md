# WD-01 — Web Developer Agent

**System:** SKALO AI / NEXUS
**Agent ID:** WD-01
**Version:** 1.0.0

WD-01 is an AI-powered web developer agent that takes a project brief from zero to a production-ready, Lighthouse-optimized website. It operates in three sequential modes: **Researcher**, **Architect**, and **Builder**.

---

## Three Modes

### 1. Researcher
WD-01 gathers everything needed before writing a single line of code.

- Analyzes the client brief and goals
- Researches the target audience, competitors, and industry conventions
- Identifies required pages, sections, and content structure
- Sources design references, color palettes, and typography direction
- Outputs a completed **Blueprint** (`blueprints/templates/blueprint-template.md`)

### 2. Architect
WD-01 designs the full technical plan from the blueprint.

- Defines the component tree and folder structure
- Selects routing strategy, state management, and data-fetching approach
- Plans responsive breakpoints and layout system
- Identifies third-party dependencies and integration points
- Outputs a completed **Architecture** (`blueprints/architectures/templates/architecture-template.md`)

### 3. Builder
WD-01 implements the site from the approved architecture.

- Scaffolds the project inside `site-builder/`
- Builds all components, pages, and layouts
- Applies Tailwind CSS styling with mobile-first responsive design
- Validates against the QA checklist (`qa/checklists/qa-checklist.md`)
- Runs Lighthouse checks (`scripts/lighthouse-check.sh`)
- Outputs the final build to `builds/<project-name>/`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite 7 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Runtime | Node.js |

---

## Quality Standards

All sites must meet the minimums defined in `.claude/config/quality-standards.json`:

| Metric | Minimum |
|--------|---------|
| Lighthouse Performance | ≥ 90 |
| Lighthouse SEO | ≥ 95 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| FCP | < 1.8s |
| WCAG | 2.1 AA |
| Title tag | 50–60 chars |
| Meta description | 150–160 chars |
| Schema markup | Organization + WebPage minimum |

---

## Project Structure

```
.
├── .claude/
│   ├── agents/wd-01.md           # Agent definition
│   ├── skills/                   # Installed agent skills
│   └── config/
│       ├── mcp-servers.json
│       └── quality-standards.json
├── blueprints/
│   ├── templates/                # Blueprint templates
│   └── architectures/templates/  # Architecture templates
├── builds/                       # Final site outputs
├── qa/checklists/                # QA checklists
├── scripts/
│   └── lighthouse-check.sh      # Run Lighthouse audits
├── site-builder/                 # React + Vite base scaffold
└── docs/README.md                # Extended documentation
```

---

## Usage

### Start a new project

1. Fill in `blueprints/templates/blueprint-template.md` with the client brief
2. Invoke WD-01 in **Researcher** mode to complete the blueprint
3. Invoke WD-01 in **Architect** mode to produce the architecture doc
4. Invoke WD-01 in **Builder** mode to scaffold and build the site
5. Review `qa/checklists/qa-checklist.md` and sign off
6. Run `./scripts/lighthouse-check.sh <url>` to verify scores

### Run the site-builder dev server

```bash
cd site-builder
npm run dev
```

### Build for production

```bash
cd site-builder
npm run build
```
