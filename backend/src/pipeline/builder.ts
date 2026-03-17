import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { callClaude, ProgressCallback } from '../llm/claude.js';
import { FILE_TOOLS, buildFileExecutors } from '../llm/tools.js';
import { buildBuilderPrompt } from '../prompts/builder.js';
import { getBuildsDir, getSiteBuilderDir } from '../utils/paths.js';

export interface BuilderResult {
  buildDir:        string;
  buildReportPath: string;
  success:         boolean;
  summary:         string;
}

export async function runBuilder(
  clientName:           string,
  clientSlug:           string,
  architectureContent:  string,
  pageScope:            string | null,
  onProgress:           ProgressCallback,
): Promise<BuilderResult> {
  const buildDir = path.join(getBuildsDir(), clientSlug);

  // Step 1: Copy site-builder template
  await onProgress('📁 Step 1/12: Setting up project...');
  fs.mkdirSync(getBuildsDir(), { recursive: true });

  if (!fs.existsSync(buildDir)) {
    execSync(`cp -r "${getSiteBuilderDir()}/." "${buildDir}"`, { stdio: 'pipe' });
    await onProgress('✅ Project template copied.');
  } else {
    await onProgress('ℹ️ Build directory already exists — using existing files.');
  }

  // Step 2: Call Claude with file-writing tools to build the site
  await onProgress('🔨 Step 2/12: Building components and pages...\n_This takes 10–20 minutes. I\'ll update you at each step._');

  const userMessage = [
    `MODE: BUILDER`,
    `Client name: ${clientName}`,
    `Build directory: ${buildDir}`,
    `Architecture file: blueprints/architectures/${clientSlug}-architecture.md`,
    pageScope ? `Page scope: ${pageScope}` : '',
    ``,
    `## Approved Architecture`,
    ``,
    architectureContent,
    ``,
    `Build the complete website following the architecture above.`,
    `Use the write_file, read_file, run_command, and list_dir tools to create all files.`,
    `Start with the Tailwind config, then UI components, then layout, then pages.`,
    `End with running npm install and npm run build.`,
    `Report each major step as you complete it.`,
  ]
    .filter(Boolean)
    .join('\n');

  const systemPrompt = buildBuilderPrompt(buildDir, pageScope ?? undefined);
  const fileExecutors = buildFileExecutors(buildDir);

  let stepCount = 0;
  const summary = await callClaude({
    systemPrompt,
    userMessage,
    tools: FILE_TOOLS,
    executors: fileExecutors,
    onProgress: async (text) => {
      // Look for step progress signals in Claude's output
      const stepMatch = text.match(/Step\s+(\d+)\/12[:\s]+(.+)/i);
      if (stepMatch) {
        stepCount++;
        await onProgress(`🔨 Step ${stepMatch[1]}/12: ${stepMatch[2].slice(0, 100)}`);
        return;
      }
      // Relay any meaningful progress
      const line = text.split('\n').find((l) => l.trim().length > 15) ?? '';
      if (line && stepCount % 3 === 0) {
        await onProgress(`⚙️ ${line.slice(0, 120)}`);
      }
      stepCount++;
    },
    maxTokens: 16000,
    model: 'claude-sonnet-4-6',
  });

  // Check if build succeeded
  const distExists = fs.existsSync(path.join(buildDir, 'dist', 'index.html'));
  const reportPath = path.join(buildDir, 'BUILD-REPORT.md');

  if (!distExists) {
    // Try running the build ourselves as a fallback
    await onProgress('⚠️ Running npm build manually...');
    try {
      execSync('npm run build', { cwd: buildDir, stdio: 'pipe', timeout: 300_000 });
    } catch {
      // Build failed — will be reported in summary
    }
  }

  const success = fs.existsSync(path.join(buildDir, 'dist', 'index.html'));
  await onProgress(success ? '✅ Production build complete!' : '⚠️ Build may need attention — check BUILD-REPORT.md');

  return {
    buildDir,
    buildReportPath: reportPath,
    success,
    summary,
  };
}
