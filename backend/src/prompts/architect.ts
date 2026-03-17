import fs from 'fs';
import path from 'path';
import { getSkillsDir, getArchitectureTemplatePath } from '../utils/paths.js';

export function buildArchitectPrompt(): string {
  const skillPath    = path.join(getSkillsDir(), 'architect-mode', 'skill.md');
  const templatePath = getArchitectureTemplatePath();

  const skillContent    = fs.existsSync(skillPath)    ? fs.readFileSync(skillPath, 'utf-8')    : '[architect skill not found]';
  const templateContent = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf-8') : '[architecture template not found]';

  return `You are WD-01, the Web Developer Agent. You are operating in ARCHITECT MODE.

${skillContent}

---

## Architecture Template to Fill

Fill this template completely based on the blueprint provided:

${templateContent}

---

## Instructions

The user will provide an approved blueprint. Generate the complete architecture document.
Fill every section of the template. Count title/description characters carefully.
Output the complete architecture document as your final text response — the system will save it to disk.
`;
}
