import { Context } from 'telegraf';
import { getSession, updateSession } from '../../sessions/store.js';
import {
  runArchitectPhase,
  runBuilderPhase,
  SendFn,
} from '../../pipeline/orchestrator.js';
import { makeSendFn } from './message.js';

export async function handleCallback(ctx: Context): Promise<void> {
  if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

  const chatId = ctx.chat?.id;
  const data   = ctx.callbackQuery.data as string;
  if (!chatId) return;

  // Acknowledge the button tap to remove the loading spinner
  await ctx.answerCbQuery();

  const session = getSession(chatId);
  if (!session) {
    await ctx.reply('Session expired. Please start a new build.');
    return;
  }

  const send: SendFn = makeSendFn(ctx);

  // Remove the inline keyboard from the approval message
  if (session.approvalMessageId) {
    try {
      await ctx.telegram.editMessageReplyMarkup(chatId, session.approvalMessageId, undefined, { inline_keyboard: [] });
    } catch {
      // Ignore — message may have been deleted or is too old
    }
  }

  switch (data) {
    // ── Blueprint approvals ──────────────────────────────────────────────────
    case 'approve_blueprint':
      await ctx.reply('✅ Blueprint approved! Starting ARCHITECT mode...');
      await runArchitectPhase(chatId, send);
      break;

    case 'reject_blueprint':
      updateSession(chatId, { phase: 'error' });
      await ctx.reply(
        '❌ Blueprint rejected.\n\n' +
        'To restart, send me a new URL or describe what you want changed.\n' +
        'Use /cancel to fully reset.',
      );
      break;

    case 'notes_blueprint':
      updateSession(chatId, { phase: 'awaiting_blueprint_notes' });
      await ctx.reply(
        '📝 *Approve with Notes*\n\n' +
        'Send your revision notes as a reply and I\'ll apply them before continuing.',
        { parse_mode: 'Markdown' },
      );
      break;

    // ── Architecture approvals ───────────────────────────────────────────────
    case 'approve_architecture':
      await ctx.reply('✅ Architecture approved! Starting BUILDER mode...');
      await runBuilderPhase(chatId, send);
      break;

    case 'reject_architecture':
      updateSession(chatId, { phase: 'error' });
      await ctx.reply(
        '❌ Architecture rejected.\n\n' +
        'Use /cancel to reset and start over.',
      );
      break;

    case 'notes_architecture':
      updateSession(chatId, { phase: 'awaiting_architecture_notes' });
      await ctx.reply(
        '📝 *Approve with Notes*\n\n' +
        'Send your revision notes and I\'ll apply them to the architecture.',
        { parse_mode: 'Markdown' },
      );
      break;

    default:
      await ctx.reply(`Unknown action: ${data}`);
  }
}
