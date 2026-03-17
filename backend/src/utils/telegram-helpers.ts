// Telegram message max length is 4096 chars (MarkdownV2)
const MAX_LENGTH = 4000;

/** Truncate a long string and add a note at the end */
export function truncateForTelegram(text: string, maxLen = MAX_LENGTH): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 60) + '\n\n_[...message truncated — see file on disk]_';
}

/** Escape special Markdown V2 characters */
export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

/** Split a long string into Telegram-sized chunks */
export function splitMessage(text: string, maxLen = MAX_LENGTH): string[] {
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    chunks.push(remaining.slice(0, maxLen));
    remaining = remaining.slice(maxLen);
  }
  return chunks;
}

/** Extract a short summary from a blueprint markdown document */
export function summarizeBlueprint(content: string, clientName: string): string {
  const lines = content.split('\n');

  const extract = (label: string): string => {
    const line = lines.find((l) => l.toLowerCase().includes(label.toLowerCase()));
    return line ? line.replace(/^[-*•]\s*/, '').trim() : '—';
  };

  const primaryColor = extract('Primary:') || extract('primary:');
  const headingFont  = extract('Heading Font:') || extract('heading:');
  const bodyFont     = extract('Body Font:') || extract('body:');
  const style        = extract('Overall Feel:') || extract('overall feel:');

  // Count keywords
  const kwSection = content.match(/## 4\. TARGET KEYWORDS[\s\S]*?(?=##|$)/)?.[0] ?? '';
  const kwCount   = (kwSection.match(/^\|/gm) ?? []).length - 2; // subtract header rows

  // Count components
  const compSection = content.match(/## 3\. COMPONENT LIST[\s\S]*?(?=##|$)/)?.[0] ?? '';
  const compCount   = (compSection.match(/^\|/gm) ?? []).length - 2;

  return [
    `📋 *Blueprint ready for ${clientName}*\n`,
    `🎨 *Design*`,
    `• Primary color: ${primaryColor}`,
    `• Heading font: ${headingFont}`,
    `• Body font: ${bodyFont}`,
    `• Style: ${style}`,
    ``,
    `📊 *Research*`,
    `• ${kwCount > 0 ? kwCount : '—'} target keywords identified`,
    `• ${compCount > 0 ? compCount : '—'} components planned`,
    ``,
    `_Full blueprint saved to disk. Tap Approve to continue to Architecture._`,
  ].join('\n');
}

/** Extract a short summary from an architecture markdown document */
export function summarizeArchitecture(content: string, clientName: string): string {
  // Count pages from sitemap table
  const sitemapSection = content.match(/## 1\. SITEMAP[\s\S]*?(?=## 2\.|$)/)?.[0] ?? '';
  const pageRows = (sitemapSection.match(/^\|.*\|$/gm) ?? []).filter(
    (r) => !r.includes('---') && !r.includes('Page') && !r.includes('page'),
  );

  // Count components
  const compSection = content.match(/## 2\. COMPONENT ARCHITECTURE[\s\S]*?(?=## 3\.|$)/)?.[0] ?? '';
  const compCount   = (compSection.match(/^####/gm) ?? []).length;

  // Extract install command
  const installMatch = content.match(/npm install ([^\n]+)/);
  const installCmd   = installMatch ? installMatch[1] : 'react-router-dom react-helmet-async lucide-react';

  return [
    `🏗️ *Architecture ready for ${clientName}*\n`,
    `📄 *${pageRows.length} pages planned*`,
    `🧩 *${compCount} components specified*`,
    ``,
    `📦 *Dependencies to install:*`,
    `\`npm install ${installCmd}\``,
    ``,
    `_Full architecture saved to disk. Tap Approve to start building._`,
  ].join('\n');
}
