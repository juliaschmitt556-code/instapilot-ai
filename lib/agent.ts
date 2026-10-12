import { ChatGroq } from '@langchain/groq';
import { createAgent, tool } from 'langchain';
import { z } from 'zod';
import { getScrapeCreatorsClient } from './scrapecreators';

const classifyComment = tool(
  async ({ comment }) => {
    const text = comment.toLowerCase();
    const category = /price|buy|order|available|shipping|size|link/.test(text) ? 'sales_lead' : /refund|broken|late|angry|bad|complaint|issue/.test(text) ? 'complaint' : /\?|how|when|where|can i/.test(text) ? 'question' : /buy now|dm me|promo code/.test(text) ? 'sales_lead' : /follow|like|love|beautiful|great/.test(text) ? 'praise' : 'other';
    return JSON.stringify({ category, reason: 'Deterministic first-pass classifier; the agent may refine this with public context.' });
  },
  { name: 'classify_comment', description: 'Classify a public Instagram comment as question, complaint, sales_lead, praise, spam, or other.', schema: z.object({ comment: z.string().min(1) }) },
);

const getProfile = tool(
  async ({ handle }) => {
    const client = getScrapeCreatorsClient();
    if (!client) return JSON.stringify({ unavailable: true, reason: 'SCRAPECREATORS_API_KEY is not configured.' });
    return JSON.stringify(await client.profile(handle));
  },
  { name: 'get_public_instagram_profile', description: 'Retrieve public Instagram profile data and recent posts by handle.', schema: z.object({ handle: z.string().min(1) }) },
);

const getPost = tool(
  async ({ url }) => {
    const client = getScrapeCreatorsClient();
    if (!client) return JSON.stringify({ unavailable: true, reason: 'SCRAPECREATORS_API_KEY is not configured.' });
    return JSON.stringify(await client.post(url));
  },
  { name: 'get_public_instagram_post', description: 'Retrieve public Instagram post or Reel details by URL.', schema: z.object({ url: z.string().url() }) },
);

const getComments = tool(
  async ({ url, cursor }) => {
    const client = getScrapeCreatorsClient();
    if (!client) return JSON.stringify({ unavailable: true, reason: 'SCRAPECREATORS_API_KEY is not configured.' });
    return JSON.stringify(await client.comments(url, cursor, false));
  },
  { name: 'get_public_instagram_comments', description: 'Retrieve available public comments for an Instagram post or Reel. Request replies selectively to control credits and latency.', schema: z.object({ url: z.string().url(), cursor: z.string().optional() }) },
);

export async function runPublicAnalysisAgent(input: { task: string; comment?: string; caption?: string; postUrl?: string; handle?: string }) {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured.');
  const model = new ChatGroq({ model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b', temperature: 0.2, maxRetries: 2 });
  const agent = createAgent({ model, tools: [classifyComment, getProfile, getPost, getComments] });
  const result = await agent.invoke({ messages: [{ role: 'system', content: 'You are InstaPilot’s public-data analysis agent. Use tools only for public Instagram data. Do not claim completeness, ownership, endorsement, or permission to publish. Separate retrieved facts from inference. Classify comments, apply the supplied brand voice, and return concise JSON-like sections: findings, classification, replyDrafts, provenance, and approvalRequired. Never publish or imply that a public-data lookup authorizes a reply.' }, { role: 'user', content: JSON.stringify(input) }] });
  const last = result.messages.at(-1);
  return typeof last?.content === 'string' ? last.content : JSON.stringify(last?.content ?? result);
}
