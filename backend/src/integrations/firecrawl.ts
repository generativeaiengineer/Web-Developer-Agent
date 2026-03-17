import axios from 'axios';

const BASE_URL = 'https://api.firecrawl.dev/v1';

function getKey(): string {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) throw new Error('FIRECRAWL_API_KEY env var is not set');
  return key;
}

export interface ScrapeResult {
  markdown?: string;
  html?:     string;
  url:       string;
  title?:    string;
}

/** Scrape a single URL and return markdown + optional HTML */
export async function scrapeUrl(
  url: string,
  formats: string[] = ['markdown'],
): Promise<ScrapeResult> {
  try {
    const response = await axios.post(
      `${BASE_URL}/scrape`,
      { url, formats },
      {
        headers: {
          Authorization: `Bearer ${getKey()}`,
          'Content-Type': 'application/json',
        },
        timeout: 30_000,
      },
    );

    const data = response.data?.data ?? response.data;
    return {
      url,
      markdown: data?.markdown ?? '',
      html:     data?.html ?? '',
      title:    data?.metadata?.title ?? '',
    };
  } catch (err: unknown) {
    const e = err as { response?: { status?: number; data?: unknown }; message?: string };
    const status  = e.response?.status ?? 'unknown';
    const message = e.message ?? 'unknown error';
    return {
      url,
      markdown: `[Scrape failed: HTTP ${status} — ${message}]`,
    };
  }
}

/**
 * Build the firecrawl_scrape executor that Claude's tool loop calls.
 * Returns a function matching ToolExecutors['firecrawl_scrape']
 */
export function buildFirecrawlExecutor() {
  return async (args: { url: string; formats?: string[] }): Promise<string> => {
    const result = await scrapeUrl(args.url, args.formats ?? ['markdown']);
    const parts: string[] = [`## Scraped: ${result.url}`, `**Title:** ${result.title ?? '—'}`, ''];
    if (result.markdown) {
      parts.push('### Markdown Content', result.markdown);
    }
    return parts.join('\n');
  };
}
