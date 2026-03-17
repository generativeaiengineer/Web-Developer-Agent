import path from 'path';

export function getProjectRoot(): string {
  const root = process.env.PROJECT_ROOT;
  if (!root) throw new Error('PROJECT_ROOT env var is not set');
  return root;
}

export function getBlueprintsDir(): string {
  return path.join(getProjectRoot(), 'blueprints');
}

export function getArchitecturesDir(): string {
  return path.join(getProjectRoot(), 'blueprints', 'architectures');
}

export function getBuildsDir(): string {
  return path.join(getProjectRoot(), 'builds');
}

export function getSiteBuilderDir(): string {
  return path.join(getProjectRoot(), 'site-builder');
}

export function getSkillsDir(): string {
  return path.join(getProjectRoot(), '.claude', 'skills');
}

export function getBlueprintTemplatePath(): string {
  return path.join(getBlueprintsDir(), 'templates', 'blueprint-template.md');
}

export function getArchitectureTemplatePath(): string {
  return path.join(getArchitecturesDir(), 'templates', 'architecture-template.md');
}

/** Convert "My Client Name" → "my-client-name" */
export function sanitizeClientName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
