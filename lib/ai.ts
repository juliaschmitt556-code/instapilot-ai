import { replyDrafts } from './sample-data';
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

export async function generateReplyDrafts(context: ReplyContext): Promise<ReplyDraft[]> {
  const safeContext = context.comment.trim();
  if (!safeContext) throw new Error('The original comment is required to draft a reply.');
  const matches = replyDrafts.filter((draft) => draft.tone.toLowerCase().includes(context.tone.toLowerCase()) || context.tone === 'Any');
  const drafts = matches.length ? matches : replyDrafts;
  return drafts.map((draft) => ({ ...draft, text: containsUnsafeClaim(draft.text) ? 'I can help with that. Please send us a DM so our team can confirm the details securely.' : draft.text }));
}
