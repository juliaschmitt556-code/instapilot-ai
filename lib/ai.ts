import type { ReplyDraft } from './types';

export type ReplyContext = {
  comment: string;
  caption?: string;
  brandVoice?: string;
  tone: string;
  instructions?: string;
};

const prohibitedClaims = [/guarantee/i, /90% off/i, /medical/i, /private/i];

export function containsUnsafeClaim(text: string) {
  return prohibitedClaims.some((pattern) => pattern.test(text));
}

async function generateWithGroq(context: ReplyContext): Promise<ReplyDraft[]> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.55,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You draft safe public Instagram replies. Never invent availability, prices, shipping outcomes, product facts, or private details. Return JSON only with a drafts array. Each item must have tone, text, confidence (0-100 integer), and rationale.' },
        { role: 'user', content: JSON.stringify({ originalComment: context.comment, caption: context.caption, brandVoice: context.brandVoice, requestedTone: context.tone, instructions: context.instructions }) },
      ],
    }),
  });
  if (!response.ok) throw new Error(`Groq request failed with ${response.status}.`);
  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error('Groq returned no draft content.');
  const parsed = JSON.parse(content) as { drafts?: ReplyDraft[] };
  if (!Array.isArray(parsed.drafts) || parsed.drafts.length === 0) throw new Error('Groq returned an invalid draft shape.');
  const safe = parsed.drafts.filter((draft) => typeof draft.text === 'string' && !containsUnsafeClaim(draft.text)).slice(0, 3);
  if (!safe.length) throw new Error('Groq returned no safe draft content.');
  return safe;
}

export async function generateReplyDrafts(context: ReplyContext): Promise<ReplyDraft[]> {
  if (!context.comment.trim()) throw new Error('The original comment is required to draft a reply.');
  if (!process.env.GROQ_API_KEY) throw new Error('Groq is not configured. Add GROQ_API_KEY on the server.');
  return generateWithGroq(context);
}
