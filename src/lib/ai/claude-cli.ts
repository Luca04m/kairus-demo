/**
 * Claude CLI spawn utility — server-side only.
 * Spawns `claude --print` as child_process and streams response as text chunks.
 * Based on Paperclip adapter patterns for stream-json parsing.
 */

import { spawn, type ChildProcess } from 'child_process';

export interface ClaudeCliOptions {
  prompt: string;
  systemPrompt: string;
  model: 'claude-opus-4-6' | 'claude-sonnet-4-6' | 'claude-haiku-4-5-20251001';
  maxTurns?: number;
  sessionId?: string;
  timeoutMs?: number;
}

interface ClaudeStreamEvent {
  type: string;
  subtype?: string;
  session_id?: string;
  model?: string;
  message?: {
    content?: Array<{ type: string; text?: string }>;
  };
  result?: string;
  total_cost_usd?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface SpawnResult {
  stream: ReadableStream<string>;
  sessionId: Promise<string | null>;
}

/**
 * Build a clean env that strips Claude Code nesting-guard variables.
 * This prevents the child claude process from detecting it's inside
 * another Claude Code session and refusing to run.
 */
function buildCleanEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  const keysToStrip = [
    'CLAUDECODE',
    'CLAUDE_CODE_ENTRYPOINT',
    'CLAUDE_CODE_SESSION',
    'CLAUDE_CODE_PARENT_SESSION',
  ];
  for (const key of keysToStrip) {
    delete env[key];
  }
  return env;
}

/**
 * Build CLI arguments for `claude` command.
 */
function buildArgs(options: ClaudeCliOptions): string[] {
  const args = ['--print', '--verbose', '--output-format', 'stream-json'];

  args.push('--model', options.model);

  if (options.sessionId) {
    args.push('--resume', options.sessionId);
  }

  if (options.maxTurns && options.maxTurns > 0) {
    args.push('--max-turns', String(options.maxTurns));
  }

  return args;
}

/**
 * Parse a single line of stream-json output from Claude CLI.
 * Returns extracted text content or null if no text in this event.
 */
function extractTextFromEvent(event: ClaudeStreamEvent): string | null {
  // assistant event with message.content containing text blocks
  if (event.type === 'assistant' && event.message?.content) {
    const texts: string[] = [];
    for (const block of event.message.content) {
      if (block.type === 'text' && block.text) {
        texts.push(block.text);
      }
    }
    return texts.length > 0 ? texts.join('') : null;
  }

  // result event may contain final text in "result" field
  if (event.type === 'result' && typeof event.result === 'string' && event.result.length > 0) {
    // Only return result text if there were no prior assistant messages
    // (the result field often duplicates the assistant output)
    return null;
  }

  return null;
}

/**
 * Spawns Claude Code CLI as child_process and returns a ReadableStream of text chunks.
 *
 * The stream emits plain text as it arrives from Claude.
 * The sessionId promise resolves to the session_id from the result event (for continuity).
 */
export function spawnClaudeCli(options: ClaudeCliOptions): SpawnResult {
  const args = buildArgs(options);
  const cleanEnv = buildCleanEnv();

  let resolveSessionId: (value: string | null) => void;
  const sessionIdPromise = new Promise<string | null>((resolve) => {
    resolveSessionId = resolve;
  });

  // Combine system prompt + user prompt for stdin
  const stdinContent = options.systemPrompt
    ? `[System instructions — follow these exactly]\n${options.systemPrompt}\n\n[User message]\n${options.prompt}`
    : options.prompt;

  let proc: ChildProcess | null = null;
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
  let killHandle: ReturnType<typeof setTimeout> | null = null;

  const stream = new ReadableStream<string>({
    start(controller) {
      let sessionFound = false;
      const stderrChunks: string[] = [];

      let child: ChildProcess;
      try {
        child = spawn('claude', args, {
          stdio: ['pipe', 'pipe', 'pipe'],
          env: cleanEnv,
          shell: false,
        });
        proc = child;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        controller.enqueue(
          `Erro ao iniciar Claude CLI: ${msg}. Verifique se o Claude Code esta instalado e acessivel no PATH.`
        );
        controller.close();
        resolveSessionId(null);
        return;
      }

      // Write prompt to stdin and close
      child.stdin?.write(stdinContent, 'utf-8');
      child.stdin?.end();

      // Collect stderr for error detection
      child.stderr?.on('data', (chunk: Buffer) => {
        stderrChunks.push(chunk.toString('utf-8'));
      });

      // Parse stdout line by line
      let buffer = '';
      let hasEmittedText = false;

      child.stdout?.on('data', (chunk: Buffer) => {
        buffer += chunk.toString('utf-8');
        const lines = buffer.split('\n');
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          let event: ClaudeStreamEvent;
          try {
            event = JSON.parse(trimmed);
          } catch {
            continue;
          }

          // Extract text content
          const text = extractTextFromEvent(event);
          if (text) {
            hasEmittedText = true;
            controller.enqueue(text);
          }

          // Track session_id from result event
          if (event.type === 'result' && event.session_id) {
            resolveSessionId(event.session_id);
            sessionFound = true;
          }
        }
      });

      // Handle process close
      child.on('close', (code) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (killHandle) clearTimeout(killHandle);

        // Process any remaining buffer
        if (buffer.trim()) {
          try {
            const event: ClaudeStreamEvent = JSON.parse(buffer.trim());
            const text = extractTextFromEvent(event);
            if (text) {
              hasEmittedText = true;
              controller.enqueue(text);
            }
            if (event.type === 'result' && event.session_id) {
              resolveSessionId(event.session_id);
              sessionFound = true;
            }
          } catch {
            // Not valid JSON
          }
        }

        // Check stderr for auth errors
        const stderr = stderrChunks.join('');
        const isAuthError =
          /not\s+logged\s+in|please\s+log\s+in|login\s+required|authentication\s+required|unauthorized/i.test(
            stderr
          );

        if (isAuthError) {
          controller.enqueue(
            '\n\nErro de autenticacao: O Claude CLI nao esta logado. Execute `claude login` no terminal para autenticar.'
          );
        } else if (code !== 0 && !hasEmittedText) {
          const stderrLine = stderr.split('\n').map((l) => l.trim()).find(Boolean) || '';
          controller.enqueue(
            `Erro ao processar com Claude CLI (codigo ${code}). ${stderrLine ? `Detalhe: ${stderrLine}` : 'Verifique se o Claude Code esta instalado corretamente.'}`
          );
        }

        if (!sessionFound) {
          resolveSessionId(null);
        }

        controller.close();
      });

      // Handle spawn error (e.g., command not found)
      child.on('error', (err) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (killHandle) clearTimeout(killHandle);

        const isNotFound = 'code' in err && (err as NodeJS.ErrnoException).code === 'ENOENT';
        controller.enqueue(
          isNotFound
            ? 'Erro: Comando `claude` nao encontrado. Instale o Claude Code CLI: https://docs.anthropic.com/en/docs/claude-code'
            : `Erro ao executar Claude CLI: ${err.message}`
        );
        resolveSessionId(null);
        controller.close();
      });

      // Timeout management: SIGTERM first, then SIGKILL after grace period
      const timeout = options.timeoutMs || 90000;
      timeoutHandle = setTimeout(() => {
        if (!child.killed) {
          child.kill('SIGTERM');
          killHandle = setTimeout(() => {
            if (!child.killed) {
              child.kill('SIGKILL');
            }
          }, 5000);
        }
      }, timeout);
    },

    cancel() {
      if (proc && !proc.killed) {
        proc.kill('SIGTERM');
        setTimeout(() => {
          if (proc && !proc.killed) {
            proc.kill('SIGKILL');
          }
        }, 2000);
      }
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (killHandle) clearTimeout(killHandle);
      resolveSessionId(null);
    },
  });

  return {
    stream,
    sessionId: sessionIdPromise,
  };
}
