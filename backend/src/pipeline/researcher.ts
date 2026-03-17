import fs from 'fs';
import path from 'path';
import { callClaude, ProgressCallback } from '../llm/claude.js';
import { SCRAPE_TOOLS } from '../llm/tools.js';
import { buildFirecrawlExecutor } from '../integrations/firecrawl.js';
import { buildResearcherPrompt } from '../prompts/researcher.js';
import { getBlueprintsDir, sanitizeClientName } from '../utils/paths.js';

export interface ResearcherResult {
  blueprintPath:    string;
  blueprintContent: string;
  clientSlug:       string;
}

export async function runResearcher(
  clientName:   string,
  brandingUrls: string[],
  seoUrls:      string[],
  onProgress:   ProgressCallback,
): Promise<ResearcherResult> {
  const clientSlug = sanitizeClientName(clientName);

  // Build user message with categorized URLs
  const urlLines: string[] = [];
  if (brandingUrls.length > 0) {
    urlLines.push(`BRANDING SITES (analyze for design/visual style): ${brandingUrls.join(', ')}`);
  }
  if (seoUrls.length > 0) {
    urlLines.push(`SEO SITES (analyze for content structure/keywords): ${seoUrls.join(', ')}`);
  }

  const userMessage = [
    `MODE: RESEARCHER`,
    `Client name: ${clientName}`,
    ``,
    urlLines.join('\n'),
    ``,
    `Please analyze all provided sites and generate a complete blueprint.`,
    `Save the blueprint as: blueprints/${clientSlug}-blueprint.md`,
  ].join('\n');

  await onProgress('🔍 Scraping and analyzing sites with Firecrawl...');

  const systemPrompt = buildResearcherPrompt();

  const blueprintContent = await callClaude({
    systemPrompt,
    userMessage,
    tools: SCRAPE_TOOLS,
    executors: {
      firecrawl_scrape: buildFirecrawlExecutor(),
    },
    onProgress: async (text) => {
      // Only relay meaningful progress lines, not the full output
      const firstLine = text.split('\n').find((l) => l.trim().length > 10) ?? '';
      if (firstLine) await onProgress(`📊 ${firstLine.slice(0, 120)}...`);
    },
    maxTokens: 8192,
  });

  // Save blueprint to disk
  const blueprintsDir = getBlueprintsDir();
  fs.mkdirSync(blueprintsDir, { recursive: true });
  const blueprintPath = path.join(blueprintsDir, `${clientSlug}-blueprint.md`);
  fs.writeFileSync(blueprintPath, blueprintContent, 'utf-8');

  await onProgress(`✅ Blueprint generated and saved.`);

  return { blueprintPath, blueprintContent, clientSlug };
}
