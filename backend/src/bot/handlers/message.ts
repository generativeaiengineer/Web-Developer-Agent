import { Context } from 'telegraf';
import { getSession, updateSession, hasActiveSession } from '../../sessions/store.js';
import {
  startPipeline,
  applyBlueprintRevision,
  applyArchitectureRevision,
  SendFn,
} from '../../pipeline/orchestrator.js';

/** Build a SendFn that sends messages back to the given chat */
export function makeSendFn(ctx: Context): SendFn {
  return async (text, options) => {
    const parseMode = options?.parseMode ?? 'Markdown';

    if (options?.approvalButtons) {
      const type = options.approvalType ?? 'blueprint';
      const label = type === 'blueprint' ? 'Blueprint' : 'Architecture';

      const message = await ctx.reply(text, {
        parse_mode: parseMode,
        reply_markup: {
          inline_keyboard: [
            [
              { text: `✅ Approve ${label}`, callback_data: `approve_${type}` },
              { text: '❌ Reject',          callback_data: `reject_${type}` },
            ],
            [
              { text: '📝 Approve with Notes', callback_data: `notes_${type}` },
            ],
          ],
        },
      });

      // Store the message ID so we can remove buttons after a tap
      const chatId = ctx.chat?.id;
      if (chatId) {
        updateSession(chatId, { approvalMessageId: message.message_id });
      }

      return message.message_id;
    }

    // Plain message — split if too long
    const MAX = 4000;
    if (text.length <= MAX) {
      await ctx.reply(text, { parse_mode: parseMode });
    } else {
      // Send in chunks
      let remaining = text;
      while (remaining.length > 0) {
        const chunk = remaining.slice(0, MAX);
        remaining = remaining.slice(MAX);
        await ctx.reply(chunk, { parse_mode: parseMode });
      }
    }
  };
}

/** Handle incoming text messages */
export async function handleMessage(ctx: Context): Promise<void> {
  if (!ctx.message || !('text' in ctx.message)) return;

  const chatId  = ctx.chat?.id;
  const text    = ctx.message.text.trim();
  if (!chatId || !text) return;

  // Check TELEGRAM_ALLOWED_CHAT_ID restriction
  const allowedId = process.env.TELEGRAM_ALLOWED_CHAT_ID;
  if (allowedId && String(chatId) !== allowedId) {
    await ctx.reply('⛔ This bot is restricted. Contact the admin for access.');
    return;
  }

  const session  = getSession(chatId);
  const send     = makeSendFn(ctx);

  // If we're waiting for revision notes, apply them
  if (session?.phase === 'awaiting_blueprint_notes') {
    await applyBlueprintRevision(chatId, text, send);
    return;
  }

  if (session?.phase === 'awaiting_architecture_notes') {
    await applyArchitectureRevision(chatId, text, send);
    return;
  }

  // If there's an active job, tell the user to wait
  if (hasActiveSession(chatId) && session?.phase !== 'complete' && session?.phase !== 'error') {
    await ctx.reply(
      `⏳ A build is already running (phase: ${session?.phase}).\n` +
      `Use /status to check progress or /cancel to stop it.`,
    );
    return;
  }

  // Start a new pipeline
  await startPipeline(chatId, text, send);
}
