import Anthropic from '@anthropic-ai/sdk';
import { executeTool, ToolExecutors } from './tools.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type ProgressCallback = (text: string) => void | Promise<void>;

export interface ClaudeCallOptions {
  systemPrompt: string;
  userMessage:  string;
  tools?:       Anthropic.Tool[];
  executors?:   ToolExecutors;
  onProgress?:  ProgressCallback;
  maxTokens?:   number;
  model?:       string;
}

/**
 * Call Claude with optional tool_use support.
 * Runs the tool-calling loop until Claude stops calling tools and returns text.
 * Calls onProgress with intermediate text blocks as they appear.
 */
export async function callClaude(options: ClaudeCallOptions): Promise<string> {
  const {
    systemPrompt,
    userMessage,
    tools = [],
    executors = {},
    onProgress,
    maxTokens = 8192,
    model = 'claude-sonnet-4-6',
  } = options;

  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userMessage },
  ];

  let finalText = '';

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      tools: tools.length > 0 ? tools : undefined,
      messages,
    });

    // Collect all text blocks from this response
    const textBlocks = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text);

    if (textBlocks.length > 0) {
      finalText = textBlocks.join('\n');
      if (onProgress) await onProgress(finalText);
    }

    // If stop_reason is 'end_turn' or 'max_tokens' with no tool calls → done
    if (response.stop_reason === 'end_turn' || response.stop_reason === 'max_tokens') {
      break;
    }

    // If stop_reason is 'tool_use', execute all tool calls
    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
      );

      // Add assistant's response (including tool_use blocks) to conversation
      messages.push({ role: 'assistant', content: response.content });

      // Execute all tool calls and collect results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolCall of toolUseBlocks) {
        if (onProgress) {
          await onProgress(`⚙️ Calling tool: \`${toolCall.name}\`...`);
        }

        const result = await executeTool(
          toolCall.name,
          toolCall.input as Record<string, unknown>,
          executors,
        );

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolCall.id,
          content: result,
        });
      }

      // Add tool results to conversation and continue
      messages.push({ role: 'user', content: toolResults });
      continue;
    }

    // Unknown stop_reason — break to avoid infinite loop
    break;
  }

  return finalText;
}

/**
 * Lightweight parse call — no tools, small token budget.
 * Used to extract structured data from user messages (URLs, client name, etc.).
 */
export async function parseClaude<T>(
  systemPrompt: string,
  userMessage:  string,
): Promise<T> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001', // Haiku for fast/cheap parsing
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  // Extract JSON from response (may be wrapped in ```json blocks)
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? text.match(/(\{[\s\S]*\})/);
  const jsonStr   = jsonMatch ? jsonMatch[1].trim() : text.trim();

  return JSON.parse(jsonStr) as T;
}
