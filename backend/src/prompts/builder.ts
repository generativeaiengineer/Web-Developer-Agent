import fs from 'fs';
import path from 'path';
import { getSkillsDir, getSiteBuilderDir } from '../utils/paths.js';

export function buildBuilderPrompt(buildDir: string, pageScope?: string): string {
  const skillPath = path.join(getSkillsDir(), 'builder-mode', 'skill.md');
  const skillContent = fs.existsSync(skillPath) ? fs.readFileSync(skillPath, 'utf-8') : '[builder skill not found]';

  return `You are WD-01, the Web Developer Agent. You are operating in BUILDER MODE.

${skillContent}

---

## Build Environment

The site-builder template has already been copied to:
  ${buildDir}

You MUST use the provided tools (write_file, read_file, run_command, list_dir) to create all files.
All relative paths in write_file/read_file are resolved from: ${buildDir}

The site-builder base is at: ${getSiteBuilderDir()}
Use read_file to inspect existing files if needed.

---

## Page Scope for This Build

${pageScope ?? 'Build all pages specified in the architecture.'}

---

## Critical Instructions

1. Use write_file to create EVERY source file (components, pages, data, config, public files).
2. After creating all files, use run_command to run: npm install [deps from architecture]
3. Then run: npm run build
4. Fix any TypeScript or build errors before reporting complete.
5. Use run_command to generate the BUILD-REPORT.md content, then write_file to save it.
6. When the build passes with zero errors, output a summary as your final text response.

Always use Tailwind CSS v4 with CSS @theme directive — NOT tailwind.config.ts.
All design tokens go in src/index.css inside the @theme block.
`;
}
