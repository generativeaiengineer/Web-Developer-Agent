import {
  getSession,
  updateSession,
  createSession,
  Session,
  Phase,
} from '../sessions/store.js';
import { runResearcher } from './researcher.js';
import { runArchitect }  from './architect.js';
import { runBuilder }    from './builder.js';
import { parseClaude }   from '../llm/claude.js';
import { PARSER_SYSTEM_PROMPT } from '../prompts/parser.js';
import {
  summarizeBlueprint,
  summarizeArchitecture,
} from '../utils/telegram-helpers.js';

export type SendFn = (text: string, options?: SendOptions) => Promise<number | void>;

export interface SendOptions {
  approvalButtons?: boolean;
  approvalType?:    'blueprint' | 'architecture';
  parseMode?:       'Markdown' | 'HTML';
}

// ─── Parse user input ──────────────────────────────────────────────────────────

interface ParsedInput {
  clientName:        string;
  brandingUrls:      string[];
  seoUrls:           string[];
  pageScope:         string | null;
  isPipelineRequest: boolean;
}

export async function parseUserInput(message: string): Promise<ParsedInput> {
  try {
    return await parseClaude<ParsedInput>(PARSER_SYSTEM_PROMPT, message);
  } catch {
    // Fallback: treat entire message as a branding URL if it looks like a URL
    const urlMatch = message.match(/https?:\/\/[^\s]+/g) ?? [];
    return {
      clientName:        'NewProject',
      brandingUrls:      urlMatch,
      seoUrls:           [],
      pageScope:         null,
      isPipelineRequest: urlMatch.length > 0,
    };
  }
}

// ─── Start Pipeline ────────────────────────────────────────────────────────────

export async function startPipeline(
  chatId:  number,
  message: string,
  send:    SendFn,
): Promise<void> {
  await send('🧠 Parsing your request...');

  const parsed = await parseUserInput(message);

  if (!parsed.isPipelineRequest) {
    await send(
      "I didn't detect a web build request. To start, send me something like:\n\n" +
      '`https://example.com/ design reference, https://competitor.com/ seo reference`\n\n' +
      'Or use `/help` for a full guide.',
    );
    return;
  }

  const session = createSession(chatId, {
    chatId,
    clientName:      parsed.clientName,
    phase:           'researching',
    brandingUrls:    parsed.brandingUrls,
    seoUrls:         parsed.seoUrls,
    originalRequest: message,
  });

  await send(
    `🚀 *Starting pipeline for: ${parsed.clientName}*\n\n` +
    `🎨 Branding sites: ${parsed.brandingUrls.join(', ') || '—'}\n` +
    `📈 SEO sites: ${parsed.seoUrls.join(', ') || '—'}\n\n` +
    `⠋ RESEARCHER mode starting...`,
    { parseMode: 'Markdown' },
  );

  await runResearcherPhase(session, send);
}

// ─── RESEARCHER Phase ──────────────────────────────────────────────────────────

async function runResearcherPhase(session: Session, send: SendFn): Promise<void> {
  updateSession(session.chatId, { phase: 'researching' });

  try {
    const result = await runResearcher(
      session.clientName,
      session.brandingUrls,
      session.seoUrls,
      async (text) => { await send(text); },
    );

    const summary = summarizeBlueprint(result.blueprintContent, session.clientName);

    updateSession(session.chatId, {
      phase:            'awaiting_blueprint_approval',
      blueprintPath:    result.blueprintPath,
      blueprintContent: result.blueprintContent,
    });

    await send(summary, { approvalButtons: true, approvalType: 'blueprint', parseMode: 'Markdown' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    updateSession(session.chatId, { phase: 'error', errorMessage: msg });
    await send(`❌ RESEARCHER failed: ${msg}\n\nUse /cancel to reset.`);
  }
}

// ─── ARCHITECT Phase ───────────────────────────────────────────────────────────

export async function runArchitectPhase(chatId: number, send: SendFn): Promise<void> {
  const session = getSession(chatId);
  if (!session?.blueprintContent) {
    await send('❌ No approved blueprint found. Please start a new pipeline.');
    return;
  }

  updateSession(chatId, { phase: 'architecturing' });
  await send('🏗️ ARCHITECT mode starting...');

  try {
    const result = await runArchitect(
      session.clientName,
      sanitize(session.clientName),
      session.blueprintContent,
      async (text) => { await send(text); },
    );

    const summary = summarizeArchitecture(result.architectureContent, session.clientName);

    updateSession(chatId, {
      phase:               'awaiting_architecture_approval',
      architecturePath:    result.architecturePath,
      architectureContent: result.architectureContent,
    });

    await send(summary, { approvalButtons: true, approvalType: 'architecture', parseMode: 'Markdown' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    updateSession(chatId, { phase: 'error', errorMessage: msg });
    await send(`❌ ARCHITECT failed: ${msg}\n\nUse /cancel to reset.`);
  }
}

// ─── BUILDER Phase ─────────────────────────────────────────────────────────────

export async function runBuilderPhase(chatId: number, send: SendFn): Promise<void> {
  const session = getSession(chatId);
  if (!session?.architectureContent) {
    await send('❌ No approved architecture found. Please start a new pipeline.');
    return;
  }

  updateSession(chatId, { phase: 'building' });

  // Estimate time based on scope
  const scope = extractPageCount(session.originalRequest);
  const estMin = scope <= 3 ? '10–15' : scope <= 6 ? '15–25' : '25–40';

  await send(
    `✅ Architecture approved!\n\n` +
    `🔨 *BUILDER mode starting*\n` +
    `Estimated time: ${estMin} minutes\n` +
    `Building: ${scope > 0 ? `${scope} pages` : 'all pages from architecture'}\n\n` +
    `_I'll send progress updates as each step completes._`,
    { parseMode: 'Markdown' },
  );

  try {
    const result = await runBuilder(
      session.clientName,
      sanitize(session.clientName),
      session.architectureContent,
      extractPageScope(session.originalRequest),
      async (text) => { await send(text); },
    );

    updateSession(chatId, {
      phase:           'complete',
      buildDir:        result.buildDir,
      buildReportPath: result.buildReportPath,
    });

    const statusEmoji = result.success ? '✅' : '⚠️';
    await send(
      `${statusEmoji} *Build complete for ${session.clientName}!*\n\n` +
      `📁 Build directory: \`${result.buildDir}\`\n\n` +
      `*To preview locally:*\n` +
      `\`\`\`\ncd "${result.buildDir}"\nnpm run preview\n\`\`\`\n\n` +
      `*To deploy:*\n` +
      `\`\`\`\n./scripts/deploy.sh --server [IP] --domain [domain] --build-dir "${result.buildDir}/dist" --ssl\n\`\`\`\n\n` +
      `Run /status for the full build report.`,
      { parseMode: 'Markdown' },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    updateSession(chatId, { phase: 'error', errorMessage: msg });
    await send(`❌ BUILDER failed: ${msg}\n\nCheck the build directory for partial output.`);
  }
}

// ─── Apply Changes (revisions) ─────────────────────────────────────────────────

export async function applyBlueprintRevision(
  chatId:  number,
  notes:   string,
  send:    SendFn,
): Promise<void> {
  const session = getSession(chatId);
  if (!session?.blueprintContent) return;

  await send('✏️ Applying revisions to blueprint...');

  // Re-run researcher with revision notes appended
  updateSession(chatId, { phase: 'researching' });
  const updatedSession = { ...session, originalRequest: `${session.originalRequest}\n\nRevisions requested: ${notes}` };
  await runResearcherPhase(updatedSession, send);
}

export async function applyArchitectureRevision(
  chatId: number,
  notes:  string,
  send:   SendFn,
): Promise<void> {
  const session = getSession(chatId);
  if (!session?.blueprintContent) return;

  await send('✏️ Applying revisions to architecture...');
  updateSession(chatId, { phase: 'architecturing' });
  // Re-run architect with revision note added to blueprint
  const revisedBlueprint = `${session.blueprintContent}\n\n---\n## REVISION NOTES\n${notes}`;
  updateSession(chatId, { blueprintContent: revisedBlueprint });
  await runArchitectPhase(chatId, send);
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function sanitize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractPageCount(message: string): number {
  const match = message.match(/(\d+)\s*pages?/i);
  return match ? parseInt(match[1], 10) : 0;
}

function extractPageScope(message: string): string | null {
  const match = message.match(/(\d+\s*pages?[^,.]*|homepage only|full site)/i);
  return match ? match[0] : null;
}
