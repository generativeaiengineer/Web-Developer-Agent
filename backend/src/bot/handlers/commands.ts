import { Context } from 'telegraf';
import fs from 'fs';
import { getSession, deleteSession, hasActiveSession } from '../../sessions/store.js';

export async function handleStart(ctx: Context): Promise<void> {
  await ctx.reply(
    `👋 *Welcome to WD-01 — Web Developer Agent*\n\n` +
    `I build professional, SEO-optimized websites using a three-phase pipeline:\n\n` +
    `1️⃣ *RESEARCHER* — Analyzes competitor sites for design & SEO patterns\n` +
    `2️⃣ *ARCHITECT* — Designs the complete site architecture\n` +
    `3️⃣ *BUILDER* — Builds the full website with React + TypeScript\n\n` +
    `*To start a build, just send me your request:*\n\n` +
    `_Example:_\n` +
    `\`\`\`\nhttps://stripe.com/ for design inspiration\nhttps://braintree.com/ for seo reference\nclient: PayFlow\n3 pages only\n\`\`\`\n\n` +
    `Or just paste URLs and describe what you need in natural language.\n\n` +
    `Commands: /help /status /cancel`,
    { parse_mode: 'Markdown' },
  );
}

export async function handleHelp(ctx: Context): Promise<void> {
  await ctx.reply(
    `📖 *WD-01 Usage Guide*\n\n` +
    `*Starting a build:*\n` +
    `Send a message with your URLs and requirements. Examples:\n\n` +
    `• \`https://example.com design + https://competitor.com seo\`\n` +
    `• \`Build like zonneplan.nl but for solar installer ZonneWeb\`\n` +
    `• \`https://linear.app/ branding, https://notion.so/ seo — client: TaskFlow — 3 pages\`\n\n` +
    `*Approval flow:*\n` +
    `After each phase, you'll get inline buttons:\n` +
    `✅ *Approve* — continue to next phase\n` +
    `❌ *Reject* — cancel and restart\n` +
    `📝 *Approve with Notes* — continue with revision requests\n\n` +
    `*Commands:*\n` +
    `/status — Show current build status\n` +
    `/cancel — Cancel current job and reset\n` +
    `/help — This message\n\n` +
    `*Output locations:*\n` +
    `• Blueprints: \`blueprints/[client]-blueprint.md\`\n` +
    `• Architecture: \`blueprints/architectures/[client]-architecture.md\`\n` +
    `• Website: \`builds/[client]/\``,
    { parse_mode: 'Markdown' },
  );
}

export async function handleStatus(ctx: Context): Promise<void> {
  const chatId  = ctx.chat?.id;
  if (!chatId) return;

  const session = getSession(chatId);

  if (!session) {
    await ctx.reply('No active session. Send me a URL to start a build.');
    return;
  }

  const phaseLabels: Record<string, string> = {
    idle:                          '⬜ Idle',
    parsing:                       '🧠 Parsing request',
    researching:                   '🔍 RESEARCHER running',
    awaiting_blueprint_approval:   '⏸️ Awaiting blueprint approval',
    awaiting_blueprint_notes:      '📝 Awaiting revision notes',
    architecturing:                '🏗️ ARCHITECT running',
    awaiting_architecture_approval:'⏸️ Awaiting architecture approval',
    awaiting_architecture_notes:   '📝 Awaiting revision notes',
    building:                      '🔨 BUILDER running',
    complete:                      '✅ Build complete',
    error:                         '❌ Error',
  };

  const elapsed = Math.round((Date.now() - session.startedAt.getTime()) / 60_000);

  let statusText =
    `📊 *Build Status: ${session.clientName}*\n\n` +
    `Phase: ${phaseLabels[session.phase] ?? session.phase}\n` +
    `Started: ${elapsed} minutes ago\n\n`;

  if (session.blueprintPath && fs.existsSync(session.blueprintPath)) {
    statusText += `📋 Blueprint: \`${session.blueprintPath}\`\n`;
  }
  if (session.architecturePath && fs.existsSync(session.architecturePath)) {
    statusText += `📐 Architecture: \`${session.architecturePath}\`\n`;
  }
  if (session.buildDir && fs.existsSync(session.buildDir)) {
    statusText += `📁 Build: \`${session.buildDir}\`\n`;
    const distExists = fs.existsSync(`${session.buildDir}/dist/index.html`);
    statusText += `Build compiled: ${distExists ? '✅' : '⏳'}\n`;
  }
  if (session.errorMessage) {
    statusText += `\n❌ Error: ${session.errorMessage}`;
  }
  if (session.buildReportPath && fs.existsSync(session.buildReportPath)) {
    const report = fs.readFileSync(session.buildReportPath, 'utf-8');
    // Append first 500 chars of report
    statusText += `\n\n*Build Report (excerpt):*\n\`\`\`\n${report.slice(0, 500)}\n\`\`\``;
  }

  await ctx.reply(statusText, { parse_mode: 'Markdown' });
}

export async function handleCancel(ctx: Context): Promise<void> {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  if (!hasActiveSession(chatId)) {
    await ctx.reply('No active session to cancel.');
    return;
  }

  deleteSession(chatId);
  await ctx.reply('🛑 Session cancelled. Send me a new URL to start a fresh build.');
}
