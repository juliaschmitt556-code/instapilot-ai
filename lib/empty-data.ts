import type { Campaign, CommentItem, Metric, ReplyDraft } from './types';

export const metrics: Metric[] = [];
export const campaigns: Campaign[] = [];
export const comments: CommentItem[] = [];
export const replyDrafts: ReplyDraft[] = [];
export const chartData: Array<{ day: string; spend: number; reach: number; comments: number }> = [];
