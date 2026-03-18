# WD-01 — Web Developer Agent

**System:** SKALO AI / NEXUS

WD-01 is an AI-powered web developer agent that scaffolds, builds, and delivers production-ready websites from project blueprints.

---

## Project Structure

```
.
├── .claude/
│   ├── agents/
│   │   └── wd-01.md          # Agent definition and workflow
│   ├── skills/               # Installed agent skills
│   └── config/
│       ├── mcp-servers.json  # MCP server configuration
│       └── quality-standards.json
├── blueprints/
│   ├── templates/
│   │   └── blueprint-template.md
│   └── architectures/
│       └── templates/
│           └── architecture-template.md
├── builds/                   # Generated site outputs
├── qa/
│   └── checklists/
│       └── qa-checklist.md
├── scripts/
│   └── lighthouse-check.sh
├── site-builder/             # React + Vite + TS scaffold base
└── docs/
    └── README.md
```

## Workflow

1. Create a blueprint from `blueprints/templates/blueprint-template.md`
2. Define an architecture from `blueprints/architectures/templates/architecture-template.md`
3. WD-01 scaffolds the site in `site-builder/`
4. Build is validated against `qa/checklists/qa-checklist.md`
5. Lighthouse scores checked via `scripts/lighthouse-check.sh`
6. Final build output to `builds/<project-name>/`

## Tech Stack

- React 18 + Vite 7 + TypeScript
- Tailwind CSS v4
- Node.js

## Quality Standards

See `.claude/config/quality-standards.json` for score thresholds and code requirements.
