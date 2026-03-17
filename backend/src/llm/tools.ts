import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// ─── Tool Definitions (JSON Schema for Claude) ─────────────────────────────────

export const FILE_TOOLS: Anthropic.Tool[] = [
  {
    name: 'write_file',
    description: 'Write content to a file on disk. Creates parent directories if needed. Use relative paths from the build directory.',
    input_schema: {
      type: 'object' as const,
      properties: {
        path:    { type: 'string', description: 'File path relative to the build directory (e.g. src/components/ui/Button.tsx)' },
        content: { type: 'string', description: 'Full file content to write' },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'read_file',
    description: 'Read the content of an existing file. Use relative paths from the build directory or absolute paths.',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'File path to read' },
      },
      required: ['path'],
    },
  },
  {
    name: 'run_command',
    description: 'Run a shell command in the build directory (e.g. npm install, npm run build). Returns stdout + stderr.',
    input_schema: {
      type: 'object' as const,
      properties: {
        command: { type: 'string', description: 'Shell command to execute' },
        cwd:     { type: 'string', description: 'Optional: working directory for the command (defaults to build dir)' },
      },
      required: ['command'],
    },
  },
  {
    name: 'list_dir',
    description: 'List files and directories at a given path.',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'Directory path to list' },
      },
      required: ['path'],
    },
  },
];

export const SCRAPE_TOOLS: Anthropic.Tool[] = [
  {
    name: 'firecrawl_scrape',
    description: 'Scrape a single URL and return its content as markdown + HTML. Use this for branding and SEO analysis.',
    input_schema: {
      type: 'object' as const,
      properties: {
        url:     { type: 'string', description: 'URL to scrape' },
        formats: {
          type: 'array',
          items: { type: 'string', enum: ['markdown', 'html'] },
          description: 'Output formats to return (default: ["markdown"])',
        },
      },
      required: ['url'],
    },
  },
];

// ─── Tool Executors ────────────────────────────────────────────────────────────

export interface ToolExecutors {
  write_file?: (args: { path: string; content: string }) => string;
  read_file?:  (args: { path: string }) => string;
  run_command?:(args: { command: string; cwd?: string }) => string;
  list_dir?:   (args: { path: string }) => string;
  firecrawl_scrape?: (args: { url: string; formats?: string[] }) => Promise<string>;
}

/** Build file-system tool executors rooted at a specific directory */
export function buildFileExecutors(rootDir: string): ToolExecutors {
  return {
    write_file({ path: relPath, content }) {
      const absPath = path.isAbsolute(relPath) ? relPath : path.join(rootDir, relPath);
      fs.mkdirSync(path.dirname(absPath), { recursive: true });
      fs.writeFileSync(absPath, content, 'utf-8');
      return `✓ Written: ${relPath} (${content.length} chars)`;
    },

    read_file({ path: filePath }) {
      const absPath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);
      if (!fs.existsSync(absPath)) return `Error: file not found: ${filePath}`;
      return fs.readFileSync(absPath, 'utf-8');
    },

    run_command({ command, cwd }) {
      const workDir = cwd ?? rootDir;
      try {
        const output = execSync(command, {
          cwd: workDir,
          encoding: 'utf-8',
          timeout: 300_000, // 5 min max
          maxBuffer: 10 * 1024 * 1024,
        });
        return output || '(command completed with no output)';
      } catch (err: unknown) {
        const e = err as { stdout?: string; stderr?: string; message?: string };
        return `Error:\n${e.stderr ?? ''}\n${e.stdout ?? ''}\n${e.message ?? ''}`.trim();
      }
    },

    list_dir({ path: dirPath }) {
      const absPath = path.isAbsolute(dirPath) ? dirPath : path.join(rootDir, dirPath);
      if (!fs.existsSync(absPath)) return `Error: directory not found: ${dirPath}`;
      const entries = fs.readdirSync(absPath, { withFileTypes: true });
      return entries.map((e) => (e.isDirectory() ? `${e.name}/` : e.name)).join('\n');
    },
  };
}

/** Execute a tool call from Claude, given a name and parsed input */
export async function executeTool(
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: Record<string, any>,
  executors: ToolExecutors,
): Promise<string> {
  switch (name) {
    case 'write_file':
      if (!executors.write_file) return 'write_file not available';
      return executors.write_file(input as { path: string; content: string });

    case 'read_file':
      if (!executors.read_file) return 'read_file not available';
      return executors.read_file(input as { path: string });

    case 'run_command':
      if (!executors.run_command) return 'run_command not available';
      return executors.run_command(input as { command: string; cwd?: string });

    case 'list_dir':
      if (!executors.list_dir) return 'list_dir not available';
      return executors.list_dir(input as { path: string });

    case 'firecrawl_scrape':
      if (!executors.firecrawl_scrape) return 'firecrawl_scrape not available';
      return await executors.firecrawl_scrape(input as { url: string; formats?: string[] });

    default:
      return `Unknown tool: ${name}`;
  }
}
