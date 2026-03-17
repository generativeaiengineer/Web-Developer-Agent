import { Telegraf } from 'telegraf';
import { handleMessage }  from './handlers/message.js';
import { handleCallback } from './handlers/callback.js';
import { handleStart, handleHelp, handleStatus, handleCancel } from './handlers/commands.js';

export function createBot(): Telegraf {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN env var is not set');

  const bot = new Telegraf(token);

  // ── Commands ───────────────────────────────────────────────────────────────
  bot.start(handleStart);
  bot.help(handleHelp);
  bot.command('status', handleStatus);
  bot.command('cancel', handleCancel);

  // ── Inline button callbacks ────────────────────────────────────────────────
  bot.on('callback_query', handleCallback);

  // ── Text messages ──────────────────────────────────────────────────────────
  bot.on('text', handleMessage);

  // ── Error handling ────────────────────────────────────────────────────────
  bot.catch((err: unknown, ctx) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Bot error] Chat ${ctx.chat?.id}:`, msg);
    ctx.reply(`⚠️ An unexpected error occurred: ${msg.slice(0, 200)}`).catch(() => {});
  });

  return bot;
}
