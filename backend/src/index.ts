import 'dotenv/config';
import http from 'http';
import { createBot } from './bot/telegram.js';

// ── Validate required env vars ────────────────────────────────────────────────
const required = ['TELEGRAM_BOT_TOKEN', 'ANTHROPIC_API_KEY', 'PROJECT_ROOT'];
const missing  = required.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
  console.error(`   Copy .env.example to .env and fill in the values.`);
  process.exit(1);
}

const PORT = parseInt(process.env.PORT ?? '3000', 10);

// ── Health check HTTP server (for Nginx + monitoring) ─────────────────────────
function startHealthServer(): void {
  const server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status:  'ok',
      service: 'wd01-telegram-bot',
      uptime:  process.uptime(),
      time:    new Date().toISOString(),
    }));
  });
  server.listen(PORT, () => {
    console.log(`🌐 Health check running at http://localhost:${PORT}/`);
  });
}

// ── Start bot ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('🤖 WD-01 Telegram Bot starting...');
  console.log(`   Project root: ${process.env.PROJECT_ROOT}`);

  startHealthServer();

  const bot = createBot();

  // Graceful shutdown
  process.once('SIGINT',  () => { console.log('\n⏹ Stopping bot (SIGINT)...');  bot.stop('SIGINT');  });
  process.once('SIGTERM', () => { console.log('\n⏹ Stopping bot (SIGTERM)...'); bot.stop('SIGTERM'); });

  await bot.launch();
  console.log('✅ Bot is running. Send /start in Telegram to test.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
