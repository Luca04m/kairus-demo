import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { spawnClaudeCli } from '@/lib/ai/claude-cli';
import { getAgentPrompt } from '@/lib/ai/agents';

// Claude CLI models por agente — Claude Max subscription, sem API keys
const AGENT_CLI_MODELS = {
  financeiro: 'claude-sonnet-4-6',
  ecommerce: 'claude-sonnet-4-6',
  estoque: 'claude-haiku-4-5-20251001',
  orquestrador: 'claude-opus-4-6',
} as const;

type AgentModel = (typeof AGENT_CLI_MODELS)[keyof typeof AGENT_CLI_MODELS];

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, agentId = 'financeiro', sessionId } = body;

    if (!messages?.length) {
      return new Response(
        JSON.stringify({ error: 'Nenhuma mensagem encontrada' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build full conversation context for multi-turn support
    // Extract text from each message (supports string content and parts array)
    function extractText(msg: { content?: string; parts?: Array<{ type: string; text?: string }> }): string {
      if (typeof msg.content === 'string') return msg.content;
      return msg.parts?.find((p) => p.type === 'text')?.text || '';
    }

    const conversationLines: string[] = [];
    for (const msg of messages) {
      const text = extractText(msg);
      if (!text.trim()) continue;
      const role = msg.role === 'user' ? 'Usuario' : 'Assistente';
      conversationLines.push(`[${role}]\n${text}`);
    }

    // The last user message is what we send as the prompt
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
    const lastUserText = lastUserMessage ? extractText(lastUserMessage) : '';

    if (!lastUserText.trim()) {
      return new Response(
        JSON.stringify({ error: 'Mensagem vazia' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If multi-turn (more than 1 message), include conversation history in the prompt
    const userText = conversationLines.length > 1
      ? `Historico da conversa:\n${conversationLines.slice(0, -1).join('\n\n')}\n\n---\n\nMensagem atual do usuario:\n${lastUserText}`
      : lastUserText;

    const model: AgentModel =
      AGENT_CLI_MODELS[agentId as keyof typeof AGENT_CLI_MODELS] || AGENT_CLI_MODELS.financeiro;
    const systemPrompt = getAgentPrompt(agentId);

    // Spawn Claude CLI and get text stream
    const { stream: cliStream, sessionId: newSessionId } = spawnClaudeCli({
      prompt: userText,
      systemPrompt,
      model,
      maxTurns: 3,
      sessionId: sessionId || undefined,
      timeoutMs: 90000,
    });

    // Create a UIMessageStream that pipes Claude CLI text into AI SDK protocol
    const uiStream = createUIMessageStream({
      execute: async ({ writer }) => {
        const partId = crypto.randomUUID();

        writer.write({ type: 'start' });
        writer.write({ type: 'text-start', id: partId });

        const reader = cliStream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              writer.write({ type: 'text-delta', id: partId, delta: value });
            }
          }
        } finally {
          reader.releaseLock();
        }

        writer.write({ type: 'text-end', id: partId });
        writer.write({ type: 'finish', finishReason: 'stop' });
      },
    });

    // Resolve session ID and pass it in custom headers
    const resolvedSessionId = await newSessionId;
    return createUIMessageStreamResponse({
      stream: uiStream,
      headers: {
        'X-Session-Id': resolvedSessionId || '',
      },
    });
  } catch (error) {
    console.error('[/api/chat] Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Erro ao processar mensagem. Verifique se o Claude Code CLI esta instalado e logado.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
