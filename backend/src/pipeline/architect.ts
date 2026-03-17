import fs from 'fs';
import path from 'path';
import { callClaude, ProgressCallback } from '../llm/claude.js';
import { buildArchitectPrompt } from '../prompts/architect.js';
import { getArchitecturesDir } from '../utils/paths.js';

export interface ArchitectResult {
  architecturePath:    string;
  architectureContent: string;
}

export async function runArchitect(
  clientName:       string,
  clientSlug:       string,
  blueprintContent: string,
  onProgress:       ProgressCallback,
): Promise<ArchitectResult> {
  await onProgress('🏗️ Designing site architecture...');

  const userMessage = [
    `MODE: ARCHITECT`,
    `Client name: ${clientName}`,
    `Blueprint file: blueprints/${clientSlug}-blueprint.md`,
    ``,
    `## Approved Blueprint`,
    ``,
    blueprintContent,
    ``,
    `Please generate the complete site architecture document based on this blueprint.`,
  ].join('\n');

  const systemPrompt = buildArchitectPrompt();

  const architectureContent = await callClaude({
    systemPrompt,
    userMessage,
    onProgress: async (text) => {
      const firstLine = text.split('\n').find((l) => l.trim().length > 10) ?? '';
      if (firstLine) await onProgress(`📐 ${firstLine.slice(0, 120)}...`);
    },
    maxTokens: 8192,
  });

  // Save architecture to disk
  const archDir = getArchitecturesDir();
  fs.mkdirSync(archDir, { recursive: true });
  const architecturePath = path.join(archDir, `${clientSlug}-architecture.md`);
  fs.writeFileSync(architecturePath, architectureContent, 'utf-8');

  await onProgress(`✅ Architecture generated and saved.`);

  return { architecturePath, architectureContent };
}
