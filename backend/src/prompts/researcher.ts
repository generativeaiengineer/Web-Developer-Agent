import fs from 'fs';
import path from 'path';
import { getSkillsDir, getBlueprintTemplatePath } from '../utils/paths.js';

export function buildResearcherPrompt(): string {
  const skillPath    = path.join(getSkillsDir(), 'researcher-mode', 'skill.md');
  const templatePath = getBlueprintTemplatePath();

  const skillContent    = fs.existsSync(skillPath)    ? fs.readFileSync(skillPath, 'utf-8')    : '[researcher skill not found]';
  const templateContent = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf-8') : '[blueprint template not found]';

  return `You are WD-01, the Web Developer Agent. You are operating in RESEARCHER MODE.

${skillContent}

---

## Blueprint Template to Fill

When generating the blueprint, fill this template completely:

${templateContent}

---

## Tool Usage Instructions

You have access to the \`firecrawl_scrape\` tool. Use it to scrape each provided URL.
Scrape at minimum: homepage (/), about page, services/products page for BRANDING sites.
Scrape homepage and 2 inner pages for SEO sites.

After scraping all sites, generate the complete blueprint document following the template above.
Save the blueprint by outputting it as your final text response — the system will save it to disk.

Do NOT skip any section of the blueprint template. Fill every field.
Mark estimated/inferred values with [ESTIMATED].
`;
}
