import { z } from 'zod';

export const replyRequestSchema = z.object({
  commentId: z.string().min(1),
  text: z.string().trim().min(1).max(2200),
  idempotencyKey: z.string().min(8).max(128),
});

export const campaignStatusSchema = z.object({
  campaignId: z.string().min(1),
  status: z.enum(['Active', 'Paused']),
  confirmationToken: z.string().min(8),
});

export const aiDraftSchema = z.object({
  comment: z.string().trim().min(1).max(2200),
  caption: z.string().max(2200).optional(),
  brandVoice: z.string().max(500).optional(),
  tone: z.string().min(1).max(80),
  instructions: z.string().max(500).optional(),
});
